import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { runCoqAgent, AgentTool, streamCoqChat } from '../llm/chatBridge';
import { CoqTools } from '../tools/coqTools';
import { normalizeGoals } from '../utils/coqUtils'; 

type ClientReadyPromise = Promise<CoqLspClient>;

export class ProofStatePanel {
    public static currentPanel: ProofStatePanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private disposables: vscode.Disposable[] = [];
    private clientReady: ClientReadyPromise;
    private currentDocumentUri: vscode.Uri | undefined; 

    public static createOrShow(
        context: vscode.ExtensionContext,
        clientReady: ClientReadyPromise,
        extensionUri: vscode.Uri
    ) {
        const column = vscode.ViewColumn.Beside; 

        if (ProofStatePanel.currentPanel) {
            ProofStatePanel.currentPanel.panel.reveal(column);
            return ProofStatePanel.currentPanel;
        }

        const panel = vscode.window.createWebviewPanel(
            'coqProofState',
            'Coq Proof State',
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                enableFindWidget: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'src', 'webview')],
            }
        );

        ProofStatePanel.currentPanel = new ProofStatePanel(
            panel,
            clientReady,
            extensionUri
        );

        return ProofStatePanel.currentPanel;
    }

    private constructor(
        panel: vscode.WebviewPanel,
        clientReady: ClientReadyPromise,
        extensionUri: vscode.Uri
    ) {
        this.panel = panel;
        this.extensionUri = extensionUri;
        this.clientReady = clientReady;

        void vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel'); 

        this.panel.webview.onDidReceiveMessage(
            (message) => this.handleMessage(message),
            null,
            this.disposables
        );

        this.panel.webview.html = this.getHtmlForWebview(this.panel.webview);

        vscode.window.onDidChangeTextEditorSelection(
            () => this.updateProofState(),
            null,
            this.disposables
        );

        vscode.window.onDidChangeActiveTextEditor(
            () => this.updateProofState(),
            null,
            this.disposables
        );

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        this.updateProofState(); // initial update
    }

    public dispose() {
        ProofStatePanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const d = this.disposables.pop();
            if (d) { d.dispose(); }
        }
    }

    private async handleMessage(message: any) {
        const cmd = message.command;
        if (cmd === 'requestUpdate') {
            console.log('proof state update requested');
            await this.updateProofState();
        } else if (cmd === 'applyTactic') {
            const tactic: string = message.tactic;
            await this.applyTactic(tactic);
        } else if (cmd === 'chat') {
            const prompt: string = message.prompt;
            console.log('Chat prompt received from webview:', prompt);
            // start streaming a chat response using the chat bridge
            (async () => {
                try {
                    // Ask the extension for a model object (may return null)
                    const model = await vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel');
                    if (!model) {
                        // No model available -- inform the webview
                        this.panel.webview.postMessage({ type: 'chatResponsePart', text: 'No chat model available. Open the Chat view to configure a model.' });
                        this.panel.webview.postMessage({ type: 'chatResponseDone' });
                        return;
                    }

                    await streamCoqChat(this.clientReady, model, prompt, (chunk: string) => {
                        this.panel.webview.postMessage({ type: 'chatResponsePart', text: chunk });
                    }, () => {
                        this.panel.webview.postMessage({ type: 'chatResponseDone' });
                    });
                } catch (e) {
                    console.error('Stream chat response failed:', e);
                    this.panel.webview.postMessage({ type: 'chatResponseDone' });
                }
            })();
        } else if (cmd === 'agentRequest') { 
            console.log('Agent request received:', message.context);
            await this.handleAgentRequest(message.context);
        }
    }

    private async handleAgentRequest(context: { lhs: string, rhs: string }) {
        // 1. Get the Generic Model (User's choice: OpenAI, Local, etc.)
        console.log("before getting model for agent"); 
        const model = await vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel');
        if (!model) {
            this.panel.webview.postMessage({ type: 'chatResponsePart', text: 'Error: No model selected.' });
            return;
        }
        console.log("after getting model for agent"); 

        // 2. Prepare the Tools Wrapper
        console.log("before getting active editor");
        let editor: vscode.TextEditor | undefined; 
        if (this.currentDocumentUri) {
            editor = vscode.window.visibleTextEditors.find(
                e => e.document.uri.toString() === this.currentDocumentUri?.toString()
            );
        }

        if (!editor) editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'coq') {
            editor = vscode.window.visibleTextEditors.find((e) => e.document.languageId === 'coq');
        }

        if (!editor) {
            console.error("Could not find the bound Coq editor.");
            this.panel.webview.postMessage({ type: 'chatResponsePart', text: 'Error: The Coq file for this proof state is no longer visible.' });
            return;
        }

        // 2. Initialize Tools
        const coqTools = new CoqTools(await this.clientReady, editor);

        // 3. Formulate the Assertion Deterministically
        const lhs = context.lhs.trim();
        const rhs = context.rhs.trim();
        
        // Basic heuristic: simple equality
        const assertion = `assert (H0: (${lhs}) = (${rhs})).`;

        // 4. Feedback to UI
        this.panel.webview.postMessage({ 
            type: 'chatResponsePart', 
            text: `_Synthesizing equality check for:_\n\`${lhs}\` replaced by \`${rhs}\`\n\n` 
        });

        // 5. Execute Logic (Check -> Insert)
        try {
            const checkResult = await coqTools.checkTermValidity(assertion);

            if (checkResult === 'valid') {
                await coqTools.insertCode(assertion);
                this.panel.webview.postMessage({ 
                    type: 'chatResponsePart', 
                    text: `✅ **Verified and Inserted:**\n\`\`\`coq\n${assertion}\n\`\`\`` 
                });
            } else {
                this.panel.webview.postMessage({ 
                    type: 'chatResponsePart', 
                    text: `❌ **Validation Failed:**\nThe term \`${assertion}\` is not valid in the current context.\n\n_Reason: ${checkResult}_` 
                });
            }
        } catch (e) {
            this.panel.webview.postMessage({ 
                type: 'chatResponsePart', 
                text: `Error executing Coq tools: ${e}` 
            });
        }

        // 6. Finish
        this.panel.webview.postMessage({ type: 'chatResponseDone' });

