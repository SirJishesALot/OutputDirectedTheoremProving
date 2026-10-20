import 'dotenv/config';
import './mockVscode';
import * as path from 'path';
import * as fs from 'fs';
import {
    loadTheoremStages,
    StageData,
    THEOREM_NAMES,
    getDefaultTask2Dir,
} from './dataLoader';
import {
    createHeadlessProverTools,
    ToolCallRecord,
    executeTactic,
    isProofCompleteState,
    normalizeState,
} from './headlessProver';
import { synthesizeDesiredState, UserAgentProposal } from './userAgent';
import { runProverAgent, ProverProofStateChange } from '../../src/llm/chatBridge';
import { createAntigravityCliAdapter, findAgyBinaryPath } from '../../src/llm/antigravityCliAdapter';
import { createPortkeyAdapter } from '../../src/llm/portkeyAdapter';

export interface SingleHopStageTask {
    id: string;
    prover: 'rocq' | 'lean';
    theorem: string;
    tier: 'single' | 'multistep';
    targetDistance: number;
    stageIndex: number;
    currentStage: StageData;
    targetStage?: StageData;
}

export interface SingleHopBenchmarkResult {
    taskId: string;
    prover: 'rocq' | 'lean';
    theorem: string;
    tier: 'single' | 'multistep';
    targetDistance: number;
    stageId: string;
    targetStageId?: string;
    userAgentIntent: string;
    userAgentDesiredState: string;
    userAgentRawResponse: string;
    success: boolean;
    winningAddition: string | null;
    validationAttempts: number;
    recoveredFromError: boolean;
    toolCallCount: number;
    toolCalls: ToolCallRecord[];
    agentResponses: string[];
    matchesGroundTruthTargetState: boolean;
    durationMs: number;
    error?: string;
}

export interface RolloutTurnRecord {
    turn: number;
    proofScriptBefore: string;
    proofStateBefore: string;
    userAgentIntent: string;
    desiredState: string;
    proverSuccess: boolean;
    winningAddition: string | null;
    validationAttempts: number;
    proofStateAfter?: string;
    isComplete?: boolean;
    durationMs: number;
    error?: string;
}

export interface RolloutBenchmarkResult {
    theoremId: string;
    prover: 'rocq' | 'lean';
    theorem: string;
    completed: boolean;
    turnsCount: number;
    successfulTransitions: number;
    failedTransitions: number;
    totalDurationMs: number;
    finalProofScript: string;
    turns: RolloutTurnRecord[];
    error?: string;
}

export type BenchmarkMode = 'single' | 'multistep' | 'completion' | 'all';

export interface CompletionTask {
    id: string;
    prover: 'rocq' | 'lean';
    theorem: string;
    initialStage: StageData;
}

export interface BenchmarkSuite {
    singleTasks: SingleHopStageTask[];
    multiTasks: SingleHopStageTask[];
    completionTasks: CompletionTask[];
}

export interface UserAgentBenchmarkReport {
    timestamp: string;
    mode: BenchmarkMode;
    backend: string;
    proverModel: string;
    userModel: string;
    maxTurns: number;
    seed: number;
    totalEvaluated: number;
    passRate: number;
    singleHopSummary?: {
        total: number;
        success: number;
        passRate: number;
        singleStepPassRate: number;
        multiStepPassRate: number;
        avgDurationMs: number;
    };
    completionSummary?: {
        totalTheorems: number;
        completedTheorems: number;
        completionRate: number;
        totalTransitions: number;
        successfulTransitions: number;
        transitionPassRate: number;
        avgTurns: number;
        avgDurationMs: number;
    };
    proverStats: {
        rocq: {
            singleHopTotal: number;
            singleHopSuccess: number;
            singleHopPassRate: number;
            completionTotal: number;
            completionSuccess: number;
            completionRate: number;
        };
        lean: {
            singleHopTotal: number;
            singleHopSuccess: number;
            singleHopPassRate: number;
            completionTotal: number;
            completionSuccess: number;
            completionRate: number;
        };
    };
    singleHopResults?: SingleHopBenchmarkResult[];
    rolloutResults?: RolloutBenchmarkResult[];
}

interface CliOptions {
    mode: BenchmarkMode;
    prover: 'rocq' | 'lean' | 'both';
    theorem?: string;
    count?: number;
    countPerTier?: number;
    backend: 'antigravity-cli' | 'portkey';
    userBackend?: 'antigravity-cli' | 'portkey';
    model?: string;
    userModel?: string;
    portkeyApiKey?: string;
    userPortkeyApiKey?: string;
    maxTurns: number;
    outputDir: string;
    task2Dir?: string;
    seed: number;
    verbose: boolean;
}

