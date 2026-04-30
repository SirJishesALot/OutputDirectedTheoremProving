import * as vscode from "vscode";
import {
    NormalizedGoal,
    NormalizedGoalHypothesis,
    NormalizedGoalState,
    ProverClient,
} from "./ProverClient";

// --- Helpers ---
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
    if (typeof raw === "string") {
        return { goals: raw.trim() ? [{ type: raw, hypotheses: [] }] : [], messages: [] };
    }
    if (raw?.rendered && typeof raw.rendered === "string") {
        return { goals: raw.rendered.trim() ? [{ type: raw.rendered, hypotheses: [] }] : [], messages: [], error: raw?.error ? asString(raw.error) : undefined };
    }
    
    const goalsRaw = raw?.goals ?? raw?.result ?? [];
    const messagesRaw = raw?.messages ?? [];
    const errorRaw = raw?.error;

    const goals: NormalizedGoal[] = Array.isArray(goalsRaw) ? goalsRaw.map((g: any) => toGoal(g)) : [];
    const messages: string[] = Array.isArray(messagesRaw) ? messagesRaw.map((m: any) => asString(m?.text ?? m)) : [];
    const error = errorRaw !== undefined ? asString(errorRaw) : undefined;

    return { goals, messages, error };
}
// --- End helpers ---

export class LeanClient implements ProverClient {
    async initialize(): Promise<void> {
        const ext = vscode.extensions.getExtension("leanprover.lean4");
        if (!ext) {
            vscode.window.showErrorMessage("Lean support requires the official Lean 4 extension.");
            throw new Error("Lean 4 extension is not installed.");
        }
        if (!ext.isActive) {
            await ext.activate();
        }
    }

    async getGoalState(document: vscode.TextDocument, position: vscode.Position): Promise<NormalizedGoalState> {
        const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
            "vscode.executeHoverProvider",
            document.uri,
            position
        );

        if (!hovers || hovers.length === 0) {
            throw new Error("No hover data available. The Lean language server might still be compiling this file, or the cursor is not on an elaborated tactic.");
        }

        let extractedState = "";
        let allHoverText = "";

        for (const hover of hovers) {
            for (const content of hover.contents) {
                const markdown = typeof content === "string" ? content : content.value;
                if (!markdown) continue;

                allHoverText += markdown + "\n\n---\n\n";
                
                // Lean 4 tactic states contain the turnstile "⊢" OR the word "goal" (e.g., "No goals")
                if (markdown.includes("⊢") || /\bgoal(?:s)?\b/i.test(markdown)) {
                    // Build backticks dynamically to prevent markdown parser breaks
                    const ticks = String.fromCharCode(96, 96, 96);
                    
                    // Robust regex handling \r\n, \n, and optional language identifiers (lean/lean4)
                    const codeBlockRegex = new RegExp(ticks + "[a-zA-Z0-9]*\\r?\\n([\\s\\S]*?)\\r?\\n" + ticks, "g");
                    
                    let match;
                    let foundBlock = false;
                    
                    // Iterate through all code blocks in the hover to find the target state
                    while ((match = codeBlockRegex.exec(markdown)) !== null) {
                        if (match[1] && (match[1].includes("⊢") || /\bgoal(?:s)?\b/i.test(match[1]))) {
                            extractedState = match[1].trim();
                            foundBlock = true;
                            break;
                        }
                    }
                    
                    // If no code block matched, fallback to stripping formatting manually
                    if (!foundBlock) {
                        const singleTick = new RegExp(String.fromCharCode(96), "g");
                        extractedState = markdown
                            .replace(singleTick, "")
                            .replace(/\*\*Tactic state\*\*/gi, "")
                            .replace(/\*\*State:\*\*/gi, "")
                            .trim();
                    }
                    break;
                }
            }
            if (extractedState) break;
        }

        if (!extractedState) {
            // Throwing a detailed error so we can see exactly what the hover provided if it fails again
            throw new Error(
                "Could not parse the goal state from the hover. Try placing your cursor at the *end* of the tactic or on a blank line.\n\n" +
                `Raw hover data seen:\n${allHoverText.substring(0, 300)}${allHoverText.length > 300 ? "..." : ""}`
            );
        }

        return normalizeLeanGoalState(extractedState);
    }

    dispose(): void {
        // We have no background servers to clean up since we piggyback on the Hover API.
    }
}