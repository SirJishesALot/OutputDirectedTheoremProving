import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { runCoqAgent, AgentTool, streamCoqChat, SuggestionCallback, ConversationHistoryCallback } from '../llm/chatBridge';
import { CoqTools } from '../tools/coqTools';
import { createAutoformaliserTools, EditHistory } from '../tools/autoformaliserTools';
import { convertToString, ProofGoal, Hyp, PpString, GoalsWithMessages } from '../lsp/coqLspTypes'; 

type ClientReadyPromise = Promise<CoqLspClient>;

export class ProofStatePanel {
    public static currentPanel: ProofStatePanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private disposables: vscode.Disposable[] = [];
    private clientReady: ClientReadyPromise;
    private currentDocumentUri: vscode.Uri | undefined;
    private editHistory: EditHistory = { edits: [] };
    private conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []; 

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
            // Use agent with tools for chat - allows the agent to decide when to use tools
            (async () => {
                try {
                    // Ask the extension for a model object (may return null)
                    // Pass useCache: true to use cached model if available, otherwise show picker
                    const model = await vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel', { useCache: true });
                    if (!model) {
                        // No model available -- inform the webview
                        this.panel.webview.postMessage({ type: 'chatResponsePart', text: 'No chat model available. Open the Chat view to configure a model.' });
                        this.panel.webview.postMessage({ type: 'chatResponseDone' });
                        return;
                    }

                    // Get the active editor
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
                        // Fall back to simple chat if no editor
                        await streamCoqChat(this.clientReady, model, prompt, (chunk: string) => {
                            this.panel.webview.postMessage({ type: 'chatResponsePart', text: chunk });
                        }, () => {
                            this.panel.webview.postMessage({ type: 'chatResponseDone' });
                        });
                        return;
                    }

                    // Create autoformaliser tools with edit history
                    const tools = createAutoformaliserTools(
                        this.clientReady,
                        editor,
                        this.editHistory
                    );

                    // Enhance the prompt to encourage tool use for proof-related questions
                    const enhancedPrompt = this.enhancePromptForTools(prompt);

                    // Callback to handle suggestions from the agent
                    const handleSuggestion: SuggestionCallback = (suggestion) => {
                        // Send suggestion to webview to display in ProseMirror
                        this.panel.webview.postMessage({
                            type: 'suggestion',
                            suggestion: suggestion
                        });
                    };

                    // Callback to update conversation history
                    const handleHistoryUpdate: ConversationHistoryCallback = (history) => {
                        this.conversationHistory = history;
                    };

                    // Use runCoqAgent which allows the agent to decide when to use tools
                    await runCoqAgent(
                        this.clientReady,
                        model,
                        enhancedPrompt,
                        tools,
                        (chunk: string) => {
                            this.panel.webview.postMessage({ type: 'chatResponsePart', text: chunk });
                        },
                        () => {
                            this.panel.webview.postMessage({ type: 'chatResponseDone' });
                        },
                        undefined, // token
                        handleSuggestion, // onSuggestion callback
                        this.conversationHistory, // conversation history
                        handleHistoryUpdate, // onHistoryUpdate callback
                        this.editHistory // edit history
                    );
                } catch (e) {
                    console.error('Stream chat response failed:', e);
                    this.panel.webview.postMessage({ type: 'chatResponseDone' });
                }
            })();
        } else if (cmd === 'agentRequest') { 
            console.log('Agent request received:', message.context);
            await this.handleAgentRequest(message.context);
        } else if (cmd === 'updateEditHistory') {
            // Update edit history when user makes edits in the proof state
            const edit = message.edit;
            if (edit && edit.lhs && edit.rhs) {
                // Check if this edit already exists (avoid duplicates)
                const isDuplicate = this.editHistory.edits.some(
                    e => e.lhs === edit.lhs && e.rhs === edit.rhs
                );
                
                if (!isDuplicate) {
                    this.editHistory.edits.push({
                        lhs: edit.lhs,
                        rhs: edit.rhs,
                        timestamp: edit.timestamp || Date.now()
                    });
                    console.log('Edit history updated:', this.editHistory.edits.length, 'edits');
                }
            }
        }
    }

    private async handleAgentRequest(context: { lhs: string, rhs: string }) {
        console.log("before getting model for agent"); 
        // Pass useCache: true to use cached model if available, otherwise show picker
        const model = await vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel', { useCache: true });
        if (!model) {
            this.panel.webview.postMessage({ type: 'chatResponsePart', text: 'Error: No model selected.' });
            return;
        }
        console.log("after getting model for agent"); 

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

        const coqTools = new CoqTools(await this.clientReady, editor);

        const lhs = context.lhs.trim();
        const rhs = context.rhs.trim();
        
        // Track this edit in history
        this.editHistory.edits.push({
            lhs,
            rhs,
            timestamp: Date.now()
        });
        
        const assertion = `assert ((${lhs}) = (${rhs})).`;

        this.panel.webview.postMessage({ 
            type: 'chatResponsePart', 
            text: `_Synthesizing equality check for:_\n\`${lhs}\` replaced by \`${rhs}\`\n\n` 
        });

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

                if (result.ok) {
                    const goalsWithMessages = result.val;
                    const goals = goalsWithMessages.goals;
                    const messages = goalsWithMessages.messages || [];
                    const error = goalsWithMessages.error;

                    // Convert PpString to strings to preserve newlines
                    const convertedGoals = goals.map((g: ProofGoal) => ({
                        ty: convertToString(g.ty),
                        hyps: g.hyps.map((h: Hyp<PpString>) => ({
                            names: h.names.map(n => convertToString(n)),
                            def: h.def ? convertToString(h.def) : undefined,
                            ty: convertToString(h.ty)
                        }))
                    }));
                    
                    // Send goals and messages to webview
                    this.panel.webview.postMessage({ 
                        type: 'proofUpdate', 
                        goals: convertedGoals,
                        messages: messages,
                        error: error
                    });
                } else {
                    // If request failed, show error
                    const err = result.val;
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

    /**
     * Enhances user prompts to encourage tool use when appropriate.
     * Adds context hints for questions that clearly need proof state information.
     */
    private enhancePromptForTools(prompt: string): string {
        const lowerPrompt = prompt.toLowerCase();
        
        // Keywords that suggest the user needs proof script information (theorem name, proof script, etc.)
        const proofScriptKeywords = [
            'theorem', 'lemma', 'name', 'working on', 'proof script',
            'what theorem', 'what lemma', 'theorem name', 'lemma name'
        ];
        
        // Keywords that suggest the user needs proof state information
        const proofStateKeywords = [
            'tactic', 'what should', 'how to', 'suggest', 'recommend',
            'what can', 'help with', 'current', 'proof state', 'goal',
            'hypothesis', 'hypotheses', 'here', 'this proof'
        ];
        
        const needsProofScript = proofScriptKeywords.some(keyword => lowerPrompt.includes(keyword));
        const needsProofState = proofStateKeywords.some(keyword => lowerPrompt.includes(keyword));
        
        if (needsProofScript) {
            return `${prompt}\n\nNote: To answer this question accurately, you should use the get_current_proof_script tool to see the theorem name and proof script.`;
        }
        
        if (needsProofState) {
            return `${prompt}\n\nNote: To answer this question accurately, you should use the get_current_proof_state tool to see the current goals and hypotheses.`;
        }
        
        return prompt;
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

                if (result.ok) {
                    const goalsWithMessages = result.val;
                    const goals = goalsWithMessages.goals;
                    const messages = goalsWithMessages.messages || [];
                    const error = goalsWithMessages.error;

                    // Log the retrieved goal state
                    console.log('Retrieved goal state:', JSON.stringify({
                        goals: goals,
                        messages: messages,
                        error: error,
                        rawResult: result
                    }, null, 2));

                    // Convert PpString to strings to preserve newlines
                    const convertedGoals = goals.map((g: ProofGoal) => ({
                        ty: convertToString(g.ty),
                        hyps: g.hyps.map((h: Hyp<PpString>) => ({
                            names: h.names.map(n => convertToString(n)),
                            def: h.def ? convertToString(h.def) : undefined,
                            ty: convertToString(h.ty)
                        }))
                    }));
                    
                    // Send goals and messages to webview
                    this.panel.webview.postMessage({ 
                        type: 'proofUpdate', 
                        goals: convertedGoals,
                        messages: messages,
                        error: error
                    });
                } else {
                    // If request failed, show error
                    const err = result.val;
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
        <div style="display: flex; flex-direction: row; align-items: center;">
            <input id="chatInput" type="text" placeholder="Consult the assistant." />
            <button id="chatSend">Send</button>
        </div>
    </div>

  <script src="${scriptUri}"></script>
</body>
</html>`;
    }
}

export default ProofStatePanel;
