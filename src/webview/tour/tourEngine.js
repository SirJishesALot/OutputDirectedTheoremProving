const SVG_NS = 'http://www.w3.org/2000/svg';

const PHASE_LABELS = {
    1: 'Phase 1 · Orientation',
    2: 'Phase 2 · Direct Manipulation',
    3: 'Phase 3 · Agent Synthesis',
    4: 'Phase 4 · Chat Assistant',
    5: 'Phase 5 · Hands-On Practice',
};

/**
 * Collision-aware positioning math for the floating tour card.
 * Guarantees the popover stays inside the viewport and flips away from overflowing edges.
 */
export function calculatePopoverPosition(targetRect, popoverRect, preferredPlacement) {
    const margin = 12;
    const arrowGap = 14;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (preferredPlacement === 'center' || !targetRect) {
        const top = Math.max(margin, Math.round((viewportHeight - popoverRect.height) / 2));
        const left = Math.max(margin, Math.round((viewportWidth - popoverRect.width) / 2));
        return { top, left, placement: 'center' };
    }

    if (preferredPlacement === 'left-editor') {
        const left = Math.max(16, margin + 4);
        const top = Math.max(
            margin,
            Math.min(
                Math.round(viewportHeight * 0.34 - popoverRect.height / 2),
                viewportHeight - popoverRect.height - margin
            )
        );
        return { top, left, placement: 'left-editor' };
    }

    let placement = preferredPlacement || 'bottom';
    const spaceAbove = targetRect.top - arrowGap - margin;
    const spaceBelow = viewportHeight - targetRect.bottom - arrowGap - margin;
    const spaceLeft = targetRect.left - arrowGap - margin;
    const spaceRight = viewportWidth - targetRect.right - arrowGap - margin;

    // Auto-flip if preferred side overflows viewport and opposite side has more room
    if (placement === 'bottom' && popoverRect.height > spaceBelow && spaceAbove > spaceBelow) {
        placement = 'top';
    } else if (placement === 'top' && popoverRect.height > spaceAbove && spaceBelow > spaceAbove) {
        placement = 'bottom';
    } else if (placement === 'left' && popoverRect.width > spaceLeft) {
        placement = spaceRight >= popoverRect.width ? 'right' : (spaceBelow >= spaceAbove ? 'bottom' : 'top');
    } else if (placement === 'right' && popoverRect.width > spaceRight) {
        placement = spaceLeft >= popoverRect.width ? 'left' : (spaceBelow >= spaceAbove ? 'bottom' : 'top');
    }

    let top = 0;
    let left = 0;

    if (placement === 'bottom') {
        top = targetRect.bottom + arrowGap;
        left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
    } else if (placement === 'top') {
        top = targetRect.top - popoverRect.height - arrowGap;
        left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
    } else if (placement === 'left') {
        top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
        left = targetRect.left - popoverRect.width - arrowGap;
    } else if (placement === 'right') {
        top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2;
        left = targetRect.right + arrowGap;
    }

    // Clamp within viewport bounds
    left = Math.round(Math.max(margin, Math.min(left, viewportWidth - popoverRect.width - margin)));
    top = Math.round(Math.max(margin, Math.min(top, viewportHeight - popoverRect.height - margin)));

    return { top, left, placement };
}

export class TourEngine {
    constructor(options = {}) {
        this.steps = options.steps || [];
        this.vscode = options.vscode;
        this.getProseMirrorState = options.getProseMirrorState || (() => null);
        this.currentIndex = 0;
        this.isActive = false;
        this.history = [];
        this.isWaitingForAction = false;
        this.isActionUnlocked = false;
        this.dynamicInstructionText = null;

        // DOM references
        this.overlayContainer = null;
        this.backdropSvg = null;
        this.cutoutRect = null;
        this.focusRing = null;
        this.popoverElement = null;
        this.arrowElement = null;
        this.instructionEl = null;
        this.instructionTextEl = null;
        this.instructionIconEl = null;
        this.primaryBtnEl = null;

        // Latest known host editor cursor context
        this.lastCursorContext = {
            theorem: null,
            line: null,
            isInProofZone: false,
        };

        // Listener cleanup registries
        this.stepCleanups = [];
        this.globalCleanups = [];
        this.resizeObserver = null;
        this.mutationObserver = null;
        this.observedTarget = null;
        this.rafId = null;
        this.hasPositionedOnce = false;
    }

