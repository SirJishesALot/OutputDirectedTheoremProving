import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { ProofGoal, Hyp, PpString } from '../lsp/coqLspTypes';
import { AgentTool } from '../llm/chatBridge';
import { parseCoqFile } from '../parser/parseCoqFile';
import { hypToString, getTextBeforePosition } from '../core/exposedCompletionGeneratorUtils';

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
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
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
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
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
            description: `Suggests an edit to the proof state that appears as a replace suggestion in the proof state panel. The user can then click "Implement changes" to run the prover agent, which will try to synthesize tactics to achieve that edit.
- originalValue: EXACT current text from the proof state (goal type or hypothesis type) as shown in the panel. Must match the display exactly so the UI can find and mark it.
- suggestedValue: DESIRED proof state text ONLY — the goal or hypothesis type we want to reach, in the same format Coq uses (e.g. "ev (0 + 0)", "ev (S (S (n' + n')))"). Do NOT put tactics, explanations, or prose here; only the target state string. Use the "reason" argument to explain the strategy (e.g. "Base case after induction on n").
- hypothesisName: "Goal" when editing the goal type; otherwise the hypothesis name.
- reason (optional): human-readable explanation (e.g. which tactic or step this corresponds to).
One call = one edit (one replacement). For multiple subgoals, suggest one at a time (e.g. first suggest desired state for the base case).`,
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

                        const goals = goalsResult.val.goals;
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
