import * as vscode from "vscode";
import { CoqLspClient } from "../lsp/coqLspClient";
import { CoqClient } from "./CoqClient";
import { LeanClient } from "./LeanClient";
import { ProverClient } from "./ProverClient";

export type ProverKind = "Coq" | "Lean";

export class ProverManager implements vscode.Disposable {
    private activeKind: ProverKind = "Coq";
    private activeClient: ProverClient | undefined;

    constructor(private readonly coqLspPath: string) {}

    getActiveKind(): ProverKind {
        return this.activeKind;
    }

    getActiveClient(): ProverClient | undefined {
        return this.activeClient;
    }

    getActiveCoqLspClientReady(): Promise<CoqLspClient> | undefined {
        if (this.activeKind !== "Coq") {
            return undefined;
        }
        const client = this.activeClient;
        if (client instanceof CoqClient) {
            return client.getLspClientReady();
        }
        return undefined;
    }

    async switchTo(kind: ProverKind): Promise<void> {
        if (this.activeClient && this.activeKind === kind) {
            return;
        }

        this.activeClient?.dispose();
        this.activeClient = undefined;

        const nextClient: ProverClient =
            kind === "Lean" ? new LeanClient() : new CoqClient(this.coqLspPath);
        await nextClient.initialize();

        this.activeKind = kind;
        this.activeClient = nextClient;
    }

    dispose(): void {
        this.activeClient?.dispose();
        this.activeClient = undefined;
    }
}

export function getConfiguredProverKind(): ProverKind {
    const raw = vscode.workspace
        .getConfiguration()
        .get<string>("myExtension.activeProver", "Coq");
    return raw === "Lean" ? "Lean" : "Coq";
}
