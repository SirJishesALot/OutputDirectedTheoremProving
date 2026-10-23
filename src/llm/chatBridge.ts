import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { isCoqDocumentLanguage } from '../utils/coqUtils';
import { OutputLogger } from '../logging/logger';
import { extractAllToolCalls, validateToolArgs, isReadOnlyTool, ExtractedToolCall } from './toolCallParser';
import { normalizeMessagesAlternating } from './messageNormalizer';

export interface AgentTool {
    name: string;
    description: string;
    // The function returns a string (success message, error, or data)
    execute: (args: any) => Promise<string>;
}

export type AgentToolActivityKind = 'call' | 'executing' | 'result' | 'error' | 'status';

export interface AgentToolActivity {
    kind: AgentToolActivityKind;
    toolName?: string;
    detail: string;
    toolArgs?: any;
}

function truncateToolDetail(detail: string, maxLen = 4000): string {
    if (detail.length <= maxLen) {
        return detail;
    }
    return detail.slice(0, maxLen) + '\n… (truncated)';
}

function formatToolCallDetail(toolName: string, args: unknown): string {
    try {
        return `${toolName}(${JSON.stringify(args, null, 2)})`;
    } catch {
        return `${toolName}(…)`;
    }
}

/** Max failed validate_proof_state_change calls before the agent must stop retrying and explain. */
const MAX_VALIDATE_ATTEMPTS = 4;

/** Autoformaliser chat: cap tool rounds, reserve turns for a text answer + optional finalize. */
const MAX_TOOL_TURNS = 4;
const MAX_AGENT_TURNS = 8;
const MIN_SUBSTANTIAL_RESPONSE_LEN = 60;

const ANSWER_ONLY_AFTER_TOOLS_NUDGE =
    'You have enough information from the tool results above. Give a complete text answer to the user\'s question. Do NOT call any tools — respond with prose only. Explain the current proof situation, why they may be stuck, and concrete next steps (lemmas, tactics, or strategy).';

const FINALIZE_ANSWER_NUDGE =
    'Based on all tool results and the user\'s question above, write a complete text answer now. Do NOT call any tools or use JSON. Respond with clear prose only.';

function userAskedForSuggestionEdit(userRequest: string): boolean {
    return /\bsuggest\b.*\bedit\b|\bedit\b.*\bsuggest\b|suggest\s+an?\s+edit/i.test(userRequest.trim());
}

function anyToolExecutedInMessages(messages: Array<{ role: string; content: string }>): boolean {
    return messages.some(
        (m) =>
            m.role === 'user' &&
            typeof m.content === 'string' &&
            m.content.startsWith('TOOL RESULT (')
    );
}

function isSubstantialUserFacingText(text: string): boolean {
    return text.trim().length >= MIN_SUBSTANTIAL_RESPONSE_LEN;
}

/** Prose remaining after stripping a tool-call JSON block (for mixed model replies). */
function proseWithoutToolCall(text: string): string {
    return extractAllToolCalls(text).prose;
}

function extractToolCallJson(text: string): string | null {
    const res = extractAllToolCalls(text);
    return res.toolCalls[0]?.raw ?? null;
}

async function invokeModel(
    messages: Array<{ role: string; content: string }>,
    model: any,
    token?: vscode.CancellationToken,
    opts?: {
        conversationId?: string;
        onConversationId?: (id: string) => void;
    }
): Promise<string> {
    const normalized = normalizeMessagesAlternating(messages);
    let fullResponseText = '';
    const responseStream = await model.sendRequest(
        normalized,
        { maxTokens: 2048, ...opts },
        token
    );
    for await (const chunk of responseStream.text) {
        fullResponseText += chunk;
    }
    return fullResponseText;
}

async function finalizeAgentAnswerIfNeeded(
    messages: Array<{ role: string; content: string }>,
    model: any,
    token: vscode.CancellationToken | undefined,
    onUpdate: (text: string) => void,
    emitTool: (activity: AgentToolActivity) => void,
    userGotSubstantialPostToolText: boolean,
    conversationId?: string
): Promise<void> {
    if (userGotSubstantialPostToolText || !anyToolExecutedInMessages(messages) || token?.isCancellationRequested) {
        return;
    }

    emitTool({
        kind: 'status',
        detail: 'Summarizing next steps from tool results…',
    });
    messages.push({ role: 'user', content: FINALIZE_ANSWER_NUDGE });
    const fullResponseText = await invokeModel(messages, model, token, conversationId ? { conversationId } : undefined);
    messages.push({ role: 'assistant', content: fullResponseText });

    const parseResult = extractAllToolCalls(fullResponseText);
    const prose = parseResult.prose;
    if (prose && isSubstantialUserFacingText(prose)) {
        onUpdate(prose);
        return;
    }
    if (parseResult.toolCalls.length === 0 && fullResponseText.trim()) {
        onUpdate(fullResponseText.trim());
        return;
    }
    if (prose) {
        onUpdate(prose);
        return;
    }
    onUpdate(
        'The agent gathered proof context but could not produce a summary. Try asking again or rephrase your question.'
    );
}

