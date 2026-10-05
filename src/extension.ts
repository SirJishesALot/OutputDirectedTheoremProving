import * as vscode from 'vscode';
import { CoqLspClient } from './lsp/coqLspClient';
import { ProofStatePanel } from './webview/proofStatePanel';
import * as dotenv from 'dotenv';
import path from 'path';
import {
    getConfiguredProverKind,
    ProverKind,
    ProverManager,
} from './prover/ProverManager';
import { NormalizedGoal } from './prover/ProverClient';
import { initProofStateLogger, showProofStateLog } from './logging/proofStateLogger';
import { OutputLogger } from './logging/logger';

const result = dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
if (result.error) {
    OutputLogger.warn('Config', `Error loading .env file: ${result.error.message || String(result.error)}`); 
} else { 
    OutputLogger.debug('Config', 'Loaded .env file successfully.');
}
// --- NEW IMPORTS FOR INLINE SUGGESTIONS ---
// Note: Adjust these import paths based on where you saved suggestionManager.ts 
// and the file containing your Prover Tools / clearSuggestedEditDecoration function.
import { SuggestionManager } from './suggestionManager';
import { clearSuggestedEditDecoration } from './tools/proverTools';
// ------------------------------------------

let coqLspClientReady: Promise<CoqLspClient> | undefined = undefined;
let proverManager: ProverManager | undefined = undefined;
let applyConfiguredProverPromise: Promise<void> | undefined = undefined;
let extensionContext: vscode.ExtensionContext | undefined;
const OPENAI_SECRET_KEY = 'outputdirectedtheoremproving.openaiApiKey';
const GEMINI_PROJECT_ID_KEY = 'outputdirectedtheoremproving.geminiProjectId';
const PORTKEY_SECRET_KEY = 'outputdirectedtheoremproving.portkeyApiKey';
const DEFAULT_PORTKEY_MODEL = '@GCP-public-dataset-integration/gemini-3.1-pro-preview';
const DEFAULT_PORTKEY_PROVIDER_SLUG = '@GCP-public-dataset-integration';
const DEFAULT_PORTKEY_BASE_URL = 'https://api.portkey.ai/v1';
const DEFAULT_GEMINI_MODEL = 'gemini-3.1-pro-preview';
const GEMINI_VERTEX_LOCATION = 'global';
let defaultChatAdapter: any | undefined = undefined;

function getConfiguredPortkeyModel(): string {
    return (
        process.env.PORTKEY_MODEL ||
        vscode.workspace
            .getConfiguration()
            .get<string>('myExtension.defaultPortkeyModel', DEFAULT_PORTKEY_MODEL)
    );
}

function getConfiguredPortkeySlug(): string {
    return (
        process.env.PORTKEY_PROVIDER_SLUG ||
        vscode.workspace
            .getConfiguration()
            .get<string>('myExtension.portkeyProviderSlug', DEFAULT_PORTKEY_PROVIDER_SLUG)
    );
}

function getConfiguredPortkeyBaseUrl(): string {
    return (
        process.env.PORTKEY_BASE_URL ||
        vscode.workspace
            .getConfiguration()
            .get<string>('myExtension.portkeyBaseUrl', DEFAULT_PORTKEY_BASE_URL)
    );
}

async function getStoredPortkeyApiKey(): Promise<string | undefined> {
    if (extensionContext) {
        const fromSecrets = await extensionContext.secrets.get(PORTKEY_SECRET_KEY);
        if (fromSecrets) {
            return fromSecrets;
        }
    }
    return process.env.PORTKEY_API_KEY || undefined;
}

function getConfiguredGeminiModel(): string {
    return vscode.workspace
        .getConfiguration()
        .get<string>('myExtension.defaultGeminiModel', DEFAULT_GEMINI_MODEL);
}

async function getStoredGeminiProjectId(): Promise<string | undefined> {
    if (extensionContext) {
        const fromSecrets = await extensionContext.secrets.get(GEMINI_PROJECT_ID_KEY);
        if (fromSecrets) {
            return fromSecrets;
        }
    }
    return process.env.GEMINI_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT ?? undefined;
}

