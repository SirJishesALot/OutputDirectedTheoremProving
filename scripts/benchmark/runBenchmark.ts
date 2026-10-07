import './mockVscode';
import * as path from 'path';
import * as fs from 'fs';
import { loadBenchmarkSuite, BenchmarkTask } from './dataLoader';
import { createHeadlessProverTools, ToolCallRecord } from './headlessProver';
import { runProverAgent, ProverProofStateChange } from '../../src/llm/chatBridge';
import { createAntigravityCliAdapter, findAgyBinaryPath } from '../../src/llm/antigravityCliAdapter';
import { createPortkeyAdapter } from '../../src/llm/portkeyAdapter';

export interface TaskBenchmarkResult {
    taskId: string;
    prover: 'rocq' | 'lean';
    theorem: string;
    initialStage: string;
    targetStage: string;
    tier: 'step1' | 'multistep' | 'completion';
    editDistance: number;
    success: boolean;
    winningAddition: string | null;
    validationAttempts: number;
    recoveredFromError: boolean;
    toolCallCount: number;
    toolCalls: ToolCallRecord[];
    agentResponses: string[];
    durationMs: number;
    error?: string;
}

export interface BenchmarkSuiteReport {
    timestamp: string;
    mode: 'mini' | 'full';
    backend: string;
    model: string;
    totalTasks: number;
    successfulTasks: number;
    passRate: number;
    avgDurationMs: number;
    proverStats: {
        rocq: { total: number; success: number; passRate: number; avgDurationMs: number };
        lean: { total: number; success: number; passRate: number; avgDurationMs: number };
    };
    tierStats: {
        step1: { total: number; success: number; passRate: number };
        multistep: { total: number; success: number; passRate: number };
        completion: { total: number; success: number; passRate: number };
    };
    recoveryStats: {
        retriesAttempted: number;
        recoveredCount: number;
        recoveryRate: number;
    };
    results: TaskBenchmarkResult[];
}

interface CliOptions {
    prover: 'rocq' | 'lean' | 'both';
    theorem?: string;
    mode: 'mini' | 'full';
    backend: 'antigravity-cli' | 'portkey';
    model?: string;
    limit?: number;
    outputDir: string;
    task2Dir?: string;
    seed?: number;
    verbose: boolean;
    taskIds?: string[];
}

function parseCliArgs(): CliOptions {
    const args = process.argv.slice(2);
    const options: CliOptions = {
        prover: 'both',
        mode: 'mini',
        backend: 'antigravity-cli',
        outputDir: path.resolve(__dirname, '../../benchmark_results'),
        verbose: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--prover' && i + 1 < args.length) {
            const val = args[++i].toLowerCase();
            if (val === 'rocq' || val === 'coq') options.prover = 'rocq';
            else if (val === 'lean' || val === 'lean4') options.prover = 'lean';
            else if (val === 'both') options.prover = 'both';
        } else if (arg === '--theorem' && i + 1 < args.length) {
            options.theorem = args[++i];
        } else if ((arg === '--tasks' || arg === '--task-ids' || arg === '--task') && i + 1 < args.length) {
            options.taskIds = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
        } else if (arg === '--mode' && i + 1 < args.length) {
            const val = args[++i].toLowerCase();
            if (val === 'mini' || val === 'full') options.mode = val;
        } else if (arg === '--backend' && i + 1 < args.length) {
            const val = args[++i].toLowerCase();
            if (val === 'portkey' || val === 'antigravity-cli') options.backend = val;
        } else if (arg === '--model' && i + 1 < args.length) {
            options.model = args[++i];
        } else if (arg === '--limit' && i + 1 < args.length) {
            options.limit = parseInt(args[++i], 10);
        } else if (arg === '--seed' && i + 1 < args.length) {
            options.seed = parseInt(args[++i], 10);
        } else if (arg === '--output-dir' && i + 1 < args.length) {
            options.outputDir = path.resolve(args[++i]);
        } else if (arg === '--task2-dir' && i + 1 < args.length) {
            options.task2Dir = path.resolve(args[++i]);
        } else if (arg === '--verbose' || arg === '-v') {
            options.verbose = true;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }
    }

    return options;
}

