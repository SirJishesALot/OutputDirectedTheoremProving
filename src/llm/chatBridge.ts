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
export interface SuggestionCallback {
    (suggestion: {
        hypothesisName: string;
        originalValue: string;
        suggestedValue: string;
        reason?: string;
    }): void;
}

export interface ConversationHistoryCallback {
    (history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): void;
}

export async function runCoqAgent(
    clientReady: Promise<CoqLspClient> | undefined,
    model: any,
    userRequest: string,
    tools: AgentTool[],
    onUpdate: (text: string) => void,
    onDone?: () => void,
    token?: vscode.CancellationToken,
    onSuggestion?: SuggestionCallback,
    conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    onHistoryUpdate?: ConversationHistoryCallback,
    editHistory?: { edits: Array<{ lhs: string; rhs: string; timestamp?: number }> }
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

    // Check if edit history is populated
    const hasEditHistory = editHistory && editHistory.edits && editHistory.edits.length > 0;
    const editHistoryRequirement = hasEditHistory 
        ? `\n\n⚠️ MANDATORY FIRST STEP - EDIT HISTORY EXISTS:

Edit history is populated with ${editHistory.edits.length} edit(s). 

You MUST call get_edit_history FIRST before doing anything else - this is not optional.
The edit history shows what transformations have already been attempted and is essential context for ALL your responses.
You cannot suggest edits, answer questions about the proof state, or provide any assistance without first checking the edit history.

After calling get_edit_history, you can then call other tools as needed (get_current_proof_state, get_current_proof_script, get_proof_context, etc.).`
        : '';

    const systemPrompt = `You are an automated Coq assistant with access to tools that can inspect the proof state and suggest edits.

You have access to the following tools:
${toolDescriptions}
${editHistoryRequirement}

IMPORTANT: When the user asks questions about:
- The current proof state, goals, or hypotheses → use get_current_proof_state
- What tactic to use → use get_current_proof_state to see what needs to be proved
- The proof script, what tactics have been used, or the theorem name → use get_current_proof_script
- The name of the theorem being worked on → use get_current_proof_script
- Questions like "what theorem am I working on?" or "what's the name of the theorem?" → use get_current_proof_script
- Suggesting edits or transformations → you MUST call suggest_proof_state_edit after get_current_proof_state (and get_proof_context if needed). Do not only respond in text; always submit the suggestion via the tool so the user sees it in the UI.
- Available theorems or context → use get_proof_context
- Validating terms → use check_term_validity
- Edit history → use get_edit_history to see what edits have been made

CRITICAL: If the user asks about the current proof, theorem name, proof script, or what they're working on, you MUST use get_current_proof_script to get accurate information. Do not guess or make assumptions.

MULTIPLE TOOL CALLS: You can and should make multiple tool calls in sequence when needed. After receiving a tool result, you can immediately call another tool if it's needed to answer the user's question. You are not limited to a single tool call - continue calling tools until you have enough information to provide a complete answer. For example:
- If edit history exists, call get_edit_history first, then call other tools as needed (get_current_proof_state, get_proof_context, etc.)
- If you need both the proof script and current state, call both tools
- If you need multiple pieces of information, call multiple tools in sequence

To use a tool, you MUST respond with ONLY a JSON block like this:
\`\`\`json
{ "tool": "tool_name", "args": { ... } }
\`\`\`

If you do not need to use a tool, just respond with text.
When you receive a tool result, analyze it and either:
1. Use another tool if needed (you can make multiple tool calls in sequence), OR
2. Provide a helpful answer based on the tool results.

When the user asks to "suggest an edit" or "advance the proof": after gathering proof state (and optionally context), you MUST call suggest_proof_state_edit. This creates a visible edit in the proof state panel (ProseMirror): the user sees the current state with a suggested replacement. If they accept, the prover agent will later synthesize tactics to achieve that change.
- originalValue: the EXACT current text from the proof state (e.g. the goal type "ev (n + n)" or a hypothesis type). Must match exactly what is displayed in the panel.
- suggestedValue: the DESIRED proof state text only — the goal or hypothesis type we want to reach (e.g. "ev (0 + 0)" for the base case, or "ev (S (S (n' + n')))" for the inductive step). Do NOT put tactics or explanations here; suggestedValue must be the target state string that Coq would show (same format as originalValue). Use reason to explain the tactic or strategy in prose.
- hypothesisName: use "Goal" when editing the goal type, otherwise the hypothesis name.
This way the panel shows a real replace suggestion (current → desired state), and "Implement changes" can call the prover to find tactics.

For questions about tactics or proof state (when edit history is NOT populated), you should start by calling get_current_proof_state to understand what you're working with.
For questions about the theorem name or proof script, you should use get_current_proof_script.
`;

    // 2. Initialize Conversation History
    // Use provided history or start fresh
    let messages: any[] = [];
    
    // Add system prompt if not already in history
    if (!conversationHistory || conversationHistory.length === 0 || conversationHistory[0].role !== 'system') {
        messages.push({ role: 'system', content: systemPrompt });
    }
    
    // Add conversation history (excluding system prompt if we just added it)
    if (conversationHistory && conversationHistory.length > 0) {
        const historyToAdd = conversationHistory[0].role === 'system' 
            ? conversationHistory 
            : conversationHistory;
        messages.push(...historyToAdd);
    }
    
    // Add the new user request
    messages.push({ role: 'user', content: userRequest });

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

                // If this is a suggestion tool, extract and send the suggestion to the UI
                if (toolName === 'suggest_proof_state_edit' && onSuggestion) {
                    try {
                        // Extract suggestion details from toolArgs
                        const suggestion = {
                            hypothesisName: toolArgs.hypothesisName,
                            originalValue: toolArgs.originalValue,
                            suggestedValue: toolArgs.suggestedValue,
                            reason: toolArgs.reason
                        };
                        onSuggestion(suggestion);
                    } catch (e) {
                        console.error('Failed to process suggestion:', e);
                    }
                }

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
        // Update conversation history before finishing
        if (onHistoryUpdate) {
            onHistoryUpdate(messages);
        }
        onDone?.();
    }
}