import { normalizeMessagesForGemini } from './llm/messageNormalizer';

async function createPortkeyAdapter(
    apiKey: string,
    modelId: string = getConfiguredPortkeyModel()
): Promise<any> {
    const OpenAI = require('openai');
    const baseURL = getConfiguredPortkeyBaseUrl();
    const slug = getConfiguredPortkeySlug();

    const resolvedModel = modelId.startsWith('@')
        ? modelId
        : `${slug.replace(/\/$/, '')}/${modelId.replace(/^\//, '')}`;

    const client = new OpenAI({
        apiKey: 'dummy',
        baseURL,
        defaultHeaders: {
            'x-portkey-api-key': apiKey,
        },
    });

    return {
        sendRequest: async (messages: any[], opts: any, token?: vscode.CancellationToken) => {
            const chatMessages = messages.map((m) => {
                if (typeof m === 'string') {
                    return { role: 'user', content: m };
                }
                if (m && typeof m === 'object' && m.role && m.content) {
                    return { role: m.role, content: m.content };
                }
                return { role: 'user', content: m?.text ?? String(m) };
            });

            const targetModel = opts?.model
                ? (opts.model.startsWith('@') ? opts.model : `${slug.replace(/\/$/, '')}/${opts.model.replace(/^\//, '')}`)
                : resolvedModel;

            try {
                const stream = await client.chat.completions.create({
                    model: targetModel,
                    messages: chatMessages,
                    max_tokens: Math.max(opts?.maxTokens ?? 4096, 4096),
                    temperature: opts?.temperature ?? 0.2,
                    stream: true,
                });

                return {
                    text: (async function* () {
                        for await (const chunk of stream) {
                            if (token && token.isCancellationRequested) {
                                break;
                            }
                            const content = chunk.choices[0]?.delta?.content;
                            if (content) {
                                yield content;
                            }
                        }
                    })(),
                };
            } catch (e: any) {
                OutputLogger.error('Agent:Chat', 'Portkey API call failed:', e);
                throw new Error('Portkey API error: ' + (e && e.message ? e.message : String(e)));
            }
        },
    };
}

async function createGeminiAdapter(
    projectId: string,
    modelId: string = getConfiguredGeminiModel()
): Promise<any> {
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({
        vertexai: true,
        project: projectId,
        location: GEMINI_VERTEX_LOCATION,
    });

    return {
        sendRequest: async (messages: any[], opts: any, token?: vscode.CancellationToken) => {
            const { systemInstruction, contents } = normalizeMessagesForGemini(messages);
            const generationConfig: any = {
                maxOutputTokens: opts?.maxTokens ?? 2048,
                temperature: opts?.temperature ?? 1.0,
            };
            if (systemInstruction) {
                generationConfig.systemInstruction = systemInstruction;
            }

            try {
                const stream = await ai.models.generateContentStream({
                    model: modelId,
                    contents: contents,
                    config: generationConfig,
                });

                return {
                    text: (async function* () {
                        for await (const chunk of stream) {
                            if (token && token.isCancellationRequested) {
                                break;
                            }
                            const text = chunk.text;
                            if (text) {
                                yield text;
                            }
                        }
                    })(),
                };
            } catch (e: any) {
                OutputLogger.error('Agent:Chat', 'Gemini API call failed:', e);
                throw new Error('Gemini API error: ' + (e && e.message ? e.message : String(e)));
            }
        },
    };
}

/** Initialize default model: Portkey (Gemini 3.1 Pro via AI Gateway) prioritized, fallback to GCP Vertex AI. */
async function ensureDefaultChatAdapter(): Promise<any | null> {
    if (defaultChatAdapter) {
        return defaultChatAdapter;
    }
    const portkeyApiKey = await getStoredPortkeyApiKey();
    if (portkeyApiKey) {
        try {
            defaultChatAdapter = await createPortkeyAdapter(portkeyApiKey, getConfiguredPortkeyModel());
            OutputLogger.info('Config', `Auto-initialized default Portkey adapter with model ${getConfiguredPortkeyModel()}`);
            return defaultChatAdapter;
        } catch (e) {
            OutputLogger.error('Config', 'Failed to auto-initialize Portkey adapter:', e);
        }
    }
    const projectId = await getStoredGeminiProjectId();
    if (projectId) {
        try {
            defaultChatAdapter = await createGeminiAdapter(projectId, getConfiguredGeminiModel());
            return defaultChatAdapter;
        } catch (e) {
            OutputLogger.error('Config', 'Failed to auto-initialize default Gemini adapter:', e);
        }
    }
    return null;
}

