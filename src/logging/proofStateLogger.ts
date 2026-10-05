import * as vscode from "vscode";
import { OutputLogger } from "./logger";

export const PROOF_STATE_OUTPUT_CHANNEL_NAME = OutputLogger.CHANNEL_NAME;
const DEFAULT_GOALS_TIMEOUT_MS = 15000;

/**
 * Initialize unified logger at activation.
 */
export function initProofStateLogger(context: vscode.ExtensionContext): void {
    OutputLogger.init(context);
}

/** Append a message under the [ProofState] category in the unified channel. */
export function proofStateLog(message: string): void {
    OutputLogger.info("ProofState", message);
}

/** Show the unified log in the Output panel. */
export function showProofStateLog(): void {
    OutputLogger.show(true);
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
