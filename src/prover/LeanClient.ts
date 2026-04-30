import * as vscode from "vscode";
import {
    LanguageClient,
    LanguageClientOptions,
    TransportKind,
    Executable,
    State,
    ErrorAction,
    CloseAction
} from "vscode-languageclient/node";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as cp from "child_process"; // Added for pre-flight check
import {
    NormalizedGoal,
    NormalizedGoalHypothesis,
    NormalizedGoalState,
    ProverClient,
} from "./ProverClient";

// --- Helpers (Same as before) ---
function asString(value: unknown): string {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
        try { return JSON.stringify(value); } catch { return String(value); }
    }
    return String(value);
}

function toHypothesis(value: any): NormalizedGoalHypothesis {
    const name = value?.userName ?? value?.name ?? value?.fvarId?.name ?? (Array.isArray(value?.names) ? value.names.join(" ") : undefined);
    const type = asString(value?.type ?? value?.goalType ?? value?.prettyType ?? "");
    const val = value?.value ?? value?.val ?? value?.expr;
    return {
        name: name ? String(name) : undefined,
        type,
        value: val !== undefined ? asString(val) : undefined,
    };
}

function toGoal(value: any): NormalizedGoal {
    const type = asString(value?.type ?? value?.goalType ?? value?.target ?? value?.goal ?? value?.pretty ?? "");
    const hypothesesSource = value?.hyps ?? value?.mvars ?? value?.hypotheses ?? value?.localContext ?? [];
    const hypotheses = Array.isArray(hypothesesSource) ? hypothesesSource.map((h: any) => toHypothesis(h)) : [];
    return { type, hypotheses };
}

function normalizeLeanGoalState(raw: any): NormalizedGoalState {
    if (typeof raw === "string") return { goals: raw.trim() ? [{ type: raw, hypotheses: [] }] : [], messages: [] };
    const goalsRaw = raw?.goals ?? raw?.result ?? [];
    const messagesRaw = raw?.messages ?? [];
    return { 
        goals: Array.isArray(goalsRaw) ? goalsRaw.map((g: any) => toGoal(g)) : [], 
        messages: Array.isArray(messagesRaw) ? messagesRaw.map((m: any) => asString(m?.text ?? m)) : [], 
        error: raw?.error ? asString(raw.error) : undefined 
    };
}

// --- Environment Management ---
function getElanBinPath(): string {
    return path.join(os.homedir(), ".elan", "bin");
}

function getLeanEnv(): NodeJS.ProcessEnv {
    const elanBin = getElanBinPath();
    const env = { ...process.env };
    env.PATH = `${elanBin}${path.delimiter}${env.PATH || ""}`;
    env.ELAN_HOME = path.join(os.homedir(), ".elan");
    // Ensure elan doesn't try to be interactive or noisy
    env.ELAN_TELEMETRY_OPTOUT = "1"; 
    return env;
}

export class LeanClient implements ProverClient {
    private client: LanguageClient | undefined;
    private isInitializing: boolean = false;
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel("AI Lean LSP");
    }

    async initialize(): Promise<void> {
        if (this.client || this.isInitializing) return;
        this.isInitializing = true;

        try {
            let cwd: string | undefined = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            const elanBin = getElanBinPath();
            const leanPath = path.join(elanBin, process.platform === "win32" ? "lean.exe" : "lean");
            const leanEnv = getLeanEnv();

            this.outputChannel.appendLine(`[Init] Checking Lean at: ${leanPath}`);

            // 1. PRE-FLIGHT CHECK: Can we even run 'lean --version'?
            // This captures errors that usually crash the LSP silently.
            try {
                const version = cp.execSync(`"${leanPath}" --version`, { env: leanEnv, cwd }).toString();
                this.outputChannel.appendLine(`[Init] Lean version check: ${version.trim()}`);
            } catch (e: any) {
                this.outputChannel.appendLine(`[ERROR] Pre-flight check failed. Lean is not runnable: ${e.message}`);
                this.isInitializing = false;
                return;
            }

            // 2. Setup LSP Client
            const serverOptions: Executable = {
                command: leanPath,
                args: ["--server"],
                // transport: TransportKind.stdio,
                options: { cwd, env: leanEnv }
            };

            const clientOptions: LanguageClientOptions = {
                documentSelector: [{ scheme: 'file', language: 'lean4' }],
                outputChannel: this.outputChannel,
                errorHandler: {
                    error: () => ({ action: ErrorAction.Shutdown }),
                    closed: () => ({ action: CloseAction.DoNotRestart })
                }
            };

            const client = new LanguageClient('aiLeanProver', 'AI Lean Prover', serverOptions, clientOptions);

            this.outputChannel.appendLine("[Init] Starting Language Client...");
            await client.start();
            
            this.client = client;
            this.outputChannel.appendLine("[Init] Success.");
        } catch (err) {
            this.outputChannel.appendLine(`[FATAL] Start failed: ${err}`);
            this.client = undefined;
        } finally {
            this.isInitializing = false;
        }
    }

    async getGoalState(document: vscode.TextDocument, position: vscode.Position): Promise<NormalizedGoalState> {
        if (!this.client || this.client.state !== State.Running) {
            throw new Error("Lean client not running.");
        }
        const params = {
            textDocument: { uri: document.uri.toString() },
            position: { line: position.line, character: position.character },
        };
        const rawResponse = await this.client.sendRequest("$/lean/plainGoal", params);
        return normalizeLeanGoalState(rawResponse);
    }

    async dispose(): Promise<void> {
        const client = this.client;
        this.client = undefined;
        if (client && client.state === State.Running) {
            await client.stop();
        }
    }
}