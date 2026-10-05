import * as path from 'path';
import * as fs from 'fs';
import { BenchmarkSuiteReport, TaskBenchmarkResult } from './runBenchmark';
import { getDefaultTask2Dir } from './dataLoader';

interface MatchedComparison {
    taskId: string;
    prover: 'rocq' | 'lean';
    theorem: string;
    pairKey: string;
    tier: string;
    editDistance: number;
    agentSuccess: boolean;
    agentValidationAttempts: number;
    agentRecovered: boolean;
    agentWinningTactic: string | null;
    baselinePassAt1: number;
    baselineSamplesCount: number;
    agentDurationMs: number;
}

export function compareRun(
    reportPath: string,
    task2Dir: string = getDefaultTask2Dir()
): {
    matched: MatchedComparison[];
    summary: {
        totalMatched: number;
        agentPassRate: number;
        baselinePassAt1Rate: number;
        delta: number;
        agentOnlySuccessCount: number;
        baselineOnlySuccessCount: number;
        tieSuccessCount: number;
        tieFailCount: number;
        recoveryCount: number;
    };
} {
    if (!fs.existsSync(reportPath)) {
        throw new Error(`Report file not found: ${reportPath}`);
    }

    const rawReport = fs.readFileSync(reportPath, 'utf-8');
    const report: BenchmarkSuiteReport = JSON.parse(rawReport);

    const baselineCache = new Map<string, any>();
    const matched: MatchedComparison[] = [];

    for (const task of report.results) {
        const cacheKey = `${task.prover}/${task.theorem}`;
        let baselineData = baselineCache.get(cacheKey);

        if (baselineData === undefined) {
            const baselinePath = path.join(task2Dir, task.prover, task.theorem, 'results_pairwise_gemini.json');
            if (fs.existsSync(baselinePath)) {
                try {
                    baselineData = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
                } catch {
                    baselineData = null;
                }
            } else {
                baselineData = null;
            }
            baselineCache.set(cacheKey, baselineData);
        }

        const pairKey = `${task.initialStage}->${task.targetStage}`;
        const baselineEntry = baselineData ? baselineData[pairKey] : null;

        if (baselineEntry) {
            matched.push({
                taskId: task.taskId,
                prover: task.prover,
                theorem: task.theorem,
                pairKey,
                tier: task.tier,
                editDistance: task.editDistance,
                agentSuccess: task.success,
                agentValidationAttempts: task.validationAttempts,
                agentRecovered: task.recoveredFromError,
                agentWinningTactic: task.winningAddition,
                baselinePassAt1: baselineEntry.pass_at_1 ?? (baselineEntry.successes > 0 ? 1.0 : 0.0),
                baselineSamplesCount: baselineEntry.total_attempts ?? 1,
                agentDurationMs: task.durationMs,
            });
        }
    }

    const total = matched.length;
    const agentPassed = matched.filter((m) => m.agentSuccess).length;
    const baselineSum = matched.reduce((acc, m) => acc + m.baselinePassAt1, 0);

    const agentPassRate = total > 0 ? (agentPassed / total) * 100 : 0;
    const baselinePassAt1Rate = total > 0 ? (baselineSum / total) * 100 : 0;
    const delta = agentPassRate - baselinePassAt1Rate;

    let agentOnlySuccessCount = 0;
    let baselineOnlySuccessCount = 0;
    let tieSuccessCount = 0;
    let tieFailCount = 0;

    for (const m of matched) {
        const bPassed = m.baselinePassAt1 >= 0.5;
        if (m.agentSuccess && !bPassed) agentOnlySuccessCount++;
        else if (!m.agentSuccess && bPassed) baselineOnlySuccessCount++;
        else if (m.agentSuccess && bPassed) tieSuccessCount++;
        else tieFailCount++;
    }

    const recoveryCount = matched.filter((m) => m.agentRecovered && m.agentSuccess).length;

    return {
        matched,
        summary: {
            totalMatched: total,
            agentPassRate: parseFloat(agentPassRate.toFixed(2)),
            baselinePassAt1Rate: parseFloat(baselinePassAt1Rate.toFixed(2)),
            delta: parseFloat(delta.toFixed(2)),
            agentOnlySuccessCount,
            baselineOnlySuccessCount,
            tieSuccessCount,
            tieFailCount,
            recoveryCount,
        },
    };
}

