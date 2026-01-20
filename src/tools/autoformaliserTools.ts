import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { normalizeGoals } from '../utils/coqUtils';
import { ProofGoal, Hyp, PpString } from '../lsp/coqLspTypes';
import { AgentTool } from '../llm/chatBridge';
import { parseCoqFile } from '../parser/parseCoqFile';
import { hypToString, getTextBeforePosition } from '../core/exposedCompletionGeneratorUtils';

/**
 * Tools for the autoformaliser agent that suggests edits to the proof state.
 * The agent uses these tools to understand the current proof state, context,
 * and edit history, then suggests new edits to help progress the proof.
 */

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
            description: `Gets the current proof state at the cursor position, including all goals, hypotheses, and their types. 
Returns a formatted string with:
- Current goal(s) and their types
- All hypotheses with their names and types
- Goal stack information if available`,
            execute: async (args: {}) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
                    const version = editor.document.version;
                    const position = editor.selection.active;

                    let result: string = '';

                    await client.withTextDocument({ uri: docUri, version }, async () => {
                        const goalsResult = await client.getGoalsAtPoint(
                            position as any,
                            docUri as any,
                            version
                        );

                        if (!goalsResult.ok) {
                            result = `Error: ${goalsResult.val.message || 'Failed to get goals'}`;
                            return;
                        }

                        const goals = normalizeGoals(goalsResult);
                        if (!goals || goals.length === 0) {
                            result = 'No active goals at this position.';
                            return;
                        }

                        result = '=== CURRENT PROOF STATE ===\n\n';
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
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
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
            name: 'get_edit_history',
            description: `Gets the history of edits made to the proof state. 
Returns a list of all previous edits (lhs -> rhs pairs) that have been made.
This helps understand what transformations have already been attempted.`,
            execute: async (args: {}) => {
                try {
                    if (editHistory.edits.length === 0) {
                        return 'No edits have been made yet.';
                    }

                    let result = `=== EDIT HISTORY (${editHistory.edits.length} edits) ===\n\n`;
                    editHistory.edits.forEach((edit, index) => {
                        result += `${index + 1}. "${edit.lhs}" -> "${edit.rhs}"\n`;
                        if (edit.timestamp) {
                            result += `   (at ${new Date(edit.timestamp).toLocaleTimeString()})\n`;
                        }
                    });

                    return result;
                } catch (e) {
                    return `Error getting edit history: ${e instanceof Error ? e.message : String(e)}`;
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
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
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

                        const goals = normalizeGoals(goalsResult);
                        if (goals) {
                            result = 'valid';
                        } else if (!goalsResult.ok) {
                            result = `error: ${goalsResult.val.message}`;
                        } else {
                            result = 'error: Unable to determine term validity.';
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
            description: `Suggests a specific edit to the proof state. This is the main tool for proposing changes.
Takes a hypothesis name, original value, and suggested new value.
The suggestion will be presented to the user for acceptance/rejection.
Returns a confirmation message with the suggestion details.`,
            execute: async (args: {
                hypothesisName: string;
                originalValue: string;
                suggestedValue: string;
                reason?: string;
            }) => {
                try {
                    // Validate inputs
                    if (!args.hypothesisName || !args.originalValue || !args.suggestedValue) {
                        return 'error: hypothesisName, originalValue, and suggestedValue are required.';
                    }

                    // Format the suggestion
                    const suggestion: ProofStateEdit = {
                        hypothesisName: args.hypothesisName,
                        originalValue: args.originalValue,
                        suggestedValue: args.suggestedValue,
                        reason: args.reason
                    };

                    // Return formatted suggestion
                    let result = `=== SUGGESTED EDIT ===\n\n`;
                    result += `Hypothesis: ${suggestion.hypothesisName}\n`;
                    result += `Original: ${suggestion.originalValue}\n`;
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
        },
        {
            name: 'get_goal_structure',
            description: `Gets a structured representation of the current goal(s) including:
- Goal type broken down by structure
- Hypothesis dependencies
- Type information
Useful for understanding what needs to be proved and what transformations might help.`,
            execute: async (args: {}) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
                    const version = editor.document.version;
                    const position = editor.selection.active;

                    let result: string = '';

                    await client.withTextDocument({ uri: docUri, version }, async () => {
                        const goalsResult = await client.getGoalsAtPoint(
                            position as any,
                            docUri as any,
                            version
                        );

                        if (!goalsResult.ok) {
                            result = `Error: ${goalsResult.val.message || 'Failed to get goals'}`;
                            return;
                        }

                        const goals = normalizeGoals(goalsResult);
                        if (!goals || goals.length === 0) {
                            result = 'No active goals at this position.';
                            return;
                        }

                        result = '=== GOAL STRUCTURE ===\n\n';
                        goals.forEach((goal: ProofGoal, index: number) => {
                            result += `--- Goal ${index + 1} ---\n`;
                            result += `Type: ${goal.ty}\n`;
                            result += `Hypothesis Count: ${goal.hyps?.length || 0}\n`;
                            
                            if (goal.hyps && goal.hyps.length > 0) {
                                result += '\nHypothesis Details:\n';
                                goal.hyps.forEach((hyp: Hyp<PpString>, hypIdx: number) => {
                                    result += `  [${hypIdx}] Names: ${hyp.names.join(', ')}\n`;
                                    result += `      Type: ${hyp.ty}\n`;
                                    if (hyp.def) {
                                        result += `      Definition: ${hyp.def}\n`;
                                    }
                                });
                            }
                            result += '\n';
                        });
                    });

                    return result || 'No goal structure available.';
                } catch (e) {
                    return `Error getting goal structure: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        }
    ];
}
