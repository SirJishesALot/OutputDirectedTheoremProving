import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';

export async function streamCoqChat(
    clientReady: Promise<CoqLspClient> | undefined,
    model: any,
    prompt: string,
    onChunk: (chunk: string) => void,
    onDone?: () => void,
    token?: vscode.CancellationToken
) {
    if (!clientReady) {
        onChunk('ERROR: Coq LSP client is not ready.');
        onDone?.();
        return;
    }

    try {
        // Build the Coq context from the active editor. If the webview is focused
        // it may not be the active editor; prefer the active editor but fall back
        // to any visible Coq editor.
        let editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'coq') {
            editor = vscode.window.visibleTextEditors.find((e) => e.document.languageId === 'coq');
        }
        if (!editor) {
            onChunk('Please open a Coq file and place your cursor inside a proof.');
            onDone?.();
            return;
        }

        const docUri = Uri.fromPath(editor.document.uri.fsPath);
        const version = editor.document.version;
        const position = editor.selection.active;

        const client = await clientReady;
        if (!client) {
            onChunk('ERROR: Coq LSP client not available.');
            onDone?.();
            return;
        }

        let coqContext: string | null = null;
        await client.withTextDocument({ uri: docUri, version }, async () => {
            try {
                const currentGoal = await client.getFirstGoalAtPointOrThrow(position as any, docUri as any, version);
                let context = `// Coq Proof State at Cursor Position (V: ${version}):\n`;
                context += `// Goal: ${currentGoal.ty}\n\n`;
                context += `--- HYPOTHESES ---\n`;
                context += currentGoal.hyps
                    .map((h) => `${h.names.join(', ')}: ${h.ty}`)
                    .join('\n');
                context += `\n--------------------\n`;
                coqContext = context;
            } catch (e) {
                coqContext = `// ERROR: Failed to retrieve proof state: ${e instanceof Error ? e.message : String(e)}`;
            }
        });

        if (!coqContext) {
            onChunk('ERROR: Unable to build Coq context.');
            onDone?.();
            return;
        }

        if (!model) {
            onChunk('Error: No language model available for chat.');
            onDone?.();
            return;
        }

        const systemPrompt = `You are an expert Coq Theorem Prover AI. Your task is to analyse the provided Coq code and context (including selected text) to generate the single best next tactic or provide a clear explanation. Only output Coq code if asked for a tactic.`;
        // Build plain objects with explicit roles compatible with OpenAI API.
        const messages: any[] = [
            { role: 'system', content: systemPrompt },
            {
                role: 'user',
                content:
                    `--- COQ CODE CONTEXT ---\n` +
                    `\`\`\`coq\n${coqContext}\n\`\`\`\n\n` +
                    `--- USER QUESTION ---\n` +
                    `${prompt}`,
            },
        ];

        try {
            const chatResponse = await model.sendRequest(messages, {}, token);
            for await (const chunk of chatResponse.text) {
                try { onChunk(chunk); } catch (e) { console.error('onChunk failed', e); }
            }
        } catch (err) {
            const msg = `An error occurred while communicating with the LLM: ${err}`;
            onChunk(msg);
        }

    } catch (e) {
        onChunk(`Unexpected error in chat bridge: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
        onDone?.();
    }
}

export default streamCoqChat;
