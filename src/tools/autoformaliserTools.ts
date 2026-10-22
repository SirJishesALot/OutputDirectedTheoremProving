import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { ProofGoal, Hyp, PpString, GoalsWithMessages } from '../lsp/coqLspTypes';
import { AgentTool } from '../llm/chatBridge';
import { parseCoqFile } from '../parser/parseCoqFile';
import { hypToString, getTextBeforePosition } from '../core/exposedCompletionGeneratorUtils';
import { serializeGoalsToPanelFormat } from './proverTools';

/**
 * Tools for the autoformaliser agent that suggests edits to the proof state.
 * The agent uses these tools to understand the current proof state, context,
 * and edit history, then suggests new edits to help progress the proof.
 */

/** Find a proof block (Proof. ... Qed./Defined./Admitted.) that contains the given 0-based line. */
function findProofBlockContainingLine(lines: string[], cursorLine: number): { startLine: number; endLine: number } | null {
    const endMarkers = /\b(Qed|Defined|Admitted)\s*\./;
    let proofStart: number | null = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/\bProof\s*\./.test(line)) proofStart = i;
        if (proofStart !== null && endMarkers.test(line ?? '')) {
            if (cursorLine >= proofStart && cursorLine <= i) return { startLine: proofStart, endLine: i };
            proofStart = null;
        }
    }
    return null;
}

export interface ProofStateEdit {
    /** The name of the hypothesis being edited (e.g., "H", "x", "n") */
    hypothesisName: string;
    /** The original text/value of the hypothesis type */
    originalValue: string;
    /** The suggested new text/value for the hypothesis type */
    suggestedValue: string;
    /** Optional: explanation of why this edit is suggested */
    reason?: string;
}

export interface EditHistory {
    /** List of edits made so far (lhs -> rhs pairs) */
    edits: Array<{ lhs: string; rhs: string; timestamp?: number }>;
}

/**
 * Creates tools for the autoformaliser agent.
 * These tools allow the agent to:
 * 1. Get the current proof state (goals, hypotheses)
 * 2. Get proof context (surrounding code, available theorems)
 * 3. Get edit history (what edits have been made)
 * 4. Check term validity (validate suggestions)
 * 5. Suggest proof state edits (propose new edits)
 */
