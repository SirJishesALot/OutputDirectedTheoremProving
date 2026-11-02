import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import {
    detectTheoremCursorContext,
    findTheoremJumpPosition,
    isTutorialWarmupPath,
    parseTutorialTheorems,
} from '../utils/tutorialUtils';

suite('Tutorial Walkthrough Utilities Tests', () => {
    const tutorialPath = path.resolve(__dirname, '../../tutorial/tutorial_warmup.lean');
    const sampleTutorialText = fs.existsSync(tutorialPath)
        ? fs.readFileSync(tutorialPath, 'utf8')
        : [
              'set_option maxHeartbeats 10000000',
              '',
              '-- ========================================================================= --',
              '-- Facilitator Demo: Used in Section 3 of PILOT_TUTORIAL_SCRIPT.md           --',
              '-- ========================================================================= --',
              'theorem demo_step : ∀ n : Nat, (n + 0) * 1 = n := by',
              '  intro n',
              '  -- Place cursor on the line below to demo editing (n + 0) -> n',
              '  sorry',
              '',
              '-- ========================================================================= --',
              '-- Participant Warm-up: Used in Section 4 of PILOT_TUTORIAL_SCRIPT.md       --',
              '-- ========================================================================= --',
              'theorem warmup_exercise : ∀ (n m : Nat), (n * 1) + (0 + m) = n + m := by',
              '  intro n m',
              '  -- Participant places cursor on the line below',
              '  sorry',
          ].join('\n');

    test('identifies tutorial_warmup.lean file paths accurately', () => {
        assert.strictEqual(isTutorialWarmupPath('/workspace/tutorial/tutorial_warmup.lean'), true);
        assert.strictEqual(isTutorialWarmupPath('tutorial/TUTORIAL_WARMUP.LEAN'), true);
        assert.strictEqual(isTutorialWarmupPath('/workspace/tutorial/other.lean'), false);
    });

    test('parses demo_step and warmup_exercise theorem blocks from tutorial_warmup.lean', () => {
        const blocks = parseTutorialTheorems(sampleTutorialText);
        assert.strictEqual(blocks.length, 2);
        assert.strictEqual(blocks[0].name, 'demo_step');
        assert.strictEqual(blocks[0].declLine, 5);
        assert.strictEqual(blocks[0].introLine, 6);
        assert.strictEqual(blocks[0].sorryLine, 8);

        assert.strictEqual(blocks[1].name, 'warmup_exercise');
        assert.strictEqual(blocks[1].declLine, 13);
        assert.strictEqual(blocks[1].introLine, 14);
        assert.strictEqual(blocks[1].sorryLine, 16);
    });

    test('detects cursor context before and after intro inside demo_step and warmup_exercise', () => {
        // Line 1 (0-based 0): outside theorems
        const topCtx = detectTheoremCursorContext(sampleTutorialText, 0);
        assert.strictEqual(topCtx.theorem, null);
        assert.strictEqual(topCtx.isInProofZone, false);

        // Line 6 (0-based 5): theorem declaration line -> not yet in post-intro proof zone
        const declCtx = detectTheoremCursorContext(sampleTutorialText, 5);
        assert.strictEqual(declCtx.theorem, 'demo_step');
        assert.strictEqual(declCtx.isInProofZone, false);

        // Line 8 (0-based 7) and Line 9 (0-based 8): inside demo_step proof zone
        const commentLineCtx = detectTheoremCursorContext(sampleTutorialText, 7);
        assert.strictEqual(commentLineCtx.theorem, 'demo_step');
        assert.strictEqual(commentLineCtx.isInProofZone, true);
        assert.strictEqual(commentLineCtx.oneBasedLine, 8);

        const sorryLineCtx = detectTheoremCursorContext(sampleTutorialText, 8);
        assert.strictEqual(sorryLineCtx.theorem, 'demo_step');
        assert.strictEqual(sorryLineCtx.isInProofZone, true);
        assert.strictEqual(sorryLineCtx.oneBasedLine, 9);

        // Line 17 (0-based 16): inside warmup_exercise proof zone
        const warmupCtx = detectTheoremCursorContext(sampleTutorialText, 16);
        assert.strictEqual(warmupCtx.theorem, 'warmup_exercise');
        assert.strictEqual(warmupCtx.isInProofZone, true);
        assert.strictEqual(warmupCtx.oneBasedLine, 17);
    });

    test('dynamically tracks shifted line numbers after tactics are inserted in demo_step', () => {
        const lines = sampleTutorialText.split(/\r?\n/);
        // Insert two tactics right before `sorry` in demo_step (0-based line 8)
        lines.splice(8, 0, '  rw [Nat.add_zero]', '  rw [Nat.mul_one]');
        const editedText = lines.join('\n');

        const demoJump = findTheoremJumpPosition(editedText, 'demo_step');
        assert.deepStrictEqual(demoJump, { line: 10, character: 0 });

        const warmupJump = findTheoremJumpPosition(editedText, 'warmup_exercise');
        assert.deepStrictEqual(warmupJump, { line: 18, character: 0 });

        const warmupCtx = detectTheoremCursorContext(editedText, 18);
        assert.strictEqual(warmupCtx.theorem, 'warmup_exercise');
        assert.strictEqual(warmupCtx.isInProofZone, true);
    });
});