import { streamCoqChat } from './llm/chatBridge';

export let globalSuggestionManager: SuggestionManager | undefined;

const coqChatHandler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<any> => {
    if (!coqLspClientReady) {
        stream.markdown('Coq backend is not active. Switch active prover to Coq to use this chat participant.');
        return {};
    }
    let model = request.model as any | undefined;
    if (!model && defaultChatAdapter) {
        model = defaultChatAdapter;
    }
    if (!model) {
        stream.markdown('Error: No language model configured. Please set up a language model in your settings or select an LLM service.');
        return {};
    }

    stream.progress('Analysing context and generating proof strategy');
    await streamCoqChat(coqLspClientReady, model, request.prompt, (chunk) => {
        stream.markdown(chunk);
    }, undefined, token);

    return {};
};

function detectProverFromEditor(editor: vscode.TextEditor | undefined): ProverKind | undefined {
    if (!editor) {
        return undefined;
    }
    const langId = editor.document.languageId.toLowerCase();
    const filePath = editor.document.uri.fsPath.toLowerCase();
    if (langId === 'coq' || langId === 'rocq' || filePath.endsWith('.v')) {
        return 'Coq';
    }
    if (langId.includes('lean') || filePath.endsWith('.lean')) {
        return 'Lean';
    }
    return undefined;
}

