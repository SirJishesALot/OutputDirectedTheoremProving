import * as vscode from 'vscode';
import { clearSuggestedEditDecoration } from './tools/proverTools';

export class SuggestionManager implements vscode.CodeLensProvider {
    // Stores the current active suggestion state
    public activeSuggestion: {
        uri: vscode.Uri;
        range: vscode.Range;
        oldText: string; // Keep track of this so we can revert!
    } | undefined;

    // This event tells VS Code to redraw the CodeLenses when a suggestion appears/disappears
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    /** Called by your AI agent when a new tactic is inserted */
    public setSuggestion(uri: vscode.Uri, range: vscode.Range, oldText: string = '') {
        this.activeSuggestion = { uri, range, oldText };
        
        // This enables the Cmd+Shift+Y / Cmd+Shift+N keyboard shortcuts
        // Note: keeping 'coqExtension.suggestionActive' to perfectly match your package.json 'when' clauses
        vscode.commands.executeCommand('setContext', 'coqExtension.suggestionActive', true);
        
        // Refresh the UI to show the buttons
        this._onDidChangeCodeLenses.fire();
    }

    /** Called when the user Accepts or Rejects */
    public clearSuggestion() {
        this.activeSuggestion = undefined;
        vscode.commands.executeCommand('setContext', 'coqExtension.suggestionActive', false);
        this._onDidChangeCodeLenses.fire();
    }

    /** VS Code calls this to figure out where to draw the buttons */
    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!this.activeSuggestion || document.uri.toString() !== this.activeSuggestion.uri.toString()) {
            return []; // No active suggestion in this file
        }

        // Place the buttons on the first line of the suggested edit
        const line = this.activeSuggestion.range.start.line;
        const lensRange = new vscode.Range(line, 0, line, 0);

        const acceptLens = new vscode.CodeLens(lensRange, {
            title: "$(check) Accept",
            command: "outputdirectedtheoremproving.acceptSuggestion", // Fixed command name
            arguments: []
        });

        const rejectLens = new vscode.CodeLens(lensRange, {
            title: "$(close) Reject",
            command: "outputdirectedtheoremproving.rejectSuggestion", // Fixed command name
            arguments: []
        });

        return [acceptLens, rejectLens];
    }
}