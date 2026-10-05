import * as vscode from 'vscode';

export type LogCategory =
    | 'ProofState'
    | 'Prover:Coq'
    | 'Prover:Lean'
    | 'Agent:Chat'
    | 'Agent:Prover'
    | 'Webview'
    | 'Config'
    | 'LSP'
    | 'LLM:Antigravity'
    | 'LLM:Portkey';

export class OutputLogger {
    private static channel: vscode.OutputChannel | vscode.LogOutputChannel | undefined;

    public static readonly CHANNEL_NAME = 'Output Directed Theorem Proving';

    public static init(context: vscode.ExtensionContext): vscode.OutputChannel {
        const ch = this.getChannel();
        if (context && context.subscriptions && !context.subscriptions.includes(ch)) {
            context.subscriptions.push(ch);
        }
        this.info('Config', 'Extension activated — output logging ready.');
        return ch;
    }

    public static getChannel(): vscode.OutputChannel {
        if (!this.channel) {
            try {
                this.channel = vscode.window.createOutputChannel(this.CHANNEL_NAME, { log: true });
            } catch {
                this.channel = vscode.window.createOutputChannel(this.CHANNEL_NAME);
            }
            if (!this.channel || typeof (this.channel as any).appendLine !== 'function') {
                this.channel = vscode.window.createOutputChannel(this.CHANNEL_NAME);
            }
        }
        return this.channel;
    }

    public static show(preserveFocus = true): void {
        try {
            this.getChannel().show(preserveFocus);
        } catch (e) {
            console.error('Failed to show output channel:', e);
        }
    }

    private static format(level: string, category: LogCategory, message: string, args: any[]): string {
        const time = new Date().toISOString().split('T')[1].slice(0, 8);
        const extra = args.length > 0
            ? ' ' + args.map(a => (a instanceof Error ? (a.stack || a.message) : (typeof a === 'object' ? JSON.stringify(a) : String(a)))).join(' ')
            : '';
        return `[${time}] [${level}] [${category}] ${message}${extra}`;
    }

    public static trace(category: LogCategory, message: string, ...args: any[]): void {
        try {
            const ch = this.getChannel() as any;
            if (typeof ch.trace === 'function') {
                if (args.length > 0) {
                    ch.trace(`[${category}] ${message}`, ...args);
                } else {
                    ch.trace(`[${category}] ${message}`);
                }
            } else if (typeof ch.appendLine === 'function') {
                ch.appendLine(this.format('TRACE', category, message, args));
            }
        } catch {
            console.log(`[TRACE] [${category}] ${message}`, ...args);
        }
    }

    public static debug(category: LogCategory, message: string, ...args: any[]): void {
        try {
            const ch = this.getChannel() as any;
            if (typeof ch.debug === 'function') {
                if (args.length > 0) {
                    ch.debug(`[${category}] ${message}`, ...args);
                } else {
                    ch.debug(`[${category}] ${message}`);
                }
            } else if (typeof ch.appendLine === 'function') {
                ch.appendLine(this.format('DEBUG', category, message, args));
            }
        } catch {
            console.log(`[DEBUG] [${category}] ${message}`, ...args);
        }
    }

    public static info(category: LogCategory, message: string, ...args: any[]): void {
        try {
            const ch = this.getChannel() as any;
            if (typeof ch.info === 'function') {
                if (args.length > 0) {
                    ch.info(`[${category}] ${message}`, ...args);
                } else {
                    ch.info(`[${category}] ${message}`);
                }
            } else if (typeof ch.appendLine === 'function') {
                ch.appendLine(this.format('INFO', category, message, args));
            }
        } catch {
            console.log(`[INFO] [${category}] ${message}`, ...args);
        }
    }

    public static warn(category: LogCategory, message: string, ...args: any[]): void {
        try {
            const ch = this.getChannel() as any;
            if (typeof ch.warn === 'function') {
                if (args.length > 0) {
                    ch.warn(`[${category}] ${message}`, ...args);
                } else {
                    ch.warn(`[${category}] ${message}`);
                }
            } else if (typeof ch.appendLine === 'function') {
                ch.appendLine(this.format('WARN', category, message, args));
            }
        } catch {
            console.warn(`[WARN] [${category}] ${message}`, ...args);
        }
    }

    public static error(category: LogCategory, message: string | Error, ...args: any[]): void {
        try {
            const msg = message instanceof Error ? (message.stack || message.message) : message;
            const ch = this.getChannel() as any;
            if (typeof ch.error === 'function') {
                if (args.length > 0) {
                    ch.error(`[${category}] ${msg}`, ...args);
                } else {
                    ch.error(`[${category}] ${msg}`);
                }
            } else if (typeof ch.appendLine === 'function') {
                ch.appendLine(this.format('ERROR', category, String(msg), args));
            }
        } catch {
            console.error(`[ERROR] [${category}]`, message, ...args);
        }
    }
}
