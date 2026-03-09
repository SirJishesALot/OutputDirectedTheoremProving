import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { ProofGoal, Hyp, PpString, GoalsWithMessages, convertToString } from '../lsp/coqLspTypes';
import { AgentTool } from '../llm/chatBridge';
import { parseCoqFile } from '../parser/parseCoqFile';
import { hypToString } from '../core/exposedCompletionGeneratorUtils';

/** Decoration used to highlight a suggested proof edit (green) so the user can Keep or Revert. */
const suggestedEditDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(46, 160, 67, 0.25)',
    borderRadius: '2px',
});

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

/** Serialize goals to the same format as the proof state panel (so we can compare to desired state from webview). */
function serializeGoalsToPanelFormat(goals: ProofGoal[]): string {
    return goals
        .map((g) => {
            const hypLines = g.hyps.map((h) => hypToString(h));
            const goalTy = typeof g.ty === 'string' ? g.ty : convertToString(g.ty);
            return [...hypLines, goalTy].join('\n');
        })
        .join('\n\n');
}

/** Normalize whitespace for comparison so Coq output and panel/desired state match regardless of minor spacing. */
function normalizeProofState(s: string): string {
    return s
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .replace(/\s*:\s*/g, ' : ') // "n: nat" and "n : nat" match
        .replace(/\s+\(/g, '(')   // "S (n" and "S(n" match (Coq may print space before "(", panel may not)
        .replace(/\s+\)/g, ')'); // optional: " )" and ")" match
}

/**
 * Structured representation of goals in the same shape as the LSP GoalAnswer goals,
 * but with string types so we can parse the panel format and compare.
 */
export interface ParsedHyp {
    names: string[];
    ty: string;
}

export interface ParsedGoal {
    hyps: ParsedHyp[];
    ty: string;
}

/** Parse the panel serialization format (hyp lines "names : type" or "names: type" then goal type) into ParsedGoal[]. */
function parsePanelFormatToGoals(stateStr: string): ParsedGoal[] | null {
    const trimmed = stateStr.trim();
    if (!trimmed) return null;
    if (trimmed.includes('no remaining goals')) return [];
    const goalBlocks = trimmed.split(/\n\n+/);
    const goals: ParsedGoal[] = [];
    for (const block of goalBlocks) {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) continue;
        const goalTy = lines[lines.length - 1] ?? '';
        const hypLines = lines.slice(0, -1);
        const hyps: ParsedHyp[] = [];
        for (const line of hypLines) {
            // Accept " : " or ":" so "n: nat" and "n : nat" both parse
            const idx = line.includes(' : ')
                ? line.indexOf(' : ')
                : line.indexOf(':');
            if (idx < 0) return null;
            const namesStr = line.slice(0, idx).trim();
            const ty = line.slice(idx + (line[idx + 1] === ' ' ? 3 : 1)).trim();
            const names = namesStr ? namesStr.split(/\s+/) : [];
            hyps.push({ names, ty });
        }
        goals.push({ hyps, ty: goalTy });
    }
    return goals.length ? goals : null;
}

/** Convert LSP ProofGoal[] to ParsedGoal[] (same structure, strings normalized for comparison). */
function proofGoalsToParsed(goals: ProofGoal[]): ParsedGoal[] {
    return goals.map((g) => {
        const hyps: ParsedHyp[] = g.hyps.map((h) => {
            const names = (h.names || []).map((n) =>
                typeof n === 'string' ? n : convertToString(n)
            );
            const ty = typeof h.ty === 'string' ? h.ty : convertToString(h.ty);
            return { names, ty };
        });
        const ty = typeof g.ty === 'string' ? g.ty : convertToString(g.ty);
        return { hyps, ty };
    });
}

/**
 * Compare two parsed goal lists. Only the parts that were edited need to match:
 * - Goal types always must match (same number of goals, same normalized goal type per goal).
 * - Hypotheses: when the user edits a hypothesis, only the proposition (type) must appear
 *   in the result; names/labels are ignored. When the user only changes the goal,
 *   hypotheses in the result need not match at all.
 * So we require: (1) same number of goals and matching goal types; (2) for each desired
 * hypothesis type, the result has some hyp with that type (any name). Names never compared.
 */
