// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const coqChatHandler: vscode.ChatRequestHandler = async (
	request: vscode.ChatRequest,
	context: vscode.ChatContext, 
	stream: vscode.ChatResponseStream, 
	token: vscode.CancellationToken
): Promise<any> => {
	const userPrompt = request.prompt; 
	const coqContext = `// Placeholder for your Coq proof state and file content.`; 
	stream.progress('Thinking about the Coq Proof...'); 
	await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing delay

	stream.markdown(`Hello! I've received your request: **${userPrompt}**.`);
	stream.markdown(`\n---\n`);
	stream.markdown(`My current Coq context for this task is:\n`);
	stream.markdown(`\n\`\`\`coq\n${coqContext}\n\`\`\``);
    stream.markdown(`\n\nI am now ready to call the LLM API to generate a tactic.`);

	return {};
}

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