    setSteps(steps) {
        this.steps = Array.isArray(steps) ? steps : [];
    }

    getState() {
        return {
            isActive: this.isActive,
            currentStepIndex: this.currentIndex,
            totalSteps: this.steps.length,
            history: [...this.history],
            isWaitingForAction: this.isWaitingForAction && !this.isActionUnlocked,
        };
    }

    getCurrentStep() {
        if (!this.isActive || this.currentIndex < 0 || this.currentIndex >= this.steps.length) {
            return null;
        }
        return this.steps[this.currentIndex];
    }

    start(fromStepIndex = 0) {
        if (!this.steps.length) {
            return;
        }
        if (this.isActive) {
            this.unbindStepTriggers();
        } else {
            this.isActive = true;
            this.hasPositionedOnce = false;
            this.history = [];
            this.renderOverlay();
            this.bindGlobalListeners();
        }

        const clamped = Math.max(0, Math.min(fromStepIndex, this.steps.length - 1));
        this.goTo(clamped, false);
    }

    next() {
        if (!this.isActive) {
            return;
        }
        const step = this.getCurrentStep();
        if (!step) {
            return;
        }
        if (this.currentIndex >= this.steps.length - 1) {
            this.complete();
            return;
        }
        this.goTo(this.currentIndex + 1, true);
    }

    prev() {
        if (!this.isActive || this.currentIndex <= 0) {
            return;
        }
        this.goTo(this.currentIndex - 1, false);
    }

    goTo(index, recordHistory = true) {
        if (!this.isActive || index < 0 || index >= this.steps.length) {
            return;
        }

        const prevStep = this.getCurrentStep();
        if (prevStep && this.stepCleanups.length > 0) {
            this.unbindStepTriggers(prevStep);
        } else if (prevStep && typeof prevStep.onExit === 'function') {
            try {
                prevStep.onExit(this);
            } catch (err) {
                console.warn('[TourEngine] Error in step.onExit:', err);
            }
        }

        if (recordHistory && this.currentIndex !== index) {
            this.history.push(this.currentIndex);
        }

        this.currentIndex = index;
        const step = this.steps[this.currentIndex];
        const isManual = !step.trigger || step.trigger.type === 'MANUAL_NEXT';

        this.isWaitingForAction = !isManual;
        this.isActionUnlocked = false;
        this.dynamicInstructionText = null;

        this.renderStepContent(step);
        this.bindStepTriggers(step);

        if (typeof step.onEnter === 'function') {
            try {
                step.onEnter(this);
            } catch (err) {
                console.warn('[TourEngine] Error in step.onEnter:', err);
            }
        }

        // Evaluate initial ProseMirror state if the step listens to PROSEMIRROR_CHANGE
        if (step.trigger && step.trigger.type === 'PROSEMIRROR_CHANGE') {
            const pmState = this.getProseMirrorState();
            if (pmState && pmState.doc) {
                this.evaluateProseMirrorStep(step, pmState.doc, pmState);
            }
        }

        // Scroll target element into view if clipped outside the current viewport
        const initialTarget = this.resolveTargetElement(step);
        if (initialTarget && typeof initialTarget.scrollIntoView === 'function') {
            const rect = initialTarget.getBoundingClientRect();
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                initialTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }

        this.scheduleReposition();
    }

    complete() {
        try {
            if (typeof window.localStorage !== 'undefined') {
                window.localStorage.setItem('odtp_tutorial_completed', 'true');
            }
        } catch {
            // Ignore sandboxed storage errors in restricted webview contexts
        }
        try {
            if (this.vscode && typeof this.vscode.getState === 'function' && typeof this.vscode.setState === 'function') {
                const prev = this.vscode.getState() || {};
                this.vscode.setState({ ...prev, odtp_tutorial_completed: true });
            }
        } catch {
            // Ignore state persistence failure
        }
        if (this.vscode) {
            this.vscode.postMessage({ command: 'tour:completed' });
        }
        this.stop(true);
    }