export function printComparison(reportPath: string, task2Dir: string = getDefaultTask2Dir()) {
    const { matched, summary } = compareRun(reportPath, task2Dir);

    console.log('===============================================================');
    console.log('       AGENT VS 1-SHOT BASELINE BENCHMARK COMPARISON           ');
    console.log('===============================================================');
    console.log(`Evaluated Run:     ${path.basename(reportPath)}`);
    console.log(`Matched Pairs:     ${summary.totalMatched}`);
    console.log(`Agent Pass Rate:   ${summary.agentPassRate}%`);
    console.log(`Baseline Pass@1:   ${summary.baselinePassAt1Rate}%`);
    console.log(`Net Advantage:     ${summary.delta >= 0 ? '+' : ''}${summary.delta}%`);
    console.log('---------------------------------------------------------------');
    console.log('Head-to-Head Breakdown:');
    console.log(`  Agent Won (Baseline failed, Agent passed):    ${summary.agentOnlySuccessCount}`);
    console.log(`  Baseline Won (Baseline passed, Agent failed): ${summary.baselineOnlySuccessCount}`);
    console.log(`  Both Succeeded:                               ${summary.tieSuccessCount}`);
    console.log(`  Both Failed:                                  ${summary.tieFailCount}`);
    console.log('---------------------------------------------------------------');
    console.log('Multi-Turn Agent Value-Add:');
    console.log(`  Recovered via Compiler Feedback:              ${summary.recoveryCount} tasks`);
    console.log('===============================================================');

    // Group by Prover
    for (const p of ['rocq', 'lean'] as const) {
        const pMatched = matched.filter((m) => m.prover === p);
        if (pMatched.length > 0) {
            const pAgentPassed = pMatched.filter((m) => m.agentSuccess).length;
            const pBaselineSum = pMatched.reduce((acc, m) => acc + m.baselinePassAt1, 0);
            const pAgentRate = (pAgentPassed / pMatched.length) * 100;
            const pBaseRate = (pBaselineSum / pMatched.length) * 100;
            const pDelta = pAgentRate - pBaseRate;
            console.log(`[${p.toUpperCase()}] Matched: ${pMatched.length} | Agent: ${pAgentRate.toFixed(1)}% | Baseline: ${pBaseRate.toFixed(1)}% | Delta: ${pDelta >= 0 ? '+' : ''}${pDelta.toFixed(1)}%`);
        }
    }

    // Group by Tier
    console.log('---------------------------------------------------------------');
    for (const tier of ['step1', 'multistep', 'completion']) {
        const tMatched = matched.filter((m) => m.tier === tier);
        if (tMatched.length > 0) {
            const tAgentPassed = tMatched.filter((m) => m.agentSuccess).length;
            const tBaselineSum = tMatched.reduce((acc, m) => acc + m.baselinePassAt1, 0);
            const tAgentRate = (tAgentPassed / tMatched.length) * 100;
            const tBaseRate = (tBaselineSum / tMatched.length) * 100;
            const tDelta = tAgentRate - tBaseRate;
            console.log(`[Tier: ${tier}] Matched: ${tMatched.length} | Agent: ${tAgentRate.toFixed(1)}% | Baseline: ${tBaseRate.toFixed(1)}% | Delta: ${tDelta >= 0 ? '+' : ''}${tDelta.toFixed(1)}%`);
        }
    }
    console.log('===============================================================');
}

function findLatestReport(outputDir: string): string | null {
    if (!fs.existsSync(outputDir)) return null;
    const latestMini = path.join(outputDir, 'latest_mini.json');
    if (fs.existsSync(latestMini)) return latestMini;

    const files = fs.readdirSync(outputDir)
        .filter((f) => f.startsWith('run_') && f.endsWith('.json'))
        .map((f) => path.join(outputDir, f))
        .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

    return files.length > 0 ? files[0] : null;
}

if (require.main === module) {
    const args = process.argv.slice(2);
    let runFile = '';
    let task2Dir = getDefaultTask2Dir();

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--run' && i + 1 < args.length) {
            runFile = path.resolve(args[++i]);
        } else if (args[i] === '--task2-dir' && i + 1 < args.length) {
            task2Dir = path.resolve(args[++i]);
        }
    }

    if (!runFile) {
        const defaultOutDir = path.resolve(__dirname, '../../benchmark_results');
        const latest = findLatestReport(defaultOutDir);
        if (!latest) {
            console.error('No benchmark run file specified and no recent run found in benchmark_results/');
            console.error('Usage: npx ts-node scripts/benchmark/compareWithBaseline.ts --run <path/to/run.json>');
            process.exit(1);
        }
        runFile = latest;
    }

    printComparison(runFile, task2Dir);
}
