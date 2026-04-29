import * as vscode from "vscode";
import { createCoqLspClient } from "../lsp/coqBuilders";
import { CoqLspClient } from "../lsp/coqLspClient";
import { convertToString, Hyp, PpString, ProofGoal } from "../lsp/coqLspTypes";
import { Uri } from "../utils/uri";
import {
    NormalizedGoal,
    NormalizedGoalHypothesis,
    NormalizedGoalState,
    ProverClient,
} from "./ProverClient";

function normalizeHypothesis(hyp: Hyp<PpString>): NormalizedGoalHypothesis {
    return {
        name: hyp.names?.length ? hyp.names.map((n) => convertToString(n)).join(" ") : undefined,
        type: convertToString(hyp.ty),
        value: hyp.def ? convertToString(hyp.def) : undefined,
    };
}

function normalizeGoal(goal: ProofGoal): NormalizedGoal {
    return {
        type: convertToString(goal.ty),
        hypotheses: (goal.hyps ?? []).map(normalizeHypothesis),
    };
}

export class CoqClient implements ProverClient {
    private lspClientReady: Promise<CoqLspClient> | undefined;
    private lspClient: CoqLspClient | undefined;

    constructor(private readonly coqLspPath: string) {}

    async initialize(): Promise<void> {
        if (this.lspClientReady) {
            await this.lspClientReady;
            return;
        }

        this.lspClientReady = createCoqLspClient(this.coqLspPath)
            .then((client) => {
                this.lspClient = client;
                return client;
            })
            .catch((e) => {
                this.lspClientReady = undefined;
                this.lspClient = undefined;
                throw e;
            });

        await this.lspClientReady;
    }

    getLspClientReady(): Promise<CoqLspClient> | undefined {
        return this.lspClientReady;
    }

    async getGoalState(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<NormalizedGoalState> {
        if (!this.lspClientReady) {
            throw new Error("Coq client is not initialized.");
        }

        const client = await this.lspClientReady;
        const docUri = Uri.fromVscodeUri(document.uri);
        const version = document.version;
        const content = document.getText();

        return client.withTextDocument(
            {
                uri: docUri,
                version,
                languageId: document.languageId,
                content,
                openTimeoutMs: 45000,
            },
            async () => {
                const result = await client.getGoalsAtPoint(
                    position as any,
                    docUri as any,
                    version
                );

                if (!result.ok) {
                    const err = result.val;
                    throw err instanceof Error ? err : new Error(String(err));
                }

                return {
                    goals: result.val.goals.map(normalizeGoal),
                    messages: result.val.messages ?? [],
                    error: result.val.error,
                };
            }
        );
    }

    dispose(): void {
        this.lspClient?.dispose();
        this.lspClient = undefined;
        this.lspClientReady = undefined;
    }
}