    stop(completed = false) {
        if (!this.isActive) {
            return;
        }
        const currentStep = this.getCurrentStep();
        this.unbindStepTriggers(currentStep);
        this.unbindGlobalListeners();

        if (this.rafId !== null) {
            window.cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        if (this.overlayContainer && this.overlayContainer.parentNode) {
            this.overlayContainer.parentNode.removeChild(this.overlayContainer);
        }

        this.overlayContainer = null;
        this.backdropSvg = null;
        this.cutoutRect = null;
        this.focusRing = null;
        this.popoverElement = null;
        this.arrowElement = null;
        this.instructionEl = null;
        this.instructionTextEl = null;
        this.instructionIconEl = null;
        this.primaryBtnEl = null;
        this.observedTarget = null;
        this.isActive = false;
        this.isWaitingForAction = false;
        this.isActionUnlocked = false;

        if (!completed && this.vscode) {
            this.vscode.postMessage({ command: 'tour:dismissed', stepIndex: this.currentIndex });
        }
    }

    unlockCurrentStep(completedMessage, primaryLabelOverride) {
        if (!this.isActive) {
            return;
        }
        this.isActionUnlocked = true;
        if (completedMessage) {
            this.dynamicInstructionText = completedMessage;
        }
        if (this.instructionEl) {
            this.instructionEl.classList.add('is-completed');
        }
        if (this.instructionIconEl) {
            this.instructionIconEl.textContent = '✓';
        }
        if (this.instructionTextEl && completedMessage) {
            this.instructionTextEl.innerHTML = completedMessage;
        }
        if (this.primaryBtnEl) {
            this.primaryBtnEl.disabled = false;
            const step = this.getCurrentStep();
            this.primaryBtnEl.textContent =
                primaryLabelOverride || step?.unlockedButtonLabel || step?.primaryButtonLabel || 'Continue >';
        }
        this.scheduleReposition();
    }

    relockCurrentStep(promptHtml) {
        if (!this.isActive) {
            return;
        }
        const step = this.getCurrentStep();
        if (!step || !step.trigger || step.trigger.type === 'MANUAL_NEXT') {
            return;
        }
        this.isActionUnlocked = false;
        this.dynamicInstructionText = null;
        if (this.instructionEl) {
            this.instructionEl.classList.remove('is-completed');
        }
        if (this.instructionIconEl) {
            this.instructionIconEl.textContent = '→';
        }
        if (this.instructionTextEl) {
            this.instructionTextEl.innerHTML = promptHtml || step.instructionPrompt || '';
        }
        if (this.primaryBtnEl) {
            this.primaryBtnEl.disabled = true;
            this.primaryBtnEl.textContent = step.waitingButtonLabel || 'Complete action…';
        }
        this.scheduleReposition();
    }

    setInstructionStatus(statusHtml, isCompleted = false) {
        if (!this.isActive || !this.instructionEl || !this.instructionTextEl) {
            return;
        }
        this.instructionEl.style.display = 'flex';
        this.instructionEl.classList.toggle('is-completed', Boolean(isCompleted));
        if (this.instructionIconEl) {
            this.instructionIconEl.textContent = isCompleted ? '✓' : '⋯';
        }
        this.instructionTextEl.innerHTML = statusHtml;
        this.scheduleReposition();
    }

    // =========================================================================
    // DOM Overlay, SVG Spotlight Cutout & Popover Rendering
    // =========================================================================

    renderOverlay() {
        if (this.overlayContainer) {
            return;
        }

        const root = document.createElement('div');
        root.className = 'odtp-tour-root';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'false');
        root.setAttribute('aria-label', 'Interactive Tutorial Walkthrough');

        // SVG Spotlight Backdrop with <mask id="odtp-spotlight-mask">
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'odtp-tour-backdrop');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');

        const defs = document.createElementNS(SVG_NS, 'defs');
        const mask = document.createElementNS(SVG_NS, 'mask');
        mask.setAttribute('id', 'odtp-spotlight-mask');

        const maskBg = document.createElementNS(SVG_NS, 'rect');
        maskBg.setAttribute('x', '0');
        maskBg.setAttribute('y', '0');
        maskBg.setAttribute('width', '100%');
        maskBg.setAttribute('height', '100%');
        maskBg.setAttribute('fill', 'white');

