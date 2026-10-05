import * as vscode from 'vscode';

export type LogCategory =
    | 'ProofState'
    | 'Prover:Coq'
    | 'Prover:Lean'
    | 'Agent:Chat'
    | 'Agent:Prover'
    | 'Webview'
    | 'Config'
    | 'LSP';

export class OutputLogger {
    private static channel: vscode.LogOutputChannel | undefined;

    public static readonly CHANNEL_NAME = 'Output Directed Prover';

    public static init(context: vscode.ExtensionContext): vscode.LogOutputChannel {
        if (!this.channel) {
            this.channel = vscode.window.createOutputChannel(this.CHANNEL_NAME, { log: true });
            context.subscriptions.push(this.channel);
            this.channel.info('[Config] Extension activated — unified LogOutputChannel ready.');
        }
        return this.channel;
    }

    public static getChannel(): vscode.LogOutputChannel {
        if (!this.channel) {
            this.channel = vscode.window.createOutputChannel(this.CHANNEL_NAME, { log: true });
        }
        return this.channel;
    }

    public static show(preserveFocus = true): void {
        this.getChannel().show(preserveFocus);
    }

    public static trace(category: LogCategory, message: string, ...args: any[]): void {
        if (args.length > 0) {
            this.getChannel().trace(`[${category}] ${message}`, ...args);
        } else {
            this.getChannel().trace(`[${category}] ${message}`);
        }
    }

    public static debug(category: LogCategory, message: string, ...args: any[]): void {
        if (args.length > 0) {
            this.getChannel().debug(`[${category}] ${message}`, ...args);
        } else {
            this.getChannel().debug(`[${category}] ${message}`);
        }
    }

    public static info(category: LogCategory, message: string, ...args: any[]): void {
        if (args.length > 0) {
            this.getChannel().info(`[${category}] ${message}`, ...args);
        } else {
            this.getChannel().info(`[${category}] ${message}`);
        }
    }

    public static warn(category: LogCategory, message: string, ...args: any[]): void {
        if (args.length > 0) {
            this.getChannel().warn(`[${category}] ${message}`, ...args);
        } else {
            this.getChannel().warn(`[${category}] ${message}`);
        }
    }

    public static error(category: LogCategory, message: string | Error, ...args: any[]): void {
        const msg = message instanceof Error ? (message.stack || message.message) : message;
        if (args.length > 0) {
            this.getChannel().error(`[${category}] ${msg}`, ...args);
        } else {
            this.getChannel().error(`[${category}] ${msg}`);
        }
    }
}
