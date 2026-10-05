import * as assert from 'assert';
import * as vscode from 'vscode';
import { EditorBufferGuard, DocumentModifiedError } from '../tools/editorBufferGuard';

suite('Editor Buffer Guard Tests', () => {
    test('detects version match and version drift', () => {
        const mockDoc = {
            uri: vscode.Uri.file('/path/to/test.v'),
            version: 1,
            lineCount: 2,
            lineAt: (line: number) => ({ text: line === 0 ? 'Theorem test : True.' : 'Proof.' }),
        } as unknown as vscode.TextDocument;

        const mockEditor = {
            document: mockDoc,
            selection: { active: new vscode.Position(1, 0) },
        } as unknown as vscode.TextEditor;

        const guard = new EditorBufferGuard(mockEditor);
        assert.strictEqual(guard.isDocumentModified(mockEditor), false);

        // When version increments (e.g. user typed into editor while LLM in flight)
        const driftedDoc = {
            ...mockDoc,
            version: 2,
        } as unknown as vscode.TextDocument;
        const driftedEditor = {
            document: driftedDoc,
            selection: { active: new vscode.Position(1, 0) },
        } as unknown as vscode.TextEditor;

        assert.strictEqual(guard.isDocumentModified(driftedEditor), true);
        assert.throws(
            () => guard.assertNotModified(driftedEditor),
            (err: any) => err instanceof DocumentModifiedError
        );
    });
});