function parsedGoalsEqual(a: ParsedGoal[], b: ParsedGoal[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        const ga = a[i]!;
        const gb = b[i]!;
        if (normalizeProofState(ga.ty) !== normalizeProofState(gb.ty)) return false;
        for (const desiredHyp of gb.hyps) {
            const desiredTy = normalizeProofState(desiredHyp.ty);
            const hasMatch = ga.hyps.some(
                (resultHyp) => normalizeProofState(resultHyp.ty) === desiredTy
            );
            if (!hasMatch) return false;
        }
    }
    return true;
}

/**
 * Goal-only comparison: same number of goals and matching goal types; hypotheses
 * are ignored. Use when the user is only changing the goal (hypotheses need not remain the same).
 */
function parsedGoalsEqualGoalOnly(a: ParsedGoal[], b: ParsedGoal[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (normalizeProofState(a[i]!.ty) !== normalizeProofState(b[i]!.ty)) return false;
    }
    return true;
}

/**
 * True when desired is a single goal and that goal appears among the result goals.
 * Used for tactics like "induction n." or "destruct u" that produce multiple subgoals:
 * we accept if the desired goal type appears in any resulting subgoal.
 * Hypothesis matching is relaxed: after destruct/simpl the context often changes
 * (e.g. u becomes Leaf), so we accept when the goal type matches even if hyps differ.
 */
function desiredGoalInResult(parsedResult: ParsedGoal[], parsedDesired: ParsedGoal[]): boolean {
    if (parsedDesired.length !== 1 || parsedResult.length < 1) return false;
    const desired = parsedDesired[0]!;
    const desiredTyNorm = normalizeProofState(desired.ty);
    for (const resultGoal of parsedResult) {
        if (normalizeProofState(resultGoal.ty) !== desiredTyNorm) continue;
        // Goal type matches. Accept if no hyps to check, or if hyps also match.
        if (resultGoal.hyps.length === 0) return true;
        let hypsMatch = true;
        for (const desiredHyp of desired.hyps) {
            const desiredHypTy = normalizeProofState(desiredHyp.ty);
            const hasMatch = resultGoal.hyps.some(
                (h) => normalizeProofState(h.ty) === desiredHypTy
            );
            if (!hasMatch) {
                hypsMatch = false;
                break;
            }
        }
        if (hypsMatch) return true;
        // After destruct/simpl, hyps often change (e.g. H0: pow2heap n u -> H0: pow2heap n Leaf).
        // Accept when the goal type appears in the result.
        return true;
    }
    return false;
}

/** Extract the theorem/lemma (or definition) and its proof script from full content, for the proof block containing cursorLine. */
function extractTheoremAndProofScript(content: string, cursorLine: number): string {
    const lines = content.split('\n');
    const block = findProofBlockContainingLine(lines, cursorLine);
    if (!block) return '(Proof block containing this line not found.)';
    let statementStart = block.startLine;
    for (let i = block.startLine - 1; i >= 0; i--) {
        if (/\b(Theorem|Lemma|Definition|Example|Fixpoint)\b/.test(lines[i] ?? '')) {
            statementStart = i;
            break;
        }
    }
    return lines.slice(statementStart, block.endLine + 1).join('\n');
}

/** Find a proof block (Proof. ... Qed./Defined./Admitted.) that contains the given 0-based line. Returns [startLine, endLine] or null. */
function findProofBlockContainingLine(lines: string[], cursorLine: number): { startLine: number; endLine: number } | null {
    const endMarkers = /\b(Qed|Defined|Admitted)\s*\./;
    let proofStart: number | null = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/\bProof\s*\./.test(line)) {
            proofStart = i;
        }
        if (proofStart !== null && endMarkers.test(line)) {
            if (cursorLine >= proofStart && cursorLine <= i) return { startLine: proofStart, endLine: i };
            proofStart = null;
        }
    }
    return null;
}

/** Find position to insert a tactic: after "Proof." or at end of the line containing the cursor if inside a proof. */
function findTacticInsertionPosition(lines: string[], position: vscode.Position): vscode.Position {
    const block = findProofBlockContainingLine(lines, position.line);
    if (block) {
        const lineIdx = position.line;
        const line = lines[lineIdx] ?? '';
        const trimmed = line.trimEnd();
        return new vscode.Position(lineIdx, trimmed.length);
    }
    const proofLine = lines.findIndex((l) => /\bProof\s*\./.test(l));
    if (proofLine >= 0) {
        const line = lines[proofLine] ?? '';
        return new vscode.Position(proofLine, line.trimEnd().length);
    }
    return position;
}

