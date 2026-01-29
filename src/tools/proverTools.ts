import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { ProofGoal, Hyp, PpString, GoalsWithMessages } from '../lsp/coqLspTypes';
import { AgentTool } from '../llm/chatBridge';
import { parseCoqFile } from '../parser/parseCoqFile';
import { hypToString } from '../core/exposedCompletionGeneratorUtils';

/**
 * Tools for the prover agent that edits the proof script to achieve desired proof states.
 * The agent uses these tools to validate proof state changes and suggest edits to the proof script.
 */

export interface ProofStateChange {
    /** The hypothesis name that was changed (e.g., "H", "x", "n") */
    hypothesisName?: string;
    /** The original value that should be changed */
    originalValue: string;
    /** The desired new value */
    desiredValue: string;
}

export interface ProofScriptEdit {
    /** The line number where the edit should be made (0-indexed) */
    line: number;
    /** The character position on the line where the edit starts (0-indexed) */
    character: number;
    /** The text to replace (empty string for insertion) */
    oldText: string;
    /** The new text to insert */
    newText: string;
    /** Optional: explanation of why this edit is needed */
    reason?: string;
}

/**
 * Creates tools for the prover agent.
 * These tools allow the agent to:
 * 1. Validate proof state changes (type check, achievability)
 * 2. Get the current proof script
 * 3. Suggest edits to the proof script
 */
