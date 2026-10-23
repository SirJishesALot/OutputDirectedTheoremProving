import * as vscode from 'vscode';
import { OutputLogger } from '../logging/logger';

export interface VerificationResult {
    success: boolean;
    error?: string;
    resultingState?: string;
}

export interface StateComparisonContext {
    prover?: 'rocq' | 'lean';
    theoremName?: string;
    userIntent?: string;
}

export interface ParsedGoal {
    hypothesesTypes: Set<string>;
    conclusion: string;
    subgoals: string[];
}

/**
 * Normalizes a proof state string for whitespace and formatting insensitive comparison.
 */
export function normalizeState(stateStr: string): string {
    if (!stateStr) return '';
    return stateStr
        .trim()
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .join('\n');
}

/**
 * Checks whether a proof state represents proof completion.
 */
export function isProofCompleteState(state: string): boolean {
    if (!state) return true;
    const s = normalizeState(state).toLowerCase();
    return (
        s === '' ||
        s.includes('no subgoals') ||
        s.includes('no proof under way') ||
        s.includes('no more goals') ||
        s.includes('no goals') ||
        s.includes('no active goals') ||
        s.includes('goals fully proven') ||
        s.includes('no remaining goals') ||
        s.includes('goals accomplished') ||
        s.includes('proof completed')
    );
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

/**
 * Extracts the active goal portion if the state contains categorized headers.
 */
export function extractActiveGoalFromTarget(targetState: string): string {
    if (targetState.includes('=== ACTIVE FOCUSED GOAL ===')) {
        const match = targetState.match(/=== ACTIVE FOCUSED GOAL ===\s*([\s\S]*?)(?=\n\n===|$)/);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return targetState.trim();
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

function getTypesafeApiKey(): string | undefined {
    return (
        process.env.TYPESAFE_API_KEY ||
        vscode.workspace.getConfiguration().get<string>('myExtension.typesafeApiKey')?.trim() ||
        undefined
    );
}

/**
 * Invokes TypeSafe Jev model as a semantic judge fallback when programmatic AST/string comparison fails.
 */
export async function evaluateSemanticMatchWithJev(
    resultingState: string,
    targetState: string,
    context?: StateComparisonContext
): Promise<{ isMatch: boolean; error?: string; noulScores?: Record<string, number> }> {
    const apiKey = getTypesafeApiKey();
    if (!apiKey) {
        return {
            isMatch: false,
            error: 'Resulting state does not match target state (Jev fallback disabled: no TYPESAFE_API_KEY).',
        };
    }

    try {
        OutputLogger.info(
            'Comparator:Jev',
            `Evaluating semantic match with Jev for theorem "${context?.theoremName || 'unknown'}" (${context?.prover || 'rocq'})`
        );

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
                    instructions:
                        'Does the reached compiler state have the same target goal conclusion (the formula after the turnstile) as the user requested state, tolerating minor typos, missing punctuation, or informal syntax?',
                    criteria: {
                        true: 'The formula to be proven is mathematically equivalent, modulo variable names, notation, or informal phrasing.',
                        false: 'The formula to be proven is mathematically different or targets a different conclusion.',
                    },
                },
                hypotheses_sufficient: {
                    type: 'noul',
                    instructions:
                        'Are all key assumptions, hypotheses, and variables requested by the user present and typed consistently in the reached compiler state (allowing for alpha-renaming, reordering, and compiler daggers)?',
                    criteria: {
                        true: 'All required hypotheses are present in the context, regardless of naming (e.g. ih vs IHexec) or internal compiler tags (such as Lean daggers).',
                        false: 'Key hypotheses requested by the user are missing or have conflicting types.',
                    },
                },
                is_overall_match: {
                    type: 'noul',
                    instructions:
                        'Overall, does the reached compiler proof state mathematically satisfy the user requested proof state for this proof step?',
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
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            OutputLogger.warn('Comparator:Jev', `Jev API returned HTTP error ${res.status}`);
            return { isMatch: false, error: `Jev API error (${res.status})` };
        }

        const data: any = await res.json();
        const goalScore = data.answers?.goal_conclusion_matches?.noul ?? 0;
        const hypsScore = data.answers?.hypotheses_sufficient?.noul ?? 0;
        const overallScore = data.answers?.is_overall_match?.noul ?? 0;

        OutputLogger.info(
            'Comparator:Jev',
            `Jev evaluation scores: overall=${overallScore}, goal=${goalScore}, hyps=${hypsScore}`
        );

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
        OutputLogger.error('Comparator:Jev', 'Jev evaluation threw error:', e);
        return { isMatch: false, error: `Jev evaluation error: ${e?.message || String(e)}` };
    }
}

/**
 * Compares an actual resulting compiler proof state against an expected target state.
 * Uses fast syntactic/AST matching (Tier 1) and falls back to TypeSafe Jev (Tier 2).
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
            success: true,
            resultingState: 'Proof completed (No subgoals).',
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
    if (getTypesafeApiKey()) {
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
