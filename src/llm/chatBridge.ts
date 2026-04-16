import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { isCoqDocumentLanguage } from '../utils/coqUtils';

export interface AgentTool {
    name: string;
    description: string;
    // The function returns a string (success message, error, or data)
    execute: (args: any) => Promise<string>;
}

/**
 * Extracts a tool-call JSON string from model output. Accepts:
 * 1. A ```json ... ``` or ``` ... ``` code block.
 * 2. Plain text: a JSON object with "tool" and "args" (brace-balanced so nested args work).
 */
function extractToolCallJson(text: string): string | null {
    // 1. Try standard code block (optional "json" tag)
    const codeBlock = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlock) return codeBlock[1].trim();

    // 2. Fallback: find plain JSON object { "tool": "...", "args": ... } via brace matching
    const startMatch = text.match(/\{\s*"tool"\s*:/);
    if (!startMatch || startMatch.index === undefined) return null;
    const start = startMatch.index;
    let depth = 0;
    let inDouble = false;
    let inSingle = false;
    let escape = false;
    let i = start;
    while (i < text.length) {
        const c = text[i];
        if (escape) {
            escape = false;
            i++;
            continue;
        }
        if (c === '\\' && (inDouble || inSingle)) {
            escape = true;
            i++;
            continue;
        }
        if (!inDouble && !inSingle) {
            if (c === '{') depth++;
            else if (c === '}') {
                depth--;
                if (depth === 0) return text.slice(start, i + 1).trim();
            } else if (c === '"') inDouble = true;
            else if (c === "'") inSingle = true;
        } else if (c === '"' && inDouble) inDouble = false;
        else if (c === "'" && inSingle) inSingle = false;
        i++;
    }
    return null;
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
        if (!editor || !isCoqDocumentLanguage(editor.document.languageId)) {
            editor = vscode.window.visibleTextEditors.find((e) => isCoqDocumentLanguage(e.document.languageId));
        }
        if (!editor) {
            onChunk('Please open a Coq file and place your cursor inside a proof.');
            onDone?.();
            return;
        }

        const docUri = Uri.fromVscodeUri(editor.document.uri);
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
        /** 1-based index when there are multiple goals; targets which goal block to replace. */
        goalIndex?: number;
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
- Suggesting edits or transformations → you MUST call suggest_proof_state_edit after get_current_proof_state (and get_proof_context if needed). Do not only respond in text; always submit the suggestion via the tool so the user sees it in the UI. Once you have the proof state (and optionally the script), your next response must include a suggest_proof_state_edit call—do not stop after get_current_proof_script or get_proof_context without calling suggest_proof_state_edit.
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
When you receive a tool result, you MUST continue: either call another tool OR give a complete text answer. Never end your turn with nothing after a tool result. In particular:
- If the user asked to "suggest an edit" and you have already called get_current_proof_state (and optionally get_current_proof_script or get_proof_context), you MUST now call suggest_proof_state_edit with the exact originalValue from the proof state and a concrete suggestedValue. Do not stop after gathering information without making the suggestion.
- If you end your response without ever calling suggest_proof_state_edit when the user asked for a suggestion (i.e. you stop with no tool call or only other tool calls, and never call suggest_proof_state_edit), you MUST give a clear reason in that response explaining why you did not make the suggestion (e.g. "I am not suggesting an edit because there are no goals" or "I cannot suggest an edit because ..."). Do not leave the user without an explanation in that case.
- If you cannot suggest an edit (e.g. no goals), say so clearly in text and explain why.

When the user asks to "suggest an edit" or "advance the proof": after gathering proof state (and optionally context), you MUST call suggest_proof_state_edit. This creates a visible edit in the proof state panel (ProseMirror): the user sees the current state with a suggested replacement. If they accept, the prover agent will later synthesize tactics to achieve that change.
- You MUST call get_current_proof_state immediately before suggest_proof_state_edit so that originalValue exists in the current panel. The panel displays whatever goals Coq has at the cursor; if the user ran a tactic (e.g. constructor), there may now be multiple goals and the previous single goal no longer exists — so never use a stale or guessed originalValue.
- originalValue: for REPLACE, use the EXACT text of one goal type or one hypothesis from get_current_proof_state. For ADD NEW HYPOTHESIS (when the proof needs an extra hypothesis that is not in the state yet, e.g. from destruct (k >? k0) eqn:Heq), use originalValue: "" and suggestedValue: the full new hypothesis line, e.g. "Heq : (k >? k0) = true". Use reason to explain (e.g. "Add eqn:Heq to the destruct tactic so this hypothesis is available."). You can and should suggest adding hypotheses when that is the right fix—do not only give plain-text advice.
- When there are multiple goals (Number of goals: 2 or more), suggest one goal at a time. Use goalIndex (1-based) to indicate which goal (e.g. goalIndex: 1 for the first goal).
- suggestedValue: the DESIRED proof state text only (goal/hypothesis type or new hypothesis line). No tactics or prose. Use reason to explain the strategy.
- hypothesisName: "Goal" when editing the goal type; otherwise the hypothesis name (existing or new, e.g. "Heq").
This way the panel shows a replace or add suggestion, and "Implement changes" can call the prover to achieve it. If you end your turn without calling suggest_proof_state_edit when the user asked for a suggestion, you must state a reason.

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
    let nudgeSent = false; // Only nudge once when agent gathers proof state but doesn't call suggest_proof_state_edit
    let suggestionMade = false; // True if suggest_proof_state_edit was called this run

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
            const toolCallJson = extractToolCallJson(fullResponseText);
            const anyToolExecuted = messages.some((m: any) => m.role === 'user' && typeof m.content === 'string' && m.content.startsWith('TOOL RESULT ('));

            if (!toolCallJson) {
                // Empty or near-empty response: model may have failed or hit a limit. Nudge once to retry with a tool call.
                const emptyOrNoResponse = fullResponseText.trim().length < 20;
                if (emptyOrNoResponse && !nudgeSent) {
                    nudgeSent = true;
                    messages.push({
                        role: 'user',
                        content: 'You did not respond with a tool call or sufficient text. You must call at least one tool. If edit history exists, call get_edit_history first; otherwise call get_current_proof_state to see the proof state. Reply with ONLY a JSON block, e.g. {"tool": "get_edit_history", "args": {}} or {"tool": "get_current_proof_state", "args": {}}.',
                    });
                    onUpdate('\n\n_The model returned no (or almost no) response. Asking it to call a tool and try again._\n\n');
                    continue;
                }

                // First turn but no tool called and no empty-response nudge used: nudge once to use a tool.
                if (turn === 1 && !anyToolExecuted && !nudgeSent) {
                    nudgeSent = true;
                    messages.push({
                        role: 'user',
                        content: 'You must call at least one tool. If edit history exists, call get_edit_history first; otherwise call get_current_proof_state to see the proof state. Reply with ONLY a JSON block (e.g. {"tool": "get_edit_history", "args": {}} or {"tool": "get_current_proof_state", "args": {}}).',
                    });
                    onUpdate('\n\n_No tool was called. Asking the agent to call get_edit_history or get_current_proof_state first._\n\n');
                    continue;
                }

                // No tool call found. If user asked for a suggestion and we have proof state but no suggest_proof_state_edit, nudge once and retry.
                const userAskedForSuggestion = /\bsuggest\b.*\bedit\b|\bedit\b.*\bsuggest\b|suggest\s+an?\s+edit/i.test(userRequest.trim());
                const hadProofState = messages.some((m: any) => m.role === 'user' && typeof m.content === 'string' && m.content.startsWith('TOOL RESULT (get_current_proof_state):'));
                const didNotCallSuggest = !fullResponseText.includes('suggest_proof_state_edit');

                if (!nudgeSent && onSuggestion && userAskedForSuggestion && hadProofState && didNotCallSuggest) {
                    nudgeSent = true;
                    messages.push({
                        role: 'user',
                        content: 'You must call suggest_proof_state_edit now. Do NOT call get_edit_history, get_proof_context, or get_current_proof_script again. Use originalValue = the exact Goal Type for one goal from the get_current_proof_state output above (e.g. "k >= k0" or "pow2heap\' n k0 u1 /\\ pow2heap\' n k t1"), suggestedValue = the desired goal type, hypothesisName = "Goal", and goalIndex = 1 or 2 if there are 2 goals. Reply with ONLY a JSON block for suggest_proof_state_edit.',
                    });
                    onUpdate('\n\n**Why no edit was suggested:** The agent returned a response without calling suggest_proof_state_edit (it may have only called get_current_proof_state / get_proof_context and then stopped with no tool call, or returned plain text). Asking it to call suggest_proof_state_edit now.\n\n');
                    continue; // One more turn
                }

                // Agent is done (text-only response or gave up).
                console.log("Agent finished without tool call - responding with text only");
                if (fullResponseText.trim().length < 20) {
                    onUpdate('\n\nThe agent returned no (or almost no) response. This can happen if the model hit a token limit, the connection failed, or the model produced no output. Try again or rephrase your question.\n\n');
                } else if (onSuggestion && userAskedForSuggestion && !suggestionMade) {
                    onUpdate('\n\n_No suggestion was made—the agent did not call suggest_proof_state_edit. Try again or say e.g. "suggest an edit for Goal 1"._\n\n');
                } else {
                    onUpdate('\n\n_Agent finished._\n\n');
                }
                break;
            }

            // --- C. Execute Tool ---
            try {
                const command = JSON.parse(toolCallJson);
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
                    suggestionMade = true;
                    try {
                        // Extract suggestion details from toolArgs (goalIndex optional, for multi-goal targeting)
                        const suggestion = {
                            hypothesisName: toolArgs.hypothesisName,
                            originalValue: toolArgs.originalValue,
                            suggestedValue: toolArgs.suggestedValue,
                            reason: toolArgs.reason,
                            ...(toolArgs.goalIndex !== undefined && toolArgs.goalIndex !== null && { goalIndex: toolArgs.goalIndex }),
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
2. Call get_current_proof_state to see the current goals and hypotheses at the cursor. Check "Number of goals: N" at the top.
3. If the current proof state has a different number of goals or different goal types than the "Original state" block below, the proof state at the cursor has already changed (e.g. the user applied a tactic). In that case, do NOT assume the Original/Desired state from the panel still apply. Tell the user: "The proof state at the cursor has changed. Currently there are N goals: [briefly list]. The Original/Desired state from the panel may be stale. Refresh the proof state panel or move the cursor and try again, or describe which goal you want to work on."
4. If the current state matches the Original state (same number of goals and same goal types), call validate_proof_state_change with args: originalValue = EXACT full text from "Original state" below, desiredValue = EXACT full text from "Desired state" below, proposedAddition = tactics to INSERT AT THE CURSOR. If it returns an error, try again with a different proposedAddition.
5. When validate_proof_state_change returns success, the edit has already been applied; tell the user they can undo or keep it.

Original state (full proof state before the user's edit) — use this EXACT text as originalValue:
\`\`\`
${proofStateChange.originalValue}
\`\`\`

Desired state (full proof state after the user's edit) — use this EXACT text as desiredValue:
\`\`\`
${proofStateChange.desiredValue}
\`\`\`

If you need to make a multi-step edit (e.g. replace existing text rather than only appending at cursor), use suggest_proof_script_edit with line, character, oldText, newText. That tool also verifies with Coq before applying.

When validate_proof_state_change fails with "state does not match", the tactic may still be correct (e.g. destruct produces multiple subgoals and the desired goal is one of them). Try suggest_proof_script_edit to insert the same tactic at the correct line/character, or try a different proposedAddition. Do not stop after one failure—retry with different tactics or positions (cursor may be in a bullet branch; get_current_proof_script shows the exact script and line numbers).

To use a tool, respond with ONLY a JSON block:
\`\`\`json
{ "tool": "tool_name", "args": { ... } }
\`\`\`

When you receive a tool result, either use another tool or reply to the user.

When you STOP without calling a tool (e.g. because the current state does not match the Original state, or the desired state cannot be achieved by inserting tactics at the cursor), you MUST give a clear reason in your response in plain text. Do not reply with only a JSON tool call and then stop. For example write: "The proof state at the cursor has changed and no longer matches the Original state (e.g. there are now 2 goals), so I cannot use validate_proof_state_change." or "The desired state (replacing a goal with True) cannot be reached by only inserting tactics at the cursor." Always explain why you are not proposing a tactic so the user sees a reason.`;

    const userRequest = `The user wants to go from the current proof state (Original state in system prompt) to the desired state (Desired state in system prompt).
Your first response MUST be a tool call—reply with ONLY a JSON block calling get_current_proof_script or get_current_proof_state (e.g. {"tool": "get_current_proof_script", "args": {}}). Do not respond with only prose; you must call at least one tool.
Then: if the current state matches the Original state, call validate_proof_state_change with originalValue, desiredValue, and proposedAddition. If the current state does NOT match (e.g. different number of goals), or you cannot achieve the desired state by inserting tactics, reply in text and clearly explain why (e.g. "The cursor has 2 goals but the Original state had 1 goal").`;

    const messages: any[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userRequest }
    ];

    const MAX_TURNS = 10; // Allow more turns for the prover agent
    let turn = 0;
    let anyToolExecuted = false;
    let nudgeSent = false;

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
            const toolCallJson = extractToolCallJson(fullResponseText);

            if (!toolCallJson) {
                // No tool call found. If we've never run a tool, nudge once so the agent at least calls get_current_proof_script / get_current_proof_state.
                if (!anyToolExecuted && !nudgeSent) {
                    nudgeSent = true;
                    messages.push({
                        role: 'user',
                        content: 'You must call at least one tool. Start with get_current_proof_script and get_current_proof_state to see the current state, then call validate_proof_state_change with originalValue and desiredValue from the system prompt. Reply with ONLY a JSON block (e.g. {"tool": "get_current_proof_script", "args": {}}).',
                    });
                    onUpdate('\n\n_No tool was called. Asking the prover to call get_current_proof_script and get_current_proof_state first._\n\n');
                    continue;
                }

                // Agent is done. If it didn't give a reason, show a concrete one.
                const hasExplanation = fullResponseText.trim().length >= 80 &&
                    /\b(state|goal|match|cannot|because|original|desired|mismatch|tactic|insert|cursor)\b/i.test(fullResponseText);
                if (!hasExplanation) {
                    onUpdate('\n\n**Why no tactic was proposed:** The desired state from the panel (e.g. replacing a goal with `True`) usually cannot be reached by only *inserting* tactics at the cursor. The prover tries to add tactics at the current position; if the panel’s “Original” state had one goal and the cursor now has two (e.g. after `constructor`), the states don’t match and the tool won’t apply. To proceed, either refresh the panel so Original/Desired match the current state, or use a different approach (e.g. edit the script manually with `destruct (k >? k0) eqn:H` then prove the subgoals).\n\n');
                }
                onUpdate('\n_Stopping._ ');
                break;
            }

            // Execute Tool
            try {
                const command = JSON.parse(toolCallJson);
                const toolName = command.tool;
                const toolArgs = command.args;

                const targetTool = tools.find(t => t.name === toolName);
                if (!targetTool) {
                    throw new Error(`Unknown tool: ${toolName}`);
                }

                onUpdate(`\n\n_Executing tool: ${toolName}..._\n`);
                
                const result = await targetTool.execute(toolArgs);
                anyToolExecuted = true;

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
        onUpdate('\n\n_Prover agent finished._');
        onDone?.();
    }
}