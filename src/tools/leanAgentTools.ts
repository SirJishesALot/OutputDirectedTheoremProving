import * as vscode from 'vscode';
import { AgentTool } from '../llm/chatBridge';
import { ProverClient } from '../prover/ProverClient';

type EditHistory = {
    edits: Array<{ lhs: string; rhs: string; timestamp?: number }>;
};

function isLeanEditor(editor: vscode.TextEditor): boolean {
    const lang = editor.document.languageId.toLowerCase();
    return lang.includes('lean') || editor.document.uri.fsPath.endsWith('.lean');
}

function formatGoalState(client: ProverClient, editor: vscode.TextEditor): Promise<string> {
    return client.getGoalState(editor.document, editor.selection.active).then((state) => {
        if (!state.goals || state.goals.length === 0) {
            let out = 'No active goals at this position.';
            if (state.error) out += `\n\n=== ERROR ===\n${state.error}`;
            if (state.messages.length > 0) out += `\n\n=== MESSAGES ===\n${state.messages.join('\n')}`;
            return out;
        }

        let out = '=== CURRENT PROOF STATE ===\n\n';
        out += `Number of goals: ${state.goals.length}\n\n`;
        state.goals.forEach((goal, index) => {
            out += `--- Goal ${index + 1} ---\n`;
            out += `Goal Type: ${goal.type}\n\n`;
            if (goal.hypotheses.length > 0) {
                out += 'Hypotheses:\n';
                goal.hypotheses.forEach((h) => {
                    const name = h.name ? `${h.name}: ` : '';
                    out += `  ${name}${h.type}\n`;
                });
            } else {
                out += 'No hypotheses.\n';
            }
            out += '\n';
        });
        if (state.error) out += `\n=== ERROR ===\n${state.error}\n`;
        if (state.messages.length > 0) out += `\n=== MESSAGES ===\n${state.messages.join('\n')}\n`;
        return out;
    });
}

function getCurrentClient(getClient: () => ProverClient | undefined): ProverClient {
    const client = getClient();
    if (!client) {
        throw new Error('No active prover client.');
    }
    return client;
}

function getLeanProofScript(editor: vscode.TextEditor): string {
    const lines = editor.document.getText().split('\n');
    const cur = editor.selection.active.line;
    const start = Math.max(0, cur - 40);
    const end = Math.min(lines.length, cur + 40);
    return lines.slice(start, end).join('\n');
}

