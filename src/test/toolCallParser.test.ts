import * as assert from 'assert';
import {
    extractAllToolCalls,
    sanitizeAndRepairJson,
    validateToolArgs,
    normalizeToolArgs,
    isReadOnlyTool,
} from '../llm/toolCallParser';

suite('Tool Call Parser & Repair Tests', () => {
    test('extracts single tool call in markdown code block', () => {
        const input = 'Here is the tool call:\n```json\n{"tool": "get_current_proof_state", "args": {}}\n```\nLet me know.';
        const result = extractAllToolCalls(input);
        assert.strictEqual(result.toolCalls.length, 1);
        assert.strictEqual(result.toolCalls[0].tool, 'get_current_proof_state');
        assert.deepStrictEqual(result.toolCalls[0].args, {});
        assert.ok(result.prose.includes('Here is the tool call:'));
        assert.ok(result.prose.includes('Let me know.'));
    });

    test('extracts multiple tool calls in separate code blocks', () => {
        const input = `Checking state and script:
\`\`\`json
{"tool": "get_current_proof_state", "args": {}}
\`\`\`
and also:
\`\`\`json
{"tool": "get_current_proof_script", "args": {}}
\`\`\``;
        const result = extractAllToolCalls(input);
        assert.strictEqual(result.toolCalls.length, 2);
        assert.strictEqual(result.toolCalls[0].tool, 'get_current_proof_state');
        assert.strictEqual(result.toolCalls[1].tool, 'get_current_proof_script');
    });

    test('extracts bare JSON object with tool key', () => {
        const input = 'Sure, calling {"tool": "check_term_validity", "args": {"term": "reflexivity."}} right now.';
        const result = extractAllToolCalls(input);
        assert.strictEqual(result.toolCalls.length, 1);
        assert.strictEqual(result.toolCalls[0].tool, 'check_term_validity');
        assert.strictEqual(result.toolCalls[0].args.term, 'reflexivity.');
        assert.ok(result.prose.includes('Sure, calling'));
        assert.ok(result.prose.includes('right now.'));
    });

    test('strips thought blocks from prose', () => {
        const input = '<thought>I should inspect the proof state first.</thought>```json\n{"tool": "get_current_proof_state", "args": {}}\n```\nHere is your goal:';
        const result = extractAllToolCalls(input);
        assert.strictEqual(result.toolCalls.length, 1);
        assert.ok(!result.prose.includes('<thought>'));
        assert.ok(!result.prose.includes('inspect the proof state'));
        assert.ok(result.prose.includes('Here is your goal:'));
    });

    test('repairs unescaped backslashes in math/logic formulas', () => {
        const malformed = '{"tool": "validate_proof_state_change", "args": {"originalValue": "\\forall x, x = x", "desiredValue": "x = x", "proposedAddition": "intro."}}';
        const repaired = sanitizeAndRepairJson(malformed);
        const parsed = JSON.parse(repaired);
        assert.strictEqual(parsed.tool, 'validate_proof_state_change');
        assert.strictEqual(parsed.args.originalValue, '\\forall x, x = x');
    });

    test('repairs trailing commas', () => {
        const malformed = '{"tool": "check_term_validity", "args": {"term": "simpl.", }, }';
        const repaired = sanitizeAndRepairJson(malformed);
        const parsed = JSON.parse(repaired);
        assert.strictEqual(parsed.args.term, 'simpl.');
    });

    test('repairs single quotes in JSON', () => {
        const input = "{'tool': 'check_term_validity', 'args': {'term': 'auto.'}}";
        const result = extractAllToolCalls(input);
        assert.strictEqual(result.toolCalls.length, 1);
        assert.strictEqual(result.toolCalls[0].tool, 'check_term_validity');
        assert.strictEqual(result.toolCalls[0].args.term, 'auto.');
    });

    test('normalizes parameter aliases', () => {
        const rawValidate = { original: 'Goal A', desired: 'Goal B', tactic: 'reflexivity.' };
        const normValidate = normalizeToolArgs('validate_proof_state_change', rawValidate);
        assert.strictEqual(normValidate.originalValue, 'Goal A');
        assert.strictEqual(normValidate.desiredValue, 'Goal B');
        assert.strictEqual(normValidate.proposedAddition, 'reflexivity.');

        const rawSuggest = { hyp: 'H1', old: 'x = 0', new: 'x = 1', goal_index: '2' };
        const normSuggest = normalizeToolArgs('suggest_proof_state_edit', rawSuggest);
        assert.strictEqual(normSuggest.hypothesisName, 'H1');
        assert.strictEqual(normSuggest.originalValue, 'x = 0');
        assert.strictEqual(normSuggest.suggestedValue, 'x = 1');
        assert.strictEqual(normSuggest.goalIndex, 2);
    });

    test('validates tool arguments with Ajv schema', () => {
        const validArgs = {
            originalValue: 'A',
            desiredValue: 'B',
            proposedAddition: 'simpl.',
        };
        const validRes = validateToolArgs('validate_proof_state_change', validArgs);
        assert.strictEqual(validRes.valid, true);

        const invalidArgs = {
            originalValue: 'A',
            // missing desiredValue and proposedAddition
        };
        const invalidRes = validateToolArgs('validate_proof_state_change', invalidArgs);
        assert.strictEqual(invalidRes.valid, false);
        assert.ok(invalidRes.errors && invalidRes.errors.length > 0);
    });

    test('identifies read-only tools accurately', () => {
        assert.strictEqual(isReadOnlyTool('get_current_proof_state'), true);
        assert.strictEqual(isReadOnlyTool('get_current_proof_script'), true);
        assert.strictEqual(isReadOnlyTool('check_term_validity'), true);
        assert.strictEqual(isReadOnlyTool('validate_proof_state_change'), false);
        assert.strictEqual(isReadOnlyTool('suggest_proof_state_edit'), false);
    });
});
