import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';

export interface AgentTool {
    name: string;
    description: string;
    // The function returns a string (success message, error, or data)
    execute: (args: any) => Promise<string>;
}

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
            // Request more tokens for longer responses
            const chatResponse = await model.sendRequest(messages, { maxTokens: 2048 }, token);
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

/**
 * A multi-turn agent loop that uses the provided model to execute tools.
 * It uses JSON-Prompting so it works with any model adapter (OpenAI, Local, etc).
 */
export async function runCoqAgent(
    clientReady: Promise<CoqLspClient> | undefined,
    model: any,
    userRequest: string,
    tools: AgentTool[],
    onUpdate: (text: string) => void,
    onDone?: () => void,
    token?: vscode.CancellationToken
) {
    if (!clientReady || !model) {
        onUpdate("Error: Client or Model not ready.");
        onDone?.();
        return;
    }

    // 1. Construct the System Prompt describing the tools
    const toolDescriptions = tools.map(t => 
        `- ${t.name}: ${t.description}. Input: JSON arguments.`
    ).join('\n');

    const systemPrompt = `You are an automated Coq assistant with access to tools that can inspect the proof state and suggest edits.

You have access to the following tools:
${toolDescriptions}

IMPORTANT: When the user asks questions about:
- The current proof state, goals, or hypotheses → use get_current_proof_state
- What tactic to use → use get_current_proof_state first to see what needs to be proved
- Suggesting edits or transformations → use get_current_proof_state, get_proof_context, and suggest_proof_state_edit
- Available theorems or context → use get_proof_context
- Validating terms → use check_term_validity

To use a tool, you MUST respond with ONLY a JSON block like this:
\`\`\`json
{ "tool": "tool_name", "args": { ... } }
\`\`\`

If you do not need to use a tool, just respond with text.
When you receive a tool result, analyze it and either:
1. Use another tool if needed, OR
2. Provide a helpful answer based on the tool results.

For questions about tactics or proof state, you should ALWAYS start by calling get_current_proof_state to understand what you're working with.
`;

    // 2. Initialize Conversation History
    // We assume the model adapter expects { role, content } objects
    let messages: any[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userRequest }
    ];

    const MAX_TURNS = 5; // Prevent infinite loops
    let turn = 0;

    try {
        while (turn < MAX_TURNS) {
            turn++;
            if (token?.isCancellationRequested) break;

            // --- A. Call the Model ---
            let fullResponseText = "";
            
            // We stream the response to the UI so the user sees "Thinking..."
            // Request more tokens for longer responses (especially for multi-turn agent conversations)
            const responseStream = await model.sendRequest(messages, { maxTokens: 2048 }, token);
            
            for await (const chunk of responseStream.text) {
                fullResponseText += chunk;
                onUpdate(chunk); // Echo to UI
            }

            // Append model's response to history
            messages.push({ role: 'assistant', content: fullResponseText });

            // --- B. Parse for Tool Calls ---
            const jsonMatch = fullResponseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
            
            if (!jsonMatch) {
                // No tool call found -> The agent is done.
                // Only log this in debug mode, don't show to user
                console.log("Agent finished without tool call - responding with text only"); 
                break;
            }

            // --- C. Execute Tool ---
            try {
                const command = JSON.parse(jsonMatch[1]);
                const toolName = command.tool;
                const toolArgs = command.args;

                const targetTool = tools.find(t => t.name === toolName);
                if (!targetTool) {
                    throw new Error(`Unknown tool: ${toolName}`);
                }

                onUpdate(`\n\n_Executing tool: ${toolName}..._\n`);
                
                // Execute logic
                const result = await targetTool.execute(toolArgs);

                // Add result to history
                messages.push({ 
                    role: 'user', // We use 'user' to represent the "System Output" in generic chat formats
                    content: `TOOL RESULT (${toolName}): ${result}` 
                });

                onUpdate(`\n_Result: ${result}_\n\n`);

            } catch (e) {
                onUpdate(`\n_Tool Execution Error: ${e}_\n`);
                messages.push({ role: 'user', content: `TOOL ERROR: ${e}` });
            }
            // Loop continues -> sends history + tool result back to LLM
        }
    } catch (e) {
        onUpdate(`\nAgent Error: ${e}`);
    } finally {
        onDone?.();
    }
}