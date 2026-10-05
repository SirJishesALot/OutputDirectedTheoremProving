import * as vscode from 'vscode';
import { OutputLogger } from '../logging/logger';

export const DEFAULT_PORTKEY_MODEL = '@GCP-public-dataset-integration/gemini-3.1-pro-preview';
export const DEFAULT_PORTKEY_SLUG = '@GCP-public-dataset-integration';
export const DEFAULT_PORTKEY_BASE_URL = 'https://api.portkey.ai/v1';

export function getConfiguredPortkeyModel(): string {
    return vscode.workspace
        .getConfiguration()
        .get<string>('myExtension.defaultPortkeyModel', DEFAULT_PORTKEY_MODEL);
}

export function getConfiguredPortkeySlug(): string {
    return vscode.workspace
        .getConfiguration()
        .get<string>('myExtension.portkeyProviderSlug', DEFAULT_PORTKEY_SLUG);
}

export function getConfiguredPortkeyBaseUrl(): string {
    return (
        process.env.PORTKEY_BASE_URL ||
        vscode.workspace
            .getConfiguration()
            .get<string>('myExtension.portkeyBaseUrl', DEFAULT_PORTKEY_BASE_URL)
    );
}

export interface PortkeyAdapter {
    backend: 'portkey';
    model: string;
    sendRequest: (
        messages: any[],
        opts?: { maxTokens?: number; temperature?: number; model?: string },
        token?: vscode.CancellationToken
    ) => Promise<{ text: AsyncIterable<string> }>;
}

export async function createPortkeyAdapter(
    apiKey: string,
    modelId?: string
): Promise<PortkeyAdapter> {
    const OpenAI = require('openai');
    const baseURL = getConfiguredPortkeyBaseUrl();
    const slug = getConfiguredPortkeySlug();
    const rawModel = modelId || getConfiguredPortkeyModel() || DEFAULT_PORTKEY_MODEL;

    const resolvedModel = rawModel.startsWith('@')
        ? rawModel
        : `${slug.replace(/\/$/, '')}/${rawModel.replace(/^\//, '')}`;

    const client = new OpenAI({
        apiKey: 'dummy',
        baseURL,
        defaultHeaders: {
            'x-portkey-api-key': apiKey,
        },
    });

    return {
        backend: 'portkey',
        model: resolvedModel,
        sendRequest: async (messages: any[], opts?: any, token?: vscode.CancellationToken) => {
            const chatMessages = messages.map((m) => {
                if (typeof m === 'string') {
                    return { role: 'user', content: m };
                }
                if (m && typeof m === 'object' && m.role && m.content) {
                    return { role: m.role, content: m.content };
                }
                return { role: 'user', content: m?.text ?? String(m) };
            });

            const targetModel = opts?.model
                ? (opts.model.startsWith('@') ? opts.model : `${slug.replace(/\/$/, '')}/${opts.model.replace(/^\//, '')}`)
                : resolvedModel;

            OutputLogger.info('LLM:Portkey', `Sending request to Portkey Gateway (model: ${targetModel})`);

            try {
                const stream = await client.chat.completions.create({
                    model: targetModel,
                    messages: chatMessages,
                    max_tokens: Math.max(opts?.maxTokens ?? 4096, 4096),
                    temperature: opts?.temperature ?? 0.2,
                    stream: true,
                });

                return {
                    text: (async function* () {
                        for await (const chunk of stream) {
                            if (token && token.isCancellationRequested) {
                                break;
                            }
                            const content = chunk.choices[0]?.delta?.content;
                            if (content) {
                                yield content;
                            }
                        }
                    })(),
                };
            } catch (e: any) {
                OutputLogger.error('LLM:Portkey', 'Portkey API call failed:', e);
                throw new Error('Portkey API error: ' + (e && e.message ? e.message : String(e)));
            }
        },
    };
}