function printHelp() {
    console.log(`
Usage: npx ts-node scripts/benchmark/runBenchmark.ts [options]

Options:
  --prover <rocq|lean|both>    Prover to benchmark (default: both)
  --theorem <name>             Target specific theorem (e.g. reverse_task)
  --mode <mini|full>           Evaluation mode: mini (3 per theorem) or full (all pairs) (default: mini)
  --backend <antigravity-cli|portkey> LLM backend to evaluate (default: antigravity-cli)
  --model <id>                 Model identifier (e.g. gemini-3.1-pro-high, @GCP-public-dataset-integration/gemini-3.1-pro-preview)
  --limit <N>                  Limit tasks: if even, 50% Rocq / 50% Lean randomly; if odd, randomly assigns +1 to one prover
  --seed <N>                   Optional random seed for reproducible task sampling
  --output-dir <path>          Directory to save benchmark run results (default: ./benchmark_results)
  --task2-dir <path>           Path to task2 data directory
  --verbose, -v                Print detailed tool activities and agent text to stdout
  --help, -h                   Show this help message
`);
}

function createRng(seed?: number): () => number {
    if (seed === undefined) {
        return Math.random;
    }
    let a = seed >>> 0;
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffleArray<T>(array: T[], rng: () => number): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function sampleBalancedTasks(
    tasks: BenchmarkTask[],
    limit: number,
    proverChoice: 'rocq' | 'lean' | 'both',
    rng: () => number = Math.random
): BenchmarkTask[] {
    if (!limit || limit <= 0 || limit >= tasks.length) {
        return tasks;
    }

    if (proverChoice !== 'both') {
        return shuffleArray(tasks, rng).slice(0, limit);
    }

    const rocqTasks = tasks.filter((t) => t.prover === 'rocq');
    const leanTasks = tasks.filter((t) => t.prover === 'lean');

    let rocqTarget: number;
    let leanTarget: number;

    if (limit % 2 === 0) {
        rocqTarget = limit / 2;
        leanTarget = limit / 2;
    } else {
        const extraToRocq = rng() < 0.5;
        rocqTarget = extraToRocq ? Math.ceil(limit / 2) : Math.floor(limit / 2);
        leanTarget = limit - rocqTarget;
    }

    if (rocqTarget > rocqTasks.length) {
        const excess = rocqTarget - rocqTasks.length;
        rocqTarget = rocqTasks.length;
        leanTarget = Math.min(leanTasks.length, leanTarget + excess);
    } else if (leanTarget > leanTasks.length) {
        const excess = leanTarget - leanTasks.length;
        leanTarget = leanTasks.length;
        rocqTarget = Math.min(rocqTasks.length, rocqTarget + excess);
    }

    const sampledRocq = shuffleArray(rocqTasks, rng).slice(0, rocqTarget);
    const sampledLean = shuffleArray(leanTasks, rng).slice(0, leanTarget);

    // Interleave tasks (Rocq, Lean, Rocq, Lean, ...)
    const result: BenchmarkTask[] = [];
    const maxLen = Math.max(sampledRocq.length, sampledLean.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < sampledRocq.length) result.push(sampledRocq[i]);
        if (i < sampledLean.length) result.push(sampledLean[i]);
    }

    return result;
}

async function resolveModelAdapter(backend: 'antigravity-cli' | 'portkey', modelId?: string) {
    if (backend === 'antigravity-cli') {
        const binPath = findAgyBinaryPath();
        const effectiveModel = modelId || 'gemini-3.1-pro-high';
        console.log(`[Backend] Antigravity CLI at "${binPath}", model: "${effectiveModel}"`);
        return createAntigravityCliAdapter(effectiveModel, binPath);
    } else {
        const apiKey = process.env.PORTKEY_API_KEY;
        if (!apiKey) {
            throw new Error('PORTKEY_API_KEY environment variable is required for portkey backend.');
        }
        const effectiveModel = modelId || '@GCP-public-dataset-integration/gemini-3.1-pro-preview';
        console.log(`[Backend] Portkey Gateway, model: "${effectiveModel}"`);
        return await createPortkeyAdapter(apiKey, effectiveModel);
    }
}

