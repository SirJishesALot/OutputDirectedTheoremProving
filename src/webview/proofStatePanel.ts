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
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (ProofStatePanel.currentPanel) {
            ProofStatePanel.currentPanel.panel.reveal(column);
            return ProofStatePanel.currentPanel;
        }

        const panel = vscode.window.createWebviewPanel(
            'coqProofState',
            'Coq Proof State',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                enableFindWidget: true,
                // restrict local resources to the webview folder
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

        // initial update
        this.updateProofState();
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

    private async streamChatResponse(prompt: string) {
        // Shim: stream a few sample chunks to the webview to emulate streaming LLM output.
        const chunks = [
            'Analysing proof state...',
            'Considering hypotheses and goal...',
            `Answering: ${prompt.slice(0, 120)}${prompt.length > 120 ? '...' : ''}`,
            'Suggested tactic: intros.'
        ];

        for (const c of chunks) {
            this.panel.webview.postMessage({ type: 'chatResponsePart', text: c });
            // small delay to emulate streaming
            await new Promise((r) => setTimeout(r, 300));
        }

        this.panel.webview.postMessage({ type: 'chatResponseDone' });
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
                if ((result as any).ok) {
                    const goals = (result as any).val as any;
                    this.panel.webview.postMessage({ type: 'proofUpdate', goals });
                } else {
                    const err = (result as any).val;
                    this.postError(err?.message ?? String(err));
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
                const goalsRes = await client.getGoalsAtPoint(position as any, docUri as any, version);
                if ((goalsRes as any).ok) {
                    const goals = (goalsRes as any).val as any;
                    this.panel.webview.postMessage({ type: 'proofUpdate', goals });
                } else {
                    const err = (goalsRes as any).val;
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
  <h2>Coq Proof State</h2>
  
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
