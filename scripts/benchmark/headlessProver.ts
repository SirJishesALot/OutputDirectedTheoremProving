import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { AgentTool } from '../../src/llm/chatBridge';

export interface VerificationResult {
    success: boolean;
    error?: string;
    resultingState?: string;
}

/** Normalizes a proof state string for whitespace and formatting insensitive comparison. */
export function normalizeState(stateStr: string): string {
    if (!stateStr) return '';
    return stateStr
        .trim()
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .join('\n');
}

/** Checks whether a proof state represents proof completion. */
export function isProofCompleteState(state: string): boolean {
    const s = normalizeState(state);
    return (
        s.includes('No subgoals') ||
        s.includes('No proof under way') ||
        s.includes('No more goals') ||
        s.includes('no goals') ||
        s.includes('Goals fully proven')
    );
}

/** Formats active, sibling, and shelved goals into standardized sections. */
export function formatCategorizedProofState(
    activeGoal: string,
    siblingGoals: string[] = [],
    shelvedGoals: string[] = []
): string {
    const activeClean = activeGoal.trim();
    if (activeClean === 'No subgoals.' || (siblingGoals.length === 0 && shelvedGoals.length === 0)) {
        return activeClean;
    }

    const parts: string[] = [];
    if (activeClean) {
        parts.push(`=== ACTIVE FOCUSED GOAL ===\n${activeClean}`);
    }

    if (siblingGoals.length > 0) {
        const siblingsStr = siblingGoals.map((s) => s.trim()).filter(Boolean).join('\n---\n');
        if (siblingsStr) {
            parts.push(`=== SIBLING GOALS (Parallel Unclosed Cases) ===\n${siblingsStr}`);
        }
    }

    if (shelvedGoals.length > 0) {
        const shelvedStr = shelvedGoals.map((s) => s.trim()).filter(Boolean).join('\n---\n');
        if (shelvedStr) {
            parts.push(`=== SHELVED GOALS (Parent Proof / Awaiting Subproof) ===\n${shelvedStr}`);
        }
    }

    return parts.join('\n\n');
}