function isValidateProofStateFailure(result: string): boolean {
    return /^\s*error:/i.test(result.trim());
}

function normalizeProposedAddition(addition: string): string {
    return addition.trim().replace(/\s+/g, ' ');
}

/** Hypothesis names from panel-format proof state text (lines like `H : ty`). */
function hypothesisNamesInProofStateText(text: string): string[] {
    const names: string[] = [];
    for (const line of text.split('\n')) {
        const m = line.trim().match(/^([A-Za-z_][\w']*)\s*:/);
        if (m) {
            names.push(m[1]);
        }
    }
    return names;
}

function desiredStateAddsHypothesis(original: string, desired: string): boolean {
    const orig = new Set(hypothesisNamesInProofStateText(original));
    return hypothesisNamesInProofStateText(desired).some((name) => !orig.has(name));
}

function lastToolResultFromMessages(
    messages: Array<{ role: string; content: string }>
): string | undefined {
    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        if (
            m.role === 'user' &&
            typeof m.content === 'string' &&
            m.content.startsWith('TOOL RESULT (')
        ) {
            return m.content;
        }
    }
    return undefined;
}

const PROVER_FINALIZE_NUDGE =
    'Summarize for the user what happened during this Implement Changes run. Use the tool results in the conversation: current proof script, current goals/hypotheses, and any validation errors. Say clearly whether the panel desired state is achievable with tactics at the cursor, or what script edits (e.g. generalize, assert, pose proof, change the lemma) are needed. Reply in plain text only — no tool JSON.';

async function finalizeProverAgentAnswerIfNeeded(
    messages: Array<{ role: string; content: string }>,
    model: any,
    token: vscode.CancellationToken | undefined,
    emitProverAgentText: (text: string) => void,
    emitTool: (activity: AgentToolActivity) => void,
    showedUserFacingText: boolean,
    conversationId?: string
): Promise<void> {
    if (showedUserFacingText || token?.isCancellationRequested) {
        return;
    }
    if (!anyToolExecutedInMessages(messages)) {
        return;
    }

    emitTool({
        kind: 'status',
        detail: 'No user-facing summary yet — asking the model to summarize tool results…',
    });
    messages.push({ role: 'user', content: PROVER_FINALIZE_NUDGE });
    const fullResponseText = await invokeModel(messages, model, token, conversationId ? { conversationId } : undefined);
    messages.push({ role: 'assistant', content: fullResponseText });

    const parseResult = extractAllToolCalls(fullResponseText);
    const prose = parseResult.prose;
    if (prose) {
        emitProverAgentText(prose);
        return;
    }

    const lastTool = lastToolResultFromMessages(messages);
    if (lastTool) {
        emitProverAgentText(
            `The prover agent did not produce a summary. Latest tool output:\n\n${truncateToolDetail(lastTool, 3000)}`
        );
    }
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
            const chatResponse = await model.sendRequest(messages, { maxTokens: 2048 }, token);
            for await (const chunk of chatResponse.text) {
                try { onChunk(chunk); } catch (e) { OutputLogger.error('Agent:Chat', 'onChunk failed', e); }
            }
        } catch (err) {
            OutputLogger.error('Agent:Chat', 'Error communicating with LLM in streamCoqChat:', err);
            const msg = `An error occurred while communicating with the LLM: ${err}`;
            onChunk(msg);
        }

    } catch (e) {
        OutputLogger.error('Agent:Chat', 'Unexpected error in chat bridge:', e);
        onChunk(`Unexpected error in chat bridge: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
        onDone?.();
    }
}

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
    onToolActivity?: (activity: AgentToolActivity) => void,
    onDone?: () => void,
    token?: vscode.CancellationToken,
    onSuggestion?: SuggestionCallback,
    conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    onHistoryUpdate?: ConversationHistoryCallback,
    editHistory?: { edits: Array<{ lhs: string; rhs: string; timestamp?: number }> },
    proverKind: 'Coq' | 'Lean' = 'Coq',
    conversationId?: string,
    onConversationId?: (id: string) => void
) {
    let currentConversationId = conversationId;
    const emitTool = (activity: AgentToolActivity) => {
        onToolActivity?.({
            ...activity,
            detail: truncateToolDetail(activity.detail),
        });
    };
    if ((proverKind === 'Coq' && !clientReady) || !model) {
        onUpdate("Error: Client or Model not ready.");
        onDone?.();
        return;
    }

    const proverName = proverKind === 'Lean' ? 'Lean 4' : 'Coq';

    // 1. Construct the System Prompt describing the tools
    const toolDescriptions = tools.map(t => 
        `- ${t.name}: ${t.description}. Input: JSON arguments.`
    ).join('\n');

    let editHistoryContext = '';
    if (editHistory && editHistory.edits && editHistory.edits.length > 0) {
        editHistoryContext = `\n\n--- RECENT PROOF STATE EDITS IN THIS SESSION ---\n` +
            `The user has made or attempted the following proof state edits:\n` +
            editHistory.edits.map((e, idx) => `Edit ${idx + 1}: Changed "${e.lhs}" to "${e.rhs}"`).join('\n') +
            `\nUse this history to avoid repeating failed directions and to understand the user's intent.\n-------------------------------------------------\n`;
    }

    const systemPrompt = `You are an automated ${proverName} assistant with access to tools that can inspect the proof state and suggest edits.

RESTRICTED ENVIRONMENT CONSTRAINTS:
- You are operating inside a restricted theorem proving extension bridge.
- You do NOT have access to any host tools, bash/terminal commands, filesystem access, web browsing, or workspace tools (such as run_command, read_file, edit_file, or search_web).
- You MUST NOT attempt to use any tools other than the virtual tools explicitly listed below.
- All tool calls MUST strictly be formatted as JSON blocks matching the specification below.

You have access to the following tools:
${toolDescriptions}
${editHistoryContext}

IMPORTANT: When the user asks questions about:
- The current proof state, goals, or hypotheses → use get_current_proof_state
- What tactic to use or next steps → use get_current_proof_state to see what needs to be proved
- Testing a tactic in a shadow buffer without altering the editor → use try_tactic
- Searching library lemmas/theorems by name or pattern → use search_theorems
- The proof script, what tactics have been used, or the theorem name → use get_current_proof_script
- Questions like "what theorem am I working on?" or "what's the name of the theorem?" → use get_current_proof_script
- Suggesting edits or transformations → you MUST call suggest_proof_state_edit after get_current_proof_state (and get_proof_context if needed). Do not only respond in text; always submit the suggestion via the tool so the user sees it in the UI.
- Available theorems or context → use get_proof_context
- Validating terms → use check_term_validity

MULTIPLE TOOL CALLS: You may output multiple tool calls in a single turn if you need several pieces of information (e.g. get_current_proof_state and get_current_proof_script). They will all be executed and returned to you.
When you have gathered enough information, respond with prose only (no JSON).

To use a tool, respond with a JSON block:
\`\`\`json
{ "tool": "tool_name", "args": { ... } }
\`\`\`

If you do not need to use a tool, just respond with text.
TOOL CALL RULES:
- If you need to use tools (such as get_current_proof_state or try_tactic), invoke your tool call(s) FIRST.
- Do NOT begin explaining or start a sentence that is left incomplete before calling a tool.
- Never output an incomplete thought before a tool JSON block.
- Once you receive the tool results, then provide your complete, detailed explanation and next steps in prose. Never end your turn silently.`;

    let messages: any[] = [];
    if (!conversationHistory || conversationHistory.length === 0 || conversationHistory[0].role !== 'system') {
        messages.push({ role: 'system', content: systemPrompt });
    }
    
    if (conversationHistory && conversationHistory.length > 0) {
        messages.push(...conversationHistory);
    }
    messages.push({ role: 'user', content: userRequest });

    let turn = 0;
    let nudgeSent = false;
    let suggestionMade = false;
    let toolExecutionCount = 0;
    let userGotSubstantialPostToolText = false;
    let anyToolExecutedSoFar = false;
    let forceAnswerOnly = false;
    let answerOnlyNudgeInjected = false;
    const userAskedForSuggestion = userAskedForSuggestionEdit(userRequest);
    const executedToolSignatures: string[] = [];

    const markSubstantialText = (text: string) => {
        if (anyToolExecutedSoFar && isSubstantialUserFacingText(text)) {
            userGotSubstantialPostToolText = true;
        }
    };

    const injectAnswerOnlyNudge = () => {
        if (answerOnlyNudgeInjected) return;
        answerOnlyNudgeInjected = true;
        forceAnswerOnly = true;
        messages.push({ role: 'user', content: ANSWER_ONLY_AFTER_TOOLS_NUDGE });
    };

    try {
        while (turn < MAX_AGENT_TURNS) {
            turn++;
            if (token?.isCancellationRequested) {
                OutputLogger.info('Agent:Chat', `Turn ${turn}: cancellation requested.`);
                break;
            }
            OutputLogger.debug('Agent:Chat', `Turn ${turn}/${MAX_AGENT_TURNS}: invoking model...`);

            const anyToolExecuted = anyToolExecutedInMessages(messages);
            if (
                turn >= MAX_AGENT_TURNS - 1 &&
                anyToolExecuted &&
                !userGotSubstantialPostToolText &&
                !userAskedForSuggestion
            ) {
                OutputLogger.warn('Agent:Chat', 'Nudge: injecting answer-only instruction before turn limit.');
                injectAnswerOnlyNudge();
            }

            const modelOpts = currentConversationId
                ? { conversationId: currentConversationId }
                : {
                      onConversationId: (id: string) => {
                          currentConversationId = id;
                          onConversationId?.(id);
                      },
                  };
            const fullResponseText = await invokeModel(messages, model, token, modelOpts);
            messages.push({ role: 'assistant', content: fullResponseText });
            OutputLogger.trace('Agent:Chat', `Model response (turn ${turn}):\n${fullResponseText}`);

            const parseResult = extractAllToolCalls(fullResponseText);
            const toolCalls = parseResult.toolCalls;

            if (parseResult.prose) {
                onUpdate(parseResult.prose);
                markSubstantialText(parseResult.prose);
            }

            if (toolCalls.length === 0) {
                if (parseResult.hasMalformedJson) {
                    OutputLogger.warn('Agent:Chat', 'Malformed tool call JSON syntax detected in model output.');
                    messages.push({
                        role: 'user',
                        content: 'Your tool call JSON was malformed. Please respond with a valid JSON block like {"tool": "...", "args": { ... }} or reply with prose.',
                    });
                    emitTool({
                        kind: 'status',
                        detail: 'Invalid tool call JSON syntax detected. Asking model to retry with valid JSON.',
                    });
                    continue;
                }

                const emptyOrNoResponse = fullResponseText.trim().length < 20;
                if (emptyOrNoResponse && !nudgeSent) {
                    nudgeSent = true;
                    const content = anyToolExecuted
                        ? 'You did not give a sufficient text answer. Use the tool results already in the conversation. Respond with a complete text explanation for the user. Do NOT call any tools.'
                        : 'You did not respond with a tool call or sufficient text. Please provide a clear text response, or call get_current_proof_state if you need to inspect the proof state.';
                    OutputLogger.warn('Agent:Chat', `Empty/short response nudge sent (turn ${turn}): ${content}`);
                    messages.push({ role: 'user', content });
                    emitTool({
                        kind: 'status',
                        detail: anyToolExecuted
                            ? 'The model returned almost no response. Asking for a text answer using tool results.'
                            : 'The model returned almost no response. Asking it to respond.',
                    });
                    if (anyToolExecuted) injectAnswerOnlyNudge();
                    continue;
                }

                if (turn === 1 && !anyToolExecuted && !nudgeSent && userAskedForSuggestion) {
                    nudgeSent = true;
                    OutputLogger.warn('Agent:Chat', 'Turn 1 nudge: suggestion requested, asking for proof state inspection.');
                    messages.push({
                        role: 'user',
                        content: 'To suggest an edit, please inspect the current proof state first using get_current_proof_state. Reply with ONLY a JSON block: {"tool": "get_current_proof_state", "args": {}}.',
                    });
                    emitTool({
                        kind: 'status',
                        detail: 'Asking the agent to inspect the proof state first before suggesting an edit.',
                    });
                    continue;
                }

                const hadProofState = messages.some(
                    (m: { role: string; content: string }) =>
                        m.role === 'user' &&
                        typeof m.content === 'string' &&
                        m.content.startsWith('TOOL RESULT (get_current_proof_state):')
                );
                const didNotCallSuggest = !fullResponseText.includes('suggest_proof_state_edit');

                if (!nudgeSent && onSuggestion && userAskedForSuggestion && hadProofState && didNotCallSuggest) {
                    nudgeSent = true;
                    OutputLogger.warn('Agent:Chat', 'Nudge: asking agent to call suggest_proof_state_edit.');
                    messages.push({
                        role: 'user',
                        content: 'You must call suggest_proof_state_edit now. Do NOT call inspection tools again. Reply with ONLY a JSON block for suggest_proof_state_edit.',
                    });
                    emitTool({
                        kind: 'status',
                        detail: 'Asking the agent to call suggest_proof_state_edit now.',
                    });
                    continue;
                }

                OutputLogger.info('Agent:Chat', 'Agent finished without tool call — responding with text only.');
                if (fullResponseText.trim().length < 20) {
                    onUpdate('The agent returned no response. Try again or rephrase your question.');
                } else if (onSuggestion && userAskedForSuggestion && !suggestionMade) {
                    onUpdate('No suggestion was made—the agent did not call suggest_proof_state_edit.');
                }
                break;
            }

            // Decide which tool calls to execute: batch read-only inspection tools
            const allReadOnly = toolCalls.every((tc) => isReadOnlyTool(tc.tool));
            const callsToExecute = allReadOnly ? toolCalls : [toolCalls[0]];
            const compositeResults: string[] = [];

            for (const command of callsToExecute) {
                const toolName = command.tool;
                const toolArgs = command.args;
                const isSuggestTool = toolName === 'suggest_proof_state_edit';
                const allowToolDespiteAnswerOnly = userAskedForSuggestion && isSuggestTool;
                const atToolLimit = toolExecutionCount >= MAX_TOOL_TURNS && !allowToolDespiteAnswerOnly;

                if ((forceAnswerOnly || atToolLimit) && !allowToolDespiteAnswerOnly) {
                    injectAnswerOnlyNudge();
                    emitTool({
                        kind: 'status',
                        detail: 'Tool limit reached — asking for a text-only response.',
                    });
                    break;
                }

                // Cycle detection
                const sig = `${toolName}:${JSON.stringify(toolArgs)}`;
                if (executedToolSignatures.length > 0 && executedToolSignatures[executedToolSignatures.length - 1] === sig) {
                    OutputLogger.warn('Agent:Chat', `Cycle detected for ${toolName}`);
                    messages.push({
                        role: 'user',
                        content: `You already executed ${toolName} with these exact arguments in the previous turn. Do not repeat identical tool calls. Use the output already provided above or proceed to your final response.`,
                    });
                    emitTool({ kind: 'status', detail: `Repeated tool call prevented for ${toolName}.` });
                    break;
                }
                executedToolSignatures.push(sig);

                // Ajv Schema validation
                const valResult = validateToolArgs(toolName, toolArgs);
                if (!valResult.valid) {
                    const errSummary = (valResult.errors || []).join('; ');
                    OutputLogger.warn('Agent:Chat', `Schema validation error for ${toolName}: ${errSummary}`);
                    messages.push({
                        role: 'user',
                        content: `TOOL ERROR (${toolName}): Invalid arguments - ${errSummary}. Please correct your arguments and retry.`,
                    });
                    emitTool({ kind: 'error', toolName, detail: `Schema error: ${errSummary}` });
                    break;
                }

                try {
                    const targetTool = tools.find((t) => t.name === toolName);
                    if (!targetTool) {
                        throw new Error(`Unknown tool: ${toolName}`);
                    }

                    const tacticLabel =
                        toolName === 'try_tactic' && toolArgs?.tactic ? ` ("${toolArgs.tactic}")` : '';
                    emitTool({
                        kind: 'executing',
                        toolName,
                        detail: `Executing ${toolName}${tacticLabel}…`,
                        toolArgs,
                    });

                    OutputLogger.info('Agent:Chat', `Executing tool "${toolName}"...`, toolArgs);
                    const toolStartTime = Date.now();
                    const result = await targetTool.execute(toolArgs);
                    const toolDuration = Date.now() - toolStartTime;
                    toolExecutionCount++;
                    anyToolExecutedSoFar = true;
                    OutputLogger.info('Agent:Chat', `Tool "${toolName}" executed in ${toolDuration}ms`);
                    OutputLogger.trace('Agent:Chat', `Tool "${toolName}" result:\n${result}`);

                    if (toolName === 'suggest_proof_state_edit' && onSuggestion) {
                        suggestionMade = true;
                        try {
                            const rawOrig = toolArgs?.originalValue;
                            const origVal =
                                rawOrig != null &&
                                String(rawOrig).trim() !== '' &&
                                String(rawOrig).trim() !== 'undefined'
                                    ? String(rawOrig)
                                    : '';
                            onSuggestion({
                                hypothesisName: String(toolArgs?.hypothesisName ?? ''),
                                originalValue: origVal,
                                suggestedValue: String(toolArgs?.suggestedValue ?? ''),
                                reason: toolArgs.reason != null ? String(toolArgs.reason) : undefined,
                                ...(toolArgs.goalIndex !== undefined &&
                                    toolArgs.goalIndex !== null && {
                                        goalIndex: Number(toolArgs.goalIndex),
                                    }),
                            });
                        } catch (e) {
                            OutputLogger.error('Agent:Chat', 'Failed to process suggestion:', e);
                        }
                    }

                    compositeResults.push(`TOOL RESULT (${toolName}): ${result}`);
                    const tacticPrefix =
                        toolName === 'try_tactic' && toolArgs?.tactic && !result.includes(`"${toolArgs.tactic}"`)
                            ? `Tactic attempted: ${toolArgs.tactic}\n\n`
                            : '';
                    emitTool({
                        kind: 'result',
                        toolName,
                        detail: tacticPrefix + result,
                        toolArgs,
                    });
                } catch (e) {
                    OutputLogger.error('Agent:Chat', `Tool "${toolName}" execution error: ${e}`);
                    emitTool({
                        kind: 'error',
                        detail: `Tool execution error: ${e}`,
                        toolArgs,
                    });
                    compositeResults.push(`TOOL ERROR (${toolName}): ${e}`);
                    break;
                }
            }

            if (compositeResults.length > 0) {
                messages.push({
                    role: 'user',
                    content: compositeResults.join('\n\n'),
                });
            }

            if (toolExecutionCount >= MAX_TOOL_TURNS && !userAskedForSuggestion) {
                OutputLogger.warn('Agent:Chat', 'Nudge: tool limit reached, requiring text answer next.');
                injectAnswerOnlyNudge();
                emitTool({
                    kind: 'status',
                    detail: 'Inspection tools finished — next response should be a text answer for the user.',
                });
            }
        }

        await finalizeAgentAnswerIfNeeded(
            messages,
            model,
            token,
            onUpdate,
            emitTool,
            userGotSubstantialPostToolText,
            currentConversationId
        );
    } catch (e) {
        OutputLogger.error('Agent:Chat', 'runCoqAgent top-level error:', e);
        onUpdate(`Agent error: ${e}`);
    } finally {
        if (onHistoryUpdate) {
            onHistoryUpdate(condenseHistoryForNextTurn(messages));
        }
        onDone?.();
    }
}

function condenseHistoryForNextTurn(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    const condensed: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
    for (const msg of messages) {
        if (!msg || !msg.content) continue;
        if (msg.role === 'system') continue;
        if (msg.role === 'user') {
            if (msg.content.startsWith('TOOL RESULT (')) continue;
            if (msg.content === ANSWER_ONLY_AFTER_TOOLS_NUDGE) continue;
            if (msg.content.includes('To suggest an edit, please inspect')) continue;
            if (msg.content.includes('You must call suggest_proof_state_edit now')) continue;
            if (msg.content.includes('Your tool call JSON was malformed')) continue;
            if (msg.content.includes('You did not give a sufficient text answer')) continue;
            condensed.push(msg);
            continue;
        }
        if (msg.role === 'assistant') {
            const parsed = extractAllToolCalls(msg.content);
            if (parsed.prose && isSubstantialUserFacingText(parsed.prose)) {
                condensed.push({ role: 'assistant', content: parsed.prose });
            }
            continue;
        }
        condensed.push(msg);
    }
    return condensed;
}

export type ProverProofStateChange = {
    originalValue: string;
    desiredValue: string;
    validationLhs?: string;
    validationRhs?: string;
    proofScript?: string;
};

export async function runProverAgent(
    clientReady: Promise<CoqLspClient> | undefined,
    model: any,
    proofStateChange: ProverProofStateChange,
    tools: AgentTool[],
    onUpdate: (text: string) => void,
    onToolActivity?: (activity: AgentToolActivity) => void,
    onDone?: () => void,
    token?: vscode.CancellationToken,
    proverKind: 'Coq' | 'Lean' = 'Coq'
) {
    const emitTool = (activity: AgentToolActivity) => {
        onToolActivity?.({
            ...activity,
            detail: truncateToolDetail(activity.detail),
        });
    };

    if ((proverKind === 'Coq' && !clientReady) || !model) {
        onUpdate("Error: Client or Model not ready.");
        onDone?.();
        return;
    }

    const proverName = proverKind === 'Lean' ? 'Lean 4' : 'Coq';
    const tacticGuidance = proverKind === 'Lean'
        ? 'For Lean 4: write Lean tactics like simp, rfl, intro, exact, apply, cases, induction. Do NOT append trailing periods to Lean tactics. Lean 4 uses indentation-based syntax: match the indentation level of the current proof block.'
        : 'For Coq: write Coq tactics ending with a period (e.g. reflexivity., simpl., intros., apply <lemma>.).';

    const toolDescriptions = tools.map(t => 
        `- ${t.name}: ${t.description}. Input: JSON arguments.`
    ).join('\n');

    const proofScriptSection = proofStateChange.proofScript
        ? `\nCurrent Proof Script (up to cursor):\n\`\`\`${proverKind === 'Lean' ? 'lean' : 'coq'}\n${proofStateChange.proofScript}\n\`\`\`\n`
        : '';

    const systemPrompt = `You are a prover agent that synthesizes tactics to achieve desired proof states in ${proverName}.

RESTRICTED ENVIRONMENT CONSTRAINTS:
- You are operating inside a restricted theorem proving extension bridge.
- You do NOT have access to any host tools, bash/terminal commands, filesystem access, web browsing, or workspace tools (such as run_command, read_file, edit_file, or search_web).
- You MUST NOT attempt to use any tools other than the virtual tools explicitly listed below.
- All tool calls MUST strictly be formatted as JSON blocks matching the specification below.

You have access to the following tools:
${toolDescriptions}

${tacticGuidance}

CRITICAL: How validate_proof_state_change works
1. It takes the current theorem and proof script and your proposedAddition (tactics to add at the user's cursor).
2. It builds: existing proof script + your proposed addition at the cursor, then verifies that with the prover.
3. If it compiles and the resulting proof state matches or is close to the desired state, it applies the edit and returns success.
4. If not (compile error or state mismatch), it returns an error and the resulting state so you can try again with a different proposedAddition.

WORKFLOW:
1. You ALREADY have the current proof state (Original state), desired state, and proof script below.
2. If you need to find relevant library lemmas or theorems, call search_theorems.
3. Your primary goal is to call validate_proof_state_change on Turn 1 with:
   - originalValue: the Original state
   - desiredValue: the Desired state
   - proposedAddition: the tactic (or sequence of tactics) to transition from Original to Desired.
4. When validate_proof_state_change returns success, the edit has been applied to the editor; conclude your answer.
5. If validate_proof_state_change returns an error, inspect the error message and the resulting state, adjust your tactic, and call validate_proof_state_change again.

Original state:
\`\`\`
${proofStateChange.originalValue}
\`\`\`

Desired state:
\`\`\`
${proofStateChange.desiredValue}
\`\`\`
${proofScriptSection}

To use a tool, respond with ONLY a JSON block:
\`\`\`json
{ "tool": "tool_name", "args": { ... } }
\`\`\`

When you STOP without calling a tool, reply in plain text with a clear, specific explanation for the user.`;

    const addsHypothesis = desiredStateAddsHypothesis(
        proofStateChange.originalValue,
        proofStateChange.desiredValue
    );
    const addHypNote = addsHypothesis
        ? `\n\nNote: Desired state adds a new hypothesis compared to Original. Prefer suggest_proof_script_edit or explain in text if the lemma itself must change.`
        : '';

    const userRequest = `The user wants to go from the current proof state to the desired state.
The current proof state, desired state, and proof script are already provided in the context above.
Your first response MUST be a tool call:
- Call validate_proof_state_change with originalValue, desiredValue, and your proposedAddition (the tactic to transition between them).
- Or, if you need to find a specific library lemma first, call search_theorems.${addHypNote}`;

    const messages: any[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userRequest }
    ];

    const MAX_TURNS = 10;
    let turn = 0;
    let anyToolExecuted = false;
    let nudgeSent = false;
    let validateFailureCount = 0;
    let validateRetriesExhausted = false;
    const proposedAdditionsTried: string[] = [];
    let validateAttempted = false;
    let scriptEditAttempted = false;
    let emptyAfterInspectionNudgeSent = false;
    let showedUserFacingText = false;
    const executedToolSignatures: string[] = [];
    let proverConversationId: string | undefined = undefined;

    const emitProverAgentText = (text: string) => {
        if (text.trim()) {
            showedUserFacingText = true;
            onUpdate(text);
        }
    };

    try {
        while (turn < MAX_TURNS) {
            turn++;
            if (token?.isCancellationRequested) {
                OutputLogger.info('Agent:Prover', `Turn ${turn}: cancellation requested.`);
                break;
            }
            OutputLogger.debug('Agent:Prover', `Turn ${turn}/${MAX_TURNS}: invoking model...`);

            const modelOpts = proverConversationId
                ? { conversationId: proverConversationId }
                : {
                      onConversationId: (id: string) => {
                          proverConversationId = id;
                      },
                  };
            const fullResponseText = await invokeModel(messages, model, token, modelOpts);
            messages.push({ role: 'assistant', content: fullResponseText });
            OutputLogger.trace('Agent:Prover', `Model response (turn ${turn}):\n${fullResponseText}`);

            const parseResult = extractAllToolCalls(fullResponseText);
            const toolCalls = parseResult.toolCalls;

            if (parseResult.prose) {
                emitProverAgentText(parseResult.prose);
            }

            if (toolCalls.length === 0) {
                if (parseResult.hasMalformedJson) {
                    OutputLogger.warn('Agent:Prover', 'Malformed tool call JSON syntax detected in prover model output.');
                    messages.push({
                        role: 'user',
                        content: 'Tool call JSON was invalid. Respond with a valid tool JSON block like {"tool": "...", "args": { ... }} or answer in text.',
                    });
                    emitTool({
                        kind: 'status',
                        detail: 'Invalid tool call JSON syntax detected. Asking prover to retry with valid JSON.',
                    });
                    continue;
                }

                if (!anyToolExecuted && !nudgeSent) {
                    nudgeSent = true;
                    OutputLogger.warn('Agent:Prover', 'Turn 1 nudge: no tool called, asking for validate_proof_state_change.');
                    messages.push({
                        role: 'user',
                        content: 'You must call validate_proof_state_change (or search_theorems). Provide your synthesized tactic in proposedAddition. Reply with ONLY a JSON tool call block.',
                    });
                    emitTool({
                        kind: 'status',
                        detail: 'No tool was called. Asking the prover to call validate_proof_state_change.',
                    });
                    continue;
                }

                if (!fullResponseText.trim()) {
                    const actionAttempted = validateAttempted || scriptEditAttempted;
                    if (!actionAttempted && !emptyAfterInspectionNudgeSent) {
                        emptyAfterInspectionNudgeSent = true;
                        OutputLogger.warn('Agent:Prover', 'Nudge: no validation attempted yet.');
                        messages.push({
                            role: 'user',
                            content: 'Call validate_proof_state_change with a concrete proposedAddition, or reply in plain text explaining why this change cannot be made.',
                        });
                        emitTool({
                            kind: 'status',
                            detail: 'No validation attempted yet — asking the prover to validate or explain.',
                        });
                        continue;
                    }

                    const lastTool = lastToolResultFromMessages(messages);
                    if (lastTool) {
                        emitProverAgentText(
                            `The prover agent stopped without a text reply. Latest tool output:\n\n${truncateToolDetail(lastTool, 3000)}`
                        );
                    }
                }
                OutputLogger.info('Agent:Prover', 'Prover agent finished with text response.');
                break;
            }

            const command = toolCalls[0];
            const toolName = command.tool;
            const toolArgs = command.args;

            // Cycle detection
            const sig = `${toolName}:${JSON.stringify(toolArgs)}`;
            if (executedToolSignatures.length > 0 && executedToolSignatures[executedToolSignatures.length - 1] === sig) {
                OutputLogger.warn('Agent:Prover', `Cycle detected for ${toolName}`);
                messages.push({
                    role: 'user',
                    content: `You already executed ${toolName} with these exact arguments in the previous turn. Do not repeat identical tool calls. Please propose a different tactic or conclude your answer.`,
                });
                emitTool({ kind: 'status', detail: `Repeated tool call prevented for ${toolName}.` });
                continue;
            }
            executedToolSignatures.push(sig);

            // Ajv schema validation
            const valResult = validateToolArgs(toolName, toolArgs);
            if (!valResult.valid) {
                const errSummary = (valResult.errors || []).join('; ');
                OutputLogger.warn('Agent:Prover', `Tool schema error for ${toolName}: ${errSummary}`);
                messages.push({
                    role: 'user',
                    content: `TOOL ERROR (${toolName}): Invalid arguments - ${errSummary}. Please correct your arguments and retry.`,
                });
                emitTool({ kind: 'error', toolName, detail: `Schema error: ${errSummary}` });
                continue;
            }

            try {
                const targetTool = tools.find(t => t.name === toolName);
                if (!targetTool) {
                    throw new Error(`Unknown tool: ${toolName}`);
                }

                emitTool({
                    kind: 'executing',
                    toolName,
                    detail: `Executing ${toolName}…`,
                });

                OutputLogger.info('Agent:Prover', `Executing tool "${toolName}"...`, toolArgs);
                const toolStartTime = Date.now();
                const result = await targetTool.execute(toolArgs);
                const toolDuration = Date.now() - toolStartTime;
                OutputLogger.info('Agent:Prover', `Tool "${toolName}" executed in ${toolDuration}ms`);
                OutputLogger.trace('Agent:Prover', `Tool "${toolName}" result:\n${result}`);

                anyToolExecuted = true;
                if (toolName === 'validate_proof_state_change') validateAttempted = true;
                if (toolName === 'suggest_proof_script_edit') scriptEditAttempted = true;

                messages.push({ 
                    role: 'user',
                    content: `TOOL RESULT (${toolName}): ${result}` 
                });

                emitTool({
                    kind: 'result',
                    toolName,
                    detail: result,
                });

                if (toolName === 'validate_proof_state_change') {
                    const addition = normalizeProposedAddition(
                        String(toolArgs?.proposedAddition ?? '')
                    );
                    if (addition) {
                        proposedAdditionsTried.push(addition);
                    }

                    if (isValidateProofStateFailure(result)) {
                        validateFailureCount++;
                        OutputLogger.warn('Agent:Prover', `validate_proof_state_change: Failure (${validateFailureCount}/${MAX_VALIDATE_ATTEMPTS}): ${result}`);

                        if (validateFailureCount < MAX_VALIDATE_ATTEMPTS) {
                            const triedList = [...new Set(proposedAdditionsTried)];
                            const duplicateHint =
                                triedList.length >= 2 &&
                                triedList[triedList.length - 1] === triedList[triedList.length - 2]
                                    ? ' Do not repeat the same proposedAddition.'
                                    : '';
                            OutputLogger.warn('Agent:Prover', `Validation retry nudge sent (attempt ${validateFailureCount}/${MAX_VALIDATE_ATTEMPTS})`);
                            messages.push({
                                role: 'user',
                                content:
                                    `validate_proof_state_change failed (attempt ${validateFailureCount} of ${MAX_VALIDATE_ATTEMPTS}). ` +
                                    `Read the TOOL RESULT above. ` +
                                    `Call validate_proof_state_change again with a different proposedAddition.${duplicateHint} ` +
                                    `Reply with ONLY a JSON tool call.`,
                            });
                            emitTool({
                                kind: 'status',
                                detail: `Validation failed (${validateFailureCount}/${MAX_VALIDATE_ATTEMPTS}). Asking the prover to try another proposedAddition.`,
                            });
                        } else if (!validateRetriesExhausted) {
                            validateRetriesExhausted = true;
                            OutputLogger.error('Agent:Prover', `validate_proof_state_change attempts exhausted (${validateFailureCount}/${MAX_VALIDATE_ATTEMPTS})`);
                            messages.push({
                                role: 'user',
                                content:
                                    `validate_proof_state_change has failed ${validateFailureCount} times. ` +
                                    `Reply to the user in plain text: explain why the desired state ` +
                                    `cannot be reached by inserting tactics at the cursor or suggest manual steps.`,
                            });
                            emitTool({
                                kind: 'status',
                                detail: `Validation failed ${validateFailureCount} times. Asking the prover to conclude or explain.`,
                            });
                        }
                    } else {
                        OutputLogger.info('Agent:Prover', 'validate_proof_state_change: Success! Proposed tactic verified and applied.');
                        const appliedTactic = addition || String(toolArgs?.proposedAddition ?? '').trim();
                        emitProverAgentText(`Successfully synthesized and applied tactic: \`${appliedTactic}\`\n\nYou can keep or revert the change in the editor.`);
                        break;
                    }
                }

            } catch (e) {
                OutputLogger.error('Agent:Prover', `Tool "${toolName}" execution error: ${e}`);
                emitTool({
                    kind: 'error',
                    detail: `Tool execution error: ${e}`,
                });
                messages.push({ role: 'user', content: `TOOL ERROR: ${e}` });
            }
        }

        await finalizeProverAgentAnswerIfNeeded(
            messages,
            model,
            token,
            emitProverAgentText,
            emitTool,
            showedUserFacingText,
            proverConversationId
        );
    } catch (e) {
        OutputLogger.error('Agent:Prover', 'runProverAgent top-level error:', e);
        onUpdate(`Prover agent error: ${e}`);
    } finally {
        onDone?.();
    }
}
