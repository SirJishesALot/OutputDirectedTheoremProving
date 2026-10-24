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
            getText: () => 'Theorem test : True.\nProof.',
        } as unknown as vscode.TextDocument;

        const mockEditor = {
            document: mockDoc,
            selection: { active: new vscode.Position(1, 0) },
        } as unknown as vscode.TextEditor;

        const guard = new EditorBufferGuard(mockEditor);
        assert.strictEqual(guard.isDocumentModified(mockEditor), false);

        // When version increments and text changes (e.g. user typed into editor while LLM in flight)
        const driftedDoc = {
            ...mockDoc,
            version: 2,
            getText: () => 'Theorem test : True.\nProof. modified',
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

        // When version increments but content is identical (e.g. auto-save / focus change)
        const autoSavedDoc = {
            ...mockDoc,
            version: 3,
            getText: () => 'Theorem test : True.\nProof.',
        } as unknown as vscode.TextDocument;
        const autoSavedEditor = {
            document: autoSavedDoc,
            selection: { active: new vscode.Position(1, 0) },
        } as unknown as vscode.TextEditor;

        assert.strictEqual(guard.isDocumentModified(autoSavedEditor), false);
        assert.doesNotThrow(() => guard.assertNotModified(autoSavedEditor));

        // When version is synchronized (e.g. after internal speculative edit rollback)
        guard.syncVersion(driftedEditor);
        assert.strictEqual(guard.isDocumentModified(driftedEditor), false);
        assert.doesNotThrow(() => guard.assertNotModified(driftedEditor));
    });
});
