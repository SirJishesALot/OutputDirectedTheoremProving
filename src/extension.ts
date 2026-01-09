import * as vscode from 'vscode';
import { CoqLspClient, CoqLspClientImpl } from './lsp/coqLspClient';
import { ProofGoal } from './lsp/coqLspTypes';
import { Uri } from './utils/uri';
import { createCoqLspClient } from './lsp/coqBuilders';
import { ProofStatePanel } from './webview/proofStatePanel';

let coqLspClient: CoqLspClient | undefined = undefined;
let coqLspClientReady: Promise<CoqLspClient> | undefined = undefined;
let extensionContext: vscode.ExtensionContext | undefined;
const OPENAI_SECRET_KEY = 'outputdirectedtheoremproving.openaiApiKey';
let defaultChatAdapter: any | undefined = undefined;

import { streamCoqChat } from './llm/chatBridge';

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

	const participant = vscode.chat.createChatParticipant(
		'coq.llmChat', 
		coqChatHandler,
	); 
	context.subscriptions.push(participant);

	coqLspClientReady = createCoqLspClient(process.env.COQ_LSP_PATH || 'coq-lsp')
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

	const getModelCmd = vscode.commands.registerCommand('outputdirectedtheoremproving.getDefaultChatModel', async () => {
		// If a default adapter was already selected, return it without prompting again.
		if (defaultChatAdapter) {
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
							max_tokens: opts?.maxTokens ?? 256,
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

	const disposable = vscode.commands.registerCommand('outputdirectedtheoremproving.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from OutputDirectedTheoremProving!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
