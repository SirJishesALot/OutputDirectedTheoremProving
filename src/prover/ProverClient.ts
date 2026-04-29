import * as vscode from "vscode";

export interface NormalizedGoalHypothesis {
    name?: string;
    type: string;
    value?: string;
}

export interface NormalizedGoal {
    type: string;
    hypotheses: NormalizedGoalHypothesis[];
}

export interface NormalizedGoalState {
    goals: NormalizedGoal[];
    messages: string[];
    error?: string;
}

export interface ProverClient {
    initialize(): Promise<void>;
    getGoalState(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<NormalizedGoalState>;
    dispose(): void;
}
