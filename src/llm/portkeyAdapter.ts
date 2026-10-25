import * as vscode from 'vscode';
import { OutputLogger } from '../logging/logger';

export const DEFAULT_PORTKEY_MODEL = '@gcp-public-dataset-integration-anthropic/anthropic.claude-sonnet-5';
export const DEFAULT_PORTKEY_SLUG = '@gcp-public-dataset-integration-anthropic';
export const DEFAULT_PORTKEY_BASE_URL = 'https://api.portkey.ai/v1';

export function resolvePortkeyModel(rawModel: string, fallbackSlug: string): string {
    const trimmed = (rawModel || '').trim();
    if (!trimmed) {
        return DEFAULT_PORTKEY_MODEL;
    }
    if (trimmed.startsWith('@')) {
        return trimmed;
    }
    // Route by model family if no explicit @integration prefix was provided
    if (/claude/i.test(trimmed)) {
        return `@gcp-public-dataset-integration-anthropic/${trimmed.replace(/^\//, '')}`;
    }
    if (/gpt-|o1|o3/i.test(trimmed)) {
        return `@aws-public-dataset-integration-openai/${trimmed.replace(/^\//, '')}`;
    }
    if (/deepseek/i.test(trimmed)) {
        return `@azure-foundry-oss-public-dataset-integration/${trimmed.replace(/^\//, '')}`;
    }
    return `${fallbackSlug.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
}

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

export function isPortkeyCacheDisabled(): boolean {
    return vscode.workspace
        .getConfiguration()
        .get<boolean>('myExtension.portkeyDisableCache', true);
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

    const resolvedModel = resolvePortkeyModel(rawModel, slug);

    const disableCache = isPortkeyCacheDisabled();
    const defaultHeaders: Record<string, string> = {
        'x-portkey-api-key': apiKey,
    };
    if (disableCache) {
        defaultHeaders['x-portkey-cache-force-refresh'] = 'true';
    }

    const client = new OpenAI({
        apiKey: 'dummy',
        baseURL,
        defaultHeaders,
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
                ? resolvePortkeyModel(opts.model, slug)
                : resolvedModel;

            const bypassCache = isPortkeyCacheDisabled();
            const requestHeaders: Record<string, string> = bypassCache
                ? { 'x-portkey-cache-force-refresh': 'true' }
                : {};

            OutputLogger.info('LLM:Portkey', `Sending request to Portkey Gateway (model: ${targetModel}, cacheBypass: ${bypassCache})`);

            const requestPayload: any = {
                model: targetModel,
                messages: chatMessages,
                stream: true,
                max_tokens: Math.max(opts?.maxTokens ?? 4096, 4096),
            };

            const isNoTemperatureModel = /claude|thinking|reasoning|o1|o3/i.test(targetModel);
            if (!isNoTemperatureModel) {
                requestPayload.temperature = opts?.temperature ?? 0.2;
            }

            try {
                let stream;
                try {
                    stream = await client.chat.completions.create(requestPayload, { headers: requestHeaders });
                } catch (firstErr: any) {
                    const msg = (firstErr && firstErr.message) ? String(firstErr.message).toLowerCase() : '';
                    if (msg.includes('temperature') && (msg.includes('deprecated') || msg.includes('not supported') || msg.includes('unsupported'))) {
                        delete requestPayload.temperature;
                        stream = await client.chat.completions.create(requestPayload, { headers: requestHeaders });
                    } else if (msg.includes('max_tokens') && msg.includes('max_completion_tokens')) {
                        requestPayload.max_completion_tokens = requestPayload.max_tokens;
                        delete requestPayload.max_tokens;
                        delete requestPayload.temperature;
                        stream = await client.chat.completions.create(requestPayload, { headers: requestHeaders });
                    } else {
                        throw firstErr;
                    }
                }

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
