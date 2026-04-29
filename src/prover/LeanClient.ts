import * as vscode from "vscode";
import {
    NormalizedGoal,
    NormalizedGoalHypothesis,
    NormalizedGoalState,
    ProverClient,
} from "./ProverClient";

type LeanExtensionLike = vscode.Extension<any>;

function asString(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }
    if (value === null || value === undefined) {
        return "";
    }
    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }
    return String(value);
}

function toHypothesis(value: any): NormalizedGoalHypothesis {
    const name =
        value?.userName ??
        value?.name ??
        value?.fvarId?.name ??
        (Array.isArray(value?.names) ? value.names.join(" ") : undefined);
    const type = asString(value?.type ?? value?.goalType ?? value?.prettyType ?? "");
    const val = value?.value ?? value?.val ?? value?.expr;
    return {
        name: name ? String(name) : undefined,
        type,
        value: val !== undefined ? asString(val) : undefined,
    };
}

function toGoal(value: any): NormalizedGoal {
    const type = asString(
        value?.type ??
            value?.goalType ??
            value?.target ??
            value?.goal ??
            value?.pretty ??
            ""
    );
    const hypothesesSource =
        value?.hyps ??
        value?.mvars ??
        value?.hypotheses ??
        value?.localContext ??
        [];
    const hypotheses = Array.isArray(hypothesesSource)
        ? hypothesesSource.map((h: any) => toHypothesis(h))
        : [];
    return { type, hypotheses };
}

function normalizeLeanGoalState(raw: any): NormalizedGoalState {
    const goalsRaw =
        raw?.goals ??
        raw?.widgets?.goals ??
        raw?.interactiveGoals ??
        raw?.goalState?.goals ??
        raw?.result?.goals ??
        [];
    const messagesRaw =
        raw?.messages ??
        raw?.goalState?.messages ??
        raw?.result?.messages ??
        [];
    const errorRaw = raw?.error ?? raw?.goalState?.error ?? raw?.result?.error;

    const goals: NormalizedGoal[] = Array.isArray(goalsRaw)
        ? goalsRaw.map((g: any) => toGoal(g))
        : [];
    const messages: string[] = Array.isArray(messagesRaw)
        ? messagesRaw.map((m: any) => asString(m?.text ?? m))
        : [];
    const error = errorRaw !== undefined ? asString(errorRaw) : undefined;

    return { goals, messages, error };
}

async function getLeanApiFromExports(exportsObj: any): Promise<any> {
    if (!exportsObj) {
        return undefined;
    }
    if (typeof exportsObj.getApi === "function") {
        return await exportsObj.getApi();
    }
    if (typeof exportsObj.api === "function") {
        return await exportsObj.api();
    }
    if (exportsObj.api) {
        return exportsObj.api;
    }
    return exportsObj;
}

function deepFindLanguageClient(candidate: any, depth = 0): any {
    if (!candidate || depth > 4) {
        return undefined;
    }
    if (
        typeof candidate.sendRequest === "function" &&
        typeof candidate.onNotification === "function"
    ) {
        return candidate;
    }
    if (candidate.languageClient) {
        return deepFindLanguageClient(candidate.languageClient, depth + 1);
    }
    if (candidate.client) {
        return deepFindLanguageClient(candidate.client, depth + 1);
    }
    if (candidate.server?.client) {
        return deepFindLanguageClient(candidate.server.client, depth + 1);
    }
    for (const key of Object.keys(candidate)) {
        const child = candidate[key];
        if (typeof child === "object" && child !== null) {
            const found = deepFindLanguageClient(child, depth + 1);
            if (found) {
                return found;
            }
        }
    }
    return undefined;
}

export class LeanClient implements ProverClient {
    private extension: LeanExtensionLike | undefined;
    private api: any;
    private languageClient: any;

    async initialize(): Promise<void> {
        const ext = vscode.extensions.getExtension("leanprover.lean4");
        if (!ext) {
            const install = "Install Lean 4";
            const selected = await vscode.window.showErrorMessage(
                "Lean support requires the official Lean 4 extension (leanprover.lean4). Please install it to use Lean as active prover.",
                install
            );
            if (selected === install) {
                await vscode.commands.executeCommand(
                    "workbench.extensions.search",
                    "leanprover.lean4"
                );
            }
            throw new Error(
                "Lean 4 extension is not installed. Install leanprover.lean4 to continue."
            );
        }

        this.extension = ext;
        if (!ext.isActive) {
            await ext.activate();
        }

        this.api = await getLeanApiFromExports(ext.exports);
        this.languageClient = deepFindLanguageClient(this.api ?? ext.exports);
    }

    async getGoalState(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<NormalizedGoalState> {
        if (!this.extension || (!this.api && !this.languageClient)) {
            throw new Error("Lean client is not initialized.");
        }

        // Preferred route: official Lean extension API (if exposed).
        if (this.api) {
            const methods = [
                "getInteractiveGoals",
                "getGoalState",
                "getGoals",
                "goalStateAt",
            ];
            for (const methodName of methods) {
                const method = this.api?.[methodName];
                if (typeof method === "function") {
                    const raw = await method.call(this.api, document, position);
                    return normalizeLeanGoalState(raw);
                }
            }
        }

        // Fallback route: Lean extension language client request channel.
        if (this.languageClient?.sendRequest) {
            const params = {
                textDocument: { uri: document.uri.toString() },
                position,
            };
            const requestTypes = [
                "$/lean/plainGoal",
                "$/lean/plainGoalAt",
                "$/lean/interactiveGoals",
            ];
            for (const requestType of requestTypes) {
                try {
                    const raw = await this.languageClient.sendRequest(
                        requestType,
                        params
                    );
                    return normalizeLeanGoalState(raw);
                } catch {
                    // Try the next known Lean request type.
                }
            }
        }

        throw new Error(
            "Unable to retrieve Lean interactive goals from leanprover.lean4 API/client."
        );
    }

    dispose(): void {
        this.api = undefined;
        this.languageClient = undefined;
        this.extension = undefined;
    }
}
