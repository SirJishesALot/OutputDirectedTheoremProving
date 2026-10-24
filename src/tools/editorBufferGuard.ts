import * as vscode from 'vscode';

export class DocumentModifiedError extends Error {
    constructor(
        message = 'The document was edited concurrently while the agent was running. Edit aborted to prevent corruption. Please re-run on the current proof state.'
    ) {
        super(message);
        this.name = 'DocumentModifiedError';
    }
}

/**
 * Tracks editor document state at the initiation of an agent run to prevent
 * destructive or desynchronized edits if the user types or navigates while
 * LLM requests are in flight.
 */
export class EditorBufferGuard {
    readonly documentUri: string;
    private expectedVersion: number;
    readonly initialPosition: { line: number; character: number };
    readonly targetLineText: string;

    constructor(editor: vscode.TextEditor, cursorPositionOverride?: { line: number; character: number }) {
        this.documentUri = editor.document.uri.toString();
        this.expectedVersion = editor.document.version;
        const pos = cursorPositionOverride ?? {
            line: editor.selection.active.line,
            character: editor.selection.active.character,
        };
        this.initialPosition = { ...pos };
        const lineIndex = Math.min(pos.line, Math.max(0, editor.document.lineCount - 1));
        this.targetLineText = editor.document.lineAt(lineIndex).text;
    }

    get initialVersion(): number {
        return this.expectedVersion;
    }

    /**
     * Synchronizes expectedVersion with editor.document.version after a speculative rollback
     * that restores the document buffer to its original content.
     */
    syncVersion(editor: vscode.TextEditor): void {
        if (editor.document.uri.toString() === this.documentUri) {
            this.expectedVersion = editor.document.version;
        }
    }

    /**
     * Checks whether the document has been modified since this guard was created or synced.
     */
    isDocumentModified(editor: vscode.TextEditor): boolean {
        if (editor.document.uri.toString() !== this.documentUri) {
            return true;
        }
        return editor.document.version !== this.expectedVersion;
    }

    /**
     * Verifies that the document has not drifted. Throws DocumentModifiedError if invalid.
     */
    assertNotModified(editor: vscode.TextEditor): void {
        if (editor.document.uri.toString() !== this.documentUri) {
            throw new DocumentModifiedError(
                'Target document is no longer open or visible. Edit aborted.'
            );
        }
        if (editor.document.version !== this.expectedVersion) {
            throw new DocumentModifiedError();
        }
    }
}