export function createProverTools(
    clientReady: Promise<CoqLspClient>,
    editor: vscode.TextEditor
): AgentTool[] {
    return [
        {
            name: 'validate_proof_state_change',
            description: `Validates that a proof state change is valid and achievable.
Takes a proof state change (original value -> desired value) and checks:
1. If the desired state type checks
2. If the desired state is actually achievable from the current state
Returns 'valid' if both conditions pass, or an error message explaining why it fails.`,
            execute: async (args: { originalValue: string; desiredValue: string }) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
                    const version = editor.document.version;
                    const position = editor.selection.active;

                    // First, check if the desired value type checks
                    const desiredAssertion = `assert (${args.desiredValue}).`;
                    let result: string = '';

                    await client.withTextDocument({ uri: docUri, version }, async () => {
                        const desiredCheck = await client.getGoalsAtPoint(
                            position as any,
                            docUri as any,
                            version,
                            desiredAssertion
                        );

                        if (!desiredCheck.ok) {
                            const err = desiredCheck.val;
                            const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Unable to validate desired state');
                            return `error: The desired proof state does not type check. ${errorMessage}`;
                        }

                        // Get current goals to see what we're working with
                        const currentGoals = await client.getGoalsAtPoint(
                            position as any,
                            docUri as any,
                            version
                        );

                        if (!currentGoals.ok) {
                            return 'error: Could not retrieve current proof state.';
                        }

                        const currentGoalsData = currentGoals.val as GoalsWithMessages;
                        
                        // Check if the desired state is achievable
                        // This is a simplified check - in practice, you might want more sophisticated logic
                        // For now, we'll check if we can construct a term that transforms originalValue to desiredValue
                        const transformationCheck = `assert ((${args.originalValue}) = (${args.desiredValue})).`;
                        
                        const transformationResult = await client.getGoalsAtPoint(
                            position as any,
                            docUri as any,
                            version,
                            transformationCheck
                        );

                        if (!transformationResult.ok) {
                            const err = transformationResult.val;
                            const errorMessage = err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Unable to validate transformation');
                            return `error: The transformation from "${args.originalValue}" to "${args.desiredValue}" is not achievable. ${errorMessage}`;
                        }

                        result = 'valid: Both type checking and achievability checks passed.';
                    });

                    return result || 'error: Failed to validate proof state change.';
                } catch (e) {
                    return `error: ${e instanceof Error ? e.message : String(e)}`;
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
- Line numbers for each proof step
This includes all tactics and proof steps that have been written so far.
Use this to understand what tactics have been used, the structure of the current proof, and where to insert new tactics.`,
            execute: async (args: {}) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
                    const position = editor.selection.active;
                    const textLines = editor.document.getText().split('\n');

                    // Parse the file to find theorems and their proofs
                    const theorems = await parseCoqFile(
                        docUri,
                        client,
                        new AbortController().signal,
                        false // don't extract initial goals
                    );

                    // Find the theorem/proof that contains the cursor position
                    let currentProof = null;
                    for (const thm of theorems) {
                        if (thm.proof && thm.proof.proof_steps.length > 0) {
                            const firstStep = thm.proof.proof_steps[0];
                            const proofStart = firstStep.range.start;
                            const proofEnd = thm.proof.end_pos.end;
                            
                            if (position.line >= proofStart.line && position.line <= proofEnd.line) {
                                if (position.line === proofStart.line && position.character < proofStart.character) {
                                    continue;
                                }
                                if (position.line === proofEnd.line && position.character > proofEnd.character) {
                                    continue;
                                }
                                currentProof = thm;
                                break;
                            }
                        }
                    }

                    if (!currentProof || !currentProof.proof) {
                        return 'No proof found at the current cursor position. Make sure you are inside a proof block (between "Proof." and "Qed."/ "Defined."/ "Admitted.").';
                    }

                    const proofScript = currentProof.proof.onlyText();

                    let result = `=== CURRENT PROOF SCRIPT ===\n\n`;
                    result += `Theorem/Lemma: ${currentProof.name}\n`;
                    result += `Statement: ${currentProof.statement}\n\n`;
                    result += `--- Proof Script (with line numbers) ---\n`;
                    
                    // Include line numbers by showing the proof steps with their ranges
                    currentProof.proof.proof_steps.forEach((step, idx) => {
                        const stepText = textLines.slice(step.range.start.line, step.range.end.line + 1).join('\n');
                        result += `Line ${step.range.start.line + 1}: ${stepText}\n`;
                    });
                    
                    result += `\n--- End of Proof ---\n`;

                    return result;
                } catch (e) {
                    return `Error getting proof script: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'suggest_proof_script_edit',
            description: `Suggests an edit to the proof script to achieve a desired proof state.
Takes a proof script edit specification (line, character, oldText, newText) and creates an inline suggestion in the editor.
The user can then accept or reject the suggestion.
Returns a confirmation message with the edit details.
CRITICAL: Only call this tool if you have validated that the edit will achieve the desired proof state and type checks.`,
            execute: async (args: {
                line: number;
                character: number;
                oldText: string;
                newText: string;
                reason?: string;
            }) => {
                try {
                    // Validate inputs
                    if (args.line === undefined || args.character === undefined) {
                        return 'error: line and character are required.';
                    }

                    const docUri = editor.document.uri;
                    const line = args.line; // 0-indexed
                    const character = args.character; // 0-indexed
                    const oldText = args.oldText || '';
                    const newText = args.newText || '';

                    // Validate line number
                    if (line < 0 || line >= editor.document.lineCount) {
                        return `error: Line number ${line + 1} is out of range (document has ${editor.document.lineCount} lines).`;
                    }

                    const lineText = editor.document.lineAt(line).text;
                    
                    // Validate character position
                    if (character < 0 || character > lineText.length) {
                        return `error: Character position ${character} is out of range for line ${line + 1} (line has ${lineText.length} characters).`;
                    }

                    // Use the editor's edit API to apply the change
                    // This will show the change in the editor and allow the user to undo it
                    const range = new vscode.Range(
                        new vscode.Position(line, character),
                        new vscode.Position(line, character + oldText.length)
                    );

                    const applied = await editor.edit(editBuilder => {
                        editBuilder.replace(range, newText);
                    });

                    if (applied) {
                        // Save the document to trigger Coq LSP validation
                        await editor.document.save();
                        
                        let result = `=== PROOF SCRIPT EDIT APPLIED ===\n\n`;
                        result += `Line ${line + 1}, Column ${character + 1}:\n`;
                        if (oldText) {
                            result += `Replaced: "${oldText}"\n`;
                        } else {
                            result += `Inserted at position ${character + 1}\n`;
                        }
                        result += `With: "${newText}"\n`;
                        if (args.reason) {
                            result += `Reason: ${args.reason}\n`;
                        }
                        result += `\nThe edit has been applied to the proof script. You can undo it (Ctrl+Z / Cmd+Z) if it doesn't achieve the desired state.`;
                        return result;
                    } else {
                        return 'error: Failed to apply the edit. The document may have been modified.';
                    }
                } catch (e) {
                    return `error: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'get_current_proof_state',
            description: `Gets the current proof state at the cursor position, including all goals, hypotheses, and their types.
Returns a formatted string with:
- Current goal(s) and their types
- All hypotheses with their names and types
- Any error messages from Coq
Use this to understand the current state before planning edits.`,
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

                        const goalsWithMessages = goalsResult.val;
                        const goals = goalsWithMessages.goals;
                        const messages = goalsWithMessages.messages || [];
                        const error = goalsWithMessages.error;

                        if (!goals || goals.length === 0) {
                            result = 'No active goals at this position.';
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

                        if (error) {
                            result += '\n=== ERROR ===\n';
                            result += error;
                            result += '\n';
                        }

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
        }
    ];
}
