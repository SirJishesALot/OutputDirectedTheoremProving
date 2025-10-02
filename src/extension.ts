// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextDecoder } from 'util';

function getActiveFileContext(): string | null {
	const editor = vscode.window.activeTextEditor; 
	if (!editor) {
		return null; 
	}
	const fileContent = editor.document.getText();
	const selection = editor.selection;
	const selectedText = editor.document.getText(selection);

	// TODO integrate with coq-lsp to get the proof state

	let context = `// Currently active file: ${editor.document.fileName}\n`;
	context += `// Selected text:\n${selectedText.trim() ? selectedText : 'None'}\n\n`;
	context += fileContent; 
	return context;
}

const coqChatHandler: vscode.ChatRequestHandler = async (
	request: vscode.ChatRequest,
	context: vscode.ChatContext, 
	stream: vscode.ChatResponseStream, 
	token: vscode.CancellationToken
): Promise<any> => {
	const coqContext = getActiveFileContext();
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
