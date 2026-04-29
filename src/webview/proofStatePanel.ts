import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { runCoqAgent, AgentTool, streamCoqChat, SuggestionCallback, ConversationHistoryCallback } from '../llm/chatBridge';
import { CoqTools } from '../tools/coqTools';
import { createAutoformaliserTools, EditHistory } from '../tools/autoformaliserTools';
import { createProverTools, clearSuggestedEditDecoration } from '../tools/proverTools';
import { runProverAgent } from '../llm/chatBridge';
import { convertToString, ProofGoal, Hyp, PpString, GoalsWithMessages } from '../lsp/coqLspTypes';
import { isCoqDocumentLanguage } from '../utils/coqUtils'; 

// --- NEW IMPORT FOR INLINE SUGGESTIONS ---
import { globalSuggestionManager } from '../extension';
// -----------------------------------------

type ClientReadyPromise = Promise<CoqLspClient>;
type ActiveProverKind = 'Coq' | 'Lean';
type ActiveProverProvider = () => ActiveProverKind;
type GenericProofState = {
    goals: Array<{ ty: string; hyps: Array<{ names: string[]; ty: string; def?: string }> }>;
    messages: string[];
    error?: string;
};
type GenericProofStateProvider = (
    document: vscode.TextDocument,
    position: vscode.Position
) => Promise<GenericProofState>;

export class ProofStatePanel {
    public static currentPanel: ProofStatePanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private chatPanel: vscode.WebviewPanel | undefined;
    private readonly extensionUri: vscode.Uri;
    private disposables: vscode.Disposable[] = [];
    private clientReady: ClientReadyPromise;
    private getActiveProver: ActiveProverProvider;
    private getProofState: GenericProofStateProvider;
    private currentDocumentUri: vscode.Uri | undefined;
    /** Last cursor position when proof state was updated (Coq file had focus). Used by prover tools when panel has focus. */
    private savedCursorPosition: { line: number; character: number } | undefined;
    private editHistory: EditHistory = { edits: [] };
    private conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
    /** When the prover applies a suggested edit, we store the editor so Keep/Revert can clear the decoration and optionally undo. */
    private pendingSuggestedEditor: vscode.TextEditor | undefined;
    /** Cancellation for the current chat/agent run. Cancel when user clicks Stop. */
    private chatCancelSource: vscode.CancellationTokenSource | undefined;

    public static createOrShow(
        context: vscode.ExtensionContext,
        clientReady: ClientReadyPromise,
        extensionUri: vscode.Uri,
        getActiveProver: ActiveProverProvider,
        getProofState: GenericProofStateProvider
    ) {
        const column = vscode.ViewColumn.Beside; 

        if (ProofStatePanel.currentPanel) {
            ProofStatePanel.currentPanel.setProviders(clientReady, getActiveProver, getProofState);
            ProofStatePanel.currentPanel.setActiveProver(getActiveProver());
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
            extensionUri,
            getActiveProver,
            getProofState
        );

        return ProofStatePanel.currentPanel;
    }

    private constructor(
        panel: vscode.WebviewPanel,
        clientReady: ClientReadyPromise,
        extensionUri: vscode.Uri,
        getActiveProver: ActiveProverProvider,
        getProofState: GenericProofStateProvider
    ) {
        this.panel = panel;
        this.extensionUri = extensionUri;
        this.clientReady = clientReady;
        this.getActiveProver = getActiveProver;
        this.getProofState = getProofState;

        void vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel'); 

        this.panel.webview.onDidReceiveMessage(
            (message) => this.handleMessage(message, this.panel.webview),
            null,
            this.disposables
        );

        this.panel.webview.html = this.getHtmlForWebview(this.panel.webview);
        this.setActiveProver(this.getActiveProver());

        vscode.window.onDidChangeTextEditorSelection(
            () => {
                void this.updateProofState();
            },
            null,
            this.disposables
        );

        vscode.window.onDidChangeActiveTextEditor(
            () => {
                void this.updateProofState();
            },
            null,
            this.disposables
        );

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        void this.updateProofState(); // initial update
    }

