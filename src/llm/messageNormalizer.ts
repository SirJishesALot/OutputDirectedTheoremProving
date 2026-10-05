export interface NormalizedGeminiPayload {
    systemInstruction?: string;
    contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | string;
    content?: string;
    text?: string;
    parts?: Array<{ text: string }>;
}

function extractTextFromMessage(msg: ChatMessage | string): string {
    if (typeof msg === 'string') return msg;
    if (typeof msg.content === 'string') return msg.content;
    if (typeof msg.text === 'string') return msg.text;
    if (Array.isArray(msg.parts)) {
        return msg.parts.map((p) => p.text || '').join('');
    }
    return '';
}

/**
 * Normalizes message history into strictly alternating user/model turns for Gemini / Vertex AI,
 * extracting system messages into a dedicated systemInstruction.
 */
export function normalizeMessagesForGemini(
    messages: Array<ChatMessage | string>
): NormalizedGeminiPayload {
    const systemParts: string[] = [];
    const flattenedTurns: Array<{ role: 'user' | 'model'; text: string }> = [];

    for (const msg of messages) {
        if (typeof msg === 'string') {
            flattenedTurns.push({ role: 'user', text: msg });
            continue;
        }

        const role = (msg.role || 'user').toLowerCase();
        const text = extractTextFromMessage(msg).trim();
        if (!text) continue;

        if (role === 'system') {
            systemParts.push(text);
        } else if (role === 'assistant' || role === 'model') {
            flattenedTurns.push({ role: 'model', text });
        } else {
            flattenedTurns.push({ role: 'user', text });
        }
    }

    // Merge consecutive turns with the same role
    const consolidatedTurns: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const turn of flattenedTurns) {
        const last = consolidatedTurns[consolidatedTurns.length - 1];
        if (last && last.role === turn.role) {
            // Append to existing turn
            const existingText = last.parts[0]?.text ?? '';
            last.parts[0] = { text: `${existingText}\n\n${turn.text}` };
        } else {
            consolidatedTurns.push({
                role: turn.role,
                parts: [{ text: turn.text }],
            });
        }
    }

    // Vertex AI requires the first turn to be 'user'
    if (consolidatedTurns.length > 0 && consolidatedTurns[0].role === 'model') {
        consolidatedTurns.unshift({
            role: 'user',
            parts: [{ text: 'Please proceed.' }],
        });
    }

    return {
        systemInstruction: systemParts.length > 0 ? systemParts.join('\n\n') : undefined,
        contents: consolidatedTurns,
    };
}

/**
 * Normalizes a list of messages so that consecutive same-role user or assistant
 * messages are merged, preserving system prompts at the start.
 */
export function normalizeMessagesAlternating(
    messages: Array<ChatMessage | string>
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    const result: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

    for (const msg of messages) {
        const text = extractTextFromMessage(msg).trim();
        if (!text) continue;

        let role: 'system' | 'user' | 'assistant' = 'user';
        if (typeof msg !== 'string' && msg.role) {
            const r = msg.role.toLowerCase();
            if (r === 'system') role = 'system';
            else if (r === 'assistant' || r === 'model') role = 'assistant';
            else role = 'user';
        }

        const last = result[result.length - 1];
        if (last && last.role === role && role !== 'system') {
            last.content = `${last.content}\n\n${text}`;
        } else {
            result.push({ role, content: text });
        }
    }

    return result;
}
