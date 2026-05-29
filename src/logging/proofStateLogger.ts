import * as vscode from "vscode";
import { OutputChannel, window } from "vscode";

const LOG_PREFIX = "[proof-state]";
const DEFAULT_GOALS_TIMEOUT_MS = 15000;

/** Visible in View → Output channel dropdown once the extension activates. */
export const PROOF_STATE_OUTPUT_CHANNEL_NAME = "Output Directed Prover";

let channel: OutputChannel | undefined;

function getChannel(): OutputChannel {
    if (!channel) {
        channel = window.createOutputChannel(PROOF_STATE_OUTPUT_CHANNEL_NAME);
    }
    return channel;
}

/**
 * Create the output channel at activation so it appears in the Output dropdown
 * even before the first cursor move.
 */
export function initProofStateLogger(context: vscode.ExtensionContext): void {
    const ch = getChannel();
    context.subscriptions.push(ch);
    ch.appendLine(
        `${LOG_PREFIX} Extension activated — proof state logging ready.`
    );
}

/** Append a line to the "Output Directed Prover" output channel. */
export function proofStateLog(message: string): void {
    getChannel().appendLine(`${LOG_PREFIX} ${message}`);
}

/** Show the proof-state log in the Output panel. */
export function showProofStateLog(): void {
    getChannel().show(true);
}

export function formatPos(line: number, character: number): string {
    return `L${line + 1}:C${character + 1}`;
}

export function formatUri(uri: string): string {
    try {
        return decodeURIComponent(uri.replace(/^file:\/\//, ""));
    } catch {
        return uri;
    }
}

export function getConfiguredGoalsTimeoutMs(): number {
    const configured = vscode.workspace
        .getConfiguration()
        .get<number>("myExtension.coqGoalsTimeoutMs", DEFAULT_GOALS_TIMEOUT_MS);
    return Math.max(1000, configured);
}

export { DEFAULT_GOALS_TIMEOUT_MS };