    public setProviders(
        clientReady: ClientReadyPromise,
        getActiveProver: ActiveProverProvider,
        getProofState: GenericProofStateProvider
    ) {
        this.clientReady = clientReady;
        this.getActiveProver = getActiveProver;
        this.getProofState = getProofState;
        this.setActiveProver(this.getActiveProver());
    }

    public setActiveProver(kind: ActiveProverKind) {
        this.panel.webview.postMessage({ type: 'activeProverChanged', prover: kind });
    }

    private isEditorForActiveProver(editor: vscode.TextEditor, activeProver: ActiveProverKind): boolean {
        if (activeProver === 'Coq') {
            return isCoqDocumentLanguage(editor.document.languageId);
        }
        const lang = editor.document.languageId.toLowerCase();
        return lang.includes('lean') || editor.document.uri.fsPath.endsWith('.lean');
    }

    /** Webview that currently shows the chat (chat panel if open, otherwise main panel). */
    private getChatWebview(): vscode.Webview {
        return this.chatPanel?.webview ?? this.panel.webview;
    }

    /** Call this to refresh the proof state at the current editor cursor (e.g. from a keybinding or toolbar). */
    public async requestProofStateUpdate(): Promise<void> {
        await this.updateProofState();
    }

    public dispose() {
        ProofStatePanel.currentPanel = undefined;
        this.closeChatPanel();
        this.panel.dispose();
        while (this.disposables.length) {
            const d = this.disposables.pop();
            if (d) { d.dispose(); }
        }
    }

    private openChatPanel(initialChatLogHtml: string) {
        if (this.chatPanel) {
            this.chatPanel.reveal();
            this.chatPanel.webview.postMessage({ type: 'initialChatLogContent', content: initialChatLogHtml });
            return;
        }
        const chatPanel = vscode.window.createWebviewPanel(
            'coqProofStateChat',
            'Coq Proof State – Chat',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'src', 'webview')],
            }
        );
        this.chatPanel = chatPanel;
        chatPanel.webview.html = this.getChatOnlyHtml(chatPanel.webview);
        this.panel.webview.postMessage({ type: 'setChatVisible', visible: false });
        chatPanel.webview.onDidReceiveMessage(
            (message) => this.handleMessage(message, chatPanel.webview),
            null,
            this.disposables
        );
        chatPanel.onDidDispose(() => {
            this.chatPanel = undefined;
            this.panel.webview.postMessage({ type: 'setChatVisible', visible: true });
        }, null, this.disposables);
        // Send initial content after script is ready (next tick)
        setTimeout(() => {
            chatPanel.webview.postMessage({ type: 'initialChatLogContent', content: initialChatLogHtml });
        }, 0);
    }

    private closeChatPanel() {
        const p = this.chatPanel;
        this.chatPanel = undefined;
        if (p) p.dispose();
        this.panel.webview.postMessage({ type: 'setChatVisible', visible: true });
    }

    private getChatOnlyHtml(webview: vscode.Webview): string {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.extensionUri, 'src', 'webview', 'proofStateChat.js'
        ));
        const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.extensionUri, 'src', 'webview', 'proofState.css'
        ));
        const katexCssUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.extensionUri, 'node_modules', 'katex', 'dist', 'katex.min.css'
        ));
        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'none';
    style-src ${webview.cspSource} ${katexCssUri} 'unsafe-inline';
    script-src ${webview.cspSource};
  ">
  <link rel="stylesheet" type="text/css" href="${cssUri}">
  <link rel="stylesheet" type="text/css" href="${katexCssUri}">
  <title>Chat</title>
</head>
<body>
  <div class="controls" style="display: flex; flex-direction: column; height: 100%; padding: 12px; box-sizing: border-box;">
    <div style="flex: 0 0 auto; display: flex; justify-content: flex-end;">
      <button id="popBackChat">Pop back</button>
    </div>
    <div id="synthesizingIndicator" class="synthesizing-indicator" aria-hidden="true">Synthesizing proof...</div>
    <div id="chatLog" style="flex: 1 1 auto; min-height: 0; overflow: auto;"></div>
    <div id="chatTypingIndicator" class="chat-typing-indicator" aria-hidden="true">Model is typing...</div>
    <div style="display: flex; flex-direction: row; align-items: center; gap: 6px;">
      <input id="chatInput" type="text" placeholder="Consult the assistant." />
      <button id="chatSend">Send</button>
      <button id="chatStop" type="button">Stop</button>
    </div>
  </div>
  <script src="${scriptUri}"></script>
