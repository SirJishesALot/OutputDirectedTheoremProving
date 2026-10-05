import * as assert from 'assert';
import {
    normalizeProofState,
    parsePanelFormatToGoals,
} from '../tools/proverTools';

suite('Proof State Matching & Normalization Tests', () => {
    test('normalizes logic operators and symbols', () => {
        const coqUnicode = '∀ x y : nat, x = y → (x + 0 = y) ∧ (x ≤ y)';
        const coqAscii = 'forall x y : nat, x = y -> (x + 0 = y) /\\ (x <= y)';

        const normUnicode = normalizeProofState(coqUnicode);
        const normAscii = normalizeProofState(coqAscii);

        assert.strictEqual(normUnicode.includes('forall'), true);
        assert.strictEqual(normUnicode.includes('->'), true);
        assert.strictEqual(normUnicode.includes('/\\'), true);
        assert.strictEqual(normAscii.includes('forall'), true);
    });

    test('parses multi-line hypothesis with continuation lines', () => {
        const panelStr = `H : forall (x : nat),
  x + 0 = x
n : nat
n + 0 = n`;

        const goals = parsePanelFormatToGoals(panelStr);
        assert.notStrictEqual(goals, null);
        assert.strictEqual(goals!.length, 1);
        assert.strictEqual(goals![0].hyps.length, 2);
        assert.deepStrictEqual(goals![0].hyps[0].names, ['H']);
        assert.ok(goals![0].hyps[0].ty.includes('x + 0 = x'));
        assert.deepStrictEqual(goals![0].hyps[1].names, ['n']);
        assert.strictEqual(goals![0].ty, 'n + 0 = n');
    });

    test('does not misparse goal statement binder lines as hypotheses', () => {
        const panelStr = `forall x : nat,
  x = x`;

        const goals = parsePanelFormatToGoals(panelStr);
        assert.notStrictEqual(goals, null);
        assert.strictEqual(goals!.length, 1);
        // The goal has no hypotheses in context, the entire block is the goal
        assert.strictEqual(goals![0].hyps.length, 0);
        assert.ok(goals![0].ty.includes('forall x : nat'));
    });

    test('parses multiple goals separated by double newlines', () => {
        const panelStr = `H : x = 0
x = 0

H : y = 1
y = 1`;

        const goals = parsePanelFormatToGoals(panelStr);
        assert.notStrictEqual(goals, null);
        assert.strictEqual(goals!.length, 2);
        assert.strictEqual(goals![0].ty, 'x = 0');
        assert.strictEqual(goals![1].ty, 'y = 1');
    });
});