export function activate(context: vscode.ExtensionContext) {
    OutputLogger.info('Config', 'Congratulations, your extension "outputdirectedtheoremproving" is now active!');
    extensionContext = context;
    initProofStateLogger(context);

    // --- SETUP INLINE SUGGESTIONS (Cursor Style) ---
	globalSuggestionManager = new SuggestionManager();
    const suggestionManager = globalSuggestionManager;

    // 1. Register the CodeLens Provider for Coq files
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            [
                { scheme: 'file', language: 'coq' },
                { scheme: 'file', language: 'rocq' },
                { scheme: 'file', language: 'lean4' },
                { scheme: 'file', pattern: '**/*.lean' }
            ],
            suggestionManager
        )
    );

    // 2. Register the Accept Command
    context.subscriptions.push(vscode.commands.registerCommand('outputdirectedtheoremproving.acceptSuggestion', () => {
        if (!suggestionManager.activeSuggestion) return;
        
        const editor = vscode.window.activeTextEditor;
        if (editor) clearSuggestedEditDecoration(editor);
        
        suggestionManager.clearSuggestion();
    }));

    // 3. Register the Reject Command
    context.subscriptions.push(vscode.commands.registerCommand('outputdirectedtheoremproving.rejectSuggestion', async () => {
        if (!suggestionManager.activeSuggestion) return;
        
        const { uri, range, oldText } = suggestionManager.activeSuggestion;
        const editor = vscode.window.activeTextEditor;
        
        if (editor && editor.document.uri.toString() === uri.toString()) {
            // Revert the document to its original state
            const edit = new vscode.WorkspaceEdit();
            edit.replace(uri, range, oldText);
            await vscode.workspace.applyEdit(edit);
            
            clearSuggestedEditDecoration(editor);
        }
        
        suggestionManager.clearSuggestion();
    }));
    // -----------------------------------------------

    const participant = vscode.chat.createChatParticipant(
        'coq.llmChat', 
        coqChatHandler,
    ); 
    context.subscriptions.push(participant);

    const coqLspPath = process.env.COQ_LSP_PATH || '/home/vscode/.opam/rocq-9.0/bin/coq-lsp';
    proverManager = new ProverManager(coqLspPath);
    context.subscriptions.push(proverManager);

    const applyConfiguredProver = async () => {
        if (!proverManager) {
            return;
        }
        const configured = getConfiguredProverKind();
        try {
            await proverManager.switchTo(configured);
            coqLspClientReady = proverManager.getActiveCoqLspClientReady();
            if (ProofStatePanel.currentPanel) {
                const panelClientReady =
                    coqLspClientReady ?? Promise.resolve({} as CoqLspClient);
                ProofStatePanel.currentPanel.setProviders(
                    panelClientReady,
                    () => (proverManager?.getActiveKind() ?? getConfiguredProverKind()),
                    async (document, position) => {
                        const activeClient = proverManager?.getActiveClient();
                        if (!activeClient) {
                            throw new Error('No active prover client.');
                        }
                        const state = await activeClient.getGoalState(document, position);
                        const goals = state.goals.map((g: NormalizedGoal) => ({
                            ty: g.type,
                            hyps: (g.hypotheses ?? []).map((h) => ({
                                names: h.name ? [h.name] : [],
                                ty: h.type,
                                def: h.value,
                            })),
                        }));
                        return {
                            goals,
                            messages: state.messages ?? [],
                            error: state.error,
                        };
                    },
                    () => proverManager?.getActiveClient()
                );
                ProofStatePanel.currentPanel.setActiveProver(
                    proverManager.getActiveKind()
                );
                void ProofStatePanel.currentPanel.requestProofStateUpdate();
            }
        } catch (e) {
            OutputLogger.error('Config', `Failed to initialize ${configured} prover:`, e);
            vscode.window.showErrorMessage(
                `Failed to initialize ${configured} prover: ${e instanceof Error ? e.message : String(e)}`
            );
            if (configured !== 'Coq') {
                await vscode.workspace
                    .getConfiguration()
                    .update('myExtension.activeProver', 'Coq', vscode.ConfigurationTarget.Global);
            }
        }
    };

    context.subscriptions.push(
        vscode.commands.registerCommand('outputdirectedtheoremproving.toggleActiveProver', async () => {
            const current = getConfiguredProverKind();
            const next: ProverKind = current === 'Coq' ? 'Lean' : 'Coq';
            await vscode.workspace
                .getConfiguration()
                .update('myExtension.activeProver', next, vscode.ConfigurationTarget.Global);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(async (event) => {
            if (!event.affectsConfiguration('myExtension.activeProver')) {
                return;
            }
            applyConfiguredProverPromise = applyConfiguredProver();
            await applyConfiguredProverPromise;
        })
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(async (editor) => {
            const autoSwitchEnabled = vscode.workspace
                .getConfiguration()
                .get<boolean>('myExtension.autoSwitchProver', true);
            if (!autoSwitchEnabled) {
                return;
            }
            const desired = detectProverFromEditor(editor);
            if (!desired) {
                return;
            }
            const current = getConfiguredProverKind();
            if (desired === current) {
                return;
            }
            await vscode.workspace
                .getConfiguration()
                .update('myExtension.activeProver', desired, vscode.ConfigurationTarget.Global);
        })
    );

    applyConfiguredProverPromise = applyConfiguredProver();

    const openProofStateDisposable = vscode.commands.registerCommand(
        'outputdirectedtheoremproving.openProofState',
        async () => {
            if (applyConfiguredProverPromise) {
                await applyConfiguredProverPromise;
            }
            if (!coqLspClientReady) {
                const activeKind = proverManager?.getActiveKind() ?? getConfiguredProverKind();
                if (activeKind === 'Lean') {
                    const activeClient = proverManager?.getActiveClient();
                    if (!activeClient) {
                        vscode.window.showErrorMessage('Lean prover is not initialized yet.');
                        return;
                    }
                    const fallbackPromise = Promise.resolve({} as CoqLspClient);
                    ProofStatePanel.createOrShow(
                        context,
                        fallbackPromise,
                        context.extensionUri,
                        () => (proverManager?.getActiveKind() ?? getConfiguredProverKind()),
                        async (document, position) => {
                            const client = proverManager?.getActiveClient();
                            if (!client) {
                                throw new Error('No active prover client.');
                            }
                            const state = await client.getGoalState(document, position);
                            return {
                                goals: state.goals.map((g: NormalizedGoal) => ({
                                    ty: g.type,
                                    hyps: (g.hypotheses ?? []).map((h) => ({
                                        names: h.name ? [h.name] : [],
                                        ty: h.type,
                                        def: h.value,
                                    })),
                                })),
                                messages: state.messages ?? [],
                                error: state.error,
                            };
                        },
                        () => proverManager?.getActiveClient()
                    );
                    return;
                }
                vscode.window.showErrorMessage('Coq LSP is not ready yet.');
                return;
            }
            ProofStatePanel.createOrShow(
                context,
                coqLspClientReady,
                context.extensionUri,
                () => (proverManager?.getActiveKind() ?? getConfiguredProverKind()),
                async (document, position) => {
                    const client = proverManager?.getActiveClient();
                    if (!client) {
                        throw new Error('No active prover client.');
                    }
                    const state = await client.getGoalState(document, position);
                    return {
                        goals: state.goals.map((g: NormalizedGoal) => ({
                            ty: g.type,
                            hyps: (g.hypotheses ?? []).map((h) => ({
                                names: h.name ? [h.name] : [],
                                ty: h.type,
                                def: h.value,
                            })),
                        })),
                        messages: state.messages ?? [],
                        error: state.error,
                    };
                },
                () => proverManager?.getActiveClient()
            );
        }
    );
    context.subscriptions.push(openProofStateDisposable);

    const updateProofStateDisposable = vscode.commands.registerCommand(
        'outputdirectedtheoremproving.updateProofState',
        async () => {
            if (ProofStatePanel.currentPanel) {
                await ProofStatePanel.currentPanel.requestProofStateUpdate();
            } else {
                vscode.window.showInformationMessage('Open the Coq Proof State view first (e.g. Command Palette: "Open Coq Proof State").');
            }
        }
    );
    context.subscriptions.push(updateProofStateDisposable);

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'outputdirectedtheoremproving.showProofStateLog',
            () => {
                showProofStateLog();
            }
        )
    );

    const setOpenAiKeyCmd = vscode.commands.registerCommand('outputdirectedtheoremproving.setOpenAiApiKey', async () => {
        const key = await vscode.window.showInputBox({
            prompt: 'Enter your OpenAI API key',
            password: true,
            ignoreFocusOut: true,
        });
        if (!key) { return; }
        if (!extensionContext) {
            vscode.window.showErrorMessage('Extension context not available.');
            return;
        }
        await extensionContext.secrets.store(OPENAI_SECRET_KEY, key);
        vscode.window.showInformationMessage('OpenAI API key saved securely.');
    });
    context.subscriptions.push(setOpenAiKeyCmd); 

    const setPortkeyApiKeyCmd = vscode.commands.registerCommand('outputdirectedtheoremproving.setPortkeyApiKey', async () => {
        const key = await vscode.window.showInputBox({
            prompt: 'Enter your Portkey API Key',
            password: true,
            ignoreFocusOut: true,
        });
        if (!key) { return; }
        if (!extensionContext) {
            vscode.window.showErrorMessage('Extension context not available.');
            return;
        }
        await extensionContext.secrets.store(PORTKEY_SECRET_KEY, key);
        defaultChatAdapter = undefined;
        await ensureDefaultChatAdapter();
        vscode.window.showInformationMessage('Portkey API key saved securely and adapter initialized.');
    });
    context.subscriptions.push(setPortkeyApiKeyCmd);

    const getModelCmd = vscode.commands.registerCommand('outputdirectedtheoremproving.getDefaultChatModel', async (args?: { useCache?: boolean }) => {
        // If useCache is true (programmatic call), return cached adapter if available
        // If useCache is false or undefined (command palette call), always show picker
        const useCache = args?.useCache ?? false;
        if (useCache) {
            const cached = await ensureDefaultChatAdapter();
            if (cached) {
                return cached;
            }
        }
        // List all available LLM services and return an adapter for each.
        const { PredefinedProofsService } = require('./llm/llmServices/predefinedProofs/predefinedProofsService');
        const { OpenAiService } = require('./llm/llmServices/openai/openAiService');
        const { LMStudioService } = require('./llm/llmServices/lmStudio/lmStudioService');
        const { GrazieService } = require('./llm/llmServices/grazie/grazieService');
        const { DeepSeekService } = require('./llm/llmServices/deepSeek/deepSeekService');
        const services = [
            { label: 'Portkey (Gemini / Claude / Kimi)', description: 'Google Gemini & frontier models via Portkey AI Gateway', instance: null },
            { label: 'PredefinedProofs', description: 'Offline fallback using simple tactics', instance: new PredefinedProofsService() },
            { label: 'OpenAI', description: 'OpenAI GPT models (requires API key)', instance: new OpenAiService() },
            { label: 'Gemini (Vertex AI)', description: 'Google Gemini models via Vertex AI (legacy GCP project)', instance: null },
            { label: 'LMStudio', description: 'Local LMStudio server', instance: new LMStudioService() },
            { label: 'Grazie', description: 'JetBrains Grazie AI', instance: new GrazieService() },
            { label: 'DeepSeek', description: 'DeepSeek AI', instance: new DeepSeekService() },
            { label: 'Open Chat view', description: 'Open the built-in Chat view to configure a model', instance: null },
        ];
        const choice = await vscode.window.showQuickPick(services, { placeHolder: 'Select an LLM service for the proof-state panel' });
        if (!choice) { return null; }

        if (choice.label === 'Open Chat view') {
            try { await vscode.commands.executeCommand('workbench.action.openChat'); } catch (e) { /* ignore */ }
            return null;
        }

        if (choice.label === 'Portkey (Gemini / Claude / Kimi)') {
            let apiKey = await getStoredPortkeyApiKey();
            if (!apiKey) {
                const inputKey = await vscode.window.showInputBox({
                    prompt: 'Enter your Portkey API Key',
                    password: true,
                    ignoreFocusOut: true,
                });
                if (!inputKey) {
                    return null;
                }
                apiKey = inputKey;
                if (extensionContext) {
                    await extensionContext.secrets.store(PORTKEY_SECRET_KEY, apiKey);
                }
            }

            const modelOptions = [
                { label: '@GCP-public-dataset-integration/gemini-3.1-pro-preview', description: 'Default & recommended reasoning model for theorem proving' },
                { label: '@GCP-public-dataset-integration/gemini-2.5-pro', description: 'High-performance reasoning model' },
                { label: '@GCP-public-dataset-integration/gemini-2.5-flash', description: 'Fast and lightweight model' },
                { label: '@GCP-public-dataset-integration/gemini-3-flash-preview', description: 'Next-gen fast preview model' },
                { label: '@GCP-public-dataset-integration/kimi-k2-thinking-maas', description: 'Thinking model via MaaS' },
                { label: 'Custom...', description: 'Specify a custom model slug' },
            ];
            const picked = await vscode.window.showQuickPick(modelOptions, { placeHolder: 'Select Portkey model to use' });
            if (!picked) {
                return null;
            }

            let selectedModel = picked.label;
            if (selectedModel === 'Custom...') {
                const customModel = await vscode.window.showInputBox({
                    prompt: 'Enter model slug (e.g. @GCP-public-dataset-integration/gemini-2.5-pro)',
                    placeHolder: '@GCP-public-dataset-integration/gemini-3.1-pro-preview',
                    ignoreFocusOut: true,
                });
                if (!customModel) {
                    return null;
                }
                selectedModel = customModel;
            }

            try {
                const adapter = await createPortkeyAdapter(apiKey, selectedModel);
                defaultChatAdapter = adapter;
                return adapter;
            } catch (e: any) {
                vscode.window.showErrorMessage(`Failed to initialize Portkey adapter: ${e.message || String(e)}`);
                return null;
            }
        }

        if (choice.label === 'PredefinedProofs') {
            // ...existing code...
            const adapter = {
                sendRequest: async (messages: any[], opts: any, token?: vscode.CancellationToken) => {
                    // ...existing code...
                    let userPrompt = '';
                    try {
                        userPrompt = messages.map((m) => (m?.asString ? m.asString() : (m?.text ?? String(m)))).join('\n');
                    } catch (e) { userPrompt = '' + messages; }
                    let suggestion = 'intros.';
                    if (/\b(intro|intros)\b/i.test(userPrompt)) { suggestion = 'intros.'; }
                    else if (/\b(apply|rewrite|simpl|induction)\b/i.test(userPrompt)) { suggestion = 'apply ... .'; }
                    const content = `Suggested tactic: ${suggestion}`;
                    return {
                        text: (async function* () { yield content; })()
                    };
                }
            };
            defaultChatAdapter = adapter;
            return adapter;
        }

        if (choice.label === 'Gemini (Vertex AI)') {
            let projectId = await getStoredGeminiProjectId();

            if (!projectId) {
                const inputProjectId = await vscode.window.showInputBox({
                    prompt: 'Enter your Google Cloud Project ID',
                    placeHolder: 'your-project-id',
                    ignoreFocusOut: true,
                });
                if (!inputProjectId) {
                    return null;
                }
                projectId = inputProjectId;
                if (extensionContext) {
                    await extensionContext.secrets.store(GEMINI_PROJECT_ID_KEY, projectId);
                }
            }

            const selectedModel = getConfiguredGeminiModel();

            try {
                const adapter = await createGeminiAdapter(projectId, selectedModel);
                defaultChatAdapter = adapter;
                return adapter;
            } catch (e: any) {
                vscode.window.showErrorMessage(`Failed to initialize Gemini client: ${e.message || String(e)}. Make sure you have run 'gcloud auth application-default login' and have Vertex AI API enabled.`);
                return {
                    sendRequest: async () => ({
                        text: (async function* () {
                            yield `Gemini initialization error: ${e.message || String(e)}. Please ensure Vertex AI API is enabled and you're authenticated.`;
                        })(),
                    }),
                };
            }
        }

        if (choice.label === 'OpenAI') {
            let apiKey: string | undefined;
            if (extensionContext) {
                apiKey = await extensionContext.secrets.get(OPENAI_SECRET_KEY);
            }
            if (!apiKey) {
                vscode.window.showWarningMessage('OpenAI API key not set. Run "Set OpenAI API Key" command.');
                return {
                    sendRequest: async () => ({ text: (async function* () { yield 'OpenAI API key not set.'; })() })
                };
            }

            const modelOptions = [
                { label: 'gpt-4o', description: 'Recommended if you have access' },
                { label: 'gpt-4o-mini', description: 'Faster/cheaper' },
                { label: 'gpt-3.5-turbo', description: 'Fallback model' }
            ];
            const pickedModel = await vscode.window.showQuickPick(modelOptions, { placeHolder: 'Select OpenAI model to use for chat (project must have access)' });
            const selectedModel = pickedModel?.label ?? 'gpt-4o';
            const OpenAI = require('openai');
            const adapter = {
                sendRequest: async (messages: any[], opts: any, token?: vscode.CancellationToken) => {
                    // Convert messages to OpenAI format
                    const chatMessages = messages.map((m) => {
                        if (typeof m === 'string') { return { role: 'user', content: m }; }
                        if (m.role && m.content) { return m; }
                        return { role: 'user', content: m.text ?? String(m) };
                    });
                    try {
                        const client = new OpenAI({ apiKey });
                        const stream = await client.chat.completions.create({
                            model: opts?.model ?? selectedModel,
                            messages: chatMessages,
                            max_tokens: opts?.maxTokens ?? 2048, // Increased from 256 to allow longer responses
                            temperature: opts?.temperature ?? 0.2,
                            stream: true, 
                        });
                        return {
                            text: (async function* () {
                                for await (const chunk of stream) {
                                    if (token && token.isCancellationRequested) break; 
                                    const content = chunk.choices[0]?.delta?.content; 
                                    if (content) yield content; 
                                }
                            })()
                        };
                    } catch (e: any) {
                        return { text: (async function* () { yield 'OpenAI error: ' + (e && e.message ? e.message : String(e)); })() };
                    }
                }
            };
            defaultChatAdapter = adapter;
            return adapter;
        }

        // ...existing code for other services...
        const service = choice.instance;
        if (!service) { return null; }
        const adapter = {
            sendRequest: async (messages: any[], opts: any, token?: vscode.CancellationToken) => {
                const content = `Service ${choice.label} is not yet configured. Please set up credentials in settings.`;
                return {
                    text: (async function* () { yield content; })()
                };
            }
        };
        defaultChatAdapter = adapter;
        return adapter;
    });
    context.subscriptions.push(getModelCmd);

    // Command that always shows the picker (for command palette use)
    const changeModelCmd = vscode.commands.registerCommand('outputdirectedtheoremproving.changeLLMModel', async () => {
        // Don't pass useCache, so it always shows the picker
        return await vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel');
    });
    context.subscriptions.push(changeModelCmd);

    void ensureDefaultChatAdapter();

    const copyDiagnosticReportCmd = vscode.commands.registerCommand(
        'outputdirectedtheoremproving.copyDiagnosticReport',
        async () => {
            try {
                const os = require('os');
                const activeKind = proverManager?.getActiveKind() ?? getConfiguredProverKind();
                const portkeyConfigured = !!(await getStoredPortkeyApiKey());
                const portkeyModel = getConfiguredPortkeyModel();
                const portkeySlug = getConfiguredPortkeySlug();
                const openAiConfigured = extensionContext ? !!(await extensionContext.secrets.get(OPENAI_SECRET_KEY)) : false;
                const geminiProject = await getStoredGeminiProjectId();
                const geminiModel = getConfiguredGeminiModel();
                const coqLspPath = process.env.COQ_LSP_PATH || '/home/vscode/.opam/rocq-9.0/bin/coq-lsp';
                
                let report = `### Output Directed Theorem Proving - Diagnostic Report\n\n`;
                report += `- **Timestamp:** ${new Date().toISOString()}\n`;
                report += `- **VS Code Version:** ${vscode.version}\n`;
                report += `- **OS:** ${process.platform} ${process.arch} (${os.release()})\n`;
                report += `- **Active Prover:** ${activeKind}\n`;
                report += `- **Auto Switch Prover:** ${vscode.workspace.getConfiguration().get('myExtension.autoSwitchProver', true)}\n`;
                report += `- **Coq LSP Path:** \`${coqLspPath}\`\n`;
                report += `- **Portkey API Key Set:** ${portkeyConfigured ? 'Yes' : 'No'}\n`;
                report += `- **Active Portkey Model:** \`${portkeyModel}\`\n`;
                report += `- **Portkey Provider Slug:** \`${portkeySlug}\`\n`;
                report += `- **OpenAI Key Set:** ${openAiConfigured ? 'Yes' : 'No'}\n`;
                report += `- **Gemini Project ID Set:** ${geminiProject ? 'Yes' : 'No'}\n`;
                report += `- **Default Gemini Model:** \`${geminiModel}\`\n`;
                report += `- **Goals Timeout:** ${vscode.workspace.getConfiguration().get('myExtension.coqGoalsTimeoutMs', 15000)}ms\n`;

                await vscode.env.clipboard.writeText(report);
                OutputLogger.info('Config', 'Diagnostic report copied to clipboard.');
                vscode.window.showInformationMessage('Diagnostic report copied to clipboard!');
            } catch (e) {
                OutputLogger.error('Config', 'Failed to copy diagnostic report:', e);
                vscode.window.showErrorMessage(`Failed to copy diagnostic report: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    );
    context.subscriptions.push(copyDiagnosticReportCmd);

    const disposable = vscode.commands.registerCommand('outputdirectedtheoremproving.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from OutputDirectedTheoremProving!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    proverManager?.dispose();
}