        const initCx = Math.round(window.innerWidth / 2);
        const initCy = Math.round(window.innerHeight / 2);
        const cutout = document.createElementNS(SVG_NS, 'rect');
        cutout.setAttribute('id', 'odtp-spotlight-cutout');
        cutout.setAttribute('x', String(initCx));
        cutout.setAttribute('y', String(initCy));
        cutout.setAttribute('width', '0');
        cutout.setAttribute('height', '0');
        cutout.setAttribute('rx', '8');
        cutout.setAttribute('ry', '8');
        cutout.setAttribute('fill', 'black');
        cutout.style.x = `${initCx}px`;
        cutout.style.y = `${initCy}px`;
        cutout.style.width = '0px';
        cutout.style.height = '0px';

        mask.appendChild(maskBg);
        mask.appendChild(cutout);
        defs.appendChild(mask);

        const dimRect = document.createElementNS(SVG_NS, 'rect');
        dimRect.setAttribute('class', 'odtp-tour-backdrop-dim');
        dimRect.setAttribute('x', '0');
        dimRect.setAttribute('y', '0');
        dimRect.setAttribute('width', '100%');
        dimRect.setAttribute('height', '100%');
        dimRect.setAttribute('mask', 'url(#odtp-spotlight-mask)');

        svg.appendChild(defs);
        svg.appendChild(dimRect);

        // Pulsing Focus Beacon Ring
        const focusRing = document.createElement('div');
        focusRing.className = 'odtp-tour-focus-ring';

        // Floating Popover / Modal Card
        const card = document.createElement('div');
        card.className = 'odtp-tour-card';

        root.appendChild(svg);
        root.appendChild(focusRing);
        root.appendChild(card);
        document.body.appendChild(root);

