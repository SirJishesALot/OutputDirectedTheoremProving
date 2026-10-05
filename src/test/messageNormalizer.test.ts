import * as assert from 'assert';
import {
    normalizeMessagesForGemini,
    normalizeMessagesAlternating,
} from '../llm/messageNormalizer';

suite('Message Normalizer Tests', () => {
    test('extracts system prompts and merges consecutive user turns for Gemini', () => {
        const messages = [
            { role: 'system', content: 'You are an automated prover.' },
            { role: 'user', content: 'Prove theorem A.' },
            { role: 'user', content: 'TOOL RESULT: Success.' },
            { role: 'user', content: 'Now finalize the proof.' },
        ];

        const result = normalizeMessagesForGemini(messages);
        assert.strictEqual(result.systemInstruction, 'You are an automated prover.');
        assert.strictEqual(result.contents.length, 1);
        assert.strictEqual(result.contents[0].role, 'user');
        assert.ok(result.contents[0].parts[0].text.includes('Prove theorem A.'));
        assert.ok(result.contents[0].parts[0].text.includes('TOOL RESULT: Success.'));
        assert.ok(result.contents[0].parts[0].text.includes('Now finalize the proof.'));
    });

    test('enforces alternating turns when model messages are interspersed', () => {
        const messages = [
            { role: 'user', content: 'What is 1 + 1?' },
            { role: 'assistant', content: '2' },
            { role: 'assistant', content: 'Is there anything else?' },
            { role: 'user', content: 'No thanks.' },
        ];

        const result = normalizeMessagesForGemini(messages);
        assert.strictEqual(result.contents.length, 3);
        assert.strictEqual(result.contents[0].role, 'user');
        assert.strictEqual(result.contents[1].role, 'model');
        assert.ok(result.contents[1].parts[0].text.includes('2\n\nIs there anything else?'));
        assert.strictEqual(result.contents[2].role, 'user');
    });

    test('normalizes messages for general alternating providers', () => {
        const messages = [
            { role: 'system', content: 'System prompt' },
            { role: 'user', content: 'Turn 1' },
            { role: 'user', content: 'Turn 2' },
            { role: 'assistant', content: 'Reply 1' },
        ];

        const result = normalizeMessagesAlternating(messages);
        assert.strictEqual(result.length, 3);
        assert.strictEqual(result[0].role, 'system');
        assert.strictEqual(result[1].role, 'user');
        assert.strictEqual(result[1].content, 'Turn 1\n\nTurn 2');
        assert.strictEqual(result[2].role, 'assistant');
        assert.strictEqual(result[2].content, 'Reply 1');
    });
});