/** Proof state change for the prover agent. Full state is used for context; validation uses specific expressions when provided. */
export type ProverProofStateChange = {
    originalValue: string;
    desiredValue: string;
    /** When set, use these for validate_proof_state_change (single Coq expressions). Otherwise use originalValue/desiredValue. */
    validationLhs?: string;
    validationRhs?: string;
};

/**
 * Runs the prover agent that edits the proof script to achieve desired proof states.
 * This agent validates proof state changes and suggests edits to the proof script.
 */
export async function runProverAgent(
    clientReady: Promise<CoqLspClient> | undefined,
    model: any,
    proofStateChange: ProverProofStateChange,
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

    // Construct the System Prompt for the prover agent
    const toolDescriptions = tools.map(t => 
        `- ${t.name}: ${t.description}. Input: JSON arguments.`
    ).join('\n');

    const systemPrompt = `You are a prover agent that edits Coq proof scripts to achieve desired proof states.

You have access to the following tools:
${toolDescriptions}

CRITICAL: How validate_proof_state_change works
1. It takes the current theorem and proof script (from the editor) and your proposedAddition (tactics to add at the user's cursor).
2. It builds: existing proof script + your proposed addition at the cursor, then runs Coq on that.
3. If it compiles and the resulting proof state matches or is close to the desired state, it applies the edit and returns success.
4. If not (compile error or state mismatch), it returns an error and the current state so you can try again with a different proposedAddition.

WORKFLOW:
1. Call get_current_proof_script to see the theorem and where the proof stands.
2. Call get_current_proof_state to see the current goals and hypotheses at the cursor.
3. Call validate_proof_state_change with args using exactly these keys (no other names):
   - originalValue: copy the EXACT full text from the "Original state" block below (do not use empty string)
   - desiredValue: copy the EXACT full text from the "Desired state" block below (do not use empty string)
   - proposedAddition: the tactics/code to INSERT AT THE CURSOR (e.g. " reflexivity." or " simpl. reflexivity.")
   If it returns an error, try again with a different proposedAddition (e.g. different tactics).
4. When validate_proof_state_change returns success, the edit has already been applied; tell the user they can undo or keep it.

Original state (full proof state before the user's edit) — use this EXACT text as originalValue:
\`\`\`
${proofStateChange.originalValue}
\`\`\`

Desired state (full proof state after the user's edit) — use this EXACT text as desiredValue:
\`\`\`
${proofStateChange.desiredValue}
\`\`\`

If you need to make a multi-step edit (e.g. replace existing text rather than only appending at cursor), use suggest_proof_script_edit with line, character, oldText, newText. That tool also verifies with Coq before applying.

To use a tool, respond with ONLY a JSON block:
\`\`\`json
{ "tool": "tool_name", "args": { ... } }
\`\`\`

When you receive a tool result, either use another tool or reply to the user.`;

    const userRequest = `The user wants to go from the current proof state (Original state in system prompt) to the desired state (Desired state in system prompt).
First call get_current_proof_script and get_current_proof_state. Then call validate_proof_state_change with args: originalValue = the exact Original state text from the system prompt, desiredValue = the exact Desired state text from the system prompt, proposedAddition = your proposed tactics (e.g. " reflexivity."). Do not pass empty strings or use parameter names "original" or "desired". If the tool returns an error, try a different proposedAddition.`;

    const messages: any[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userRequest }
    ];

    const MAX_TURNS = 10; // Allow more turns for the prover agent
    let turn = 0;

    try {
        while (turn < MAX_TURNS) {
            turn++;
            if (token?.isCancellationRequested) break;

            // Call the Model
            let fullResponseText = "";
            const responseStream = await model.sendRequest(messages, { maxTokens: 2048 }, token);
            
            for await (const chunk of responseStream.text) {
                fullResponseText += chunk;
                onUpdate(chunk);
            }

            messages.push({ role: 'assistant', content: fullResponseText });

            // Parse for Tool Calls
            const jsonMatch = fullResponseText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
            
            if (!jsonMatch) {
                // No tool call found -> The agent is done.
                break;
            }

            // Execute Tool
            try {
                const command = JSON.parse(jsonMatch[1]);
                const toolName = command.tool;
                const toolArgs = command.args;

                const targetTool = tools.find(t => t.name === toolName);
                if (!targetTool) {
                    throw new Error(`Unknown tool: ${toolName}`);
                }

                onUpdate(`\n\n_Executing tool: ${toolName}..._\n`);
                
                const result = await targetTool.execute(toolArgs);

                messages.push({ 
                    role: 'user',
                    content: `TOOL RESULT (${toolName}): ${result}` 
                });

                onUpdate(`\n_Result: ${result}_\n\n`);

            } catch (e) {
                onUpdate(`\n_Tool Execution Error: ${e}_\n`);
                messages.push({ role: 'user', content: `TOOL ERROR: ${e}` });
            }
        }
    } catch (e) {
        onUpdate(`\nProver Agent Error: ${e}`);
    } finally {
        onDone?.();
    }
}