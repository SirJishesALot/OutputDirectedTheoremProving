import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { OutputLogger } from '../logging/logger';

export interface AntigravityModelInfo {
    id: string;
    description: string;
}

export const POPULAR_ANTIGRAVITY_MODELS: AntigravityModelInfo[] = [
    { id: 'gemini-3.1-pro-high', description: 'Gemini 3.1 Pro mathematical reasoning (Recommended)' },
    { id: 'gemini-3.1-pro-low', description: 'Gemini 3.1 Pro low reasoning' },
    { id: 'gemini-3.8-flash-low', description: 'Fast, lightweight & responsive' },
    { id: 'gemini-3.8-flash-medium', description: 'Balanced reasoning speed and depth' },
    { id: 'gemini-3.8-flash-high', description: 'Deep reasoning effort with thinking tokens' },
    { id: 'gemini-3.7-flash-high', description: 'Gemini 3.7 Flash with high reasoning' },
    { id: 'claude-sonnet-5-5-high', description: 'Claude Sonnet 5.5 (High reasoning)' },
    { id: 'claude-opus-5-5-high', description: 'Claude Opus 5.5 (High reasoning)' },
];

/**
 * Searches for the `agy` binary on the host machine.
 */
export function findAgyBinaryPath(): string {
    const configured = vscode.workspace
        .getConfiguration()
        .get<string>('myExtension.antigravityCliPath', 'agy')
        ?.trim();

    if (configured && configured !== 'agy') {
        if (fs.existsSync(configured)) {
            return configured;
        }
    }

    const homeLocalBin = path.join(os.homedir(), '.local', 'bin', 'agy');
    if (fs.existsSync(homeLocalBin)) {
        return homeLocalBin;
    }

    const optHomebrew = '/opt/homebrew/bin/agy';
    if (fs.existsSync(optHomebrew)) {
        return optHomebrew;
    }

    const usrLocalBin = '/usr/local/bin/agy';
    if (fs.existsSync(usrLocalBin)) {
        return usrLocalBin;
    }

    const envPath = process.env.PATH || '';
    const dirs = envPath.split(path.delimiter);
    for (const dir of dirs) {
        const candidate = path.join(dir, 'agy');
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return 'agy';
}

/**
 * Queries `agy models` to retrieve live models registered in the local CLI.
 */
export async function listAvailableAgyModels(): Promise<AntigravityModelInfo[]> {
    const agyBin = findAgyBinaryPath();
    return new Promise((resolve) => {
        cp.exec(`"${agyBin}" models`, { timeout: 8000 }, (error, stdout) => {
            if (error || !stdout) {
                OutputLogger.warn('LLM:Antigravity', `Failed to list models via 'agy models': ${error?.message || 'Empty output'}`);
                resolve(POPULAR_ANTIGRAVITY_MODELS);
                return;
            }

            const models: AntigravityModelInfo[] = [];
            const lines = stdout.split('\n');
            for (const line of lines) {
                // Lines format: "gemini-3.8-flash-high     Gemini 3.8 Flash (High)"
                const cleaned = line.replace(/^[⠋⠙⠹⠸\s]+Fetching available models\.\.\./, '').trim();
                if (!cleaned) continue;
                const match = cleaned.match(/^([a-z0-9\-_.]+)\s+(.*)$/i);
                if (match) {
                    models.push({ id: match[1], description: match[2].trim() });
                } else if (/^[a-z0-9\-_.]+$/i.test(cleaned)) {
                    models.push({ id: cleaned, description: cleaned });
                }
            }

            if (models.length > 0) {
                resolve(models);
            } else {
                resolve(POPULAR_ANTIGRAVITY_MODELS);
            }
        });
    });
}

/**
 * Formats an array of chat messages into a structured prompt suitable for `agy -p`.
 */
export function formatMessagesForAgy(messages: any[]): string {
    if (!Array.isArray(messages) || messages.length === 0) {
        return '';
    }

    let systemInstruction = '';
    const turns: Array<{ role: string; content: string }> = [];

    for (const msg of messages) {
        if (typeof msg === 'string') {
            turns.push({ role: 'user', content: msg.trim() });
            continue;
        }
        const role = (msg.role || 'user').toLowerCase();
        let content = '';
        if (typeof msg.content === 'string') {
            content = msg.content.trim();
        } else if (typeof msg.text === 'string') {
            content = msg.text.trim();
        } else if (Array.isArray(msg.parts)) {
            content = msg.parts.map((p: any) => p.text || '').join('').trim();
        }

        if (!content) continue;

        if (role === 'system') {
            systemInstruction = systemInstruction ? `${systemInstruction}\n\n${content}` : content;
        } else {
            turns.push({ role, content });
        }
    }

    // Single user message: return directly (with optional system prompt prefix)
    if (turns.length === 1 && turns[0].role === 'user') {
        if (!systemInstruction) {
            return turns[0].content;
        }
        return `System Instructions:\n${systemInstruction}\n\nUser Request:\n${turns[0].content}`;
    }

    // Multi-turn conversation: format sequentially
    const buffer: string[] = [];
    if (systemInstruction) {
        buffer.push(`System Instructions:\n${systemInstruction}\n`);
    }

    buffer.push('Conversation History:');
    for (let i = 0; i < turns.length; i++) {
        const turn = turns[i];
        const speaker = turn.role === 'user' ? 'User' : 'Assistant';
        if (i === turns.length - 1 && turn.role === 'user') {
            buffer.push(`\nLatest User Request:\n${turn.content}`);
        } else {
            buffer.push(`${speaker}: ${turn.content}`);
        }
    }

    return buffer.join('\n');
}

export interface AntigravityCliAdapter {
    backend: 'antigravity-cli';
    model: string;
    binaryPath: string;
    sendRequest: (
        messages: any[],
        opts?: { maxTokens?: number; temperature?: number; model?: string },
        token?: vscode.CancellationToken
    ) => Promise<{ text: AsyncIterable<string> }>;
}

/**
 * Creates an LLM adapter backed by the local Antigravity CLI (`agy`).
 */
export function createAntigravityCliAdapter(
    modelId?: string,
    binaryPath?: string
): AntigravityCliAdapter {
    const agyBin = binaryPath || findAgyBinaryPath();
    const effectiveModel =
        modelId ||
        vscode.workspace
            .getConfiguration()
            .get<string>('myExtension.defaultAntigravityModel', 'gemini-3.1-pro-high');

    return {
        backend: 'antigravity-cli',
        model: effectiveModel,
        binaryPath: agyBin,
        sendRequest: async (messages: any[], opts?: any, token?: vscode.CancellationToken) => {
            const prompt = formatMessagesForAgy(messages);
            const targetModel = opts?.model || effectiveModel;

            const args = [
                '-p',
                prompt,
                '--model',
                targetModel,
                '--output-format',
                'stream-json',
                '--dangerously-skip-permissions',
                '--disable-slash-commands',
            ];

            OutputLogger.info(
                'LLM:Antigravity',
                `Spawning agy (binary: ${agyBin}, model: ${targetModel}, prompt length: ${prompt.length} chars)`
            );

            // Channel queue to yield chunks asynchronously as they arrive from stdout
            type StreamItem = { delta?: string; done?: boolean; error?: Error };
            const queue: StreamItem[] = [];
            let notifyReady: (() => void) | null = null;

            const pushItem = (item: StreamItem) => {
                queue.push(item);
                if (notifyReady) {
                    notifyReady();
                    notifyReady = null;
                }
            };

            let proc: cp.ChildProcess | null = null;
            try {
                proc = cp.spawn(agyBin, args, {
                    cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd(),
                    env: { ...process.env, NO_COLOR: '1' },
                });
            } catch (err: any) {
                OutputLogger.error('LLM:Antigravity', `Failed to spawn ${agyBin}:`, err);
                throw new Error(`Failed to execute Antigravity CLI at "${agyBin}": ${err.message}`);
            }

            let receivedDeltas = false;
            let fullResultResponse = '';
            let stderrOutput = '';

            if (token) {
                const cancelSub = token.onCancellationRequested(() => {
                    if (proc && !proc.killed) {
                        OutputLogger.info('LLM:Antigravity', 'Cancellation requested; killing agy process');
                        proc.kill('SIGTERM');
                        setTimeout(() => {
                            if (proc && !proc.killed) proc.kill('SIGKILL');
                        }, 500);
                    }
                    pushItem({ done: true });
                });
                proc.on('close', () => cancelSub.dispose());
            }

            if (proc.stderr) {
                proc.stderr.on('data', (chunk) => {
                    stderrOutput += chunk.toString();
                });
            }

            if (proc.stdout) {
                const rl = readline.createInterface({ input: proc.stdout });
                rl.on('line', (line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return;
                    try {
                        const parsed = JSON.parse(trimmed);
                        if (parsed.event === 'step_update' && parsed.step_update?.text_delta) {
                            receivedDeltas = true;
                            pushItem({ delta: parsed.step_update.text_delta });
                        } else if (parsed.event === 'result' && parsed.result?.response) {
                            fullResultResponse = parsed.result.response;
                        }
                    } catch {
                        // Plain text fallback if non-JSON line is printed
                        if (trimmed && !trimmed.startsWith('⠋') && !trimmed.startsWith('⠙')) {
                            receivedDeltas = true;
                            pushItem({ delta: trimmed + '\n' });
                        }
                    }
                });
            }

            proc.on('error', (err) => {
                OutputLogger.error('LLM:Antigravity', 'agy process error:', err);
                pushItem({ error: err });
            });

            proc.on('close', (code) => {
                OutputLogger.info('LLM:Antigravity', `agy process exited with code ${code}`);
                if (!receivedDeltas && fullResultResponse) {
                    pushItem({ delta: fullResultResponse });
                }
                if (code !== 0 && !receivedDeltas && !fullResultResponse) {
                    const errMsg = stderrOutput.trim() || `agy exited with status code ${code}`;
                    pushItem({ error: new Error(`Antigravity CLI execution error: ${errMsg}`) });
                }
                pushItem({ done: true });
            });

            return {
                text: (async function* () {
                    while (true) {
                        while (queue.length > 0) {
                            const item = queue.shift()!;
                            if (item.error) {
                                throw item.error;
                            }
                            if (item.done) {
                                return;
                            }
                            if (item.delta) {
                                yield item.delta;
                            }
                        }

                        // Wait for next item
                        await new Promise<void>((resolve) => {
                            notifyReady = resolve;
                        });
                    }
                })(),
            };
        },
    };
}