/** True if resulting state matches or is close enough to desired (normalized comparison). */
function stateMatchesDesired(resultState: string, desiredState: string): boolean {
    const a = normalizeProofState(resultState);
    const b = normalizeProofState(desiredState);
    if (a === b || a.includes(b) || b.includes(a)) {
        return true;
    }
    // Proof closed (no goals): treat as match if desired state is empty or indicates "no goals"
    if (a.includes('no remaining goals') && (!b || b.includes('no goal') || b.length < 20)) {
        return true;
    }
    return false;
}

/** Optional session state and cursor: when the agent runs with the panel focused, use saved position from when proof state was last updated. */
export interface ProverToolsOptions {
    sessionOriginalValue?: string;
    sessionDesiredValue?: string;
    /** Use this position instead of editor.selection.active (e.g. last position when Coq file had focus). */
    cursorPositionOverride?: { line: number; character: number };
    /** Called when a proof edit is applied as a suggestion (green highlight). Panel can show Keep/Revert UI. */
    onSuggestedEditApplied?: (editor: vscode.TextEditor, range: vscode.Range, oldText: string) => void;
}

/** Clears the green suggestion decoration from an editor. Call when user chooses Keep or Revert. */
export function clearSuggestedEditDecoration(editor: vscode.TextEditor): void {
    editor.setDecorations(suggestedEditDecorationType, []);
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
    editor: vscode.TextEditor,
    options?: ProverToolsOptions
): AgentTool[] {
    const sessionOriginal = (options?.sessionOriginalValue ?? '').trim();
    const sessionDesired = (options?.sessionDesiredValue ?? '').trim();
    const cursorOverride = options?.cursorPositionOverride;
    const getPosition = (): vscode.Position =>
        cursorOverride
            ? new vscode.Position(cursorOverride.line, cursorOverride.character)
            : editor.selection.active;

    return [
        {
            name: 'validate_proof_state_change',
            description: `Proposes tactics to add at the cursor to go from the current (old) proof state to the desired proof state.
1. Takes the current theorem and proof script, and a proposed addition (tactics/code to insert at the cursor).
2. Builds the proof script = existing content + your proposed addition at the cursor.
3. Checks if the new script compiles with Coq.
4. If it compiles, checks if the resulting proof state matches or is close to the desired state.
5. If both pass: the proposed addition is applied as an edit; you can then tell the user it was suggested (they can undo).
6. If not: returns an error (compile error or current state) so you can try again with different tactics.

Args: originalValue (full proof state before the change), desiredValue (full proof state after the change), proposedAddition (the tactics/code to add at the cursor, e.g. " reflexivity." or " simpl. reflexivity.").`,
            execute: async (args: {
                originalValue?: string;
                desiredValue?: string;
                proposedAddition?: string;
                /** Aliases some models use */
                original?: string;
                desired?: string;
            }) => {
                try {
                    // Use args first; when the agent sends empty (e.g. doesn't copy from prompt), use session state from the panel
                    let originalValue = (args.originalValue ?? args.original ?? '').trim();
                    let desiredValue = (args.desiredValue ?? args.desired ?? '').trim();
                    if (!originalValue && sessionOriginal) originalValue = sessionOriginal;
                    if (!desiredValue && sessionDesired) desiredValue = sessionDesired;

                    const addition = (args.proposedAddition ?? '').trim();

                    if (!originalValue || !desiredValue) {
                        return (
                            'error: originalValue and desiredValue are required and must not be empty. ' +
                            'Use the EXACT text from the "Original state" and "Desired state" blocks in the system prompt (copy them in full). ' +
                            'Parameter names must be: originalValue, desiredValue, proposedAddition (not "original" or "desired").'
                        );
                    }
                    if (!addition) {
                        return (
                            'error: proposedAddition is required and must be non-empty (e.g. " reflexivity." or " simpl. reflexivity."). ' +
                            'This is the tactics/code to insert at the cursor.'
                        );
                    }

                    const client = await clientReady;
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
                    const version = editor.document.version;
                    const cursorPos = getPosition();
                    const content = editor.document.getText();
                    const lines = content.split('\n');

                    const insertText = addition.trimEnd();
                    const position = new vscode.Position(cursorPos.line, cursorPos.character);
                    const offset =
                        lines.slice(0, position.line).join('\n').length + position.character;
                    const charBefore = offset > 0 ? content[offset - 1] : '';
                    const needsLeadingSpace = charBefore !== '' && !/[\s\n\r]/.test(charBefore);
                    const textToInsert = (needsLeadingSpace ? ' ' : '') + insertText + ' \n';

                    const insertedInfo = `Inserted text: ${JSON.stringify(textToInsert)}`;
                    const whereStr = `Insertion at cursor: line ${position.line + 1}, column ${position.character + 1} (0-based: ${position.line}, ${position.character}).`;

                    const newContent =
                        content.substring(0, offset) + textToInsert + content.substring(offset);

                    const fullProofScript = extractTheoremAndProofScript(newContent, position.line);
                    const newScriptBlock = `\n--- Full proof script being verified (with proposed addition) ---\n${fullProofScript}\n--- End ---`;

                    const addLines = textToInsert.split('\n');
                    const endLine =
                        position.line + addLines.length - 1;
                    const endChar =
                        addLines.length === 1
                            ? position.character + textToInsert.length
                            : addLines[addLines.length - 1].length;
                    const positionAfterInsert = new vscode.Position(endLine, endChar);
                    const editRange = new vscode.Range(position, position);

                    type TryResult = {
                        verified: boolean;
                        error?: string;
                        state?: string;
                        applied?: boolean;
                        /** Location where Coq reported the error (0-based line/character). */
                        errorAt?: { line: number; character: number };
                    };

                    // Same as panel: only use getGoalsAtPoint at insertion position; ignore diagnostics.
                    const tryResult: TryResult = await client.withTextDocument(
                        { uri: docUri, version: version + 1, content: newContent },
                        async () => {
                            const goalsResult = await client.getGoalsAtPoint(
                                positionAfterInsert as any,
                                docUri as any,
                                version + 1
                            );
                            if (!goalsResult.ok) {
                                const err = goalsResult.val;
                                const msg =
                                    err instanceof Error ? err.message : String(err);
                                return {
                                    verified: false,
                                    error: `Could not get goals after proposed addition: ${msg}`,
                                };
                            }
                            const goalsWithMessages = goalsResult.val as GoalsWithMessages;
                            const goals = goalsWithMessages.goals;
                            const stateStr = goals?.length
                                ? serializeGoalsToPanelFormat(goals)
                                : '(no remaining goals)';
                            const parsedDesired = parsePanelFormatToGoals(desiredValue);
                            if (!goals || goals.length === 0) {
                                const match =
                                    parsedDesired?.length === 0 ||
                                    stateMatchesDesired(stateStr, desiredValue);
                                if (match) return { verified: true, applied: true };
                                return {
                                    verified: false,
                                    error: 'Proof state does not match desired. Result: no remaining goals.',
                                    state: stateStr,
                                };
                            }
                            const parsedResult = proofGoalsToParsed(goals);
                            const desiredHasHyps = parsedDesired?.some((g) => g.hyps.length > 0) ?? false;
                            const exactMatch =
                                parsedDesired !== null
                                    ? desiredHasHyps
                                        ? parsedGoalsEqual(parsedResult, parsedDesired)
                                        : parsedGoalsEqualGoalOnly(parsedResult, parsedDesired)
                                    : stateMatchesDesired(stateStr, desiredValue);
                            const desiredInResult =
                                parsedDesired !== null &&
                                parsedDesired.length === 1 &&
                                desiredGoalInResult(parsedResult, parsedDesired);
                            const match = exactMatch || desiredInResult;
                            if (match) return { verified: true, applied: true, state: stateStr };
                            return {
                                verified: false,
                                error: 'Proof state after proposed addition does not match desired state.',
                                state: stateStr,
                            };
                        }
                    );

                    if (tryResult.verified && tryResult.applied) {
                        const applied = await editor.edit((editBuilder) => {
                            editBuilder.replace(editRange, textToInsert);
                        });
                        if (applied) {
                            const insertedRange = new vscode.Range(position, positionAfterInsert);
                            editor.setDecorations(suggestedEditDecorationType, [insertedRange]);
                            options?.onSuggestedEditApplied?.(editor, insertedRange, '');
                            return (
                                'valid: Proposed addition compiles and brings the proof state to the desired state. ' +
                                `The edit is applied and highlighted in the editor; use the Keep / Revert buttons in the Proof State panel to accept or undo.\n\n${insertedInfo}\n${whereStr}${newScriptBlock}`
                            );
                        }
                        return `error: Validation passed but failed to apply the edit.\n\n${insertedInfo}\n${whereStr}${newScriptBlock}`;
                    }

                    let msg = tryResult.error ?? 'Validation failed.';
                    if (tryResult.errorAt !== undefined) {
                        const { line, character } = tryResult.errorAt;
                        msg += `\nError location: line ${line + 1}, column ${character + 1} (1-based). Compare with insertion line above.`;
                    }
                    if (tryResult.state) {
                        msg += `\n\nCurrent state after your proposed addition:\n${tryResult.state}`;
                    }
                    return `error: ${msg}\n\n${insertedInfo}\n${whereStr}\nTry again with a different proposedAddition.${newScriptBlock}`;
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
                    const version = editor.document.version;
                    const position = getPosition();
                    const content = editor.document.getText();
                    const textLines = content.split('\n');

                    // Use current buffer so LSP has latest content when parsing
                    let theorems: Awaited<ReturnType<typeof parseCoqFile>> = [];
                    await client.withTextDocument({ uri: docUri, version, content }, async () => {
                        theorems = await parseCoqFile(
                            docUri,
                            client,
                            new AbortController().signal,
                            false // don't extract initial goals
                        );
                    });

                    // Find the theorem/proof that contains the cursor position (allow proofs with 0 steps, e.g. just "Proof.")
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
                            const ver = client.getServerVersion?.();
                            let result = `=== CURRENT PROOF SCRIPT (from document scan) ===\n\n`;
                            if (ver) result += `Coq: ${ver.coq} | coq-lsp: ${ver.coq_lsp}\n\n`;
                            result += `Cursor is inside a proof block (lines ${block.startLine + 1}--${block.endLine + 1}).\n\n`;
                            result += `--- Proof block text ---\n${segment}\n\n--- End ---\n`;
                            return result;
                        }
                        const lineNum = position.line;
                        const colNum = position.character;
                        const lineContent = textLines[lineNum] ?? '(no such line)';
                        const docLines = textLines.length;
                        return (
                            `No proof found at the current cursor position. Make sure you are inside a proof block (between "Proof." and "Qed."/ "Defined."/ "Admitted.").\n\n` +
                            `**Position used:** line ${lineNum + 1} (0-based: ${lineNum}), column ${colNum + 1} (0-based: ${colNum}). Document has ${docLines} lines.\n\n` +
                            `**Line at cursor:**\n${JSON.stringify(lineContent)}\n\n` +
                            `(If this position is wrong, click inside the proof in the Coq file so the proof state panel updates, then try Synthesize again.)`
                        );
                    }

                    const ver = client.getServerVersion?.();
                    let result = `=== CURRENT PROOF SCRIPT ===\n\n`;
                    if (ver) result += `Coq: ${ver.coq} | coq-lsp: ${ver.coq_lsp}\n\n`;
                    result += `Theorem/Lemma: ${currentProof.name}\n`;
                    result += `Statement: ${currentProof.statement}\n\n`;
                    result += `--- Full proof (theorem + Proof. ... Qed.) ---\n`;
                    result += currentProof.onlyText();
                    result += `\n\n--- Proof steps (with line numbers) ---\n`;
                    if (currentProof.proof.proof_steps.length > 0) {
                        currentProof.proof.proof_steps.forEach((step) => {
                            const stepText = textLines.slice(step.range.start.line, step.range.end.line + 1).join('\n');
                            result += `Line ${step.range.start.line + 1}: ${stepText}\n`;
                        });
                    } else {
                        result += `(no tactics yet)\n`;
                    }
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
Takes a proof script edit specification (line, character, oldText, newText).
The tool will VERIFY the edit with the Coq LSP before applying: if the proposed script produces a Coq error, the tool returns an error and you must try a different edit.
Only when the edit verifies successfully is it applied as an inline suggestion; the user can then accept (keep) or undo the change.
Call this with your proposed edit; if you get an error back, try again with a different proof script.`,
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

                    const client = await clientReady;
                    const docUri = Uri.fromPath(editor.document.uri.fsPath);
                    const version = editor.document.version;
                    const content = editor.document.getText();
                    const lines = content.split('\n');
                    let line = args.line;
                    if (line >= 1 && line <= lines.length) {
                        line = line - 1;
                    }
                    const character = args.character;
                    const oldText = args.oldText || '';
                    const newText = (args.newText || '').trimEnd() + ' ';

                    // Validate line number
                    if (line < 0 || line >= lines.length) {
                        return `error: Line number ${line + 1} is out of range (document has ${lines.length} lines).`;
                    }

                    const lineText = lines[line];

                    // Validate character position
                    if (character < 0 || character > lineText.length) {
                        return `error: Character position ${character} is out of range for line ${line + 1} (line has ${lineText.length} characters).`;
                    }

                    // Build proposed document content: replace oldText with newText at (line, character)
                    const startOffset = lines.slice(0, line).join('\n').length + character;
                    const proposedContent =
                        content.substring(0, startOffset) +
                        newText +
                        content.substring(startOffset + oldText.length);

                    const newScriptBlock = `\n--- Theorem and new proof script (proposed) ---\n${extractTheoremAndProofScript(proposedContent, line)}\n--- End ---`;

                    const linesProposed = proposedContent.split('\n');
                    const proofBlockEdit = findProofBlockContainingLine(linesProposed, line);

                    // Verify with Coq LSP: only fail on errors inside or before the proof block we edited
                    type VerifyResult = { verified: boolean; error?: string; errorAt?: { line: number; character: number } };
                    const verifyResult: VerifyResult = await client.withTextDocument(
                        { uri: docUri, version: version + 1, content: proposedContent },
                        async (diagnostic) => {
                            if (diagnostic?.ppMessage) {
                                const at = diagnostic.range?.start;
                                const errorAfterOurProof =
                                    proofBlockEdit !== null &&
                                    at !== undefined &&
                                    at.line > proofBlockEdit.endLine;
                                if (errorAfterOurProof) {
                                    return { verified: true };
                                }
                                return {
                                    verified: false,
                                    error: diagnostic.ppMessage,
                                    errorAt: at !== undefined ? { line: at.line, character: at.character } : undefined,
                                };
                            }
                            return { verified: true };
                        }
                    );

                    if (!verifyResult.verified) {
                        let errMsg = `error: The proposed proof script produces a Coq error. Try a different tactic or edit.\n\nCoq error: ${verifyResult.error}`;
                        if (verifyResult.errorAt) {
                            const { line, character } = verifyResult.errorAt;
                            errMsg += `\nError location: line ${line + 1}, column ${character + 1} (1-based).`;
                        } else {
                            errMsg += "\nNo error location given.";
                        }
                        return errMsg + newScriptBlock;
                    }

                    // Verified: apply the edit in the editor (one undoable edit; do not save so user can undo)
                    const oldLines = oldText.split('\n');
                    const endLine = line + oldLines.length - 1;
                    const endCharacter =
                        oldLines.length === 1
                            ? character + oldText.length
                            : oldLines[oldLines.length - 1].length;
                    const range = new vscode.Range(
                        new vscode.Position(line, character),
                        new vscode.Position(endLine, endCharacter)
                    );

                    const applied = await editor.edit((editBuilder) => {
                        editBuilder.replace(range, newText);
                    });

                    if (applied) {
                        // --- UPDATED: Calculate the exact range of the newly inserted text ---
                        const newLinesArr = newText.split('\n');
                        const newEndLine = line + newLinesArr.length - 1;
                        const newEndCharacter = newLinesArr.length === 1
                            ? character + newText.length
                            : newLinesArr[newLinesArr.length - 1].length;
                        
                        const newRange = new vscode.Range(
                            new vscode.Position(line, character),
                            new vscode.Position(newEndLine, newEndCharacter)
                        );

                        // Apply the green highlight to the NEW text
                        editor.setDecorations(suggestedEditDecorationType, [newRange]);
                        // ---------------------------------------------------------------------

                        let result = `=== PROOF SCRIPT EDIT APPLIED ===\n\n`;
                        result += `Line ${line + 1}, Column ${character + 1}:\n`;
                        if (oldText) {
                            result += `Replaced: "${oldText}"\n`;
                        } else {
                            result += `Inserted at position ${character + 1}\n`;
                        }
                        result += `With: ${JSON.stringify(newText)} (trailing space added after tactic)\n`;
                        if (args.reason) {
                            result += `Reason: ${args.reason}\n`;
                        }
                        result += `\nThe edit has been applied. You can undo it (Ctrl+Z / Cmd+Z) or keep it.`;
                        
                        // Pass the newRange to the callback so the buttons show up exactly on the green text
                        options?.onSuggestedEditApplied?.(editor, newRange, oldText);
                        
                        return result + newScriptBlock;
                    } else {
                        return 'error: Failed to apply the edit. The document may have been modified.' + newScriptBlock;
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
                    const position = getPosition();
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
                        const ver = client.getServerVersion?.();
                        if (ver) result += `Coq: ${ver.coq} | coq-lsp: ${ver.coq_lsp}\n\n`;
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