async function runSingleTask(
    task: BenchmarkTask,
    modelAdapter: any,
    verbose: boolean
): Promise<TaskBenchmarkResult> {
    const responses: string[] = [];
    const handle = createHeadlessProverTools(
        task.prover,
        task.prefixCode,
        task.initialState,
        task.desiredState,
        (name, args, result) => {
            if (verbose) {
                console.log(`    ↳ [TOOL] ${name}(${JSON.stringify(args)})`);
                const preview = result.length > 120 ? result.slice(0, 120) + '...' : result;
                console.log(`      [RES]  ${preview.replace(/\n/g, ' ')}`);
            }
        }
    );

    const proofStateChange: ProverProofStateChange = {
        originalValue: task.initialState,
        desiredValue: task.desiredState,
    };

    const startTime = Date.now();
    let taskError: string | undefined;

    try {
        await runProverAgent(
            Promise.resolve({} as any),
            modelAdapter,
            proofStateChange,
            handle.tools,
            (text: string) => {
                responses.push(text);
                if (verbose && text.trim()) {
                    console.log(`    ↳ [AGENT] ${text.trim().replace(/\n/g, ' ')}`);
                }
            },
            (activity) => {
                if (verbose && activity.kind === 'status') {
                    console.log(`    ↳ [STATUS] ${activity.detail}`);
                }
            },
            () => {},
            undefined,
            task.prover === 'rocq' ? 'Coq' : 'Lean'
        );
    } catch (e: any) {
        taskError = e?.message || String(e);
    }

    const durationMs = Date.now() - startTime;
    const success = handle.isSuccessful();

    return {
        taskId: task.id,
        prover: task.prover,
        theorem: task.theorem,
        initialStage: task.initialStageId,
        targetStage: task.targetStageId,
        tier: task.tier,
        editDistance: task.editDistance,
        success,
        winningAddition: handle.getWinningAddition(),
        validationAttempts: handle.getAttemptCount(),
        recoveredFromError: handle.isRecovered(),
        toolCallCount: handle.getToolCallLogs().length,
        toolCalls: handle.getToolCallLogs(),
        agentResponses: responses,
        durationMs,
        error: taskError,
    };
}