        this.overlayContainer = root;
        this.backdropSvg = svg;
        this.cutoutRect = cutout;
        this.focusRing = focusRing;
        this.popoverElement = card;
    }

    renderStepContent(step) {
        if (!this.popoverElement) {
            return;
        }

        const card = this.popoverElement;
        card.innerHTML = '';

        const isModal = !step.targetSelector && step.placement === 'center';
        const isCelebration = Boolean(step.isCelebration);
        card.classList.toggle('odtp-tour-modal', isModal);

        if (this.backdropSvg) {
            this.backdropSvg.classList.toggle('is-editor-focus', step.placement === 'left-editor');
        }

        // Directional arrow
        const arrow = document.createElement('div');
        arrow.className = 'odtp-tour-arrow';
        if (isModal) {
            arrow.classList.add('is-hidden');
        }
        card.appendChild(arrow);
        this.arrowElement = arrow;

        // Optional hero badge on Welcome / Celebration modals
        if (isModal && step.heroIcon) {
            const hero = document.createElement('div');
            hero.className = 'odtp-tour-hero-icon' + (isCelebration ? ' is-celebration' : '');
            hero.textContent = step.heroIcon;
            card.appendChild(hero);
        }

        // Header
        const header = document.createElement('div');
        header.className = 'odtp-tour-header';

        const meta = document.createElement('div');
        meta.className = 'odtp-tour-header-meta';

        const badgeRow = document.createElement('div');
        badgeRow.className = 'odtp-tour-step-badge-row';

        const stepCounter = document.createElement('span');
        stepCounter.className = 'odtp-tour-step-counter';
        stepCounter.textContent = `STEP ${this.currentIndex + 1} OF ${this.steps.length}`;
        badgeRow.appendChild(stepCounter);

        if (step.phase && PHASE_LABELS[step.phase]) {
            const phasePill = document.createElement('span');
            phasePill.className = 'odtp-tour-phase-pill';
            phasePill.textContent = PHASE_LABELS[step.phase];
            badgeRow.appendChild(phasePill);
        }

        const titleEl = document.createElement('h3');
        titleEl.className = 'odtp-tour-title';
        titleEl.textContent = step.title;

        meta.appendChild(badgeRow);
        meta.appendChild(titleEl);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'odtp-tour-close-btn';
        closeBtn.setAttribute('aria-label', 'Close tutorial walkthrough');
        closeBtn.title = 'Pause / Close Tutorial (Esc)';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => this.stop(false));

        header.appendChild(meta);
        header.appendChild(closeBtn);
        card.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'odtp-tour-body';
        body.innerHTML = step.bodyHtml || '';
        card.appendChild(body);

        // Instruction Callout Box
        const instruction = document.createElement('div');
        instruction.className = 'odtp-tour-instruction';
        if (!step.instructionPrompt) {
            instruction.style.display = 'none';
        }
        const iconSpan = document.createElement('span');
        iconSpan.className = 'odtp-tour-instruction-icon';
        iconSpan.textContent = '→';

        const textSpan = document.createElement('span');
        textSpan.innerHTML = step.instructionPrompt || '';

        instruction.appendChild(iconSpan);
        instruction.appendChild(textSpan);
        card.appendChild(instruction);

        this.instructionEl = instruction;
        this.instructionIconEl = iconSpan;
        this.instructionTextEl = textSpan;

        // Quick Actions (if configured on step)
        if (Array.isArray(step.quickActions) && step.quickActions.length > 0) {
            const qaContainer = document.createElement('div');
            qaContainer.className = 'odtp-tour-quick-actions';
            step.quickActions.forEach((qa) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'odtp-tour-quick-action-btn';
                btn.textContent = qa.label;
                btn.addEventListener('click', () => {
                    if (typeof qa.action === 'function') {
                        qa.action(this);
                    }
                });
                qaContainer.appendChild(btn);
            });
            card.appendChild(qaContainer);
        }

        // Progress Bar / Dots
        const progress = document.createElement('div');
        progress.className = 'odtp-tour-progress';
        progress.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < this.steps.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'odtp-tour-progress-dot';
            if (i < this.currentIndex) {
                dot.classList.add('is-done');
            } else if (i === this.currentIndex) {
                dot.classList.add('is-active');
            }
            progress.appendChild(dot);
        }
        card.appendChild(progress);

        // Footer Controls
        const footer = document.createElement('div');
        footer.className = 'odtp-tour-footer' + (isCelebration ? ' is-full-cta' : '');

        const primaryBtn = document.createElement('button');
        primaryBtn.type = 'button';
        primaryBtn.className = 'odtp-tour-btn-primary' + (isCelebration ? ' is-celebration-cta' : '');

        const isGated = this.isWaitingForAction && !this.isActionUnlocked;
        if (isGated) {
            primaryBtn.disabled = true;
            primaryBtn.textContent = step.waitingButtonLabel || 'Complete action…';
        } else {
            primaryBtn.disabled = false;
            primaryBtn.textContent = step.primaryButtonLabel || (isCelebration ? 'Start Exploring' : 'Next >');
        }

        primaryBtn.addEventListener('click', () => {
            if (this.isWaitingForAction && !this.isActionUnlocked) {
                return;
            }
            this.next();
        });
        this.primaryBtnEl = primaryBtn;

        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'odtp-tour-btn-secondary';
        prevBtn.textContent = '< Prev';
        prevBtn.disabled = this.currentIndex === 0;
        prevBtn.addEventListener('click', () => this.prev());

        const skipBtn = document.createElement('button');
        skipBtn.type = 'button';
        skipBtn.className = 'odtp-tour-skip-btn';
        skipBtn.textContent = 'Skip Tour';
        skipBtn.addEventListener('click', () => this.stop(false));

        if (isCelebration) {
            footer.appendChild(primaryBtn);
            const subFooter = document.createElement('div');
            subFooter.className = 'odtp-tour-modal-subfooter';
            subFooter.appendChild(prevBtn);
            footer.appendChild(subFooter);
        } else {
            footer.appendChild(skipBtn);
            const navGroup = document.createElement('div');
            navGroup.className = 'odtp-tour-nav-group';
            navGroup.appendChild(prevBtn);
            navGroup.appendChild(primaryBtn);
            footer.appendChild(navGroup);
        }

        card.appendChild(footer);
    }

    resolveTargetElement(step) {
        if (!step || !step.targetSelector) {
            return null;
        }
        const candidates = [step.targetSelector];
        if (step.fallbackSelector) {
            candidates.push(step.fallbackSelector);
        }
        for (const selector of candidates) {
            const el = document.querySelector(selector);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    return el;
                }
            }
        }
        return document.querySelector(step.targetSelector);
    }

    scheduleReposition() {
        if (!this.isActive) {
            return;
        }
        if (this.rafId !== null) {
            window.cancelAnimationFrame(this.rafId);
        }
        this.rafId = window.requestAnimationFrame(() => {
            this.rafId = null;
            this.repositionActiveStep();
        });
    }

    repositionActiveStep() {
        const step = this.getCurrentStep();
        if (!step || !this.popoverElement) {
            return;
        }
        const targetEl = this.resolveTargetElement(step);
        this.observeTargetElement(targetEl);
        this.updateSpotlight(targetEl, step);
        this.positionPopover(targetEl, step.placement, step);
    }

    updateSpotlight(targetEl, step) {
        if (!this.cutoutRect || !this.focusRing) {
            return;
        }
        const padding = typeof step?.spotlightPadding === 'number' ? step.spotlightPadding : 6;

        if (!targetEl) {
            const cx = Math.round(window.innerWidth / 2);
            const cy = Math.round(window.innerHeight / 2);
            this.applyCutoutGeometry(cx, cy, 0, 0);
            this.focusRing.classList.remove('is-visible');
            return;
        }

        const rect = targetEl.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
            const cx = Math.round(window.innerWidth / 2);
            const cy = Math.round(window.innerHeight / 2);
            this.applyCutoutGeometry(cx, cy, 0, 0);
            this.focusRing.classList.remove('is-visible');
            return;
        }

        const x = Math.max(2, Math.round(rect.left - padding));
        const y = Math.max(2, Math.round(rect.top - padding));
        const width = Math.min(window.innerWidth - x - 2, Math.round(rect.width + padding * 2));
        const height = Math.min(window.innerHeight - y - 2, Math.round(rect.height + padding * 2));

        this.applyCutoutGeometry(x, y, Math.max(0, width), Math.max(0, height));

        this.focusRing.style.left = `${x}px`;
        this.focusRing.style.top = `${y}px`;
        this.focusRing.style.width = `${Math.max(0, width)}px`;
        this.focusRing.style.height = `${Math.max(0, height)}px`;
        this.focusRing.classList.add('is-visible');
    }

    applyCutoutGeometry(x, y, width, height) {
        if (!this.cutoutRect) {
            return;
        }
        this.cutoutRect.setAttribute('x', String(x));
        this.cutoutRect.setAttribute('y', String(y));
        this.cutoutRect.setAttribute('width', String(width));
        this.cutoutRect.setAttribute('height', String(height));
        this.cutoutRect.style.x = `${x}px`;
        this.cutoutRect.style.y = `${y}px`;
        this.cutoutRect.style.width = `${width}px`;
        this.cutoutRect.style.height = `${height}px`;
    }

    positionPopover(targetEl, preferredPlacement) {
        if (!this.popoverElement) {
            return;
        }

        const card = this.popoverElement;
        const popoverRect = card.getBoundingClientRect();
        const targetRect = targetEl ? targetEl.getBoundingClientRect() : null;

        const { top, left, placement } = calculatePopoverPosition(
            targetRect && targetRect.width > 0 && targetRect.height > 0 ? targetRect : null,
            popoverRect,
            preferredPlacement
        );

        card.setAttribute('data-placement', placement);
        card.style.right = 'auto';
        card.style.bottom = 'auto';

        if (!this.hasPositionedOnce) {
            card.style.transition = 'none';
            card.style.top = `${top}px`;
            card.style.left = `${left}px`;
            // Force synchronous layout before re-enabling smooth transitions
            void card.offsetHeight;
            card.style.transition = '';
            this.hasPositionedOnce = true;
        } else {
            card.style.top = `${top}px`;
            card.style.left = `${left}px`;
        }

        if (!this.arrowElement) {
            return;
        }

        if (placement === 'center') {
            this.arrowElement.classList.add('is-hidden');
            return;
        }

        if (placement === 'left-editor') {
            this.arrowElement.classList.remove('is-hidden');
            this.arrowElement.style.left = '';
            this.arrowElement.style.right = '';
            this.arrowElement.style.bottom = '';
            this.arrowElement.style.top = `${Math.round(popoverRect.height / 2 - 6)}px`;
            return;
        }

        if (!targetRect) {
            this.arrowElement.classList.add('is-hidden');
            return;
        }

        this.arrowElement.classList.remove('is-hidden');
        this.arrowElement.style.top = '';
        this.arrowElement.style.bottom = '';
        this.arrowElement.style.left = '';
        this.arrowElement.style.right = '';

        const edgePad = 18;
        if (placement === 'top' || placement === 'bottom') {
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const arrowLeft = Math.round(
                Math.max(edgePad, Math.min(targetCenterX - left - 6, popoverRect.width - edgePad - 12))
            );
            this.arrowElement.style.left = `${arrowLeft}px`;
        } else if (placement === 'left' || placement === 'right') {
            const targetCenterY = targetRect.top + targetRect.height / 2;
            const arrowTop = Math.round(
                Math.max(edgePad, Math.min(targetCenterY - top - 6, popoverRect.height - edgePad - 12))
            );
            this.arrowElement.style.top = `${arrowTop}px`;
        }
    }

    // =========================================================================
    // Interactive Gating & Event Listeners
    // =========================================================================

    bindStepTriggers(step) {
        this.unbindStepTriggers();
        if (!step || !step.trigger) {
            return;
        }

        const trigger = step.trigger;

        if (trigger.type === 'DOM_CLICK') {
            const clickSelector = trigger.selector || step.targetSelector;
            if (!clickSelector) {
                return;
            }
            const useCapture = Boolean(trigger.useCapture);
            const onDocClick = (event) => {
                if (!this.isActive || this.getCurrentStep() !== step) {
                    return;
                }
                const target = event.target instanceof Element ? event.target.closest(clickSelector) : null;
                if (!target) {
                    return;
                }

                // Optional pre-check in capture phase (e.g. verifying #chatInput has text before main.js clears it)
                if (typeof trigger.preValidate === 'function' && !trigger.preValidate(event, this)) {
                    return;
                }

                const runPostCheck = () => {
                    if (!this.isActive || this.getCurrentStep() !== step) {
                        return;
                    }
                    const isValid = typeof trigger.validate === 'function' ? trigger.validate(event, this) : true;
                    if (!isValid) {
                        return;
                    }
                    if (typeof trigger.onValidatedClick === 'function') {
                        trigger.onValidatedClick(event, this);
                    }
                    if (trigger.waitForExtensionEvent) {
                        return;
                    }
                    if (trigger.autoAdvance !== false) {
                        this.next();
                    } else {
                        this.unlockCurrentStep(trigger.completedPrompt);
                    }
                };

                // Defer by 1 tick so underlying ProseMirror / UI handlers update state first
                const timerId = window.setTimeout(runPostCheck, 15);
                this.stepCleanups.push(() => window.clearTimeout(timerId));
            };

            document.addEventListener('click', onDocClick, useCapture);
            this.stepCleanups.push(() => document.removeEventListener('click', onDocClick, useCapture));
        } else if (trigger.type === 'DOM_INPUT') {
            const inputSelector = trigger.selector || step.targetSelector;
            const inputEl = inputSelector ? document.querySelector(inputSelector) : null;
            if (inputEl) {
                const onInput = (event) => {
                    if (!this.isActive || this.getCurrentStep() !== step) {
                        return;
                    }
                    const isValid = typeof trigger.validate === 'function' ? trigger.validate(event, this) : true;
                    if (isValid) {
                        if (trigger.autoAdvance) {
                            this.next();
                        } else {
                            this.unlockCurrentStep(trigger.completedPrompt);
                        }
                    }
                };
                inputEl.addEventListener('input', onInput);
                this.stepCleanups.push(() => inputEl.removeEventListener('input', onInput));
            }
        }
    }

    unbindStepTriggers(exitingStep) {
        while (this.stepCleanups.length > 0) {
            const cleanup = this.stepCleanups.pop();
            if (typeof cleanup === 'function') {
                try {
                    cleanup();
                } catch {
                    // ignore cleanup error
                }
            }
        }
        if (exitingStep && typeof exitingStep.onExit === 'function') {
            try {
                exitingStep.onExit(this);
            } catch (err) {
                console.warn('[TourEngine] Error in step.onExit:', err);
            }
        }
    }

    onExtensionMessage(msg) {
        if (!msg) {
            return;
        }
        const eventType = msg.command || msg.type;

        if (eventType === 'tour:cursorMoved') {
            this.lastCursorContext = {
                theorem: msg.theorem || null,
                line: typeof msg.line === 'number' ? msg.line : null,
                isInProofZone: Boolean(msg.isInProofZone),
            };
        }

        if (eventType === 'tour:start') {
            const startIndex = typeof msg.stepIndex === 'number' ? msg.stepIndex : 0;
            this.start(startIndex);
            return;
        }

        if (!this.isActive) {
            return;
        }

        // Re-anchor spotlight whenever proof state updates (e.g. goals render or resize)
        if (eventType === 'proofUpdate' || eventType === 'tour:proofStateUpdated') {
            this.scheduleReposition();
        }

        const step = this.getCurrentStep();
        if (!step) {
            return;
        }

        if (typeof step.onMessage === 'function') {
            step.onMessage(msg, this);
            // If step.onMessage already advanced the step, stop processing for the old step
            if (this.getCurrentStep() !== step) {
                return;
            }
        }

        if (step.trigger && step.trigger.type === 'EXTENSION_MESSAGE') {
            const expected = step.trigger.event;
            const matchesEvent = Array.isArray(expected)
                ? expected.includes(eventType)
                : expected === eventType;

            if (matchesEvent) {
                const isValid = typeof step.trigger.validate === 'function' ? step.trigger.validate(msg, this) : true;
                if (isValid) {
                    if (msg.isQueryResponse) {
                        this.unlockCurrentStep(
                            step.trigger.completedPrompt ||
                                'Ready! Click <strong>Continue &gt;</strong> to proceed.'
                        );
                    } else if (step.trigger.autoAdvance !== false) {
                        this.next();
                    } else {
                        this.unlockCurrentStep(step.trigger.completedPrompt);
                    }
                }
            }
        }
    }

    onProseMirrorDocChanged(doc, editorState) {
        if (!this.isActive) {
            return;
        }
        this.scheduleReposition();
        const step = this.getCurrentStep();
        if (!step) {
            return;
        }
        if (typeof step.onProseMirrorChange === 'function') {
            step.onProseMirrorChange({ doc, editorState }, this);
            if (this.getCurrentStep() !== step) {
                return;
            }
        }
        if (step.trigger && step.trigger.type === 'PROSEMIRROR_CHANGE') {
            this.evaluateProseMirrorStep(step, doc, editorState);
        }
    }

    evaluateProseMirrorStep(step, doc, editorState) {
        const isValid =
            typeof step.trigger.validate === 'function'
                ? step.trigger.validate({ doc, editorState }, this)
                : false;

        if (isValid) {
            if (step.trigger.autoAdvance === true) {
                this.next();
            } else if (!this.isActionUnlocked) {
                this.unlockCurrentStep(step.trigger.completedPrompt);
            }
        } else if (this.isActionUnlocked && step.trigger.relockOnInvalid !== false) {
            this.relockCurrentStep(step.instructionPrompt);
        }
    }

    bindGlobalListeners() {
        this.unbindGlobalListeners();

        const onResize = () => this.scheduleReposition();
        const onScroll = () => this.scheduleReposition();
        const onKeyDown = (ev) => {
            if (!this.isActive) {
                return;
            }
            if (ev.key === 'Escape') {
                ev.preventDefault();
                ev.stopPropagation();
                this.stop(false);
            }
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('keydown', onKeyDown, true);

        this.globalCleanups.push(() => window.removeEventListener('resize', onResize));
        this.globalCleanups.push(() => window.removeEventListener('scroll', onScroll, true));
        this.globalCleanups.push(() => window.removeEventListener('keydown', onKeyDown, true));

        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => this.scheduleReposition());
            if (document.body) {
                this.resizeObserver.observe(document.body);
            }
        }

        if (typeof MutationObserver !== 'undefined') {
            const editorContainer = document.getElementById('editor');
            if (editorContainer) {
                this.mutationObserver = new MutationObserver(() => this.scheduleReposition());
                this.mutationObserver.observe(editorContainer, {
                    childList: true,
                    subtree: true,
                });
            }
        }
    }

    observeTargetElement(targetEl) {
        if (!this.resizeObserver) {
            return;
        }
        if (this.observedTarget && this.observedTarget !== targetEl) {
            try {
                this.resizeObserver.unobserve(this.observedTarget);
            } catch {
                // ignore
            }
            this.observedTarget = null;
        }
        if (targetEl && targetEl !== document.body) {
            try {
                this.resizeObserver.observe(targetEl);
                this.observedTarget = targetEl;
            } catch {
                // ignore
            }
        }
    }

    unbindGlobalListeners() {
        while (this.globalCleanups.length > 0) {
            const fn = this.globalCleanups.pop();
            if (typeof fn === 'function') {
                fn();
            }
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }
        this.observedTarget = null;
    }
}