//         console.log("after getting active editor");

//         console.log("before creating coqTools");
//         const coqTools = new CoqTools(await this.clientReady, editor);
//         console.log("after creating coqTools"); 

//         const agentTools: AgentTool[] = [
//             {
//                 name: "check_validity",
//                 description: "Checks if a Coq term (like 'assert (A=B).') is valid in the current context.",
//                 execute: async (args) => {
//                     return await coqTools.checkTermValidity(args.term);
//                 }
//             },
//             {
//                 name: "insert_code",
//                 description: "Inserts Coq code into the editor. Only use this AFTER check_validity returns 'valid'.",
//                 execute: async (args) => {
//                     return await coqTools.insertCode(args.code);
//                 }
//             }
//         ];

//         // 3. Construct the User Request
//         const prompt = `
// The user replaced "${context.lhs}" with "${context.rhs}" in the goal view.
// Your task is to:
// 1. Formulate a valid assertion string (e.g. "assert (${context.lhs} = ${context.rhs}).").
// 2. Check if it is valid using the tool.
// 3. If valid, insert it into the editor.
// `;

//         // 4. Run the Agent Loop
//         // We reuse the 'chatResponsePart' message type so it prints to your existing Chat UI
//         console.log("before runCoqAgent"); 
//         await runCoqAgent(
//             this.clientReady,
//             model,
//             prompt,
//             agentTools,
//             (chunk) => this.panel.webview.postMessage({ type: 'chatResponsePart', text: chunk }),
//             () => this.panel.webview.postMessage({ type: 'chatResponseDone' })
//         );
//         console.log("after runCoqAgent"); 
    }

    // private normalizeGoals(res: any): any[] | null {
    //     console.log(res); 
    //     let data = res?.val !== undefined ? res.val : res;
    //     if (data && typeof data === 'object' && !Array.isArray(data) && data.message && typeof data.message === 'string') {
    //         try {
    //             const parsed = JSON.parse(data.message);
    //             if (Array.isArray(parsed)) {
    //                 data = parsed;
    //             }
    //         } catch (e) { }
    //     }
    //     if (typeof data === 'string') {
    //         try { data = JSON.parse(data); } catch { return null; }
    //     }
    //     if (!Array.isArray(data)) return null;
    //     if (data.length > 0 && Array.isArray(data[0]) && data[0].length === 2 && Array.isArray(data[0][1])) {
    //         return data.flatMap((tuple: any) => tuple[1]);
    //     } return data;
    // }

    private async applyTactic(tactic: string) {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'coq') {
                this.postError('Open a Coq document and place cursor inside a proof');
                return;
            }

            const docUri = Uri.fromPath(editor.document.uri.fsPath);
            const version = editor.document.version;
            const position = editor.selection.active;

            const client = await this.clientReady;

            // withTextDocument ensures the document is opened on the server
            await client.withTextDocument({ uri: docUri, version }, async () => {
                const result = await client.getGoalsAtPoint(position as any, docUri as any, version, tactic);
                const goals = normalizeGoals(result);

                if (goals) {
                    this.panel.webview.postMessage({ type: 'proofUpdate', goals });
                } else {
                    // If normalization failed, print the raw result to debug
                    const err = (result as any)?.val || result;
                    this.postError(err?.message ?? JSON.stringify(err));
                }
            });
        } catch (e) {
            this.postError(e instanceof Error ? e.message : String(e));
        }
    }

    private postError(msg: string) {
        this.panel.webview.postMessage({ type: 'error', message: msg });
    }

    private async updateProofState() {
        try {
            if (this.panel.active) { return; }
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'coq') {
                this.panel.webview.postMessage({ type: 'noDocument' });
                return;
            }
            
            this.currentDocumentUri = editor.document.uri; 
            const docUri = Uri.fromPath(editor.document.uri.fsPath);
            const version = editor.document.version;
            const position = editor.selection.active;

            const client = await this.clientReady;

            await client.withTextDocument({ uri: docUri, version }, async () => {
                const result = await client.getGoalsAtPoint(position as any, docUri as any, version);
                const goals = normalizeGoals(result);

                if (goals) {
                    this.panel.webview.postMessage({ type: 'proofUpdate', goals });
                } else {
                    // If normalization failed, print the raw result to debug
                    const err = (result as any)?.val || result;
                    this.postError(err?.message ?? JSON.stringify(err));
                }
            });
        } catch (e) {
            this.postError(e instanceof Error ? e.message : String(e));
        }
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.extensionUri, 'src', 'webview', 'proofState.js'
        ));

        const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.extensionUri, 'src', 'webview', 'proofState.css'
        ));

        const proseMirrorCssUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.extensionUri, 'node_modules', 'prosemirror-view', 'style', 'prosemirror.css'
        ));

        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'none'; 
    style-src ${webview.cspSource}; 
    script-src ${webview.cspSource};
  ">

  <link rel="stylesheet" type="text/css" href="${proseMirrorCssUri}">
  <link rel="stylesheet" type="text/css" href="${cssUri}">
  
<title>Coq Proof State</title>
</head>
<body>
  <h2>Output Directed Theorem Prover</h2>
  
  <div id="editor"></div>

    <div id="chat" class="controls">
        <div id="chatLog"></div>
        <input id="chatInput" type="text" placeholder="Ask the assistant about this proof state" />
        <button id="chatSend">Send</button>
    </div>

  <script src="${scriptUri}"></script>
</body>
</html>`;
    }
}

export default ProofStatePanel;