export async function main() {
    const opts = parseCliArgs();

    console.log('===============================================================');
    console.log('       OUTPUT-DIRECTED THEOREM PROVING BENCHMARK RUNNER        ');
    console.log('===============================================================');
    console.log(`Mode:       ${opts.mode.toUpperCase()}`);
    console.log(`Prover:     ${opts.prover.toUpperCase()}`);
    console.log(`Backend:    ${opts.backend}`);
    if (opts.theorem) console.log(`Theorem:    ${opts.theorem}`);
    if (opts.limit) console.log(`Limit:      ${opts.limit} tasks`);
    console.log(`Output Dir: ${opts.outputDir}`);
    console.log('---------------------------------------------------------------');

    let allTasks = loadBenchmarkSuite({
        mode: opts.mode,
        prover: opts.prover,
        theorem: opts.theorem,
        task2Dir: opts.task2Dir,
    });

    if (opts.taskIds && opts.taskIds.length > 0) {
        allTasks = allTasks.filter((t) =>
            opts.taskIds!.some((id) => t.id === id || t.id.includes(id))
        );
    }

    const rng = createRng(opts.seed);
    if (opts.limit && opts.limit > 0) {
        allTasks = sampleBalancedTasks(allTasks, opts.limit, opts.prover, rng);
    }

    if (allTasks.length === 0) {
        console.error('No tasks found to run with current filter.');
        process.exit(1);
    }

    const rocqCount = allTasks.filter((t) => t.prover === 'rocq').length;
    const leanCount = allTasks.filter((t) => t.prover === 'lean').length;
    console.log(`Loaded ${allTasks.length} task(s) to evaluate (${rocqCount} Rocq, ${leanCount} Lean 4).\n`);

    const modelAdapter = await resolveModelAdapter(opts.backend, opts.model);

    const results: TaskBenchmarkResult[] = [];
    const suiteStartTime = Date.now();

    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        const taskLabel = `[${i + 1}/${allTasks.length}] [${task.prover.toUpperCase()}] ${task.theorem} (${task.initialStageId} -> ${task.targetStageId}, dist: ${task.editDistance}, tier: ${task.tier})`;
        process.stdout.write(`${taskLabel} ... `);

        const result = await runSingleTask(task, modelAdapter, opts.verbose);
        results.push(result);

        const durSec = (result.durationMs / 1000).toFixed(2);
        if (result.success) {
            const recoveryTag = result.recoveredFromError ? ' [RECOVERED after retry]' : '';
            console.log(`✔ PASS (${durSec}s, ${result.validationAttempts} attempt(s), ${result.toolCallCount} tools)${recoveryTag}`);
            if (result.winningAddition) {
                const oneLine = result.winningAddition.replace(/\s+/g, ' ').slice(0, 80);
                console.log(`    Tactic: "${oneLine}"`);
            }
        } else {
            console.log(`✘ FAIL (${durSec}s, ${result.validationAttempts} attempt(s))`);
            if (result.error) {
                console.log(`    Error: ${result.error}`);
            }
        }
    }

    const suiteDurationMs = Date.now() - suiteStartTime;

    // Aggregate statistics
    const totalTasks = results.length;
    const successfulTasks = results.filter((r) => r.success).length;
    const overallPassRate = totalTasks > 0 ? (successfulTasks / totalTasks) * 100 : 0;
    const avgDurationMs = totalTasks > 0 ? suiteDurationMs / totalTasks : 0;

    const rocqTasks = results.filter((r) => r.prover === 'rocq');
    const rocqSuccess = rocqTasks.filter((r) => r.success).length;
    const rocqDurTotal = rocqTasks.reduce((acc, r) => acc + r.durationMs, 0);

    const leanTasks = results.filter((r) => r.prover === 'lean');
    const leanSuccess = leanTasks.filter((r) => r.success).length;
    const leanDurTotal = leanTasks.reduce((acc, r) => acc + r.durationMs, 0);

    const step1Tasks = results.filter((r) => r.tier === 'step1');
    const step1Success = step1Tasks.filter((r) => r.success).length;

    const multiTasks = results.filter((r) => r.tier === 'multistep');
    const multiSuccess = multiTasks.filter((r) => r.success).length;

    const compTasks = results.filter((r) => r.tier === 'completion');
    const compSuccess = compTasks.filter((r) => r.success).length;

    const retriesAttempted = results.filter((r) => r.validationAttempts > 1).length;
    const recoveredCount = results.filter((r) => r.recoveredFromError).length;
    const recoveryRate = retriesAttempted > 0 ? (recoveredCount / retriesAttempted) * 100 : 0;

    const report: BenchmarkSuiteReport = {
        timestamp: new Date().toISOString(),
        mode: opts.mode,
        backend: opts.backend,
        model: modelAdapter.model,
        totalTasks,
        successfulTasks,
        passRate: parseFloat(overallPassRate.toFixed(2)),
        avgDurationMs: Math.round(avgDurationMs),
        proverStats: {
            rocq: {
                total: rocqTasks.length,
                success: rocqSuccess,
                passRate: rocqTasks.length ? parseFloat(((rocqSuccess / rocqTasks.length) * 100).toFixed(2)) : 0,
                avgDurationMs: rocqTasks.length ? Math.round(rocqDurTotal / rocqTasks.length) : 0,
            },
            lean: {
                total: leanTasks.length,
                success: leanSuccess,
                passRate: leanTasks.length ? parseFloat(((leanSuccess / leanTasks.length) * 100).toFixed(2)) : 0,
                avgDurationMs: leanTasks.length ? Math.round(leanDurTotal / leanTasks.length) : 0,
            },
        },
        tierStats: {
            step1: {
                total: step1Tasks.length,
                success: step1Success,
                passRate: step1Tasks.length ? parseFloat(((step1Success / step1Tasks.length) * 100).toFixed(2)) : 0,
            },
            multistep: {
                total: multiTasks.length,
                success: multiSuccess,
                passRate: multiTasks.length ? parseFloat(((multiSuccess / multiTasks.length) * 100).toFixed(2)) : 0,
            },
            completion: {
                total: compTasks.length,
                success: compSuccess,
                passRate: compTasks.length ? parseFloat(((compSuccess / compTasks.length) * 100).toFixed(2)) : 0,
            },
        },
        recoveryStats: {
            retriesAttempted,
            recoveredCount,
            recoveryRate: parseFloat(recoveryRate.toFixed(2)),
        },
        results,
    };

    // Save report to disk
    if (!fs.existsSync(opts.outputDir)) {
        fs.mkdirSync(opts.outputDir, { recursive: true });
    }
    const safeTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outFilename = `run_${opts.mode}_${opts.prover}_${safeTimestamp}.json`;
    const outPath = path.join(opts.outputDir, outFilename);
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');

    // Also write a latest symlink or pointer
    const latestPath = path.join(opts.outputDir, `latest_${opts.mode}.json`);
    fs.writeFileSync(latestPath, JSON.stringify(report, null, 2), 'utf-8');

    // Print summary table
    console.log('\n===============================================================');
    console.log('                     BENCHMARK SUMMARY                         ');
    console.log('===============================================================');
    console.log(`Total Tasks:       ${totalTasks}`);
    console.log(`Pass Count:        ${successfulTasks} / ${totalTasks}`);
    console.log(`Pass Rate:         ${report.passRate}%`);
    console.log(`Total Duration:    ${(suiteDurationMs / 1000).toFixed(2)}s (avg ${(avgDurationMs / 1000).toFixed(2)}s/task)`);
    console.log('---------------------------------------------------------------');
    console.log('By Prover:');
    if (rocqTasks.length > 0) {
        console.log(`  Rocq:            ${rocqSuccess}/${rocqTasks.length} (${report.proverStats.rocq.passRate}%) [avg ${(report.proverStats.rocq.avgDurationMs / 1000).toFixed(2)}s]`);
    }
    if (leanTasks.length > 0) {
        console.log(`  Lean 4:          ${leanSuccess}/${leanTasks.length} (${report.proverStats.lean.passRate}%) [avg ${(report.proverStats.lean.avgDurationMs / 1000).toFixed(2)}s]`);
    }
    console.log('---------------------------------------------------------------');
    console.log('By Difficulty Tier:');
    console.log(`  Step 1 (dist=1): ${step1Success}/${step1Tasks.length} (${report.tierStats.step1.passRate}%)`);
    console.log(`  Multi-step Jump: ${multiSuccess}/${multiTasks.length} (${report.tierStats.multistep.passRate}%)`);
    console.log(`  Proof Completion:${compSuccess}/${compTasks.length} (${report.tierStats.completion.passRate}%)`);
    console.log('---------------------------------------------------------------');
    console.log('Multi-Turn Error Recovery:');
    console.log(`  Tasks with retries: ${retriesAttempted}`);
    console.log(`  Successful retry recoveries: ${recoveredCount} (${report.recoveryStats.recoveryRate}%)`);
    console.log('===============================================================');
    console.log(`Report saved to: ${outPath}`);
    console.log(`Latest pointer:  ${latestPath}`);
}

if (require.main === module) {
    main().catch((err) => {
        console.error('Benchmark fatal error:', err);
        process.exit(1);
    });
}
