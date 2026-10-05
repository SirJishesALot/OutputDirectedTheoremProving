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

/**
 * Headless Rocq / Coq compiler verification using `coqtop`.
 */
export function verifyRocqTransition(
    prefixCode: string,
    proposedAddition: string,
    targetState: string,
    timeoutMs: number = 15000
): VerificationResult {
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

        const normTarget = normalizeState(targetState);
        const normStdout = normalizeState(stdout);

        if (isProofCompleteState(normTarget)) {
            if (isProofCompleteState(normStdout)) {
                return { success: true, resultingState: 'Proof completed (No subgoals).' };
            }
            return {
                success: false,
                error: 'Proof state did not reach completion.',
                resultingState: stdout.trim(),
            };
        }

        if (normStdout.includes(normTarget)) {
            return { success: true, resultingState: targetState };
        }

        // Try extracting the final goal block from stdout for diagnostic feedback
        const goalMatches = stdout.split(/(\d+\s+goals?|1\s+goal)/);
        const lastGoalBlock = goalMatches.length > 1 ? goalMatches.slice(-2).join('').trim() : stdout.trim();

        return {
            success: false,
            error: 'Resulting state does not match target state.',
            resultingState: lastGoalBlock,
        };
    } catch (e: any) {
        return { success: false, error: e?.message || String(e) };
    }
}

/**
 * Headless Lean 4 compiler verification using `lake exe repl`.
 */
export function verifyLeanTransition(
    prefixCode: string,
    proposedAddition: string,
    targetState: string,
    workspaceRoot?: string,
    timeoutMs: number = 20000
): VerificationResult {
    const rootDir =
        workspaceRoot ||
        path.resolve(__dirname, '../../../outputdirected_benchmarking');

    const cleanAddition = proposedAddition
        .replace(/```(?:lean|lean4)?/gi, '')
        .replace(/```/g, '')
        .trim();

    const normTarget = normalizeState(targetState);
    const isCompletion = isProofCompleteState(normTarget);

    let fullInput = '';
    let sorryLine: number | null = null;

    if (isCompletion) {
        fullInput = `${prefixCode}\n${cleanAddition}`.trimEnd();
    } else {
        // Indentation calculation for sorry
        const lines = cleanAddition ? cleanAddition.split('\n') : prefixCode.split('\n');
        const lastNonEmpty = [...lines].reverse().find((l) => l.trim().length > 0) || '';
        const indentMatch = lastNonEmpty.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : '  ';
        fullInput = `${prefixCode}\n${cleanAddition}\n${indent}sorry`;
        sorryLine = fullInput.split('\n').length;
    }

    const tempPath = path.join(rootDir, `tmp_bench_${Date.now()}_${Math.random().toString(36).slice(2)}.lean`);
    fs.writeFileSync(tempPath, fullInput, 'utf-8');

    try {
        const proc = cp.spawnSync('lake', ['exe', 'repl'], {
            cwd: rootDir,
            input: JSON.stringify({ path: tempPath, allTactics: true }) + '\n\n',
            encoding: 'utf-8',
            timeout: timeoutMs,
            maxBuffer: 10 * 1024 * 1024,
        });

        if (proc.error) {
            return { success: false, error: `lake spawn error: ${proc.error.message}` };
        }

        let res: any = {};
        try {
            res = JSON.parse(proc.stdout || '{}');
        } catch {
            return { success: false, error: `Failed to parse Lean REPL response: ${proc.stdout || proc.stderr}` };
        }

        const errors: string[] = (res.messages || [])
            .filter((m: any) => m.severity === 'error')
            .map((m: any) => m.data || '');

        if (isCompletion) {
            if (errors.some((err) => err.includes('No goals to be solved'))) {
                return { success: true, resultingState: 'Proof completed (No subgoals).' };
            }
            if (!errors.length && !(res.sorries || []).length) {
                return { success: true, resultingState: 'Proof completed (No subgoals).' };
            }
            const firstErr = errors[0] || 'Proof state did not reach completion.';
            return { success: false, error: firstErr };
        }

        const otherErrors = errors.filter((e) => !e.includes('No goals to be solved'));
        if (otherErrors.length > 0) {
            return { success: false, error: otherErrors[0] };
        }

        // Find the goal state of the sorry tactic
        const tactics: any[] = res.tactics || [];
        const sorryTactic = tactics.find((t) => t.pos?.line === sorryLine);

        if (sorryTactic && sorryTactic.goals) {
            const normGoals = normalizeState(sorryTactic.goals);
            if (normGoals.includes(normTarget) || normTarget.includes(normGoals)) {
                return { success: true, resultingState: sorryTactic.goals };
            }
            return {
                success: false,
                error: 'Resulting Lean state does not match target state.',
                resultingState: sorryTactic.goals,
            };
        }

        return { success: false, error: 'Could not extract resulting Lean proof state.' };
    } catch (e: any) {
        return { success: false, error: e?.message || String(e) };
    } finally {
        if (fs.existsSync(tempPath)) {
            try {
                fs.unlinkSync(tempPath);
            } catch {
                // ignore
            }
        }
    }
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
    onToolCalled?: (name: string, args: any, result: string) => void
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

                const res =
                    prover === 'rocq'
                        ? verifyRocqTransition(initialPrefix, proposedAddition, desiredState)
                        : verifyLeanTransition(initialPrefix, proposedAddition, desiredState);

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

