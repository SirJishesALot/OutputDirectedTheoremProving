import * as fs from 'fs';
import * as path from 'path';

export interface StageData {
    stage_id: string;
    prefix_code: string;
    proof_state: string;
    active_goal?: string;
    sibling_goals?: string[];
    shelved_goals?: string[];
    tactic?: string;
}

export interface BenchmarkTask {
    id: string;
    prover: 'rocq' | 'lean';
    theorem: string;
    initialStageId: string;
    targetStageId: string;
    prefixCode: string;
    initialState: string;
    desiredState: string;
    initialActiveGoal?: string;
    initialSiblingGoals?: string[];
    initialShelvedGoals?: string[];
    desiredActiveGoal?: string;
    desiredSiblingGoals?: string[];
    desiredShelvedGoals?: string[];
    editDistance: number;
    isCompletion: boolean;
    tier: 'step1' | 'multistep' | 'completion';
}

export const THEOREM_NAMES = [
    'compiler_task',
    'mathexp_task1',
    'mathexp_task2',
    'mathexp_task3',
    'regexp_task1',
    'regexp_task2',
    'regexp_task3',
    'reverse_task',
    'skew_task',
    'update_task',
];

export function getDefaultTask2Dir(): string {
    return path.resolve(__dirname, '../../../outputdirected_benchmarking/task2');
}

export function loadTheoremStages(
    prover: 'rocq' | 'lean',
    theoremName: string,
    task2Dir: string = getDefaultTask2Dir()
): StageData[] {
    const stagesPath = path.join(task2Dir, prover, theoremName, 'stages.json');
    if (!fs.existsSync(stagesPath)) {
        throw new Error(`Stages file not found at: ${stagesPath}`);
    }

    const raw = fs.readFileSync(stagesPath, 'utf-8');
    const data = JSON.parse(raw);
    const list: StageData[] = Array.isArray(data) ? data : Object.values(data);

    // Sort numerically S_1, S_2, ...
    list.sort((a, b) => {
        const numA = parseInt(a.stage_id.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.stage_id.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
    });

    return list;
}

/**
 * Generates all candidate pairs (S_i, S_j) for a given theorem.
 */
export function generatePairsForTheorem(
    prover: 'rocq' | 'lean',
    theoremName: string,
    mode: 'mini' | 'full' = 'mini',
    task2Dir: string = getDefaultTask2Dir()
): BenchmarkTask[] {
    const stages = loadTheoremStages(prover, theoremName, task2Dir);
    const n = stages.length;
    if (n < 2) return [];

    const allPairs: BenchmarkTask[] = [];

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const so = stages[i];
            const sk = stages[j];
            const editDistance = j - i;
            const isCompletion = j === n - 1;

            let tier: 'step1' | 'multistep' | 'completion' = 'multistep';
            if (editDistance === 1) tier = 'step1';
            else if (isCompletion) tier = 'completion';

            allPairs.push({
                id: `${prover}-${theoremName}-${so.stage_id}->${sk.stage_id}`,
                prover,
                theorem: theoremName,
                initialStageId: so.stage_id,
                targetStageId: sk.stage_id,
                prefixCode: so.prefix_code,
                initialState: so.proof_state,
                desiredState: sk.proof_state,
                initialActiveGoal: so.active_goal,
                initialSiblingGoals: so.sibling_goals,
                initialShelvedGoals: so.shelved_goals,
                desiredActiveGoal: sk.active_goal,
                desiredSiblingGoals: sk.sibling_goals,
                desiredShelvedGoals: sk.shelved_goals,
                editDistance,
                isCompletion,
                tier,
            });
        }
    }

    if (mode === 'full') {
        return allPairs;
    }

    // Mini mode: sample 1 immediate step, 1 intermediate jump, 1 completion
    const miniTasks: BenchmarkTask[] = [];

    // 1. Immediate step: preferably S_1 -> S_2
    const step1 = allPairs.find((p) => p.initialStageId === 'S_1' && p.tier === 'step1') ||
        allPairs.find((p) => p.tier === 'step1');
    if (step1) miniTasks.push(step1);

    // 2. Intermediate jump: e.g. S_2 -> S_5 or distance between 2 and 4
    const multistep = allPairs.find((p) => p.editDistance >= 2 && p.editDistance <= 4 && !p.isCompletion) ||
        allPairs.find((p) => p.editDistance >= 2 && !p.isCompletion);
    if (multistep) miniTasks.push(multistep);

    // 3. Completion step: from an intermediate stage (e.g. S_2 or mid) to final S_N
    const midIdx = Math.floor(n / 2);
    const completion = allPairs.find((p) => p.isCompletion && p.initialStageId === stages[midIdx]?.stage_id) ||
        allPairs.find((p) => p.isCompletion);
    if (completion && !miniTasks.some((t) => t.id === completion.id)) {
        miniTasks.push(completion);
    }

    return miniTasks;
}

/**
 * Loads all benchmark tasks according to options.
 */
export function loadBenchmarkSuite(options: {
    mode?: 'mini' | 'full';
    prover?: 'rocq' | 'lean' | 'both';
    theorem?: string;
    task2Dir?: string;
}): BenchmarkTask[] {
    const mode = options.mode || 'mini';
    const proverChoice = options.prover || 'both';
    const provers: Array<'rocq' | 'lean'> =
        proverChoice === 'both' ? ['rocq', 'lean'] : [proverChoice];

    const theorems = options.theorem ? [options.theorem] : THEOREM_NAMES;
    const allTasks: BenchmarkTask[] = [];

    for (const p of provers) {
        for (const th of theorems) {
            try {
                const tasks = generatePairsForTheorem(p, th, mode, options.task2Dir);
                allTasks.push(...tasks);
            } catch (err: any) {
                console.warn(`[DataLoader] Could not load ${p}/${th}: ${err.message}`);
            }
        }
    }

    return allTasks;
}