export function createAutoformaliserTools(
    clientReady: Promise<CoqLspClient>,
    editor: vscode.TextEditor,
    editHistory: EditHistory = { edits: [] }
): AgentTool[] {
    return [
        {
            name: 'get_current_proof_state',
            description: `Gets the current proof state at the cursor position, including all goals, hypotheses, their types, and any error messages.
Returns a formatted string with:
- Current goal(s) and their types
- All hypotheses with their names and types
- Any error messages from Coq
- Any informational messages from Coq
- Goal stack information if available`,
            execute: async (args: {}) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
                    const version = editor.document.version;
                    const position = editor.selection.active;
                    const content = editor.document.getText();

                    let result: string = '';

                    await client.withTextDocument({ uri: docUri, version, content }, async () => {
                        const goalsResult = await client.getGoalsAtPoint(
                            position as any,
                            docUri as any,
                            version
                        );

                        if (!goalsResult.ok) {
                            result = `Error: ${goalsResult.val.message || 'Failed to get goals'}`;
                            return;
                        }

                        const goalsWithMessages = goalsResult.val;
                        const goals = goalsWithMessages.goals;
                        const messages = goalsWithMessages.messages || [];
                        const error = goalsWithMessages.error;

                        if (!goals || goals.length === 0) {
                            result = 'No active goals at this position.';
                            // Still include errors/messages even if no goals
                            if (error) {
                                result += `\n\n=== ERROR ===\n${error}`;
                            }
                            if (messages.length > 0) {
                                result += `\n\n=== MESSAGES ===\n${messages.join('\n')}`;
                            }
                            return;
                        }

                        result = '=== CURRENT PROOF STATE ===\n\n';
                        result += `Number of goals: ${goals.length}\n\n`;
                        goals.forEach((goal: ProofGoal, index: number) => {
                            result += `--- Goal ${index + 1} ---\n`;
                            result += `Goal Type: ${goal.ty}\n\n`;
                            
                            if (goal.hyps && goal.hyps.length > 0) {
                                result += 'Hypotheses:\n';
                                goal.hyps.forEach((hyp: Hyp<PpString>) => {
                                    const hypStr = hypToString(hyp);
                                    result += `  ${hypStr}\n`;
                                });
                            } else {
                                result += 'No hypotheses.\n';
                            }
                            result += '\n';
                        });

                        // Add error messages if present
                        if (error) {
                            result += '\n=== ERROR ===\n';
                            result += error;
                            result += '\n';
                        }

                        // Add informational messages if present
                        if (messages.length > 0) {
                            result += '\n=== MESSAGES ===\n';
                            messages.forEach(msg => {
                                result += `${msg}\n`;
                            });
                        }
                    });

                    return result || 'No proof state available.';
                } catch (e) {
                    return `Error getting proof state: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'get_proof_context',
            description: `Gets the surrounding proof context including:
- The proof script text before the cursor (last N lines)
- Available theorems and lemmas in the current file
- The current theorem/lemma being proved
Returns formatted context information.`,
            execute: async (args: { linesBefore?: number; includeTheorems?: boolean }) => {
                try {
                    const linesBefore = args.linesBefore ?? 20;
                    const includeTheorems = args.includeTheorems ?? true;

                    const client = await clientReady;
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
                    const version = editor.document.version;
                    const position = editor.selection.active;
                    const textLines = editor.document.getText().split('\n');

                    let result = '=== PROOF CONTEXT ===\n\n';

                    // Get text before cursor
                    const textBefore = getTextBeforePosition(textLines, position);
                    const relevantLines = textBefore.slice(-linesBefore);
                    result += `--- Proof Script (last ${relevantLines.length} lines) ---\n`;
                    result += relevantLines.join('\n');
                    result += '\n\n';

                    // Get available theorems if requested
                    if (includeTheorems) {
                        try {
                            const theorems = await parseCoqFile(
                                docUri,
                                client,
                                new AbortController().signal,
                                false // don't extract initial goals
                            );

                            if (theorems.length > 0) {
                                result += `--- Available Theorems/Lemmas (${theorems.length}) ---\n`;
                                theorems.slice(0, 10).forEach((thm, idx) => {
                                    result += `${idx + 1}. ${thm.name}: ${thm.statement}\n`;
                                });
                                if (theorems.length > 10) {
                                    result += `... and ${theorems.length - 10} more\n`;
                                }
                            } else {
                                result += 'No theorems/lemmas found in this file.\n';
                            }
                        } catch (e) {
                            result += `Note: Could not parse theorems: ${e instanceof Error ? e.message : String(e)}\n`;
                        }
                    }

                    return result;
                } catch (e) {
                    return `Error getting proof context: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'get_current_proof_script',
            description: `Gets the complete proof script for the current proof that the cursor is in.
Returns:
- The theorem/lemma name
- The theorem/lemma statement
- The full proof script from "Proof." to "Qed." (or "Defined." or "Admitted.")
This includes all tactics and proof steps that have been written so far.
Use this to understand what tactics have been used, the structure of the current proof, or to get the name of the theorem being worked on.`,
            execute: async (args: {}) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
                    const version = editor.document.version;
                    const position = editor.selection.active;
                    const content = editor.document.getText();

                    let result = '';

                    const textLines = content.split('\n');
                    await client.withTextDocument({ uri: docUri, version, content }, async () => {
                        // Parse the file to find theorems and their proofs (using current buffer)
                        const theorems = await parseCoqFile(
                            docUri,
                            client,
                            new AbortController().signal,
                            false, // don't extract initial goals
                            undefined,
                            content
                        );

                        // Find the theorem/proof that contains the cursor (allow proofs with 0 steps, same as prover)
                        let currentProof = null;
                        for (const thm of theorems) {
                            if (!thm.proof) continue;
                            const proofStart = thm.proof.proof_steps.length > 0
                                ? thm.proof.proof_steps[0].range.start
                                : { line: thm.statement_range.end.line + 1, character: 0 };
                            const proofEnd = thm.proof.end_pos.end;
                            if (position.line >= proofStart.line && position.line <= proofEnd.line) {
                                if (position.line === proofStart.line && position.character < proofStart.character) continue;
                                if (position.line === proofEnd.line && position.character > proofEnd.character) continue;
                                currentProof = thm;
                                break;
                            }
                        }

                        if (!currentProof || !currentProof.proof) {
                            const block = findProofBlockContainingLine(textLines, position.line);
                            if (block) {
                                const segment = textLines.slice(block.startLine, block.endLine + 1).join('\n');
                                result = `=== CURRENT PROOF SCRIPT (from document scan) ===\n\n`;
                                result += `Cursor is inside a proof block (lines ${block.startLine + 1}--${block.endLine + 1}).\n\n`;
                                result += `--- Proof block text ---\n${segment}\n\n--- End ---\n`;
                                return;
                            }
                            result = 'No proof found at the current cursor position. Make sure you are inside a proof block (between "Proof." and "Qed."/ "Defined."/ "Admitted.").';
                            return;
                        }

                        const proofScript = currentProof.proof.onlyText();

                        result = `=== CURRENT PROOF SCRIPT ===\n\n`;
                        result += `Theorem/Lemma: ${currentProof.name}\n`;
                        result += `Statement: ${currentProof.statement}\n\n`;
                        result += `--- Proof Script ---\n`;
                        result += proofScript;
                        result += `\n\n--- End of Proof ---\n`;
                    });

                    return result;
                } catch (e) {
                    return `Error getting proof script: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'try_tactic',
            description: `Tests a tactic in a shadow buffer at the current cursor position without modifying the editor.
Returns the resulting proof state if the tactic succeeds, or the error message if the tactic fails.
Use this to test tactics (e.g. "rewrite Nat.add_0_r.", "lia.", "ring.", "induction n.") before recommending them.`,
            execute: async (args: { tactic: string }) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
                    const version = editor.document.version;
                    const position = editor.selection.active;
                    const tactic = (args.tactic ?? '').trim();
                    if (!tactic) return 'error: tactic argument is required.';

                    const command = tactic.endsWith('.') ? tactic : tactic + '.';
                    const content = editor.document.getText();
                    const lines = content.split('\n');
                    const offset = lines.slice(0, position.line).join('\n').length + position.character;
                    const charBefore = offset > 0 ? content[offset - 1] : '';
                    const needsLeadingSpace = charBefore !== '' && !/[\s\n\r]/.test(charBefore);
                    const textToInsert = (needsLeadingSpace ? ' ' : '') + command + ' \n';

                    const newContent = content.substring(0, offset) + textToInsert + content.substring(offset);
                    const addLines = textToInsert.split('\n');
                    const endLine = position.line + addLines.length - 1;
                    const endChar = addLines.length === 1
                        ? position.character + textToInsert.length
                        : addLines[addLines.length - 1].length;
                    const positionAfterInsert = new vscode.Position(endLine, endChar);

                    let result = '';
                    await client.withTextDocument(
                        { uri: docUri, version: version + 1, content: newContent, isShadowContent: true },
                        async () => {
                            const goalsResult = await client.getGoalsAtPoint(
                                positionAfterInsert as any,
                                docUri as any,
                                version + 1
                            );
                            if (!goalsResult.ok) {
                                const err = goalsResult.val;
                                const msg = err instanceof Error ? err.message : String(err);
                                result = `error: Tactic failed: ${msg}`;
                                return;
                            }
                            const goalsWithMessages = goalsResult.val as GoalsWithMessages;
                            const goals = goalsWithMessages.goals;
                            if (!goals || goals.length === 0) {
                                result = 'success: Tactic solved all remaining goals! (0 goals remaining)';
                            } else {
                                result = `success: Tactic succeeded. Resulting proof state (${goals.length} goal(s)):\n\n${serializeGoalsToPanelFormat(goals)}`;
                            }
                        }
                    );
                    return result || 'error: Tactic execution produced no result.';
                } catch (e) {
                    return `error: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'search_theorems',
            description: `Searches available lemmas and theorems in Coq/Rocq libraries matching a pattern or query.
Examples: "(_ + 0 = _)", "(_ * 1 = _)", "Nat.add", "Nat.mul", "le_trans".
Returns matching lemmas and their types.`,
            execute: async (args: { query: string }) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
                    const version = editor.document.version;
                    const position = editor.selection.active;
                    let rawQuery = (args.query ?? '').trim();
                    if (!rawQuery) return 'error: query argument is required.';

                    let command = rawQuery;
                    if (!command.toLowerCase().startsWith('search')) {
                        command = `Search ${command}`;
                    }
                    if (!command.endsWith('.')) {
                        command += '.';
                    }

                    let output = '';
                    await client.withTextDocument({ uri: docUri, version }, async () => {
                        const goalsResult = await client.getGoalsAtPoint(
                            position as any,
                            docUri as any,
                            version,
                            command
                        );
                        if (!goalsResult.ok) {
                            const err = goalsResult.val;
                            output = `Search error: ${err instanceof Error ? err.message : String(err)}`;
                            return;
                        }
                        const goalsWithMessages = goalsResult.val as GoalsWithMessages;
                        const messages = goalsWithMessages.messages || [];
                        if (messages.length === 0) {
                            output = `No theorems found matching query: ${rawQuery}`;
                        } else {
                            const top = messages.slice(0, 25);
                            output = `Found ${messages.length} theorem(s) matching "${rawQuery}" (showing top ${top.length}):\n\n${top.join('\n')}`;
                        }
                    });
                    return output || `No theorems found matching "${rawQuery}".`;
                } catch (e) {
                    return `error: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'check_term_validity',
            description: `Checks if a Coq term or assertion is type-valid in the current context.
Returns 'valid' if the term is valid, or an error message describing why it's invalid.
Use this to validate suggested edits before proposing them.`,
            execute: async (args: { term: string }) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
                    const version = editor.document.version;
                    const position = editor.selection.active;
                    const command = args.term.trim().endsWith('.') ? args.term : args.term + '.';

                    let result: string = '';

                    await client.withTextDocument({ uri: docUri, version }, async () => {
                        const goalsResult = await client.getGoalsAtPoint(
                            position as any,
                            docUri as any,
                            version,
                            command
                        );

                        if (goalsResult.ok) {
                            result = 'valid';
                        } else {
                            const err = goalsResult.val;
                            const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Unable to determine term validity');
                            result = `error: ${errorMessage}`;
                        }
                    });

                    return result || 'error: Failed to check validity.';
                } catch (e) {
                    return `error: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'suggest_proof_state_edit',
            description: `Suggests an edit to the proof state that appears in the proof state panel. The user can then click "Implement changes" to run the prover agent to achieve that edit.

Two modes:
1) REPLACE (existing goal or hypothesis): originalValue = EXACT current text from get_current_proof_state. suggestedValue = DESIRED text. hypothesisName = "Goal" for goal type, or the hypothesis name.
2) ADD NEW HYPOTHESIS: Use when the proof needs an extra hypothesis that is not currently in the state (e.g. the user must change a tactic to add it). Set originalValue to "" (empty string). suggestedValue = the full new hypothesis line as it would appear in the proof state, e.g. "Heq : (k >? k0) = true". hypothesisName = the new hypothesis name (e.g. "Heq"). Use reason to explain (e.g. "Add eqn:Heq to destruct so this hypothesis is available.").

- originalValue: For replace, EXACT current text from get_current_proof_state. For add, use "".
- suggestedValue: DESIRED proof state text only (goal/hypothesis type or new hypothesis line). No tactics or prose.
- hypothesisName: "Goal" when editing the goal type; otherwise the hypothesis name (existing or new).
- goalIndex (optional): 1-based goal index when multiple goals. Omit for single goal.
- reason (optional): human-readable explanation.
One call = one edit.`,
            execute: async (args: {
                hypothesisName: string;
                originalValue?: string;
                suggestedValue: string;
                reason?: string;
                goalIndex?: number;
            }) => {
                try {
                    if (!args.hypothesisName || args.suggestedValue === undefined || args.suggestedValue === null) {
                        return 'error: hypothesisName and suggestedValue are required.';
                    }
                    const isAdd = args.originalValue === undefined || args.originalValue === null || String(args.originalValue).trim() === '' || String(args.originalValue).trim() === 'undefined';
                    if (!isAdd && !args.originalValue) {
                        return 'error: originalValue is required for replace (use "" only for add new hypothesis).';
                    }

                    // Format the suggestion (goalIndex passed through for UI targeting). For "add", originalValue is "".
                    const suggestion: ProofStateEdit & { goalIndex?: number } = {
                        hypothesisName: args.hypothesisName,
                        originalValue: (args.originalValue !== undefined && args.originalValue !== null && String(args.originalValue) !== 'undefined') ? args.originalValue : '',
                        suggestedValue: args.suggestedValue,
                        reason: args.reason,
                        ...(args.goalIndex !== undefined && args.goalIndex !== null && { goalIndex: args.goalIndex }),
                    };

                    // Return formatted suggestion
                    let result = `=== SUGGESTED EDIT ===\n\n`;
                    result += `Hypothesis: ${suggestion.hypothesisName}\n`;
                    result += suggestion.originalValue ? `Original: ${suggestion.originalValue}\n` : '(Add new hypothesis)\n';
                    result += `Suggested: ${suggestion.suggestedValue}\n`;
                    if (suggestion.reason) {
                        result += `Reason: ${suggestion.reason}\n`;
                    }
                    result += `\nThis suggestion will be presented to the user for review.`;

                    // Note: The actual presentation to the user will be handled by the calling code
                    // This tool just formats and validates the suggestion

                    return result;
                } catch (e) {
                    return `error: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        }
    ];
}