function parseCliArgs(): CliOptions {
    const args = process.argv.slice(2);
    const options: CliOptions = {
        mode: 'all',
        prover: 'both',
        backend: 'antigravity-cli',
        userModel: 'gemini-3.8-flash-medium',
        maxTurns: 15,
        outputDir: path.resolve(__dirname, '../../benchmark_results'),
        seed: 2026,
        verbose: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--mode' && i + 1 < args.length) {
            const val = args[++i].toLowerCase();
            if (val === 'single' || val === 'step1') options.mode = 'single';
            else if (val === 'multistep' || val === 'multi') options.mode = 'multistep';
            else if (val === 'completion' || val === 'rollout') options.mode = 'completion';
            else if (val === 'all' || val === 'balanced' || val === 'full') options.mode = 'all';
        } else if ((arg === '--eval-mode' || arg === '--evaluation-mode') && i + 1 < args.length) {
            const val = args[++i].toLowerCase();
            if (val === 'single') options.mode = 'single';
            else if (val === 'rollout' || val === 'completion') options.mode = 'completion';
            else if (val === 'all') options.mode = 'all';
        } else if (arg === '--tier-balanced') {
            options.mode = 'all';
        } else if (arg === '--count' && i + 1 < args.length) {
            options.count = parseInt(args[++i], 10);
        } else if (arg === '--limit' && i + 1 < args.length) {
            options.count = parseInt(args[++i], 10);
        } else if (arg === '--count-per-tier' && i + 1 < args.length) {
            options.countPerTier = parseInt(args[++i], 10);
        } else if (arg === '--prover' && i + 1 < args.length) {
            const val = args[++i].toLowerCase();
            if (val === 'rocq' || val === 'coq') options.prover = 'rocq';
            else if (val === 'lean' || val === 'lean4') options.prover = 'lean';
            else if (val === 'both') options.prover = 'both';
        } else if (arg === '--theorem' && i + 1 < args.length) {
            options.theorem = args[++i];
        } else if (arg === '--backend' && i + 1 < args.length) {
            const val = args[++i].toLowerCase();
            if (val === 'portkey' || val === 'antigravity-cli') options.backend = val;
        } else if (arg === '--user-backend' && i + 1 < args.length) {
            const val = args[++i].toLowerCase();
            if (val === 'portkey' || val === 'antigravity-cli') options.userBackend = val;
        } else if (arg === '--portkey-api-key' && i + 1 < args.length) {
            options.portkeyApiKey = args[++i];
        } else if (arg === '--user-portkey-api-key' && i + 1 < args.length) {
            options.userPortkeyApiKey = args[++i];
        } else if (arg === '--model' && i + 1 < args.length) {
            options.model = args[++i];
        } else if (arg === '--user-model' && i + 1 < args.length) {
            options.userModel = args[++i];
        } else if (arg === '--max-turns' && i + 1 < args.length) {
            options.maxTurns = parseInt(args[++i], 10);
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
Usage: npx ts-node scripts/benchmark/runUserAgentBenchmark.ts [options]

Task 3: Universal User-Agent-Directed Benchmark Runner
Evaluates human simulator (User Agent) + multi-tool prover agent collaboration.

Modes:
  --mode <single|multistep|completion|all>
      single      Evaluate single-step transitions (distance = 1)
      multistep   Evaluate intermediate multi-step milestone jumps (distance >= 2)
      completion  Evaluate full proof rollouts from theorem start (S_1) to completion
      all         Comprehensive suite combining single, multistep, and completion (default: all)

Options:
  --count <N>                   Total number of tasks to run across chosen mode (e.g. 10, 20, 30)
  --count-per-tier <N>          Number of tasks per tier per prover (e.g. 5)
  --prover <rocq|lean|both>     Prover to benchmark (default: both)
  --theorem <name>              Target specific theorem (e.g. reverse_task)
  --max-turns <N>               Max interactive rollout turns per theorem (default: 15)
  --seed <N>                    Random seed for sampling (default: 2026)
  --backend <antigravity-cli|portkey> Multi-tool prover LLM backend (default: antigravity-cli)
  --user-backend <antigravity-cli|portkey> User agent LLM backend (default: same as --backend)
  --portkey-api-key <key>       API key for Portkey gateway (Multi-tool prover agent)
  --user-portkey-api-key <key>  API key for Portkey gateway (User agent)
  --model <id>                  Multi-tool prover model (default: gemini-3.1-pro-high)
  --user-model <id>             Human simulator user model (default: gemini-3.8-flash-medium)
  --output-dir <path>           Directory to save JSON report (default: ./benchmark_results)
  --verbose, -v                 Print detailed tool actions and agent thoughts
  --help, -h                    Show this help message
`);
}

async function resolveModelAdapter(
    backend: 'antigravity-cli' | 'portkey',
    modelId: string,
    apiKeyOverride?: string
) {
    if (backend === 'antigravity-cli') {
        const binPath = findAgyBinaryPath();
        return createAntigravityCliAdapter(modelId, binPath);
    } else {
        const apiKey = apiKeyOverride || process.env.PORTKEY_API_KEY;
        if (!apiKey) {
            throw new Error(
                'PORTKEY_API_KEY environment variable (or --portkey-api-key / --user-portkey-api-key) is required for portkey backend.'
            );
        }
        return await createPortkeyAdapter(apiKey, modelId);
    }
}

function createRng(seed: number = 42): () => number {
    let a = seed >>> 0;
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
    const c = [...arr];
    for (let i = c.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
}

/**
 * Universal benchmark task sampler:
 * Samples tasks across provers and categories with deterministic seeding.
 */
export function sampleBenchmarkSuite(options: {
    mode: BenchmarkMode;
    prover?: 'rocq' | 'lean' | 'both';
    theorem?: string;
    count?: number;
    countPerTier?: number;
    seed?: number;
    task2Dir?: string;
}): BenchmarkSuite {
    const proverChoice = options.prover || 'both';
    const provers: Array<'rocq' | 'lean'> = proverChoice === 'both' ? ['rocq', 'lean'] : [proverChoice];
    const rng = createRng(options.seed ?? 2026);

    const singleTasks: SingleHopStageTask[] = [];
    const multiTasks: SingleHopStageTask[] = [];
    const completionTasks: CompletionTask[] = [];

    let singleTargetPerProver = 0;
    let multiTargetPerProver = 0;
    let completionTargetPerProver = 0;

    if (options.countPerTier && options.countPerTier > 0) {
        if (options.mode === 'single' || options.mode === 'all') singleTargetPerProver = options.countPerTier;
        if (options.mode === 'multistep' || options.mode === 'all') multiTargetPerProver = options.countPerTier;
        if (options.mode === 'completion' || options.mode === 'all') completionTargetPerProver = options.countPerTier;
    } else {
        const total = options.count ?? (options.mode === 'all' ? 30 : 10);
        if (options.mode === 'single') {
            singleTargetPerProver = Math.max(1, Math.ceil(total / provers.length));
        } else if (options.mode === 'multistep') {
            multiTargetPerProver = Math.max(1, Math.ceil(total / provers.length));
        } else if (options.mode === 'completion') {
            completionTargetPerProver = Math.max(1, Math.ceil(total / provers.length));
        } else if (options.mode === 'all') {
            const perTierTotal = Math.max(1, Math.floor(total / 3));
            singleTargetPerProver = Math.max(1, Math.floor(perTierTotal / provers.length));
            multiTargetPerProver = Math.max(1, Math.floor(perTierTotal / provers.length));
            completionTargetPerProver = Math.max(1, Math.floor(perTierTotal / provers.length));
        }
    }

    for (const p of provers) {
        const theorems = options.theorem
            ? options.theorem.split(',').map((t) => t.trim()).filter(Boolean)
            : THEOREM_NAMES;

        // 1. Single-step tasks
        if (singleTargetPerProver > 0) {
            const shuffled = shuffle(theorems, rng);
            let count = 0;
            for (const th of shuffled) {
                if (count >= singleTargetPerProver) break;
                const stages = loadTheoremStages(p, th, options.task2Dir);
                if (stages.length >= 2) {
                    const idx = Math.min(Math.floor(rng() * Math.min(3, stages.length - 1)), stages.length - 2);
                    singleTasks.push({
                        id: `${p}-${th}-${stages[idx].stage_id}`,
                        prover: p,
                        theorem: th,
                        tier: 'single',
                        targetDistance: 1,
                        stageIndex: idx,
                        currentStage: stages[idx],
                        targetStage: stages[idx + 1],
                    });
                    count++;
                }
            }
        }

        // 2. Multi-step tasks
        if (multiTargetPerProver > 0) {
            const shuffled = shuffle(theorems, rng);
            let count = 0;
            for (const th of shuffled) {
                if (count >= multiTargetPerProver) break;
                const stages = loadTheoremStages(p, th, options.task2Dir);
                if (stages.length >= 4) {
                    const maxIdx = stages.length - 3;
                    const idx = Math.min(Math.floor(rng() * maxIdx), maxIdx);
                    const dist = Math.min(2 + Math.floor(rng() * 2), stages.length - 1 - idx);
                    multiTasks.push({
                        id: `${p}-${th}-${stages[idx].stage_id}-d${dist}`,
                        prover: p,
                        theorem: th,
                        tier: 'multistep',
                        targetDistance: dist,
                        stageIndex: idx,
                        currentStage: stages[idx],
                        targetStage: stages[idx + dist],
                    });
                    count++;
                }
            }
        }

        // 3. Completion tasks
        if (completionTargetPerProver > 0) {
            const shuffled = shuffle(theorems, rng);
            let count = 0;
            for (const th of shuffled) {
                if (count >= completionTargetPerProver) break;
                const stages = loadTheoremStages(p, th, options.task2Dir);
                if (stages.length >= 2) {
                    completionTasks.push({
                        id: `${p}-${th}-completion`,
                        prover: p,
                        theorem: th,
                        initialStage: stages[0],
                    });
                    count++;
                }
            }
        }
    }

    return { singleTasks, multiTasks, completionTasks };
}

/**
 * Backward compatibility helper for 20-task sampling.
 */
export function sampleTierBalancedTasks(options: {
    task2Dir?: string;
    seed?: number;
    countPerCategory?: number;
}): SingleHopStageTask[] {
    const suite = sampleBenchmarkSuite({
        mode: 'all',
        countPerTier: options.countPerCategory ?? 5,
        seed: options.seed ?? 2026,
        task2Dir: options.task2Dir,
    });
    return [...suite.singleTasks, ...suite.multiTasks];
}

/**
 * Loads single-hop stage tasks across the specified provers and theorems.
 */
function loadSingleHopTasks(options: {
    mode: 'mini' | 'full';
    prover: 'rocq' | 'lean' | 'both';
    theorem?: string;
    task2Dir?: string;
}): SingleHopStageTask[] {
    const provers: Array<'rocq' | 'lean'> =
        options.prover === 'both' ? ['rocq', 'lean'] : [options.prover];

    const theorems = options.theorem
        ? options.theorem.split(',').map((t) => t.trim()).filter(Boolean)
        : THEOREM_NAMES;

    const tasks: SingleHopStageTask[] = [];

    for (const p of provers) {
        for (const th of theorems) {
            try {
                const stages = loadTheoremStages(p, th, options.task2Dir);
                if (stages.length < 2) continue;

                if (options.mode === 'full') {
                    for (let i = 0; i < stages.length - 1; i++) {
                        tasks.push({
                            id: `${p}-${th}-${stages[i].stage_id}`,
                            prover: p,
                            theorem: th,
                            tier: 'single',
                            targetDistance: 1,
                            stageIndex: i,
                            currentStage: stages[i],
                            targetStage: stages[i + 1],
                        });
                    }
                } else {
                    tasks.push({
                        id: `${p}-${th}-${stages[0].stage_id}`,
                        prover: p,
                        theorem: th,
                        tier: 'single',
                        targetDistance: 1,
                        stageIndex: 0,
                        currentStage: stages[0],
                        targetStage: stages[1],
                    });

                    if (stages.length > 3) {
                        const mid = Math.floor(stages.length / 2);
                        tasks.push({
                            id: `${p}-${th}-${stages[mid].stage_id}`,
                            prover: p,
                            theorem: th,
                            tier: 'single',
                            targetDistance: 1,
                            stageIndex: mid,
                            currentStage: stages[mid],
                            targetStage: stages[mid + 1],
                        });
                    }
                }
            } catch (err: any) {
                console.warn(`[TaskLoader] Could not load stages for ${p}/${th}: ${err.message}`);
            }
        }
    }

    return tasks;
}

/**
 * Runs a single-hop benchmark task:
 * 1. User Agent synthesizes desired next state.
 * 2. Multi-tool agent attempts to bridge current state -> desired state.
 */
async function runSingleHopTask(
    task: SingleHopStageTask,
    userAgentModel: any,
    proverModel: any,
    verbose: boolean
): Promise<SingleHopBenchmarkResult> {
    const startTime = Date.now();
    let taskError: string | undefined;

    // Step 1: User Agent synthesizes desired next proof state
    let proposal: UserAgentProposal;
    try {
        proposal = await synthesizeDesiredState(
            {
                prover: task.prover,
                theorem: task.theorem,
                prefixCode: task.currentStage.prefix_code,
                currentState: task.currentStage.proof_state,
                tier: task.tier,
            },
            userAgentModel
        );
    } catch (e: any) {
        return {
            taskId: task.id,
            prover: task.prover,
            theorem: task.theorem,
            tier: task.tier,
            targetDistance: task.targetDistance,
            stageId: task.currentStage.stage_id,
            targetStageId: task.targetStage?.stage_id,
            userAgentIntent: 'Failed to synthesize state',
            userAgentDesiredState: '',
            userAgentRawResponse: '',
            success: false,
            winningAddition: null,
            validationAttempts: 0,
            recoveredFromError: false,
            toolCallCount: 0,
            toolCalls: [],
            agentResponses: [],
            matchesGroundTruthTargetState: false,
            durationMs: Date.now() - startTime,
            error: `User Agent error: ${e?.message || String(e)}`,
        };
    }

    if (verbose) {
        console.log(`\n    [USER AGENT INTENT] ${proposal.intent}`);
        const statePreview = proposal.desiredState.replace(/\n/g, ' ').slice(0, 100);
        console.log(`    [USER AGENT STATE]  ${statePreview}...`);
    }

    // Step 2: Set up headless prover tools with synthesized desired state
    const responses: string[] = [];
    const handle = createHeadlessProverTools(
        task.prover,
        task.currentStage.prefix_code,
        task.currentStage.proof_state,
        proposal.desiredState,
        (name, args, result) => {
            if (verbose) {
                console.log(`    ↳ [TOOL] ${name}(${JSON.stringify(args)})`);
                const preview = result.length > 120 ? result.slice(0, 120) + '...' : result;
                console.log(`      [RES]  ${preview.replace(/\n/g, ' ')}`);
            }
        },
        {
            prover: task.prover,
            theoremName: task.theorem,
            userIntent: proposal.intent,
        }
    );

    const proofStateChange: ProverProofStateChange = {
        originalValue: task.currentStage.proof_state,
        desiredValue: proposal.desiredState,
    };

    // Step 3: Run multi-tool prover agent
    try {
        await runProverAgent(
            Promise.resolve({} as any),
            proverModel,
            proofStateChange,
            handle.tools,
            (text: string) => {
                responses.push(text);
                if (verbose && text.trim()) {
                    console.log(`    ↳ [PROVER AGENT] ${text.trim().replace(/\n/g, ' ')}`);
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

    // Check if synthesized state matched ground truth target stage
    let matchesGroundTruth = false;
    if (task.targetStage) {
        const normDesired = normalizeState(proposal.desiredState);
        const normGt = normalizeState(task.targetStage.proof_state);
        matchesGroundTruth =
            normDesired.length > 0 &&
            (normDesired === normGt || normDesired.includes(normGt) || normGt.includes(normDesired));
    }

    return {
        taskId: task.id,
        prover: task.prover,
        theorem: task.theorem,
        tier: task.tier,
        targetDistance: task.targetDistance,
        stageId: task.currentStage.stage_id,
        targetStageId: task.targetStage?.stage_id,
        userAgentIntent: proposal.intent,
        userAgentDesiredState: proposal.desiredState,
        userAgentRawResponse: proposal.rawResponse,
        success,
        winningAddition: handle.getWinningAddition(),
        validationAttempts: handle.getAttemptCount(),
        recoveredFromError: handle.isRecovered(),
        toolCallCount: handle.getToolCallLogs().length,
        toolCalls: handle.getToolCallLogs(),
        agentResponses: responses,
        matchesGroundTruthTargetState: matchesGroundTruth,
        durationMs,
        error: taskError,
    };
}

/**
 * Runs a multi-hop trajectory rollout for a theorem:
 * Alternates between User Agent (proposing next milestone) and Multi-Tool Agent
 * until proof is completed or max turns exceeded.
 */
async function runRolloutTrajectory(
    prover: 'rocq' | 'lean',
    theoremName: string,
    initialStage: StageData,
    userAgentModel: any,
    proverModel: any,
    maxTurns: number,
    verbose: boolean
): Promise<RolloutBenchmarkResult> {
    const startTime = Date.now();
    const turns: RolloutTurnRecord[] = [];

    let currentPrefix = initialStage.prefix_code;
    let currentState = initialStage.proof_state;
    let isCompleted = isProofCompleteState(currentState);

    let successfulTransitions = 0;
    let failedTransitions = 0;
    let theoremError: string | undefined;

    for (let turn = 1; turn <= maxTurns; turn++) {
        if (isCompleted) break;

        const turnStart = Date.now();
        if (verbose) {
            console.log(`\n  --- [TURN ${turn}/${maxTurns}] ${theoremName} (${prover.toUpperCase()}) ---`);
        }

        // 1. User Agent proposes next proof state
        let proposal: UserAgentProposal;
        try {
            proposal = await synthesizeDesiredState(
                {
                    prover,
                    theorem: theoremName,
                    prefixCode: currentPrefix,
                    currentState,
                },
                userAgentModel
            );
        } catch (e: any) {
            failedTransitions++;
            turns.push({
                turn,
                proofScriptBefore: currentPrefix,
                proofStateBefore: currentState,
                userAgentIntent: 'Failed to synthesize next state',
                desiredState: '',
                proverSuccess: false,
                winningAddition: null,
                validationAttempts: 0,
                durationMs: Date.now() - turnStart,
                error: `User Agent error: ${e?.message || String(e)}`,
            });
            break;
        }

        if (verbose) {
            console.log(`  [USER INTENT] ${proposal.intent}`);
            const statePreview = proposal.desiredState.replace(/\n/g, ' ').slice(0, 100);
            console.log(`  [USER TARGET] ${statePreview}...`);
        }

        // 2. Multi-tool agent searches for tactics to reach target state
        const handle = createHeadlessProverTools(
            prover,
            currentPrefix,
            currentState,
            proposal.desiredState,
            (name, args, result) => {
                if (verbose) {
                    console.log(`    ↳ [TOOL] ${name}(${JSON.stringify(args)})`);
                    const preview = result.length > 120 ? result.slice(0, 120) + '...' : result;
                    console.log(`      [RES]  ${preview.replace(/\n/g, ' ')}`);
                }
            },
            {
                prover,
                theoremName,
                userIntent: proposal.intent,
            }
        );

        const proofStateChange: ProverProofStateChange = {
            originalValue: currentState,
            desiredValue: proposal.desiredState,
        };

        try {
            await runProverAgent(
                Promise.resolve({} as any),
                proverModel,
                proofStateChange,
                handle.tools,
                () => {},
                (activity) => {
                    if (verbose && activity.kind === 'status') {
                        console.log(`    ↳ [STATUS] ${activity.detail}`);
                    }
                },
                () => {},
                undefined,
                prover === 'rocq' ? 'Coq' : 'Lean'
            );
        } catch (e: any) {
            theoremError = e?.message || String(e);
        }

        const proverSuccess = handle.isSuccessful();
        const winningAddition = handle.getWinningAddition();

        if (proverSuccess && winningAddition) {
            successfulTransitions++;
            const scriptBefore = currentPrefix;
            const stateBefore = currentState;

            // Execute tactic and advance the environment state
            const execResult = executeTactic(prover, currentPrefix, winningAddition);
            currentPrefix = `${currentPrefix}\n${winningAddition}`.trim();
            currentState = execResult.resultingState || '';
            isCompleted = Boolean(execResult.isComplete) || isProofCompleteState(currentState);

            turns.push({
                turn,
                proofScriptBefore: scriptBefore,
                proofStateBefore: stateBefore,
                userAgentIntent: proposal.intent,
                desiredState: proposal.desiredState,
                proverSuccess: true,
                winningAddition,
                validationAttempts: handle.getAttemptCount(),
                proofStateAfter: currentState,
                isComplete: isCompleted,
                durationMs: Date.now() - turnStart,
            });

            if (isCompleted) {
                if (verbose) console.log(`  🎉 Proof completed successfully at turn ${turn}!`);
                break;
            }
        } else {
            failedTransitions++;
            turns.push({
                turn,
                proofScriptBefore: currentPrefix,
                proofStateBefore: currentState,
                userAgentIntent: proposal.intent,
                desiredState: proposal.desiredState,
                proverSuccess: false,
                winningAddition: null,
                validationAttempts: handle.getAttemptCount(),
                durationMs: Date.now() - turnStart,
                error: theoremError || 'Prover failed to reach desired state',
            });
            // Stop rollout if prover agent could not bridge the gap
            break;
        }
    }

    return {
        theoremId: `${prover}-${theoremName}`,
        prover,
        theorem: theoremName,
        completed: isCompleted,
        turnsCount: turns.length,
        successfulTransitions,
        failedTransitions,
        totalDurationMs: Date.now() - startTime,
        finalProofScript: currentPrefix,
        turns,
        error: theoremError,
    };
}

export async function main() {
    const opts = parseCliArgs();

    const proverBackend = opts.backend;
    const userBackend = opts.userBackend || opts.backend;

    const defaultProverModel =
        proverBackend === 'portkey'
            ? '@GCP-public-dataset-integration/gemini-3.1-pro-preview'
            : 'gemini-3.1-pro-high';

    const defaultUserModel =
        userBackend === 'portkey'
            ? '@GCP-public-dataset-integration/gemini-3.8-flash-preview'
            : 'gemini-3.8-flash-medium';

    const effectiveProverModel = opts.model || defaultProverModel;
    const effectiveUserModel = opts.userModel || defaultUserModel;

    console.log('===============================================================');
    console.log('  TASK 3: UNIVERSAL USER-AGENT-DIRECTED THEOREM PROVER RUNNER  ');
    console.log('===============================================================');
    console.log(`Evaluation Mode: ${opts.mode.toUpperCase()}`);
    console.log(`Prover:          ${opts.prover.toUpperCase()}`);
    console.log(`Prover Backend:  ${proverBackend} (model: ${effectiveProverModel})`);
    console.log(`User Backend:    ${userBackend} (model: ${effectiveUserModel})`);
    if (opts.theorem)  console.log(`Theorem:         ${opts.theorem}`);
    if (opts.count)    console.log(`Task Count:      ${opts.count}`);
    console.log(`Max Turns:       ${opts.maxTurns}`);
    console.log(`Seed:            ${opts.seed}`);
    console.log(`Output Dir:      ${opts.outputDir}`);
    console.log('---------------------------------------------------------------');

    const proverModelAdapter = await resolveModelAdapter(
        proverBackend,
        effectiveProverModel,
        opts.portkeyApiKey
    );
    const userModelAdapter = await resolveModelAdapter(
        userBackend,
        effectiveUserModel,
        opts.userPortkeyApiKey || opts.portkeyApiKey
    );

    const suiteStartTime = Date.now();

    // Sample benchmark suite
    const suite = sampleBenchmarkSuite({
        mode: opts.mode,
        prover: opts.prover,
        theorem: opts.theorem,
        count: opts.count,
        countPerTier: opts.countPerTier,
        seed: opts.seed,
        task2Dir: opts.task2Dir,
    });

    const singleHopTasks = [...suite.singleTasks, ...suite.multiTasks];
    console.log(
        `Planned tasks: ${suite.singleTasks.length} Single-Step, ${suite.multiTasks.length} Multi-Step, ${suite.completionTasks.length} Completion (Total: ${singleHopTasks.length + suite.completionTasks.length})\n`
    );

    // 1. Run Single-Hop Stage Tasks
    const singleHopResults: SingleHopBenchmarkResult[] = [];
    if (singleHopTasks.length > 0) {
        console.log(`=== RUNNING SINGLE-HOP STAGE EVALUATION (${singleHopTasks.length} tasks) ===\n`);
        for (let i = 0; i < singleHopTasks.length; i++) {
            const task = singleHopTasks[i];
            const targetLabel = task.targetStage ? ` -> ${task.targetStage.stage_id}` : '';
            const label = `[${i + 1}/${singleHopTasks.length}] [${task.prover.toUpperCase()}] ${task.theorem} (${task.currentStage.stage_id}${targetLabel}, ${task.tier}, d=${task.targetDistance})`;
            process.stdout.write(`${label} ... `);

            const res = await runSingleHopTask(task, userModelAdapter, proverModelAdapter, opts.verbose);
            singleHopResults.push(res);

            const durSec = (res.durationMs / 1000).toFixed(2);
            if (res.success) {
                const recTag = res.recoveredFromError ? ' [RECOVERED]' : '';
                const gtTag = res.matchesGroundTruthTargetState ? ' [MATCHES GT]' : '';
                console.log(`✔ PASS (${durSec}s, ${res.validationAttempts} attempt(s))${recTag}${gtTag}`);
                if (res.winningAddition) {
                    const oneLine = res.winningAddition.replace(/\s+/g, ' ').slice(0, 80);
                    console.log(`    Tactic: "${oneLine}"`);
                }
            } else {
                console.log(`✘ FAIL (${durSec}s, ${res.validationAttempts} attempt(s))`);
                if (res.error) console.log(`    Error: ${res.error}`);
            }
        }
    }

    // 2. Run Completion Rollout Tasks
    const rolloutResults: RolloutBenchmarkResult[] = [];
    if (suite.completionTasks.length > 0) {
        console.log(`\n=== RUNNING PROOF COMPLETION EVALUATION (${suite.completionTasks.length} theorems, max ${opts.maxTurns} turns) ===\n`);
        for (let i = 0; i < suite.completionTasks.length; i++) {
            const target = suite.completionTasks[i];
            const label = `[${i + 1}/${suite.completionTasks.length}] [${target.prover.toUpperCase()}] ${target.theorem}`;
            console.log(`Starting trajectory: ${label}...`);

            const res = await runRolloutTrajectory(
                target.prover,
                target.theorem,
                target.initialStage,
                userModelAdapter,
                proverModelAdapter,
                opts.maxTurns,
                opts.verbose
            );
            rolloutResults.push(res);

            const durSec = (res.totalDurationMs / 1000).toFixed(2);
            if (res.completed) {
                console.log(`✔ THEOREM PROVED (${durSec}s, ${res.turnsCount} turns, ${res.successfulTransitions} steps)`);
            } else {
                console.log(`✘ INCOMPLETE (${durSec}s, ${res.turnsCount} turns, ${res.successfulTransitions} succeeded, ${res.failedTransitions} failed)`);
            }
        }
    }

    // Compute Metrics
    const totalSingleHops = singleHopResults.length;
    const singleHopSuccess = singleHopResults.filter((r) => r.success).length;
    const singleHopPassRate = totalSingleHops > 0 ? (singleHopSuccess / totalSingleHops) * 100 : 0;

    const singleStepTasks = singleHopResults.filter((r) => r.tier === 'single');
    const singleStepSuccess = singleStepTasks.filter((r) => r.success).length;
    const singleStepPassRate = singleStepTasks.length > 0 ? (singleStepSuccess / singleStepTasks.length) * 100 : 0;

    const multiStepTasks = singleHopResults.filter((r) => r.tier === 'multistep');
    const multiStepSuccess = multiStepTasks.filter((r) => r.success).length;
    const multiStepPassRate = multiStepTasks.length > 0 ? (multiStepSuccess / multiStepTasks.length) * 100 : 0;

    const totalRollouts = rolloutResults.length;
    const rolloutCompleted = rolloutResults.filter((r) => r.completed).length;
    const rolloutPassRate = totalRollouts > 0 ? (rolloutCompleted / totalRollouts) * 100 : 0;
    const allRolloutTurns = rolloutResults.flatMap((r) => r.turns);
    const succTransitions = allRolloutTurns.filter((t) => t.proverSuccess).length;
    const transitionPassRate = allRolloutTurns.length > 0 ? (succTransitions / allRolloutTurns.length) * 100 : 0;
    const avgTurns = totalRollouts > 0 ? allRolloutTurns.length / totalRollouts : 0;

    const totalEvaluated = totalSingleHops + totalRollouts;
    const totalSuccess = singleHopSuccess + rolloutCompleted;
    const compositePassRate = totalEvaluated > 0 ? (totalSuccess / totalEvaluated) * 100 : 0;

    // Prover breakdowns
    const rocqSingle = singleHopResults.filter((r) => r.prover === 'rocq');
    const rocqSingleSucc = rocqSingle.filter((r) => r.success).length;
    const rocqRollout = rolloutResults.filter((r) => r.prover === 'rocq');
    const rocqRolloutSucc = rocqRollout.filter((r) => r.completed).length;

    const leanSingle = singleHopResults.filter((r) => r.prover === 'lean');
    const leanSingleSucc = leanSingle.filter((r) => r.success).length;
    const leanRollout = rolloutResults.filter((r) => r.prover === 'lean');
    const leanRolloutSucc = leanRollout.filter((r) => r.completed).length;

    const report: UserAgentBenchmarkReport = {
        timestamp: new Date().toISOString(),
        mode: opts.mode,
        backend: proverBackend === userBackend ? proverBackend : `${proverBackend} (prover) / ${userBackend} (user)`,
        proverModel: proverModelAdapter.model,
        userModel: userModelAdapter.model,
        maxTurns: opts.maxTurns,
        seed: opts.seed,
        totalEvaluated,
        passRate: parseFloat(compositePassRate.toFixed(2)),
        singleHopSummary: totalSingleHops > 0 ? {
            total: totalSingleHops,
            success: singleHopSuccess,
            passRate: parseFloat(singleHopPassRate.toFixed(2)),
            singleStepPassRate: parseFloat(singleStepPassRate.toFixed(2)),
            multiStepPassRate: parseFloat(multiStepPassRate.toFixed(2)),
            avgDurationMs: Math.round(singleHopResults.reduce((a, b) => a + b.durationMs, 0) / totalSingleHops),
        } : undefined,
        completionSummary: totalRollouts > 0 ? {
            totalTheorems: totalRollouts,
            completedTheorems: rolloutCompleted,
            completionRate: parseFloat(rolloutPassRate.toFixed(2)),
            totalTransitions: allRolloutTurns.length,
            successfulTransitions: succTransitions,
            transitionPassRate: parseFloat(transitionPassRate.toFixed(2)),
            avgTurns: parseFloat(avgTurns.toFixed(2)),
            avgDurationMs: Math.round(rolloutResults.reduce((a, b) => a + b.totalDurationMs, 0) / totalRollouts),
        } : undefined,
        proverStats: {
            rocq: {
                singleHopTotal: rocqSingle.length,
                singleHopSuccess: rocqSingleSucc,
                singleHopPassRate: rocqSingle.length ? parseFloat(((rocqSingleSucc / rocqSingle.length) * 100).toFixed(2)) : 0,
                completionTotal: rocqRollout.length,
                completionSuccess: rocqRolloutSucc,
                completionRate: rocqRollout.length ? parseFloat(((rocqRolloutSucc / rocqRollout.length) * 100).toFixed(2)) : 0,
            },
            lean: {
                singleHopTotal: leanSingle.length,
                singleHopSuccess: leanSingleSucc,
                singleHopPassRate: leanSingle.length ? parseFloat(((leanSingleSucc / leanSingle.length) * 100).toFixed(2)) : 0,
                completionTotal: leanRollout.length,
                completionSuccess: leanRolloutSucc,
                completionRate: leanRollout.length ? parseFloat(((leanRolloutSucc / leanRollout.length) * 100).toFixed(2)) : 0,
            },
        },
        singleHopResults: singleHopResults.length > 0 ? singleHopResults : undefined,
        rolloutResults: rolloutResults.length > 0 ? rolloutResults : undefined,
    };

    // Save Reports
    if (!fs.existsSync(opts.outputDir)) {
        fs.mkdirSync(opts.outputDir, { recursive: true });
    }
    const safeTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outFilename = `task3_${opts.mode}_${opts.prover}_${safeTimestamp}.json`;
    const outPath = path.join(opts.outputDir, outFilename);
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');

    const latestPath = path.join(opts.outputDir, `latest_task3_${opts.mode}.json`);
    fs.writeFileSync(latestPath, JSON.stringify(report, null, 2), 'utf-8');

    // Also link latest_task3_single and latest_task3_completion if present
    if (singleHopResults.length > 0) {
        const latestSingle = path.join(opts.outputDir, `latest_task3_single.json`);
        fs.writeFileSync(latestSingle, JSON.stringify(report, null, 2), 'utf-8');
    }
    if (rolloutResults.length > 0) {
        const latestComp = path.join(opts.outputDir, `latest_task3_completion.json`);
        fs.writeFileSync(latestComp, JSON.stringify(report, null, 2), 'utf-8');
    }

    // Print summary dashboard
    console.log('\n===============================================================');
    console.log('              TASK 3 BENCHMARK SUMMARY DASHBOARD               ');
    console.log('===============================================================');
    console.log(`Evaluation Mode:         ${opts.mode.toUpperCase()}`);
    console.log(`Total Tasks Evaluated:   ${totalEvaluated}`);
    console.log(`Overall Pass Rate:       ${report.passRate}%`);
    if (totalSingleHops > 0) {
        console.log('---------------------------------------------------------------');
        console.log('Single-Hop Stage Tasks:');
        console.log(`  Combined Pass Rate:    ${singleHopSuccess}/${totalSingleHops} (${singleHopPassRate.toFixed(1)}%)`);
        console.log(`  Single-Step (d=1):     ${singleStepSuccess}/${singleStepTasks.length} (${singleStepPassRate.toFixed(1)}%)`);
        console.log(`  Multi-Step (d>=2):     ${multiStepSuccess}/${multiStepTasks.length} (${multiStepPassRate.toFixed(1)}%)`);
    }
    if (totalRollouts > 0) {
        console.log('---------------------------------------------------------------');
        console.log('Proof Completion Rollouts:');
        console.log(`  Theorems Proved:       ${rolloutCompleted}/${totalRollouts} (${rolloutPassRate.toFixed(1)}%)`);
        console.log(`  Step Transitions:      ${succTransitions}/${allRolloutTurns.length} (${transitionPassRate.toFixed(1)}%)`);
        console.log(`  Average Turns/Theorem: ${avgTurns.toFixed(1)}`);
    }
    console.log('---------------------------------------------------------------');
    console.log('Performance by Prover:');
    if (rocqSingle.length > 0 || rocqRollout.length > 0) {
        const rocqCompStr = rocqRollout.length ? `, Proved: ${rocqRolloutSucc}/${rocqRollout.length} (${report.proverStats.rocq.completionRate}%)` : '';
        console.log(`  Rocq:   Single-Hop: ${rocqSingleSucc}/${rocqSingle.length} (${report.proverStats.rocq.singleHopPassRate}%)${rocqCompStr}`);
    }
    if (leanSingle.length > 0 || leanRollout.length > 0) {
        const leanCompStr = leanRollout.length ? `, Proved: ${leanRolloutSucc}/${leanRollout.length} (${report.proverStats.lean.completionRate}%)` : '';
        console.log(`  Lean 4: Single-Hop: ${leanSingleSucc}/${leanSingle.length} (${report.proverStats.lean.singleHopPassRate}%)${leanCompStr}`);
    }
    console.log('===============================================================');
    console.log(`Report saved to: ${outPath}`);
    console.log(`Latest pointer:  ${latestPath}`);
}

if (require.main === module) {
    main().catch((err) => {
        console.error('Fatal Task 3 error:', err);
        process.exit(1);
    });
}