</body>
</html>`;
    }

    private async handleMessage(message: any, fromWebview: vscode.Webview) {
        const cmd = message.command;
        const msgType = message.type;
        const isMain = fromWebview === this.panel.webview;

        if (isMain && msgType === 'chatLogContent') {
            const content = message.content as string | undefined;
            this.openChatPanel(content ?? '');
            return;
        }

        if (cmd === 'popOutChat') {
            if (isMain) {
                this.panel.webview.postMessage({ type: 'getChatLogContent' });
            }
            return;
        }

        if (cmd === 'popBackChat') {
            this.closeChatPanel();
            return;
        }

        if (cmd === 'stopGeneration') {
            if (this.chatCancelSource) {
                this.chatCancelSource.cancel();
            }
            return;
        }

        if (cmd === 'requestUpdate') {
            if (!isMain) return;
            console.log('proof state update requested');
            await this.updateProofState();
        } else if (cmd === 'toggleActiveProver') {
            await vscode.commands.executeCommand('outputdirectedtheoremproving.toggleActiveProver');
        } else if (cmd === 'applyTactic') {
            if (!isMain) return;
            const tactic: string = message.tactic;
            await this.applyTactic(tactic);
        } else if (cmd === 'proofSuggestionKeep') {
            if (!isMain) return;
            const ed = this.pendingSuggestedEditor;
            this.pendingSuggestedEditor = undefined;
            if (ed) clearSuggestedEditDecoration(ed);
        } else if (cmd === 'proofSuggestionRevert') {
            if (!isMain) return;
            const ed = this.pendingSuggestedEditor;
            this.pendingSuggestedEditor = undefined;
            if (ed) {
                clearSuggestedEditDecoration(ed);
                await vscode.commands.executeCommand('undo');
            }
        } else if (cmd === 'chat') {
            const prompt: string = message.prompt;
            console.log('Chat prompt received from webview:', prompt);
            this.chatCancelSource?.dispose();
            this.chatCancelSource = new vscode.CancellationTokenSource();
            const token = this.chatCancelSource.token;
            // Use agent with tools for chat - allows the agent to decide when to use tools
            (async () => {
                try {
                    // Ask the extension for a model object (may return null)
                    // Pass useCache: true to use cached model if available, otherwise show picker
                    const model = await vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel', { useCache: true });
                    if (!model) {
                        // No model available -- inform the webview
                        this.getChatWebview().postMessage({ type: 'chatResponsePart', text: 'No chat model available. Open the Chat view to configure a model.' });
                        this.getChatWebview().postMessage({ type: 'chatResponseDone' });
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
                    if (!editor || !isCoqDocumentLanguage(editor.document.languageId)) {
                        editor = vscode.window.visibleTextEditors.find((e) => isCoqDocumentLanguage(e.document.languageId));
                    }

                    if (!editor) {
                        // Fall back to simple chat if no editor
                        await streamCoqChat(this.clientReady, model, prompt, (chunk: string) => {
                            this.getChatWebview().postMessage({ type: 'chatResponsePart', text: chunk });
                        }, () => {
                            this.getChatWebview().postMessage({ type: 'chatResponseDone' });
                        }, token);
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
                        const msg = { type: 'suggestion' as const, suggestion };
                        this.getChatWebview().postMessage(msg);
                        // Refresh main panel proof state then send suggestion so the document matches what the agent saw.
                        // Small delay so the panel has time to apply the proofUpdate before we send the suggestion.
                        void (async () => {
                            await this.updateProofStateForSuggestion();
                            await new Promise((r) => setTimeout(r, 150));
                            this.panel.webview.postMessage(msg);
                        })();
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
                            this.getChatWebview().postMessage({ type: 'chatResponsePart', text: chunk });
                        },
                        () => {
                            this.getChatWebview().postMessage({ type: 'chatResponseDone' });
                        },
                        token,
                        handleSuggestion, // onSuggestion callback
                        this.conversationHistory, // conversation history
                        handleHistoryUpdate, // onHistoryUpdate callback
                        this.editHistory // edit history
                    );
                } catch (e) {
                    console.error('Stream chat response failed:', e);
                    this.getChatWebview().postMessage({ type: 'chatResponseDone' });
                } finally {
                    this.chatCancelSource?.dispose();
                    this.chatCancelSource = undefined;
                }
            })();
        } else if (cmd === 'agentRequest') {
            if (!isMain) return;
            console.log('[Proof State Panel] agentRequest received, context:', JSON.stringify(message.context));
            await this.handleAgentRequest(message.context);
        } else if (cmd === 'updateEditHistory') {
            if (!isMain) return;
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

    private async handleAgentRequest(context: { lhs?: string; rhs?: string; fullOriginalState?: string; fullDesiredState?: string }) {
        const lhs = (context?.lhs ?? '').trim();
        const rhs = (context?.rhs ?? '').trim();
        const fullOriginalState = (context?.fullOriginalState ?? '').trim() || undefined;
        const fullDesiredState = (context?.fullDesiredState ?? '').trim() || undefined;
        console.log('[Proof State Panel] handleAgentRequest started', { lhs, rhs, hasFullState: !!(fullOriginalState && fullDesiredState) });
        this.chatCancelSource?.dispose();
        this.chatCancelSource = new vscode.CancellationTokenSource();
        const token = this.chatCancelSource.token;
        this.getChatWebview().postMessage({ type: 'proverAgentStarted' });
        try {
        const hasFullState = !!(fullOriginalState && fullDesiredState);
        if (!hasFullState && (!lhs || !rhs)) {
            this.getChatWebview().postMessage({
                type: 'chatResponsePart',
                text: '_No proof state change selected._ Enable **Suggestions**, then mark a change on a hypothesis or goal (e.g. edit it to show old → new). Click **Synthesize Equality** again.',
            });
            this.getChatWebview().postMessage({ type: 'chatResponseDone' });
            return;
        }
        // Pass useCache: true to use cached model if available, otherwise show picker
        const model = await vscode.commands.executeCommand('outputdirectedtheoremproving.getDefaultChatModel', { useCache: true });
        if (!model) {
            console.log('[Proof State Panel] No model selected, aborting');
            this.getChatWebview().postMessage({ type: 'chatResponsePart', text: 'Error: No model selected.' });
            this.getChatWebview().postMessage({ type: 'chatResponseDone' });
            return;
        }
        console.log('[Proof State Panel] Model obtained');

        console.log('[Proof State Panel] Resolving Coq editor');
        let editor: vscode.TextEditor | undefined; 
        if (this.currentDocumentUri) {
            editor = vscode.window.visibleTextEditors.find(
                e => e.document.uri.toString() === this.currentDocumentUri?.toString()
            );
        }

        if (!editor) editor = vscode.window.activeTextEditor;
        if (!editor || !isCoqDocumentLanguage(editor.document.languageId)) {
            editor = vscode.window.visibleTextEditors.find((e) => isCoqDocumentLanguage(e.document.languageId));
        }

        if (!editor) {
            console.error('[Proof State Panel] Could not find the bound Coq editor.');
            this.getChatWebview().postMessage({ type: 'chatResponsePart', text: 'Error: The Coq file for this proof state is no longer visible.' });
            this.getChatWebview().postMessage({ type: 'chatResponseDone' });
            return;
        }
        console.log('[Proof State Panel] Editor found, running prover agent');

        if (!this.savedCursorPosition) {
            this.savedCursorPosition = { line: editor.selection.active.line, character: editor.selection.active.character };
        }

        // Track this edit in history
        this.editHistory.edits.push({
            lhs,
            rhs,
            timestamp: Date.now()
        });

        // Compute full state text for the agent (and for tool session fallback when agent sends empty)
        const originalValue = (fullOriginalState || lhs).trim() || lhs;
        const desiredValue = (fullDesiredState || rhs).trim() || rhs;
        if (!originalValue || !desiredValue) {
            this.getChatWebview().postMessage({ type: 'chatResponsePart', text: 'Error: Proof state text is empty; cannot run the prover agent.' });
            this.getChatWebview().postMessage({ type: 'chatResponseDone' });
            return;
        }

        // Create prover tools with session state and saved cursor (so tools use proof position when panel has focus)
        const proverTools = createProverTools(this.clientReady, editor, {
            sessionOriginalValue: originalValue,
            sessionDesiredValue: desiredValue,
            cursorPositionOverride: this.savedCursorPosition,
            // --- UPDATED: Connect the suggestion event to the global manager ---
            onSuggestedEditApplied: (ed, range, oldText) => {
                this.pendingSuggestedEditor = ed;
                if (globalSuggestionManager) {
                    globalSuggestionManager.setSuggestion(ed.document.uri, range, oldText);
                }
                this.panel.webview.postMessage({ type: 'proofSuggestionApplied' });
            },
            // -------------------------------------------------------------------
        });

        // Show initial message (show full-state summary when available)
        const summary = fullOriginalState && fullDesiredState
            ? 'Full proof state (before) → (after)'
            : `\`${lhs}\` → \`${rhs}\``;
        this.getChatWebview().postMessage({ 
            type: 'chatResponsePart', 
            text: `_Prover Agent: Attempting to achieve proof state change_\n${summary}\n\n` 
        });

        try {
            console.log('[Proof State Panel] Calling runProverAgent');
            await runProverAgent(
                this.clientReady,
                model,
                {
                    originalValue,
                    desiredValue,
                    validationLhs: lhs || undefined,
                    validationRhs: rhs || undefined,
                },
                proverTools,
                (chunk: string) => {
                    this.getChatWebview().postMessage({ type: 'chatResponsePart', text: chunk });
                },
                () => {
                    this.getChatWebview().postMessage({ type: 'chatResponseDone' });
                },
                token
            );
            console.log('[Proof State Panel] runProverAgent finished');
        } catch (e) {
            console.error('[Proof State Panel] Prover agent error:', e);
            this.getChatWebview().postMessage({
                type: 'chatResponsePart',
                text: `Error running prover agent: ${e instanceof Error ? e.message : String(e)}`
            });
            this.getChatWebview().postMessage({ type: 'chatResponseDone' });
        }
        } finally {
            this.chatCancelSource?.dispose();
            this.chatCancelSource = undefined;
            this.getChatWebview().postMessage({ type: 'proverAgentDone' });
        }
    }

    

    private async applyTactic(tactic: string) {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor || !isCoqDocumentLanguage(editor.document.languageId)) {
                this.postError('Open a Coq document and place cursor inside a proof');
                return;
            }

            const docUri = Uri.fromVscodeUri(editor.document.uri);
            const version = editor.document.version;
            const position = editor.selection.active;

            const client = await this.clientReady;
            const content = editor.document.getText();

            // withTextDocument ensures the document is opened on the server
            await client.withTextDocument(
                {
                    uri: docUri,
                    version,
                    languageId: editor.document.languageId,
                    content,
                    openTimeoutMs: 45000,
                },
                async () => {
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
            }
            );
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

    /** Like updateProofState but skips the panel.active check. Use before sending a suggestion so the main panel has current goals. */
    private async updateProofStateForSuggestion(): Promise<void> {
        try {
            const activeProver = this.getActiveProver();
            let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
            const currentMatches = editor !== undefined && this.isEditorForActiveProver(editor, activeProver);
            if (!currentMatches) editor = undefined;
            if (!editor && this.currentDocumentUri !== undefined && this.savedCursorPosition !== undefined) {
                editor = vscode.window.visibleTextEditors.find(
                    (e) =>
                        e.document.uri.toString() === this.currentDocumentUri?.toString() &&
                        this.isEditorForActiveProver(e, activeProver)
                );
            }
            if (!editor) {
                editor = vscode.window.visibleTextEditors.find((e) =>
                    this.isEditorForActiveProver(e, activeProver)
                );
            }
            if (!editor) {
                this.panel.webview.postMessage({ type: 'noDocument' });
                return;
            }
            this.currentDocumentUri = editor.document.uri;
            const position = currentMatches
                ? editor.selection.active
                : this.savedCursorPosition
                    ? new vscode.Position(this.savedCursorPosition.line, this.savedCursorPosition.character)
                    : editor.selection.active;
            this.savedCursorPosition = { line: position.line, character: position.character };
            const state = await this.getProofState(editor.document, position);
            this.panel.webview.postMessage({
                type: 'proofUpdate',
                goals: state.goals,
                messages: state.messages ?? [],
                error: state.error,
            });
        } catch (e) {
            this.postError(e instanceof Error ? e.message : String(e));
        }
    }

    private async updateProofState() {
        try {
            if (this.panel.active) { return; }
            const activeProver = this.getActiveProver();
            let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
            const currentMatches = editor !== undefined && this.isEditorForActiveProver(editor, activeProver);
            if (!currentMatches) {
                editor = undefined;
            }
            // When user clicks the webview, active editor is no longer the Coq file; use saved document and position
            if (!editor && this.currentDocumentUri !== undefined && this.savedCursorPosition !== undefined) {
                editor = vscode.window.visibleTextEditors.find(
                    (e) =>
                        e.document.uri.toString() === this.currentDocumentUri?.toString() &&
                        this.isEditorForActiveProver(e, activeProver)
                );
            }
            if (!editor) {
                editor = vscode.window.visibleTextEditors.find((e) =>
                    this.isEditorForActiveProver(e, activeProver)
                );
            }
            if (!editor) {
                this.panel.webview.postMessage({ type: 'noDocument' });
                return;
            }

            this.currentDocumentUri = editor.document.uri;
            // Use current cursor when Coq had focus; use saved position when we fell back to saved document (e.g. user clicked panel)
            const position = currentMatches
                ? editor.selection.active
                : this.savedCursorPosition
                    ? new vscode.Position(this.savedCursorPosition.line, this.savedCursorPosition.character)
                    : editor.selection.active;
            this.savedCursorPosition = { line: position.line, character: position.character };
            const state = await this.getProofState(editor.document, position);
            this.panel.webview.postMessage({
                type: 'proofUpdate',
                goals: state.goals,
                messages: state.messages ?? [],
                error: state.error,
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

        const katexCssUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this.extensionUri, 'node_modules', 'katex', 'dist', 'katex.min.css'
        ));

        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'none'; 
    style-src ${webview.cspSource} ${katexCssUri} 'unsafe-inline'; 
    script-src ${webview.cspSource};
  ">

  <link rel="stylesheet" type="text/css" href="${proseMirrorCssUri}">
  <link rel="stylesheet" type="text/css" href="${cssUri}">
  <link rel="stylesheet" type="text/css" href="${katexCssUri}">
  
<title>Coq Proof State</title>
</head>
<body>
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <h2>Output Directed Theorem Prover</h2>
    <button id="toggleProverButton" type="button">Toggle Prover</button>
  </div>
  <div id="webviewStatus" class="webview-status" aria-live="polite"></div>
  <div id="editor"></div>

    <div id="chat" class="controls">
        <div id="synthesizingIndicator" class="synthesizing-indicator" aria-hidden="true">Synthesizing proof...</div>
        <div id="chatLog"></div>
        <div id="chatTypingIndicator" class="chat-typing-indicator" aria-hidden="true">Model is typing...</div>
        <div style="display: flex; flex-direction: row; align-items: center; gap: 6px;">
            <input id="chatInput" type="text" placeholder="Consult the assistant." />
            <button id="chatSend">Send</button>
            <button id="chatStop" type="button">Stop</button>
            <button id="popOutChat" type="button">Pop out chat</button>
        </div>
    </div>

  <script src="${scriptUri}"></script>
</body>
</html>`;
    }
}

export default ProofStatePanel;