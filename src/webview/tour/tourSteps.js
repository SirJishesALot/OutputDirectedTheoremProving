/**
 * Normalizes a Lean goal formula so benign formatting variations
 * (e.g. `⊢ n * 1 = n` vs `⊢ (n) * 1 = n`) match reliably during Step 6.
 */
export function normalizeGoalFormula(text) {
    if (!text) {
        return '';
    }
    let normalized = String(text)
        .replace(/^⊢\s*/, '')
        .replace(/\s+/g, '')
        .trim();
    while (/\(([A-Za-z0-9_']+)\)/.test(normalized)) {
        normalized = normalized.replace(/\(([A-Za-z0-9_']+)\)/g, '$1');
    }
    return normalized;
}

/**
 * Validates that the ProseMirror proof state document reflects editing
 * `(n + 0) * 1 = n` -> `n * 1 = n` in `demo_step`.
 */
export function isDemoStepGoalEdited(doc, helpers) {
    if (!doc || !helpers) {
        return false;
    }
    const { getDiffFromNode, getFullStateBeforeAfter } = helpers;

    let goalMatched = false;

    doc.descendants((node) => {
        if (node.type && node.type.name === 'goalType') {
            const { deletedText, insertedText } = getDiffFromNode(node);
            const hasDiff = Boolean(deletedText || insertedText);
            if (!hasDiff) {
                return true;
            }

            const { before: nodeBefore, after: nodeAfter } = getFullStateBeforeAfter(node);
            const normBefore = normalizeGoalFormula(nodeBefore);
            const normAfter = normalizeGoalFormula(nodeAfter);

            if (normBefore !== normAfter && normAfter === 'n*1=n') {
                goalMatched = true;
                return false;
            }

            // Also accept explicit replacement of `(n + 0)` or `n + 0` with `n`
            const normDel = String(deletedText || '').replace(/\s+/g, '');
            const normIns = String(insertedText || '').replace(/\s+/g, '');
            if (
                ((normDel === '(n+0)' || normDel === 'n+0') && normIns === 'n') ||
                (normDel === '+0' && normIns === '')
            ) {
                if (normAfter === 'n*1=n') {
                    goalMatched = true;
                    return false;
                }
            }
        }
        return true;
    });

    if (goalMatched) {
        return true;
    }

    // Fallback check across full state lines
    const { before, after } = getFullStateBeforeAfter(doc);
    if (before === after) {
        return false;
    }
    const afterLines = after.split('\n').map((line) => normalizeGoalFormula(line));
    return afterLines.includes('n*1=n');
}

/**
 * Builds the 14-step pedagogical state machine for `tutorial/tutorial_warmup.lean`.
 */
export function createTourSteps(helpers) {
    const {
        vscode,
        isSuggestionsEnabled,
        getDiffFromNode,
        getFullStateBeforeAfter,
        updateWebviewStatus,
    } = helpers;

    const isMac =
        typeof navigator !== 'undefined' &&
        /Mac|iPod|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');
    const modKey = isMac ? 'Cmd' : 'Ctrl';

    return [
        // =====================================================================
        // PHASE 1: Orientation & Layout (Steps 1 - 3)
        // =====================================================================
        {
            id: 'WELCOME',
            phase: 1,
            heroIcon: '✦',
            title: 'Welcome to Output-Directed Theorem Proving',
            targetSelector: null,
            placement: 'center',
            bodyHtml: `
                <p>In traditional theorem proving, you have to guess tactic names and exact syntax (<code>intro</code>, <code>induction</code>, <code>rw</code>) just to see how a goal changes.</p>
                <p><strong>Output-Directed Proving flips this around:</strong> You directly edit the proof state to what you want it to look like, and an AI agent synthesizes and formally verifies the Lean 4 tactics for you.</p>
                <p>In this self-paced walkthrough, you will solve two short proofs in <code>tutorial_warmup.lean</code>.</p>
            `,
            primaryButtonLabel: 'Get Started →',
            trigger: {
                type: 'MANUAL_NEXT',
            },
            onEnter: () => {
                vscode.postMessage({ command: 'tour:ensureTutorialFile' });
            },
        },
        {
            id: 'HEADER_CONTROLS',
            phase: 1,
            title: 'Prover & Automation Controls',
            targetSelector: '.panel-header',
            placement: 'bottom',
            bodyHtml: `
                <p>Notice the header badges and mode controls above:</p>
                <ul>
                    <li><strong>Prover: Lean</strong> — Confirms Lean 4 is active and verifying every step.</li>
                    <li><strong>Model Badge</strong> — Shows the AI model backing tactic synthesis (click anytime to switch).</li>
                    <li><strong>Auto / Manual</strong> — <code>Auto</code> mode refreshes proof goals automatically as you move your cursor in the code.</li>
                </ul>
            `,
            primaryButtonLabel: 'Next >',
            trigger: {
                type: 'MANUAL_NEXT',
            },
        },
        {
            id: 'CURSOR_DEMO_STEP',
            phase: 1,
            title: 'Step 1: Position Your Cursor',
            targetSelector: '#webviewStatus',
            fallbackSelector: '.panel-header',
            placement: 'bottom',
            bodyHtml: `
                <p>Look at the editor on the left in <code>tutorial_warmup.lean</code>.</p>
                <p>Find <code>theorem demo_step</code> and place your cursor inside the proof after <code>intro n</code> (on line 8 or the <code>sorry</code> line 9).</p>
            `,
            instructionPrompt: 'Move your cursor inside <code>demo_step</code> in <code>tutorial_warmup.lean</code>.',
            waitingButtonLabel: 'Waiting for cursor…',
            unlockedButtonLabel: 'Continue >',
            quickActions: [
                {
                    label: '⌖ Jump to demo_step (Line 9)',
                    action: () => {
                        vscode.postMessage({
                            command: 'tour:jumpToLocation',
                            file: 'tutorial/tutorial_warmup.lean',
                            theorem: 'demo_step',
                            line: 9,
                        });
                    },
                },
            ],
            trigger: {
                type: 'EXTENSION_MESSAGE',
                event: 'tour:cursorMoved',
                completedPrompt:
                    'Cursor is positioned inside <code>demo_step</code>! Click <strong>Continue &gt;</strong>.',
                validate: (msg) => msg.theorem === 'demo_step' && Boolean(msg.isInProofZone),
            },
            onEnter: (engine) => {
                if (typeof updateWebviewStatus === 'function') {
                    updateWebviewStatus('Place cursor inside theorem demo_step…');
                }
                if (
                    engine.lastCursorContext.theorem === 'demo_step' &&
                    engine.lastCursorContext.isInProofZone
                ) {
                    engine.unlockCurrentStep(
                        'Cursor is positioned inside <code>demo_step</code>! Click <strong>Continue &gt;</strong>.'
                    );
                }
                vscode.postMessage({ command: 'tour:queryCursor', silentIfUnchanged: true });
            },
        },

        // =====================================================================
        // PHASE 2: Direct Manipulation Loop on `demo_step` (Steps 4 - 6)
        // =====================================================================
        {
            id: 'VIEW_PROOF_STATE',
            phase: 2,
            title: 'The Living Proof State',
            targetSelector: '#editor',
            placement: 'bottom',
            bodyHtml: `
                <p>The goal is <code>⊢ (n + 0) * 1 = n</code> with hypothesis <code>n : Nat</code>.</p>
                <p>Unlike a standard static info view, this panel is a live, interactive document editor.</p>
            `,
            primaryButtonLabel: 'Next >',
            trigger: {
                type: 'MANUAL_NEXT',
            },
        },
        {
            id: 'ENABLE_SUGGESTIONS',
            phase: 2,
            title: 'Enable Track-Changes Mode',
            targetSelector: '#btn-toggle-suggestions',
            fallbackSelector: '.menu button:first-child',
            placement: 'bottom',
            bodyHtml: `
                <p>To edit the proof state, you first turn on suggestion mode. This acts like track-changes in a collaborative document.</p>
            `,
            instructionPrompt: 'Click the <strong>Enable Suggestions</strong> button now.',
            waitingButtonLabel: 'Click Enable Suggestions…',
            unlockedButtonLabel: 'Continue >',
            trigger: {
                type: 'DOM_CLICK',
                selector: '#btn-toggle-suggestions, .menu button:first-child',
                validate: () => Boolean(isSuggestionsEnabled()),
            },
            onEnter: (engine) => {
                if (isSuggestionsEnabled()) {
                    engine.unlockCurrentStep(
                        'Suggestions mode is active! Click <strong>Continue &gt;</strong>.'
                    );
                }
            },
        },
        {
            id: 'EDIT_GOAL_TERM',
            phase: 2,
            title: 'Edit the Goal Directly',
            targetSelector: '#editor .goalType',
            fallbackSelector: '#editor',
            placement: 'bottom',
            bodyHtml: `
                <p>We know <code>n + 0</code> simplifies to <code>n</code>.</p>
                <p>Select <code>(n + 0)</code> in the goal above and type <code>n</code> to replace it. Notice how deleted text is struck through in red and your desired term appears in green!</p>
            `,
            instructionPrompt: 'Change <code>(n + 0) * 1 = n</code> to <code>n * 1 = n</code>.',
            waitingButtonLabel: 'Edit goal above…',
            unlockedButtonLabel: 'Continue >',
            trigger: {
                type: 'PROSEMIRROR_CHANGE',
                autoAdvance: false,
                completedPrompt: 'Desired goal <code>⊢ n * 1 = n</code> recorded! Click <strong>Continue &gt;</strong>.',
                validate: ({ doc }) =>
                    isDemoStepGoalEdited(doc, { getDiffFromNode, getFullStateBeforeAfter }),
            },
            onEnter: (engine) => {
                // Ensure suggestion mode stays enabled if user stepped back and forth
                if (!isSuggestionsEnabled()) {
                    const toggleBtn = document.querySelector('#btn-toggle-suggestions, .menu button:first-child');
                    if (toggleBtn instanceof HTMLElement) {
                        toggleBtn.click();
                    }
                }
                const pmState = engine.getProseMirrorState();
                if (
                    pmState &&
                    pmState.doc &&
                    isDemoStepGoalEdited(pmState.doc, { getDiffFromNode, getFullStateBeforeAfter })
                ) {
                    engine.unlockCurrentStep(
                        'Desired goal <code>⊢ n * 1 = n</code> recorded! Click <strong>Continue &gt;</strong>.'
                    );
                }
            },
        },

        // =====================================================================
        // PHASE 3: Agent Tactics & CodeLens (Steps 7 - 9)
        // =====================================================================
        {
            id: 'IMPLEMENT_CHANGES',
            phase: 3,
            title: 'Ask the Prover Agent',
            targetSelector: '.synthesize-button',
            fallbackSelector: '.menu',
            placement: 'bottom',
            bodyHtml: `
                <p>Now let the agent find and verify the exact Lean 4 tactic that achieves your target proof state!</p>
            `,
            instructionPrompt: 'Click <strong>Implement Changes</strong>.',
            waitingButtonLabel: 'Click Implement Changes…',
            unlockedButtonLabel: 'Continue >',
            trigger: {
                type: 'DOM_CLICK',
                selector: '.synthesize-button',
                waitForExtensionEvent: true,
                onValidatedClick: (_ev, engine) => {
                    engine._synthesisStartedOnStep7 = true;
                    engine._tacticAppliedOnStep7 = false;
                    engine.setInstructionStatus(
                        'Synthesizing proof &amp; checking against Lean 4…',
                        false
                    );
                    if (engine.primaryBtnEl) {
                        engine.primaryBtnEl.textContent = 'Synthesizing…';
                    }
                },
            },
            onEnter: (engine) => {
                engine._synthesisStartedOnStep7 = false;
                engine._tacticAppliedOnStep7 = false;
            },
            onMessage: (msg, engine) => {
                const evt = msg.command || msg.type;
                if (evt === 'proverAgentStarted') {
                    engine._synthesisStartedOnStep7 = true;
                    engine.setInstructionStatus(
                        'Synthesizing proof &amp; checking against Lean 4…',
                        false
                    );
                    if (engine.primaryBtnEl) {
                        engine.primaryBtnEl.textContent = 'Synthesizing…';
                    }
                } else if (evt === 'proofSuggestionApplied' || evt === 'tour:tacticSuggested') {
                    engine._tacticAppliedOnStep7 = true;
                    engine.next();
                } else if (evt === 'proverAgentDone' && engine._synthesisStartedOnStep7 && !engine._tacticAppliedOnStep7) {
                    engine.unlockCurrentStep(
                        'Synthesis finished without inserting a tactic (check your LLM model badge if needed). Try <strong>Implement Changes</strong> again, or click <strong>Continue &gt;</strong>.',
                        'Continue >'
                    );
                }
            },
        },
        {
            id: 'REVIEW_SUGGESTION',
            phase: 3,
            title: 'CodeLens in the Editor',
            targetSelector: null,
            placement: 'left-editor',
            bodyHtml: `
                <p>Look at your Lean editor on the left!</p>
                <p>The agent synthesized a tactic (e.g. <code>rw [Nat.add_zero]</code>) and inserted it into <code>tutorial_warmup.lean</code> highlighted in green.</p>
                <p>Right above that line are two CodeLens actions: <strong>✓ Accept</strong> and <strong>✕ Reject</strong>.</p>
            `,
            instructionPrompt: `Click <strong>Accept</strong> in the editor, or press <code>${modKey}+Shift+Y</code>.`,
            waitingButtonLabel: 'Accept in editor…',
            unlockedButtonLabel: 'Continue >',
            trigger: {
                type: 'EXTENSION_MESSAGE',
                event: 'tour:suggestionAccepted',
            },
            onMessage: (msg, engine) => {
                const evt = msg.command || msg.type;
                if (evt === 'tour:suggestionRejected') {
                    engine.unlockCurrentStep(
                        'Suggestion rejected and cleanly reverted! Click <strong>&lt; Prev</strong> to try again, or <strong>Continue &gt;</strong>.'
                    );
                }
            },
        },
        {
            id: 'PROOF_STATE_UPDATED',
            phase: 3,
            title: 'Verified Proof Progression',
            targetSelector: '#editor',
            placement: 'bottom',
            bodyHtml: `
                <p>Look at the proof state now: <code>(n + 0)</code> is simplified, and the updated goal is <code>⊢ n * 1 = n</code>!</p>
                <p>Lean's kernel checked the synthesized tactic with <strong>100% formal soundness</strong>—no unverified AI hallucinations can ever slip into your proof.</p>
            `,
            primaryButtonLabel: 'Next >',
            trigger: {
                type: 'MANUAL_NEXT',
            },
        },

        // =====================================================================
        // PHASE 4: Conversational Assistant Chat (Steps 10 - 11)
        // =====================================================================
        {
            id: 'CHAT_CONSULT',
            phase: 4,
            title: 'Need Ideas? Consult the Assistant',
            targetSelector: '#chat',
            placement: 'top',
            bodyHtml: `
                <p>If you aren't sure what transformation to make next, you can ask the assistant in natural language.</p>
            `,
            instructionPrompt: 'Type <code>"What lemma simplifies n * 1 = n?"</code> and click <strong>Send</strong>, or use the quick prompt below.',
            waitingButtonLabel: 'Send chat message…',
            quickActions: [
                {
                    label: '✦ Insert prompt: "What lemma simplifies n * 1 = n?"',
                    action: () => {
                        const input = document.getElementById('chatInput');
                        if (input instanceof HTMLInputElement) {
                            input.value = 'What lemma simplifies n * 1 = n?';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.focus();
                        }
                    },
                },
            ],
            trigger: {
                type: 'DOM_CLICK',
                selector: '#chatSend',
                useCapture: true,
                preValidate: () => {
                    const input = document.getElementById('chatInput');
                    return Boolean(input instanceof HTMLInputElement && input.value.trim().length > 0);
                },
            },
        },
        {
            id: 'CHAT_PROJECTED_SUGGESTION',
            phase: 4,
            title: 'Projected State Changes',
            targetSelector: '#chatLog',
            fallbackSelector: '#chat',
            placement: 'top',
            bodyHtml: `
                <p>The assistant explains the relevant lemma (such as <code>Nat.mul_one</code>) and can even project a suggested state transformation directly onto your Proof State editor above for you to review and implement!</p>
            `,
            primaryButtonLabel: 'Continue to Hands-on Practice >',
            trigger: {
                type: 'MANUAL_NEXT',
            },
        },

        // =====================================================================
        // PHASE 5: Self-Paced Practice & Wrap-Up (Steps 12 - 14)
        // =====================================================================
        {
            id: 'WARMUP_EXERCISE_START',
            phase: 5,
            title: 'Your Turn: Solve the Warmup Exercise',
            targetSelector: '#editor',
            placement: 'bottom',
            bodyHtml: `
                <p>In <code>tutorial_warmup.lean</code>, scroll down to <code>theorem warmup_exercise</code>:</p>
                <p><code>∀ (n m : Nat), (n * 1) + (0 + m) = n + m</code></p>
                <p>Place your cursor inside the proof after <code>intro n m</code> (on the <code>sorry</code> line).</p>
            `,
            instructionPrompt: 'Move your cursor inside <code>warmup_exercise</code> in <code>tutorial_warmup.lean</code>.',
            waitingButtonLabel: 'Waiting for cursor…',
            unlockedButtonLabel: 'Continue >',
            quickActions: [
                {
                    label: '⌖ Jump to warmup_exercise',
                    action: () => {
                        vscode.postMessage({
                            command: 'tour:jumpToLocation',
                            file: 'tutorial/tutorial_warmup.lean',
                            theorem: 'warmup_exercise',
                            line: 17,
                        });
                    },
                },
            ],
            trigger: {
                type: 'EXTENSION_MESSAGE',
                event: 'tour:cursorMoved',
                completedPrompt:
                    'Cursor is inside <code>warmup_exercise</code>! Click <strong>Continue &gt;</strong>.',
                validate: (msg) => msg.theorem === 'warmup_exercise' && Boolean(msg.isInProofZone),
            },
            onEnter: (engine) => {
                if (
                    engine.lastCursorContext.theorem === 'warmup_exercise' &&
                    engine.lastCursorContext.isInProofZone
                ) {
                    engine.unlockCurrentStep(
                        'Cursor is inside <code>warmup_exercise</code>! Click <strong>Continue &gt;</strong>.'
                    );
                }
                vscode.postMessage({ command: 'tour:queryCursor', silentIfUnchanged: true });
            },
        },
        {
            id: 'WARMUP_EDIT',
            phase: 5,
            title: 'Simplify (n * 1) or (0 + m)',
            targetSelector: '#editor',
            placement: 'bottom',
            bodyHtml: `
                <p>Put the full Output-Directed workflow together on your own:</p>
                <ol>
                    <li>Click <strong>Enable Suggestions</strong> (if not already active).</li>
                    <li>Replace <code>(n * 1)</code> with <code>n</code> (or <code>(0 + m)</code> with <code>m</code>).</li>
                    <li>Click <strong>Implement Changes</strong>.</li>
                    <li>Click <strong>Accept</strong> (<code>${modKey}+Shift+Y</code>) on the suggested tactic in the editor!</li>
                </ol>
            `,
            instructionPrompt: 'Edit the warmup goal, click <strong>Implement Changes</strong>, and <strong>Accept</strong> the tactic.',
            waitingButtonLabel: 'Accept warmup tactic…',
            unlockedButtonLabel: 'Finish Tutorial >',
            trigger: {
                type: 'EXTENSION_MESSAGE',
                event: 'tour:suggestionAccepted',
            },
            onMessage: (msg, engine) => {
                const evt = msg.command || msg.type;
                if (evt === 'proverAgentStarted') {
                    engine.setInstructionStatus(
                        'Synthesizing your warmup tactic in Lean 4…',
                        false
                    );
                } else if (evt === 'proofSuggestionApplied' || evt === 'tour:tacticSuggested') {
                    engine.setInstructionStatus(
                        `Tactic ready in editor! Click <strong>Accept</strong> (<code>${modKey}+Shift+Y</code>) on the left to finish!`,
                        false
                    );
                }
            },
        },
        {
            id: 'TUTORIAL_COMPLETE',
            phase: 5,
            isCelebration: true,
            heroIcon: '🚀',
            title: "Now it's your turn! — You're Ready to Prove!",
            targetSelector: null,
            placement: 'center',
            bodyHtml: `
                <p>You've mastered the core Output-Directed Theorem Proving loop!</p>
                <div class="odtp-tour-recap-steps">
                    <span>1. Direct Manipulation</span>
                    <span class="odtp-tour-recap-arrow">→</span>
                    <span>2. Implement Changes</span>
                    <span class="odtp-tour-recap-arrow">→</span>
                    <span>3. Accept &amp; Verify</span>
                </div>
                <p>Try finishing the remaining <code>(0 + m)</code> step in <code>warmup_exercise</code> on your own, or explore any Lean / Rocq proof file.</p>
                <div class="odtp-tour-cheatsheet">
                    <div class="odtp-tour-cheatsheet-title">Quick Reference Cheatsheet</div>
                    <div class="odtp-tour-cheatsheet-grid">
                        <span class="odtp-tour-kbd">${modKey} + Enter</span>
                        <span>Refresh proof state manually</span>
                        <span class="odtp-tour-kbd">${modKey} + Shift + Y</span>
                        <span>Accept suggested tactic</span>
                        <span class="odtp-tour-kbd">${modKey} + Shift + N</span>
                        <span>Reject suggested tactic</span>
                        <span class="odtp-tour-kbd">${modKey} + Z</span>
                        <span>Undo edits in the Proof State panel</span>
                        <span class="odtp-tour-kbd">Revert All</span>
                        <span>Discard all unapplied state edits</span>
                    </div>
                </div>
            `,
            primaryButtonLabel: 'Start Exploring',
            trigger: {
                type: 'MANUAL_NEXT',
            },
        },
    ];
}
