import * as vscode from 'vscode';
import { CoqLspClient, CoqLspClientImpl } from './lsp/coqLspClient';
import { ProofGoal } from './lsp/coqLspTypes';
import { Uri } from './utils/uri';
import { createCoqLspClient } from './lsp/coqBuilders';
import { ProofStatePanel } from './webview/proofStatePanel';

// --- NEW IMPORTS FOR INLINE SUGGESTIONS ---
// Note: Adjust these import paths based on where you saved suggestionManager.ts 
// and the file containing your Prover Tools / clearSuggestedEditDecoration function.
import { SuggestionManager } from './suggestionManager';
import { clearSuggestedEditDecoration } from './tools/proverTools'; 
// ------------------------------------------

let coqLspClient: CoqLspClient | undefined = undefined;
let coqLspClientReady: Promise<CoqLspClient> | undefined = undefined;
let extensionContext: vscode.ExtensionContext | undefined;
const OPENAI_SECRET_KEY = 'outputdirectedtheoremproving.openaiApiKey';
const GEMINI_PROJECT_ID_KEY = 'outputdirectedtheoremproving.geminiProjectId';
let defaultChatAdapter: any | undefined = undefined;

import { streamCoqChat } from './llm/chatBridge';

export let globalSuggestionManager: SuggestionManager | undefined;

const coqChatHandler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<any> => {
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

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "outputdirectedtheoremproving" is now active!');
    extensionContext = context;

    // --- SETUP INLINE SUGGESTIONS (Cursor Style) ---
	globalSuggestionManager = new SuggestionManager();
    const suggestionManager = globalSuggestionManager;

    // 1. Register the CodeLens Provider for Coq files
    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider(
            [{ scheme: 'file', language: 'coq' }, { scheme: 'file', language: 'rocq' }],
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

    coqLspClientReady = createCoqLspClient(process.env.COQ_LSP_PATH || '/home/vscode/.opam/rocq-9.0/bin/coq-lsp')
        .then((client) => {
            coqLspClient = client;
            return client;
        })
        .catch((e) => {
            console.error('Failed to start coq-lsp client', e);
            throw e;
        });

    const openProofStateDisposable = vscode.commands.registerCommand(
        'outputdirectedtheoremproving.openProofState',
        () => {
            if (!coqLspClientReady) {
                vscode.window.showErrorMessage('Coq LSP is not ready yet.');
                return;
            }
            ProofStatePanel.createOrShow(context, coqLspClientReady, context.extensionUri);
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

    const getModelCmd = vscode.commands.registerCommand('outputdirectedtheoremproving.getDefaultChatModel', async (args?: { useCache?: boolean }) => {
        // If useCache is true (programmatic call), return cached adapter if available
        // If useCache is false or undefined (command palette call), always show picker
        const useCache = args?.useCache ?? false;
        if (useCache && defaultChatAdapter) {
            return defaultChatAdapter;
        }
        // List all available LLM services and return an adapter for each.
        const { PredefinedProofsService } = require('./llm/llmServices/predefinedProofs/predefinedProofsService');
        const { OpenAiService } = require('./llm/llmServices/openai/openAiService');
        const { LMStudioService } = require('./llm/llmServices/lmStudio/lmStudioService');
        const { GrazieService } = require('./llm/llmServices/grazie/grazieService');
        const { DeepSeekService } = require('./llm/llmServices/deepSeek/deepSeekService');
        const services = [
            { label: 'PredefinedProofs', description: 'Offline fallback using simple tactics', instance: new PredefinedProofsService() },
            { label: 'OpenAI', description: 'OpenAI GPT models (requires API key)', instance: new OpenAiService() },
            { label: 'Gemini (Vertex AI)', description: 'Google Gemini models via Vertex AI (requires GCP project)', instance: null },
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
            // Get project ID from secrets or prompt; location is always 'global'
            let projectId: string | undefined;
            
            if (extensionContext) {
                projectId = await extensionContext.secrets.get(GEMINI_PROJECT_ID_KEY);
            }

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

            const location = 'global';

            const modelOptions = [
                { label: 'gemini-3-deep-think', description: 'Gemini 3 Deep Think (most powerful)' }, 
                { label: 'gemini-3.1-pro-preview', description: 'Gemini 3.0 Pro (recommended' },
                { label: 'gemini-3-flash-preview', description: 'Gemini 3.0 Flash (faster)' },
            ];
            const pickedModel = await vscode.window.showQuickPick(modelOptions, { 
                placeHolder: 'Select Gemini model to use (requires Vertex AI API enabled)' 
            });
            const selectedModel = pickedModel?.label ?? 'gemini-3.1-pro-preview';

            try {
                const { GoogleGenAI } = require('@google/genai');
                const ai = new GoogleGenAI({
                    vertexai: true,
                    project: projectId,
                    location: location,
                });

                const adapter = {
                    sendRequest: async (messages: any[], opts: any, token?: vscode.CancellationToken) => {
                        try {
                            // Convert messages to Gemini format
                            // The SDK accepts Content[] where Content has role and parts
                            const contents: any[] = [];
                            
                            for (const m of messages) {
                                if (typeof m === 'string') {
                                    contents.push({ role: 'user', parts: [{ text: m }] });
                                } else if (m.role && m.content) {
                                    // Map OpenAI-style roles to Gemini roles
                                    const role = m.role === 'assistant' ? 'model' : 'user';
                                    contents.push({ role: role, parts: [{ text: m.content }] });
                                } else if (m.role && m.parts) {
                                    // Already in Gemini format
                                    contents.push(m);
                                } else {
                                    contents.push({ role: 'user', parts: [{ text: m.text ?? String(m) }] });
                                }
                            }

                            // Generate content with streaming
                            const stream = await ai.models.generateContentStream({
                                model: selectedModel,
                                contents: contents,
                                generationConfig: {
                                    maxOutputTokens: opts?.maxTokens ?? 2048,
                                    temperature: opts?.temperature ?? 1.0,
                                },
                            });

                            return {
                                text: (async function* () {
                                    for await (const chunk of stream) {
                                        if (token && token.isCancellationRequested) break;
                                        // Extract text from the chunk
                                        const text = chunk.text;
                                        if (text) {
                                            yield text;
                                        }
                                    }
                                })()
                            };
                        } catch (e: any) {
                            return { 
                                text: (async function* () { 
                                    yield 'Gemini error: ' + (e && e.message ? e.message : String(e)); 
                                })() 
                            };
                        }
                    }
                };
                defaultChatAdapter = adapter;
                return adapter;
            } catch (e: any) {
                vscode.window.showErrorMessage(`Failed to initialize Gemini client: ${e.message || String(e)}. Make sure you have run 'gcloud auth application-default login' and have Vertex AI API enabled.`);
                return {
                    sendRequest: async () => ({ 
                        text: (async function* () { 
                            yield `Gemini initialization error: ${e.message || String(e)}. Please ensure Vertex AI API is enabled and you're authenticated.`; 
                        })() 
                    })
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

    const disposable = vscode.commands.registerCommand('outputdirectedtheoremproving.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from OutputDirectedTheoremProving!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}