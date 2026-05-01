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
// function asString(value: unknown): string {
//     if (typeof value === "string") return value;
//     if (value === null || value === undefined) return "";
//     if (typeof value === "object") {
//         try { return JSON.stringify(value); } catch { return String(value); }
//     }
//     return String(value);
// }

// function toHypothesis(value: any): NormalizedGoalHypothesis {
//     const name = value?.userName ?? value?.name ?? value?.fvarId?.name ?? (Array.isArray(value?.names) ? value.names.join(" ") : undefined);
//     const type = asString(value?.type ?? value?.goalType ?? value?.prettyType ?? "");
//     const val = value?.value ?? value?.val ?? value?.expr;
//     return {
//         name: name ? String(name) : undefined,
//         type,
//         value: val !== undefined ? asString(val) : undefined,
//     };
// }

// function toGoal(value: any): NormalizedGoal {
//     const type = asString(value?.type ?? value?.goalType ?? value?.target ?? value?.goal ?? value?.pretty ?? "");
//     const hypothesesSource = value?.hyps ?? value?.mvars ?? value?.hypotheses ?? value?.localContext ?? [];
//     const hypotheses = Array.isArray(hypothesesSource) ? hypothesesSource.map((h: any) => toHypothesis(h)) : [];
//     return { type, hypotheses };
// }

// function normalizeLeanGoalState(raw: any): NormalizedGoalState {
//     if (typeof raw === "string") return { goals: raw.trim() ? [{ type: raw, hypotheses: [] }] : [], messages: [] };
//     const goalsRaw = raw?.goals ?? raw?.result ?? [];
//     const messagesRaw = raw?.messages ?? [];
//     return { 
//         goals: Array.isArray(goalsRaw) ? goalsRaw.map((g: any) => toGoal(g)) : [], 
//         messages: Array.isArray(messagesRaw) ? messagesRaw.map((m: any) => asString(m?.text ?? m)) : [], 
//         error: raw?.error ? asString(raw.error) : undefined 
//     };
// }

/**
 * Recursively flattens Lean 4 TaggedText into a plain string.
 * This handles {text: ""}, {append: []}, and {tag: [attr, content]} structures.
 */
function asString(value: unknown): string {
    if (typeof value === "string") return value;
    if (value === null || value === undefined) return "";
    
    if (typeof value === "object") {
        const val = value as any;
        
        // 1. Lean 4 'text' variant
        if (typeof val.text === "string") return val.text;
        
        // 2. Lean 4 'append' variant (recursive)
        if (Array.isArray(val.append)) {
            return val.append.map((item: any) => asString(item)).join("");
        }
        
        // 3. Lean 4 'tag' variant (extracts text from the 'content' field)
        if (val.content !== undefined) {
            return asString(val.content);
        }

        // 4. Handle raw arrays (sometimes the list of TaggedText is sent directly)
        if (Array.isArray(val)) {
            return val.map((item: any) => asString(item)).join("");
        }
        
        // Fallback for unexpected structured data
        try { 
            const str = JSON.stringify(value);
            return str === "{}" ? "" : str;
        } catch { 
            return String(value); 
        }
    }
    return String(value);
}

function toHypothesis(value: any): NormalizedGoalHypothesis {
    // Lean 4 uses 'names' (Array of strings) and 'type' (TaggedText)
    const name = Array.isArray(value?.names) 
        ? value.names.join(", ") 
        : (value?.userName ?? value?.name);
    
    const type = asString(value?.type);
    const val = value?.val ? asString(value.val) : undefined;
    
    return {
        name: name ? String(name) : undefined,
        type: type,
        value: val,
    };
}

function toGoal(value: any): NormalizedGoal {
    // Lean 4 goals usually separate the prefix (⊢) from the goal type
    const prefix = value?.goalPrefix ? asString(value.goalPrefix) : "⊢ ";
    const type = prefix + asString(value?.type);
    
    const hypothesesSource = value?.hyps ?? [];
    const hypotheses = Array.isArray(hypothesesSource) 
        ? hypothesesSource.map((h: any) => toHypothesis(h)) 
        : [];
        
    return { type, hypotheses };
}

export function normalizeLeanGoalState(raw: any): NormalizedGoalState {
    const messagesRaw = raw?.messages ?? [];
    const messages = Array.isArray(messagesRaw) 
        ? messagesRaw.map((m: any) => asString(m?.text ?? m)) 
        : [];
    
    // 1. Process structured goals if available
    const goalsRaw = raw?.goals ?? raw?.result ?? [];
    let goals: NormalizedGoal[] = [];

    if (Array.isArray(goalsRaw) && goalsRaw.length > 0) {
        goals = goalsRaw.map((g: any) => toGoal(g));
    }

    // 2. Validation: If structured goals exist but resulted in empty strings,
    // something went wrong with the parse. Fall back to the 'rendered' field.
    const hasContent = goals.some(g => g.type.trim().length > 2); // >2 to ignore just "⊢ "
    
    if (!hasContent && raw?.rendered && typeof raw.rendered === "string") {
        // Strip markdown blocks: ```lean ... ```
        const cleanGoal = raw.rendered
            .replace(/^```lean\s*/, "")
            .replace(/```$/, "")
            .trim();
            
        return {
            goals: [{ type: cleanGoal, hypotheses: [] }],
            messages,
        };
    }

    return { 
        goals, 
        messages, 
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
                documentSelector: [
                    { scheme: 'file', language: 'lean4' }, 
                    { scheme: 'file', pattern: '**/*.lean' }
                ],
                outputChannel: this.outputChannel,
                // traceOutputChannel: this.outputChannel, 
                // trace: Trace.Verbose,  
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
        if (!this.client.protocol2CodeConverter.asUri(document.uri.toString())) {
            this.outputChannel.appendLine(`Force-syncing document: ${document.uri.toString()}`);
        }
        const params = {
            textDocument: { uri: this.client.code2ProtocolConverter.asUri(document.uri)},
            position: this.client.code2ProtocolConverter.asPosition(position),
        };

        let retries = 3;
        while (retries > 0) {
            try {
                const rawResponse = await this.client.sendRequest("$/lean/plainGoal", params);
                console.log("rawResponse: ", rawResponse);
                const normalized = normalizeLeanGoalState(rawResponse);
                console.log("normalized: ", normalized);
                return normalized;
            } catch (error: any) {
                // If the server says the file is closed, wait 200ms and try again.
                // This gives the LSP client time to finish the didOpen handshake.
                if (error.message?.includes("closed file") && retries > 1) {
                    this.outputChannel.appendLine(`File not yet synced, retrying... (${retries} left)`);
                    await new Promise(resolve => setTimeout(resolve, 200));
                    retries--;
                    continue;
                }
                throw error;
            }
        }
        throw new Error("Failed to get goal state after retries.");
    }

    async dispose(): Promise<void> {
        const client = this.client;
        this.client = undefined;
        if (client && client.state === State.Running) {
            await client.stop();
        }
    }
}