import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import streamCoqChat from '../llm/chatBridge';

type ClientReadyPromise = Promise<CoqLspClient>;

export class ProofStatePanel {
    public static currentPanel: ProofStatePanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private disposables: vscode.Disposable[] = [];
    private clientReady: ClientReadyPromise;

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
        }
    }

    private normalizeGoals(res: any): any[] | null {
        console.log(res); 
        let data = res?.val !== undefined ? res.val : res;
        if (data && typeof data === 'object' && !Array.isArray(data) && data.message && typeof data.message === 'string') {
            try {
                const parsed = JSON.parse(data.message);
                if (Array.isArray(parsed)) {
                    data = parsed;
                }
            } catch (e) { }
        }
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch { return null; }
        }
        if (!Array.isArray(data)) return null;
        if (data.length > 0 && Array.isArray(data[0]) && data[0].length === 2 && Array.isArray(data[0][1])) {
            return data.flatMap((tuple: any) => tuple[1]);
        } return data;
    }

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
                const goals = this.normalizeGoals(result);

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

            const docUri = Uri.fromPath(editor.document.uri.fsPath);
            const version = editor.document.version;
            const position = editor.selection.active;

            const client = await this.clientReady;

            await client.withTextDocument({ uri: docUri, version }, async () => {
                const result = await client.getGoalsAtPoint(position as any, docUri as any, version);
                const goals = this.normalizeGoals(result);

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
