// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CoqLspClient, CoqLspClientImpl } from './lsp/coqLspClient';
import { ProofGoal } from './lsp/coqLspTypes';
import { Uri } from './utils/uri';
import { createCoqLspClient } from './lsp/coqBuilders';

let coqLspClient: CoqLspClient | undefined = undefined;
let coqLspClientReady: Promise<CoqLspClient> | undefined = undefined;

async function getActiveFileContext(): Promise<string | null> {
    const editor = vscode.window.activeTextEditor;
	if (!editor || editor.document.languageId !== 'coq') {
		return null;
	}

	// If the client is still starting, wait for it. If startup failed, return null.
	if (!coqLspClient) {
		if (coqLspClientReady) {
			try {
				await coqLspClientReady;
			} catch (e) {
				console.error('coq-lsp startup failed', e);
				return null;
			}
		} else {
			// client not started and no startup promise
			return null;
		}
	}

	const docUri = Uri.fromPath(editor.document.uri.fsPath);
    const version = editor.document.version;
    const position = editor.selection.active;

    // 1. Define the document specification
    const documentSpec = { uri: docUri, version: version };

    try {
		// 2. Use withTextDocument to handle the open/check/close lifecycle
        // The block function executes *after* the document is ready on the server.
		const client = coqLspClient;
		if (!client) {
			return null;
		}

		const proofStateContext = await client.withTextDocument(
			documentSpec,
			async (openedDocDiagnostic: any) => {
                
                // You can check openedDocDiagnostic here if you want to see
                // if Coq-LSP found any initial errors on the document opening.
                
                // Now, safely request the goal state from the prepared document
				const currentGoal: ProofGoal = await client.getFirstGoalAtPointOrThrow(
                    position,
                    docUri,
                    version
                );

                // --- Format the output for the LLM ---
                let context = `// Coq Proof State at Cursor Position (V: ${version}):\n`;
				// The ProofGoal type exported from coqLspTypes has fields `ty` and `hyps`.
				context += `// Goal: ${currentGoal.ty}\n\n`;
				context += `--- HYPOTHESES ---\n`;
				context += currentGoal.hyps
					.map((h) => `${h.names.join(', ')}: ${h.ty}`)
					.join('\n');
                context += `\n--------------------\n`;
                
                return context;
            }
        );
        
        return proofStateContext;

    } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.error('LSP Goal Retrieval Failed:', errorMsg);
        return `// ERROR: Failed to retrieve live proof state. The server reported: ${errorMsg}`;
    }
}

const coqChatHandler: vscode.ChatRequestHandler = async (
	request: vscode.ChatRequest,
	context: vscode.ChatContext, 
	stream: vscode.ChatResponseStream, 
	token: vscode.CancellationToken
): Promise<any> => {
	const coqContext = await getActiveFileContext();
	if (!coqContext) {
		stream.markdown("Please open a Coq file and place your cursor inside a proof before chatting with me."); 
		return {};
	}

	const systemPrompt = `You are an expert Coq Theorem Prover AI. Your task is to analyse the provided Coq code and curernt context (including selected text) to generate the single best next tactic or provide a clear explanation. Only output Coq code if asked for a tactic.`;
	const userPrompt = request.prompt; 
	const messages: vscode.LanguageModelChatMessage[] = [
		vscode.LanguageModelChatMessage.User(systemPrompt),
		vscode.LanguageModelChatMessage.User(
            `--- COQ CODE CONTEXT ---\n` +
            `\`\`\`coq\n${coqContext}\n\`\`\`\n\n` +
            `--- USER QUESTION ---\n` +
            `${request.prompt}`
        )
	];

	const model = request.model; 
	if (!model) { 
		stream.markdown("Error: No language model configured. Please set up a language model in your settings.");
		return {};
	}

	try { 
		stream.progress('Analysing context and generating proof strategy');
		const chatResponse = await model.sendRequest(messages, {}, token); 
		for await (const chunk of chatResponse.text) {
			stream.markdown(chunk);
		}
	} catch (error) { 
		console.error("LLM API Error:", error); 
		stream.markdown(`An error occurred while communicating with the LLM: \`${error}\``);
	}

	return {};
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "outputdirectedtheoremproving" is now active!');

	const participant = vscode.chat.createChatParticipant(
		'coq.llmChat', 
		coqChatHandler,
	); 
	context.subscriptions.push(participant);

	// Initialize Coq LSP client for extension features and expose a ready Promise
	coqLspClientReady = createCoqLspClient(process.env.COQ_LSP_PATH || 'coq-lsp')
		.then((client) => {
			coqLspClient = client;
			return client;
		})
		.catch((e) => {
			console.error('Failed to start coq-lsp client', e);
			throw e;
		});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('outputdirectedtheoremproving.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from OutputDirectedTheoremProving!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