/** Extracts the active goal portion if the state contains categorized headers. */
export function extractActiveGoalFromTarget(targetState: string): string {
    if (targetState.includes('=== ACTIVE FOCUSED GOAL ===')) {
        const match = targetState.match(/=== ACTIVE FOCUSED GOAL ===\s*([\s\S]*?)(?=\n\n===|$)/);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return targetState.trim();
}

export interface TacticExecutionResult {
    success: boolean;
    error?: string;
    resultingState?: string;
    isComplete?: boolean;
}

/**
 * Normalizes mathematical expressions by standardizing connective symbols and collapsing whitespace.
 */
export function normalizeMathExpr(expr: string): string {
    return expr
        .replace(/[✝¹²³⁴⁵⁶⁷⁸⁹⁰]/g, '')
        .replace(/\r?\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/->/g, '→')
        .replace(/<->/g, '↔')
        .replace(/\\\//g, '∨')
        .replace(/\/\\/g, '∧')
        .replace(/~=/g, '≠')
        .replace(/<>/g, '≠')
        .trim();
}

export interface ParsedGoal {
    hypothesesTypes: Set<string>;
    conclusion: string;
    subgoals: string[];
}

/**
 * Parses a raw compiler or user-provided proof state string into its core mathematical components.
 */
export function parseProofState(stateStr: string): ParsedGoal {
    const clean = stateStr
        .replace(/^```(?:proof_state|state|coq|rocq|lean)?/gim, '')
        .replace(/```/g, '')
        .replace(/^proof_state\s*/im, '')
        .replace(/[✝¹²³⁴⁵⁶⁷⁸⁹⁰]/g, '')
        .trim();

    // Check for goal separator: Coq's ===... or Lean's ⊢ / |-
    let turnstileIndex = -1;
    let turnstileLength = 0;

    const coqMatch = clean.match(/={3,}/);
    const leanMatch = clean.match(/⊢|\|-/);

    if (coqMatch && coqMatch.index !== undefined) {
        turnstileIndex = coqMatch.index;
        turnstileLength = coqMatch[0].length;
    } else if (leanMatch && leanMatch.index !== undefined) {
        turnstileIndex = leanMatch.index;
        turnstileLength = leanMatch[0].length;
    }

    if (turnstileIndex === -1) {
        return {
            hypothesesTypes: new Set(),
            conclusion: normalizeMathExpr(clean),
            subgoals: [],
        };
    }

    const before = clean.slice(0, turnstileIndex);
    const after = clean.slice(turnstileIndex + turnstileLength);

    const rawLines = before.split('\n').map((l) => l.trim()).filter(Boolean);
    const hypothesesTypes = new Set<string>();

    const hypBlocks: string[] = [];
    for (const line of rawLines) {
        if (/^\d+\s+goals?/i.test(line)) continue;
        if (/^case\s+/i.test(line)) continue;

        if (line.includes(':') && /^[a-zA-Z0-9_,'\s]+:/.test(line)) {
            hypBlocks.push(line);
        } else if (hypBlocks.length > 0) {
            hypBlocks[hypBlocks.length - 1] += ' ' + line;
        }
    }

    for (const block of hypBlocks) {
        const colonIdx = block.indexOf(':');
        if (colonIdx === -1) continue;
        const rhs = normalizeMathExpr(block.slice(colonIdx + 1));
        if (rhs) {
            hypothesesTypes.add(rhs);
        }
    }

    const subgoalSplit = after.split(/(?:subgoal\s+\d+\s+is:|goal\s+\d+\s+is:|case\s+[a-zA-Z0-9_.]+)/i);
    const mainConclusion = normalizeMathExpr(subgoalSplit[0]);
    const subgoals = subgoalSplit.slice(1).map((s) => normalizeMathExpr(s)).filter(Boolean);

    return {
        hypothesesTypes,
        conclusion: mainConclusion,
        subgoals,
    };
}

/**
 * Checks whether the actual compiler goal state satisfies the expected goal state.
 */
export function compareParsedGoals(actual: ParsedGoal, expected: ParsedGoal): boolean {
    if (!expected.conclusion && expected.hypothesesTypes.size === 0) {
        return false;
    }

    // 1. Conclusions must match
    if (actual.conclusion !== expected.conclusion) {
        if (!actual.conclusion.includes(expected.conclusion) && !expected.conclusion.includes(actual.conclusion)) {
            return false;
        }
    }

    // 2. Expected hypothesis types should all be present in actual
    for (const expType of expected.hypothesesTypes) {
        let found = false;
        for (const actType of actual.hypothesesTypes) {
            if (actType === expType || actType.includes(expType) || expType.includes(actType)) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }

    return true;
}

export interface StateComparisonContext {
    prover?: 'rocq' | 'lean';
    theoremName?: string;
    userIntent?: string;
}

/**
 * Invokes TypeSafe Jev model as a semantic judge fallback when programmatic AST/string comparison fails.
 */
export async function evaluateSemanticMatchWithJev(
    resultingState: string,
    targetState: string,
    context?: StateComparisonContext
): Promise<{ isMatch: boolean; error?: string; noulScores?: Record<string, number> }> {
    const apiKey = process.env.TYPESAFE_API_KEY;
    if (!apiKey) {
        return { isMatch: false, error: 'Resulting state does not match target state (Jev fallback disabled: no TYPESAFE_API_KEY).' };
    }

    try {
        const payload = {
            model: 'jev-latest',
            state: {
                prover: context?.prover || 'theorem_prover',
                theorem: context?.theoremName || 'unknown',
                user_intent: context?.userIntent || 'Advance proof toward the desired state.',
                user_requested_state: targetState,
                compiler_reached_state: resultingState,
            },
            questions: {
                goal_conclusion_matches: {
                    type: 'noul',
                    instructions: 'Does the reached compiler state have the same target goal conclusion (the formula after the turnstile) as the user requested state, tolerating minor typos, missing punctuation, or informal syntax?',
                    criteria: {
                        true: 'The formula to be proven is mathematically equivalent, modulo variable names, notation, or informal phrasing.',
                        false: 'The formula to be proven is mathematically different or targets a different conclusion.',
                    },
                },
                hypotheses_sufficient: {
                    type: 'noul',
                    instructions: 'Are all key assumptions, hypotheses, and variables requested by the user present and typed consistently in the reached compiler state (allowing for alpha-renaming, reordering, and compiler daggers)?',
                    criteria: {
                        true: 'All required hypotheses are present in the context, regardless of naming (e.g. ih vs IHexec) or internal compiler tags (such as Lean daggers).',
                        false: 'Key hypotheses requested by the user are missing or have conflicting types.',
                    },
                },
                is_overall_match: {
                    type: 'noul',
                    instructions: 'Overall, does the reached compiler proof state mathematically satisfy the user requested proof state for this proof step?',
                    criteria: {
                        true: 'The compiler state represents the intended mathematical proof state requested by the user, even if formatting, syntax, or variable names diverge.',
                        false: 'The compiler state represents a genuinely different mathematical goal or branch.',
                    },
                },
            },
        };

        const res = await fetch('https://api.typesafe.ai/v1/systemone', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            return { isMatch: false, error: `Jev API error (${res.status})` };
        }

        const data: any = await res.json();
        const goalScore = data.answers?.goal_conclusion_matches?.noul ?? 0;
        const hypsScore = data.answers?.hypotheses_sufficient?.noul ?? 0;
        const overallScore = data.answers?.is_overall_match?.noul ?? 0;

        const isMatch = overallScore >= 0.75 || (goalScore >= 0.70 && hypsScore >= 0.70);

        if (isMatch) {
            return {
                isMatch: true,
                noulScores: { goalScore, hypsScore, overallScore },
            };
        }

        let errorDetail = 'State mismatch:';
        if (goalScore < 0.60) {
            errorDetail += ' The tactic produced a different goal conclusion than requested.';
        }
        if (hypsScore < 0.60) {
            errorDetail += ' Key hypotheses requested by the user are missing or named inconsistently.';
        }
        if (errorDetail === 'State mismatch:') {
            errorDetail = 'Resulting state does not mathematically satisfy target state.';
        }

        return {
            isMatch: false,
            error: errorDetail,
            noulScores: { goalScore, hypsScore, overallScore },
        };
    } catch (e: any) {
        return { isMatch: false, error: `Jev evaluation error: ${e?.message || String(e)}` };
    }
}

/**
 * Compares an actual resulting compiler proof state against an expected target state.
 */
export async function compareStateWithTarget(
    resultingState: string,
    targetState: string,
    isComplete?: boolean,
    context?: StateComparisonContext
): Promise<VerificationResult> {
    const normTarget = normalizeState(targetState);
    const normResult = normalizeState(resultingState);
    const activeTarget = extractActiveGoalFromTarget(targetState);
    const normActiveTarget = normalizeState(activeTarget);
    const activeResult = extractActiveGoalFromTarget(resultingState);
    const normActiveResult = normalizeState(activeResult);

    if (isProofCompleteState(normTarget)) {
        if (isComplete || isProofCompleteState(normResult)) {
            return { success: true, resultingState: 'Proof completed (No subgoals).' };
        }
        return {
            success: false,
            error: 'Proof state did not reach completion.',
            resultingState: resultingState.trim(),
        };
    }

    if (isComplete || isProofCompleteState(normResult)) {
        return {
            success: false,
            error: 'Proof completed or closed goals prematurely when an intermediate state was expected.',
            resultingState: resultingState.trim(),
        };
    }

    // Direct normalized substring inclusion (Fast Tier 1)
    if (
        normResult === normTarget ||
        normResult.includes(normTarget) ||
        normTarget.includes(normResult) ||
        normResult.includes(normActiveTarget) ||
        normActiveTarget.includes(normResult) ||
        normActiveResult.includes(normTarget) ||
        normActiveResult.includes(normActiveTarget)
    ) {
        return { success: true, resultingState: targetState };
    }

    // Semantic parsed goal matching (Fast Tier 1 AST)
    const parsedTarget = parseProofState(activeTarget || targetState);
    const parsedResult = parseProofState(activeResult || resultingState);
    if (compareParsedGoals(parsedResult, parsedTarget)) {
        return { success: true, resultingState: targetState };
    }

    // Tier 2: TypeSafe Jev fallback (when fast checks fail)
    if (process.env.TYPESAFE_API_KEY) {
        const jevRes = await evaluateSemanticMatchWithJev(resultingState, targetState, context);
        if (jevRes.isMatch) {
            return { success: true, resultingState: targetState };
        }
        return {
            success: false,
            error: jevRes.error || 'Resulting state does not match target state.',
            resultingState: resultingState.trim(),
        };
    }

    return {
        success: false,
        error: 'Resulting state does not match target state.',
        resultingState: resultingState.trim(),
    };
}

/**
 * Executes a proposed tactic in Rocq/Coq and returns the resulting proof state and completion status.
 */
export function executeRocqTactic(
    prefixCode: string,
    proposedAddition: string,
    timeoutMs: number = 15000
): TacticExecutionResult {
    const cleanAddition = proposedAddition
        .replace(/```(?:coq|rocq)?/gi, '')
        .replace(/```/g, '')
        .trim();

    const fullInput = `${prefixCode}\n${cleanAddition}\nShow.\nQuit.\n`;

    try {
        const proc = cp.spawnSync('coqtop', ['-color', 'no'], {
            input: fullInput,
            encoding: 'utf-8',
            timeout: timeoutMs,
            maxBuffer: 10 * 1024 * 1024,
        });

        if (proc.error) {
            return { success: false, error: `coqtop spawn error: ${proc.error.message}` };
        }

        const stdout = proc.stdout || '';
        const stderr = proc.stderr || '';
        const combined = `${stdout}\n${stderr}`;

        // Check for compiler errors
        if (
            combined.includes('Error:') ||
            combined.includes('Tactic failure') ||
            combined.includes('Syntax error')
        ) {
            const errLines = combined
                .split('\n')
                .filter((l) => l.includes('Error') || l.includes('failure') || l.includes('Syntax'));
            return {
                success: false,
                error: errLines[0]?.trim() || 'Coq compilation error',
            };
        }

        const trimmed = stdout.trim();
        if (trimmed.endsWith('No more goals.') || trimmed.endsWith('No subgoals.')) {
            return { success: true, isComplete: true, resultingState: 'Proof completed (No subgoals).' };
        }

        const goalMatches = stdout.split(/(\d+\s+goals?|1\s+goal)/);
        if (goalMatches.length > 1) {
            const lastGoalBlock = goalMatches.slice(-2).join('').trim();
            if (lastGoalBlock.endsWith('No more goals.') || lastGoalBlock.endsWith('No subgoals.')) {
                return { success: true, isComplete: true, resultingState: 'Proof completed (No subgoals).' };
            }
            return {
                success: true,
                isComplete: false,
                resultingState: lastGoalBlock,
            };
        }

        const tailStdout = trimmed.slice(-300);
        if (tailStdout.includes('No more goals.') || tailStdout.includes('No subgoals.')) {
            return { success: true, isComplete: true, resultingState: 'Proof completed (No subgoals).' };
        }

        return {
            success: true,
            isComplete: false,
            resultingState: trimmed,
        };
    } catch (e: any) {
        return { success: false, error: e?.message || String(e) };
    }
}

/**
 * Headless Rocq / Coq compiler verification using `coqtop`.
 */
export async function verifyRocqTransition(
    prefixCode: string,
    proposedAddition: string,
    targetState: string,
    timeoutMs: number = 15000,
    context?: StateComparisonContext
): Promise<VerificationResult> {
    const execRes = executeRocqTactic(prefixCode, proposedAddition, timeoutMs);
    if (!execRes.success) {
        return { success: false, error: execRes.error };
    }
    return await compareStateWithTarget(execRes.resultingState || '', targetState, execRes.isComplete, context);
}

/**
 * Headless Lean 4 compiler verification using `lake exe repl`.
 */
/**
 * Sanitizes proposed Lean code by removing markdown fences,
 * leading blank newlines, and trailing whitespace, while preserving
 * indentation on the first non-empty line.
 */
export function cleanLeanProposedAddition(raw: string): string {
    let text = raw
        .replace(/```(?:lean|lean4)?/gi, '')
        .replace(/```/g, '');
    // Strip leading blank lines only (preserve spaces on first code line)
    text = text.replace(/^[ \t]*\r?\n+/, '');
    return text.trimEnd();
}

/**
 * Computes the expected indentation for tactics at the cursor.
 */
export function detectCursorIndentation(prefixCode: string): string {
    const lines = prefixCode.split('\n');
    const lastNonEmpty = [...lines].reverse().find((l) => l.trim().length > 0) || '';
    if (!lastNonEmpty) return '  ';

    const match = lastNonEmpty.match(/^(\s*)/);
    const base = match ? match[1] : '';
    const trimmed = lastNonEmpty.trimEnd();

    if (trimmed.endsWith(':= by') || trimmed.endsWith(' by') || trimmed.endsWith('=>')) {
        return base + '  ';
    }
    return base;
}

/**
 * Produces candidate strings for verification:
 * 1. If proposed addition has no leading indentation on line 1, auto-aligns it by cursor indent.
 * 2. If proposed addition already has leading indentation on line 1, uses it as-is.
 * Also provides an alternative fallback if needed.
 */
export function getLeanAdditionCandidates(prefixCode: string, proposedAddition: string): string[] {
    const clean = cleanLeanProposedAddition(proposedAddition);
    if (!clean) return [''];

    const firstLine = clean.split('\n')[0] || '';
    const firstIndentMatch = firstLine.match(/^(\s*)/);
    const firstIndent = firstIndentMatch ? firstIndentMatch[1] : '';
    const cursorIndent = detectCursorIndentation(prefixCode);

    const candidates: string[] = [];
    if (firstIndent.length === 0 && cursorIndent.length > 0) {
        // Candidate 1: Auto-aligned to cursor indentation
        const aligned = clean
            .split('\n')
            .map((line) => (line.trim().length > 0 ? cursorIndent + line : ''))
            .join('\n');
        candidates.push(aligned);
        // Candidate 2: Raw as-is (in case column 0 was intended)
        candidates.push(clean);
    } else {
        // Candidate 1: As-is with preserved indentation
        candidates.push(clean);
        // Candidate 2: If it had indent, try re-aligning to cursor indent
        if (firstIndent.length > 0 && cursorIndent.length > 0 && firstIndent !== cursorIndent) {
            const reindented = clean
                .split('\n')
                .map((line) => {
                    if (!line.trim().length) return '';
                    return line.startsWith(firstIndent)
                        ? cursorIndent + line.slice(firstIndent.length)
                        : line;
                })
                .join('\n');
            candidates.push(reindented);
        }
    }
    return candidates;
}

/**
 * Executes a proposed tactic in Lean 4 and returns the resulting proof state and completion status.
 */
export function executeLeanTactic(
    prefixCode: string,
    proposedAddition: string,
    workspaceRoot?: string,
    timeoutMs: number = 20000
): TacticExecutionResult {
    const rootDir =
        workspaceRoot ||
        path.resolve(__dirname, '../../../outputdirected_benchmarking');

    const candidates = getLeanAdditionCandidates(prefixCode, proposedAddition);
    let lastError: string | undefined;

    for (const cand of candidates) {
        // Try as completion first
        const fullInputComp = `${prefixCode}\n${cand}`.trimEnd();
        const tempPathComp = path.join(rootDir, `tmp_bench_${Date.now()}_${Math.random().toString(36).slice(2)}.lean`);
        fs.writeFileSync(tempPathComp, fullInputComp, 'utf-8');
        try {
            const proc = cp.spawnSync('lake', ['exe', 'repl'], {
                cwd: rootDir,
                input: JSON.stringify({ path: tempPathComp, allTactics: true }) + '\n\n',
                encoding: 'utf-8',
                timeout: timeoutMs,
                maxBuffer: 10 * 1024 * 1024,
            });
            let res: any = {};
            try {
                res = JSON.parse(proc.stdout || '{}');
            } catch {}
            const errors: string[] = (res.messages || [])
                .filter((m: any) => m.severity === 'error')
                .map((m: any) => m.data || '');
            if (
                errors.some((err) => err.includes('No goals to be solved')) ||
                (!errors.length && !(res.sorries || []).length)
            ) {
                return { success: true, isComplete: true, resultingState: 'Proof completed (No subgoals).' };
            }
        } finally {
            if (fs.existsSync(tempPathComp)) {
                try {
                    fs.unlinkSync(tempPathComp);
                } catch {}
            }
        }

        // Try with sorry to inspect remaining goals
        const lines = cand ? cand.split('\n') : prefixCode.split('\n');
        const lastNonEmpty = [...lines].reverse().find((l) => l.trim().length > 0) || '';
        const indentMatch = lastNonEmpty.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : '  ';
        const fullInputSorry = `${prefixCode}\n${cand}\n${indent}sorry`;
        const sorryLine = fullInputSorry.split('\n').length;
        const tempPathSorry = path.join(rootDir, `tmp_bench_${Date.now()}_${Math.random().toString(36).slice(2)}.lean`);
        fs.writeFileSync(tempPathSorry, fullInputSorry, 'utf-8');

        try {
            const proc = cp.spawnSync('lake', ['exe', 'repl'], {
                cwd: rootDir,
                input: JSON.stringify({ path: tempPathSorry, allTactics: true }) + '\n\n',
                encoding: 'utf-8',
                timeout: timeoutMs,
                maxBuffer: 10 * 1024 * 1024,
            });
            let res: any = {};
            try {
                res = JSON.parse(proc.stdout || '{}');
            } catch {}
            const errors: string[] = (res.messages || [])
                .filter((m: any) => m.severity === 'error')
                .map((m: any) => m.data || '');
            const fatalErrors = errors.filter(
                (e) => !e.includes('No goals to be solved') && !e.includes('unsolved goals')
            );
            if (fatalErrors.length === 0) {
                const tactics: any[] = res.tactics || [];
                const sorryTactic = tactics.find((t) => t.pos?.line === sorryLine);
                if (sorryTactic && sorryTactic.goals) {
                    const activeGoal = sorryTactic.goals;
                    const siblingGoals: string[] = [];
                    const shelvedGoals: string[] = [];
                    for (const m of res.messages || []) {
                        if (m.severity === 'error' && m.data?.includes('unsolved goals')) {
                            const u = m.data.replace(/^unsolved goals\n?/, '').trim();
                            if (u && normalizeState(u) !== normalizeState(activeGoal)) {
                                if (u.startsWith('case ')) {
                                    if (!siblingGoals.includes(u)) siblingGoals.push(u);
                                } else {
                                    if (!shelvedGoals.includes(u)) shelvedGoals.push(u);
                                }
                            }
                        }
                    }
                    const fullResultingState = formatCategorizedProofState(activeGoal, siblingGoals, shelvedGoals);
                    return {
                        success: true,
                        isComplete: false,
                        resultingState: fullResultingState,
                    };
                }
            } else {
                lastError = fatalErrors[0];
            }
        } finally {
            if (fs.existsSync(tempPathSorry)) {
                try {
                    fs.unlinkSync(tempPathSorry);
                } catch {}
            }
        }
    }
    return { success: false, error: lastError || 'Failed to compile proposed Lean tactic.' };
}

/**
 * Headless Lean 4 compiler verification using `lake exe repl`.
 * Evaluates candidate additions and compares resulting proof state to targetState.
 */
export async function verifyLeanTransition(
    prefixCode: string,
    proposedAddition: string,
    targetState: string,
    workspaceRoot?: string,
    timeoutMs: number = 20000,
    context?: StateComparisonContext
): Promise<VerificationResult> {
    const execRes = executeLeanTactic(prefixCode, proposedAddition, workspaceRoot, timeoutMs);
    if (!execRes.success) {
        return { success: false, error: execRes.error };
    }
    return await compareStateWithTarget(execRes.resultingState || '', targetState, execRes.isComplete, context);
}

/**
 * Universal tactic executor for headless proof progression.
 */
export function executeTactic(
    prover: 'rocq' | 'lean',
    prefixCode: string,
    addition: string,
    workspaceRoot?: string,
    timeoutMs?: number
): TacticExecutionResult {
    return prover === 'rocq'
        ? executeRocqTactic(prefixCode, addition, timeoutMs)
        : executeLeanTactic(prefixCode, addition, workspaceRoot, timeoutMs);
}

export interface ToolCallRecord {
    tool: string;
    args: any;
    result: string;
    timestamp: number;
}

export interface HeadlessProverToolsHandle {
    tools: AgentTool[];
    getAttemptCount: () => number;
    getLastAddition: () => string;
    isSuccessful: () => boolean;
    getWinningAddition: () => string | null;
    isRecovered: () => boolean;
    getToolCallLogs: () => ToolCallRecord[];
}

/**
 * Creates headless AgentTool instances simulating the VS Code editor tools for the benchmark runner.
 */
export function createHeadlessProverTools(
    prover: 'rocq' | 'lean',
    initialPrefix: string,
    originalState: string,
    desiredState: string,
    onToolCalled?: (name: string, args: any, result: string) => void,
    context?: StateComparisonContext
): HeadlessProverToolsHandle {
    let attempts = 0;
    let lastProposedAddition = '';
    let success = false;
    let winningAddition: string | null = null;
    let failedBeforeSuccess = false;
    const callLogs: ToolCallRecord[] = [];

    const recordCall = (tool: string, args: any, result: string) => {
        callLogs.push({ tool, args, result, timestamp: Date.now() });
        onToolCalled?.(tool, args, result);
    };

    const tools: AgentTool[] = [
        {
            name: 'validate_proof_state_change',
            description:
                'Validates proposed tactics against the theorem prover and checks if the resulting proof state matches desiredValue.',
            execute: async (args: any) => {
                attempts++;
                const proposedAddition =
                    args.proposedAddition ||
                    args.addition ||
                    args.tactic ||
                    args.tactics ||
                    args.code ||
                    '';
                lastProposedAddition = proposedAddition;

                const effectiveContext: StateComparisonContext = {
                    prover,
                    ...context,
                };

                const res =
                    prover === 'rocq'
                        ? await verifyRocqTransition(initialPrefix, proposedAddition, desiredState, 15000, effectiveContext)
                        : await verifyLeanTransition(initialPrefix, proposedAddition, desiredState, undefined, 20000, effectiveContext);

                let resultMsg = '';
                if (res.success) {
                    success = true;
                    if (winningAddition === null) {
                        winningAddition = proposedAddition;
                    }
                    if (attempts > 1) {
                        failedBeforeSuccess = true;
                    }
                    resultMsg = `valid: Validation succeeded! The proposed tactics achieved the desired proof state.`;
                } else if (res.resultingState) {
                    resultMsg = `error: Proposed tactics compiled, but resulting state did not match desired state.\nError: ${res.error || 'State mismatch'}\nResulting proof state:\n${res.resultingState}`;
                } else {
                    resultMsg = `error: Proposed tactics failed to compile:\n${res.error || 'Compiler error'}`;
                }

                recordCall('validate_proof_state_change', args, resultMsg);
                return resultMsg;
            },
        },
        {
            name: 'get_current_proof_script',
            description: 'Returns the current proof script up to the cursor.',
            execute: async (args: any) => {
                const msg = `=== CURRENT PROOF SCRIPT ===\n\n${initialPrefix}`;
                recordCall('get_current_proof_script', args, msg);
                return msg;
            },
        },
        {
            name: 'get_current_proof_state',
            description: 'Returns the current goals and hypotheses at the cursor position.',
            execute: async (args: any) => {
                const msg = `=== CURRENT PROOF STATE ===\n\n${originalState}`;
                recordCall('get_current_proof_state', args, msg);
                return msg;
            },
        },
        {
            name: 'suggest_proof_script_edit',
            description: 'Applies direct proof script edit at a source position.',
            execute: async (args: any) => {
                const msg = `=== PROOF SCRIPT EDIT APPLIED ===`;
                recordCall('suggest_proof_script_edit', args, msg);
                return msg;
            },
        },
    ];

    return {
        tools,
        getAttemptCount: () => attempts,
        getLastAddition: () => lastProposedAddition,
        isSuccessful: () => success,
        getWinningAddition: () => winningAddition,
        isRecovered: () => failedBeforeSuccess,
        getToolCallLogs: () => callLogs,
    };
}