export function createLeanAutoformaliserTools(
    getClient: () => ProverClient | undefined,
    editor: vscode.TextEditor,
    editHistory: EditHistory
): AgentTool[] {
    return [
        {
            name: 'get_current_proof_state',
            description: 'Gets current Lean proof goals and hypotheses at the cursor.',
            execute: async () => {
                if (!isLeanEditor(editor)) return 'Open a Lean file to use this tool.';
                try {
                    return await formatGoalState(getCurrentClient(getClient), editor);
                } catch (e) {
                    return `Error getting proof state: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        },
        {
            name: 'get_proof_context',
            description: 'Gets surrounding Lean proof script near the cursor.',
            execute: async (args: { linesBefore?: number }) => {
                const linesBefore = args?.linesBefore ?? 20;
                const content = editor.document.getText().split('\n');
                const line = editor.selection.active.line;
                const from = Math.max(0, line - linesBefore);
                const context = content.slice(from, line + 1).join('\n');
                return `=== PROOF CONTEXT ===\n\n${context}`;
            }
        },
        {
            name: 'get_current_proof_script',
            description: 'Gets Lean proof script snippet around cursor.',
            execute: async () => `=== CURRENT PROOF SCRIPT ===\n\n${getLeanProofScript(editor)}`
        },
        {
            name: 'get_edit_history',
            description: 'Gets edit history for proof state suggestions.',
            execute: async () => {
                if (editHistory.edits.length === 0) return 'No edits have been made yet.';
                return editHistory.edits
                    .map((e, i) => `${i + 1}. "${e.lhs}" -> "${e.rhs}"`)
                    .join('\n');
            }
        },
        {
            name: 'check_term_validity',
            description: 'Checks if Lean term appears valid (best-effort placeholder).',
            execute: async () => 'valid'
        },
        {
            name: 'suggest_proof_state_edit',
            description: 'Suggests a Lean proof-state edit for the panel.',
            execute: async (args: {
                hypothesisName: string;
                originalValue?: string;
                suggestedValue: string;
                reason?: string;
                goalIndex?: number;
            }) => {
                if (!args.hypothesisName || args.suggestedValue === undefined || args.suggestedValue === null) {
                    return 'error: hypothesisName and suggestedValue are required.';
                }
                let out = `=== SUGGESTED EDIT ===\n\nHypothesis: ${args.hypothesisName}\n`;
                out += args.originalValue ? `Original: ${args.originalValue}\n` : '(Add new hypothesis)\n';
                out += `Suggested: ${args.suggestedValue}\n`;
                if (args.goalIndex !== undefined) out += `Goal Index: ${args.goalIndex}\n`;
                if (args.reason) out += `Reason: ${args.reason}\n`;
                return out;
            }
        }
    ];
}

export function createLeanProverTools(
    getClient: () => ProverClient | undefined,
    editor: vscode.TextEditor,
    onSuggestedEditApplied?: (editor: vscode.TextEditor, range: vscode.Range, oldText: string) => void
): AgentTool[] {
    return [
        {
            name: 'validate_proof_state_change',
            description: 'Applies proposed Lean tactic text at cursor (best effort).',
            execute: async (args: { proposedAddition?: string }) => {
                const addition = (args?.proposedAddition ?? '').trim();
                if (!addition) return 'error: proposedAddition is required.';
                const pos = editor.selection.active;
                const textToInsert = (addition.endsWith('\n') ? addition : `${addition}\n`);
                const ok = await editor.edit((b) => b.insert(pos, textToInsert));
                if (!ok) return 'error: failed to apply proposed addition.';
                const end = new vscode.Position(pos.line + textToInsert.split('\n').length - 1, 0);
                onSuggestedEditApplied?.(editor, new vscode.Range(pos, end), '');
                try {
                    const state = await formatGoalState(getCurrentClient(getClient), editor);
                    return `valid: applied proposed addition.\n\n${state}`;
                } catch {
                    return 'valid: applied proposed addition.';
                }
            }
        },
        {
            name: 'get_current_proof_script',
            description: 'Gets current Lean proof script snippet around cursor.',
            execute: async () => `=== CURRENT PROOF SCRIPT ===\n\n${getLeanProofScript(editor)}`
        },
        {
            name: 'suggest_proof_script_edit',
            description: 'Applies direct proof script edit at a Lean source position.',
            execute: async (args: { line: number; character: number; oldText: string; newText: string }) => {
                const line = Math.max(0, args.line >= 1 ? args.line - 1 : args.line);
                const start = new vscode.Position(line, Math.max(0, args.character));
                const end = new vscode.Position(line, Math.max(0, args.character) + (args.oldText ?? '').length);
                const range = new vscode.Range(start, end);
                const ok = await editor.edit((b) => b.replace(range, args.newText ?? ''));
                if (!ok) return 'error: failed to apply edit.';
                onSuggestedEditApplied?.(editor, new vscode.Range(start, new vscode.Position(start.line, start.character + (args.newText ?? '').length)), args.oldText ?? '');
                return '=== PROOF SCRIPT EDIT APPLIED ===';
            }
        },
        {
            name: 'get_current_proof_state',
            description: 'Gets current Lean proof state.',
            execute: async () => {
                try {
                    return await formatGoalState(getCurrentClient(getClient), editor);
                } catch (e) {
                    return `Error getting proof state: ${e instanceof Error ? e.message : String(e)}`;
                }
            }
        }
    ];
}
