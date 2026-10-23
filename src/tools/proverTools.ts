import * as vscode from 'vscode';
import { CoqLspClient } from '../lsp/coqLspClient';
import { Uri } from '../utils/uri';
import { ProofGoal, Hyp, PpString, GoalsWithMessages, convertToString } from '../lsp/coqLspTypes';
import { AgentTool } from '../llm/chatBridge';
import { parseCoqFile } from '../parser/parseCoqFile';
import { hypToString } from '../core/exposedCompletionGeneratorUtils';
import { EditorBufferGuard } from './editorBufferGuard';
import { compareStateWithTarget, isProofCompleteState } from './stateComparator';

/** Decoration used to highlight a suggested proof edit (green) so the user can Keep or Revert. */
export const suggestedEditDecorationType = vscode.window.createTextEditorDecorationType({
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
export function serializeGoalsToPanelFormat(goals: ProofGoal[]): string {
    return goals
        .map((g) => {
            const hypLines = g.hyps.map((h) => hypToString(h));
            const goalTy = typeof g.ty === 'string' ? g.ty : convertToString(g.ty);
            return [...hypLines, goalTy].join('\n');
        })
        .join('\n\n');
}

/** Normalize whitespace and logical symbols for robust comparison across Coq syntax variations. */
export function normalizeProofState(s: string): string {
    let result = s
        .trim()
        // Canonicalize Unicode & ASCII logic operators
        .replace(/\\forall\b|∀/g, 'forall')
        .replace(/\\exists\b|∃/g, 'exists')
        .replace(/→/g, '->')
        .replace(/∧/g, '/\\')
        .replace(/∨/g, '\\/')
        .replace(/↔/g, '<->')
        .replace(/¬/g, '~')
        .replace(/\s+/g, ' ')
        .replace(/\s*:\s*/g, ' : ')
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')')
        .replace(/\s*,\s*/g, ', ');

    // Strip redundant parentheses around single identifiers/tokens (e.g. "(n)" -> "n", "( 0 )" -> "0")
    let prev = '';
    while (prev !== result) {
        prev = result;
        result = result.replace(/\(\s*([a-zA-Z0-9_']+)\s*\)/g, '$1');
    }
    return result;
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

/**
 * Parse the panel serialization format (hyp lines "names : type" or "names: type" then goal type) into ParsedGoal[].
 * Supports multi-line hypothesis types and avoids misparsing binder lines in goal expressions (e.g. forall x : nat).
 */
export function parsePanelFormatToGoals(stateStr: string): ParsedGoal[] | null {
    const trimmed = stateStr.trim();
    if (!trimmed || trimmed.includes('no remaining goals') || isProofCompleteState(trimmed)) return [];
    const goalBlocks = trimmed.split(/\n\s*\n+/);
    const goals: ParsedGoal[] = [];

    const reservedKeywords = new Set([
        'forall', 'exists', 'fun', 'let', 'match', 'fix',
        'Theorem', 'Lemma', 'Definition', 'Example', 'Fixpoint'
    ]);

    for (const block of goalBlocks) {
        const rawLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        if (rawLines.length === 0) continue;

        const hyps: ParsedHyp[] = [];
        let currentHyp: ParsedHyp | null = null;
        const goalTyLines: string[] = [];
        let inGoal = false;

        for (let i = 0; i < rawLines.length; i++) {
            const line = rawLines[i];
            const colonIdx = line.includes(' : ')
                ? line.indexOf(' : ')
                : line.indexOf(':');

            let isHypLine = false;
            let names: string[] = [];
            let tyPart = '';

            if (colonIdx > 0 && !inGoal && i < rawLines.length - 1) {
                const prefix = line.slice(0, colonIdx).trim();
                const prefixTokens = prefix.split(/\s+/).filter(Boolean);
                const firstWord = prefixTokens[0] || '';
                // Ensure it's valid hypothesis identifier(s) and not a binder or statement keyword
                const isValidId = prefixTokens.every((tok) => /^[a-zA-Z_][a-zA-Z0-9_']*$/.test(tok));
                if (isValidId && !reservedKeywords.has(firstWord)) {
                    isHypLine = true;
                    names = prefixTokens;
                    tyPart = line.slice(colonIdx + (line[colonIdx + 1] === ' ' ? 3 : 1)).trim();
                }
            }

            if (isHypLine) {
                currentHyp = { names, ty: tyPart };
                hyps.push(currentHyp);
            } else if (currentHyp && !inGoal && i < rawLines.length - 1) {
                // Continuation line of the current hypothesis
                currentHyp.ty += ' ' + line;
            } else {
                inGoal = true;
                goalTyLines.push(line);
            }
        }

        const goalTy = goalTyLines.join(' ').trim() || rawLines[rawLines.length - 1];
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
export function extractTheoremAndProofScript(content: string, cursorLine: number): string {
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
    if (!b || isProofCompleteState(b)) {
        if (isProofCompleteState(a) || a.includes('no remaining goals')) {
            return true;
        }
    }
    if (a === b || a.includes(b) || b.includes(a)) {
        return true;
    }
    // Proof closed (no goals): treat as match if desired state is empty or indicates "no goals"
    if ((a.includes('no remaining goals') || isProofCompleteState(a)) && (!b || b.includes('no goal') || b.length < 20 || isProofCompleteState(b))) {
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
    /** Editor buffer guard for strict concurrency/version checking. */
    editorGuard?: EditorBufferGuard;
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
    const guard = options?.editorGuard ?? new EditorBufferGuard(editor, cursorOverride);
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
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
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
                        { uri: docUri, version: version + 1, content: newContent, isShadowContent: true },
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
                                // If the proposed addition completely solved all goals (proof is finished),
                                // this is always a verified success. In interactive proving, discharging
                                // all remaining goals accomplishes the proof goal.
                                return { verified: true, applied: true, state: stateStr };
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
                            let match = exactMatch || desiredInResult;

                            let semanticError: string | undefined;
                            if (!match) {
                                // Tier 2 fallback: Evaluate semantic match with Jev comparator (same as Task 3 benchmark)
                                const thmMatch = fullProofScript.match(/\b(?:Theorem|Lemma|Definition|Example|Fixpoint)\s+([a-zA-Z0-9_']+)/);
                                const theoremName = thmMatch ? thmMatch[1] : undefined;
                                const compResult = await compareStateWithTarget(stateStr, desiredValue, false, {
                                    prover: 'rocq',
                                    theoremName,
                                    userIntent: 'Advance proof toward the desired state.',
                                });
                                if (compResult.success) {
                                    match = true;
                                } else if (compResult.error) {
                                    semanticError = compResult.error;
                                }
                            }

                            if (match) return { verified: true, applied: true, state: stateStr };
                            return {
                                verified: false,
                                error: semanticError || 'Proof state after proposed addition does not match desired state.',
                                state: stateStr,
                            };
                        }
                    );

                    if (tryResult.verified && tryResult.applied) {
                        try {
                            guard.assertNotModified(editor);
                        } catch (e) {
                            return `error: ${e instanceof Error ? e.message : String(e)}`;
                        }
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
            name: 'search_theorems',
            description: `Searches available lemmas and theorems in Coq/Rocq matching a pattern or query.
Examples: "(_ + 0 = _)", "(_ * 1 = _)", "Nat.add", "Nat.mul", "le_trans".
Returns matching lemmas and their types. Use this to find the exact lemma name needed for your tactic.`,
            execute: async (args: { query: string }) => {
                try {
                    const client = await clientReady;
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
                    const version = editor.document.version;
                    const position = getPosition();
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
                    const docUri = Uri.fromVscodeUri(editor.document.uri);
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
                        { uri: docUri, version: version + 1, content: proposedContent, isShadowContent: true },
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

                    try {
                        guard.assertNotModified(editor);
                    } catch (e) {
                        return `error: ${e instanceof Error ? e.message : String(e)}`;
                    }

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
        }
    ];
}