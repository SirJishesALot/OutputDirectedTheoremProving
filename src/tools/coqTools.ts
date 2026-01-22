import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';

export class CoqTools {
    constructor(
        private client: CoqLspClient, 
        private editor: vscode.TextEditor
    ) {}

    async checkTermValidity(term: string): Promise<string> {

        const uri = Uri.fromPath(this.editor.document.uri.fsPath);
        const version = this.editor.document.version;
        const pos = this.editor.selection.active;
        const command = term.trim().endsWith('.') ? term : term + '.';

        try {
            const result = await this.client.getGoalsAtPoint(pos, uri, version, command);

            if (result.ok) {
                return "valid";
            } else {
                const err = result.val;
                const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Unable to determine term validity');
                return `error: ${errorMessage}`;
            }
        } catch (e) {
            return `error: ${e}`;
        }
    }

    async insertCode(code: string): Promise<string> {
        const success = await this.editor.edit(editBuilder => {
            editBuilder.insert(this.editor.selection.active, code + '\n');
        });
        
        if (success) {
            await this.editor.document.save(); 
            return "success";
        }
        return "failed to edit document";
    }
}