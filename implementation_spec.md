# Technical Implementation Specification: ODTP Interactive Walkthrough Tutorial Engine

## 1. Executive Summary & Vision

This specification defines the architecture, UI components, interaction design, state machine, and extension integration for an interactive, self-paced walkthrough tutorial for the **Output-Directed Theorem Prover (ODTP)** in VS Code.

Inspired by the guided tour shown in `Screen Recording 2026-10-28 at 19.12.56.mov` (which features spotlight focus overlays, anchored popover cards, step progression counters, interactive gating, animated beacons, and a completion modal), this walkthrough guides a user step-by-step through solving proofs in `tutorial/tutorial_warmup.lean`.

The tutorial runs inside the ODTP Webview panel with bidirectional coordination with the VS Code extension host to monitor editor cursor placement, text selections, and tactic accept/reject events.

---

## 2. System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   VS Code Host Environment                                   │
│                                                                                              │
│   ┌──────────────────────────────────────────┐    ┌──────────────────────────────────────┐   │
│   │        Active Text Editor Pane           │    │       ProofStatePanel (Webview)      │   │
│   │      (tutorial_warmup.lean)              │    │                                      │   │
│   │                                          │    │  ┌────────────────────────────────┐  │   │
│   │  - Cursor Position Tracking              │    │  │       TourEngine Overlay       │  │   │
│   │  - CodeLens (Accept/Reject Tactic)       │    │  │  - SVG Spotlight Mask Cutout   │  │   │
│   │  - Document Edit Watcher                 │    │  │  - Floating Popover Tooltip    │  │   │
│   │  - Auto-open tutorial file               │    │  │  - Interactive Action Gate     │  │   │
│   │                                          │    │  │  - Animated Attention Beacon   │  │   │
│   └────────────────────┬─────────────────────┘    │  └───────────────┬────────────────┘  │   │
│                        │                          │                  │                   │   │
│                        │  postMessage / RPC       │                  │                   │   │
│                        ▼                          │                  ▼                   │   │
│   ┌──────────────────────────────────────────┐    │  ┌────────────────────────────────┐  │   │
│   │          Extension Host Router           │◄───┼─►│     ProseMirror Proof State    │  │   │
│   │  - onDidChangeTextEditorSelection        │    │  │  - "Enable Suggestions"        │  │   │
│   │  - SuggestionManager (Accept/Reject)     │    │  │  - "Implement Changes"         │  │   │
│   │  - Command: startTutorialWalkthrough     │    │  │  - Assistant Chat Input / Stream│  │   │
│   └──────────────────────────────────────────┘    │  └────────────────────────────────┘  │   │
│                                                   └──────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Component Boundaries
1. **Extension Host (`src/extension.ts` & `src/webview/proofStatePanel.ts`)**:
   - Manages tour activation (`outputdirectedtheoremproving.startTutorialWalkthrough`).
   - Automatically opens `tutorial/tutorial_warmup.lean` and splits the editor beside the webview.
   - Listens to editor events (cursor line, active document, CodeLens accepted/rejected).
   - Bridges editor state changes to the Webview via `postMessage`.
2. **Webview Tour Engine (`src/webview/tourEngine.js`)**:
   - Manages tour lifecycle, step state machine, DOM spotlight overlays, collision-aware popover positioning, and user interaction gating.
   - Observes DOM mutations in ProseMirror to verify when edits (strikethrough / additions) are created.
   - Intercepts or hooks UI events (`Enable Suggestions`, `Implement Changes`, Chat queries) to trigger smooth transitions.

---

## 3. UI Layout & Visual Specifications

The visual design mirrors the sleek, modern aesthetic observed in the reference video, adapted to VS Code's native design tokens (`--vscode-*` CSS variables) to look native in both dark and light themes.

### 3.1 Spotlight & Backdrop Overlay
- **Backdrop (`.odtp-tour-backdrop`)**:
  - Full-viewport fixed overlay (`z-index: 99990; pointer-events: none;`).
  - Uses an SVG `<mask id="spotlight-mask">` with a dark semi-transparent fill (`rgba(0, 0, 0, 0.65)` in light mode, `rgba(0, 0, 0, 0.75)` in dark mode).
  - The cutout rectangle has smooth rounded corners (`rx: 8px, ry: 8px`) and 6px padding around the target DOM element.
  - Smooth CSS `transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1)` on cutout `x, y, width, height` when transitioning between steps.
- **Attention Beacon & Focus Ring (`.odtp-tour-focus-ring`)**:
  - Placed directly around the active DOM target.
  - Border: `2px solid var(--vscode-focusBorder, #007fd4)`.
  - Box shadow pulse animation (`box-shadow: 0 0 0 0 rgba(0, 127, 212, 0.5)` -> `0 0 0 10px rgba(0, 127, 212, 0)` repeating every 1.6s).
  - Target element retains full interactivity (`pointer-events: auto`) through the cutout.

### 3.2 Floating Popover Card (`.odtp-tour-card`)
- **Container**:
  - `position: absolute; z-index: 99995; width: 340px; max-width: calc(100vw - 32px);`
  - Background: `var(--vscode-editorWidget-background, #252526)`.
  - Border: `1px solid var(--vscode-widget-border, #454545)`.
  - Border radius: `10px`.
  - Shadow: `0 8px 32px rgba(0, 0, 0, 0.36), 0 2px 8px rgba(0, 0, 0, 0.18)`.
  - Arrow indicator pointing toward target element (SVG triangle with matching border and background).
- **Header (`.odtp-tour-header`)**:
  - Step counter badge: `STEP 3 OF 14` (font-size: `10px`, font-weight: `700`, uppercase, tracking: `0.08em`, color: `var(--vscode-descriptionForeground)`).
  - Title: 14px bold (`var(--vscode-foreground)`).
  - Close button: `×` icon button (24x24px, hover background `var(--vscode-toolbar-hoverBackground)`).
- **Body (`.odtp-tour-body`)**:
  - Explanatory copy (12.5px, line-height: `1.55`, `var(--vscode-foreground)`).
  - Task/Instruction callout box (`.odtp-tour-instruction`):
    - Border-left: `3px solid var(--vscode-textLink-foreground)`.
    - Background: `var(--vscode-textBlockQuote-background)`.
    - Distinct italicized prompt: e.g. *"Click 'Enable Suggestions' to begin."*
- **Footer (`.odtp-tour-footer`)**:
  - Progress dots or progress bar (`.odtp-tour-progress`).
  - Button Group:
    - `Previous` (`<` button or text, disabled on step 1).
    - `Next` (`>` or "Continue", active on informational steps).
    - Dynamic Action Button: e.g. "I'm Ready", "Try It", "Got It", "Finish".
    - `Skip Tour` link/text on bottom-left.

### 3.3 Celebration Completion Modal (`.odtp-tour-modal`)
- Displayed on the final step (matching 01:42 of the reference video).
- Centered fixed modal card (`width: 440px; padding: 28px; border-radius: 14px; text-align: left;`).
- Visual trophy / rocket icon + Headline: **"Now it's your turn!"**
- Bulleted quick-reference recap (Direct manipulation -> Implement Changes -> Accept/Reject).
- Prominent Primary Button: **"Start Exploring"** (`background: var(--vscode-button-background); padding: 10px 20px; font-weight: 600; width: 100%;`).

---

## 4. Complete Step-by-Step State Machine Specification

The tutorial is structured into **14 sequential steps** across 5 pedagogical phases using `tutorial/tutorial_warmup.lean`.

```
Phase 1: Orientation ───────► Phase 2: Direct Manipulation Loop ─────► Phase 3: Agent Tactics
 (Steps 1 - 3)                         (Steps 4 - 6)                      (Steps 7 - 9)
                                                                                │
                                                                                ▼
Phase 5: Self-Paced Practice ◄──── Phase 4: Chat Assistant ◄────────────────────┘
   (Steps 12 - 14)                     (Steps 10 - 11)
```

---

### Phase 1: Orientation & Layout (Steps 1 – 3)

#### Step 1: Welcome & Core Philosophy
- **Step ID**: `WELCOME`
- **Target**: Screen Center (Modal presentation)
- **Title**: Welcome to Output-Directed Theorem Proving
- **Body**:
  > In traditional theorem proving, you have to guess tactic names and syntax (`intro`, `induction`, `rw`) to make progress. 
  > 
  > **Output-Directed Proving flips this around:** You directly edit the proof state to what you want it to look like, and an AI agent synthesizes and verifies the Lean tactics for you.
- **Trigger / Advance**: Click `"Get Started →"` button.
- **Actions on Mount**: Extension host ensures `tutorial/tutorial_warmup.lean` is open in the left editor column.

#### Step 2: Prover Header & Mode Controls
- **Step ID**: `HEADER_CONTROLS`
- **Target Selector**: `.panel-header` (Webview header container)
- **Placement**: `bottom`
- **Title**: Prover & Automation Controls
- **Body**:
  > Notice the header badges:
  > - **Prover: Lean**: Shows Lean 4 is active.
  > - **Model Badge**: Shows the AI model backing the synthesis agent.
  > - **Auto / Manual**: `Auto` mode refreshes proof goals as you move your cursor in the code.
- **Trigger / Advance**: Click `"Next >"`.

#### Step 3: Placing the Cursor in Lean Code
- **Step ID**: `CURSOR_DEMO_STEP`
- **Target Selector**: `#webviewStatus` (or top banner in Webview)
- **Placement**: `bottom`
- **Title**: Step 1: Position Your Cursor
- **Body**:
  > Look at the editor on the left in `tutorial_warmup.lean`.
  > Find `theorem demo_step` and place your cursor after `intro n` on the empty line (line 8).
- **Instruction**: *Move your cursor inside `demo_step` in `tutorial_warmup.lean`.*
- **Trigger / Advance**: `EXTENSION_EVENT`: Message `{ type: "cursorMoved", theorem: "demo_step", line: 8 }` received from extension host.
- **Fallback**: Clickable button in card: `"Jump to Line 8"`, which sends command to VS Code to position cursor.

---

### Phase 2: Direct Manipulation Loop on `demo_step` (Steps 4 – 6)

#### Step 4: The Proof State View
- **Step ID**: `VIEW_PROOF_STATE`
- **Target Selector**: `#editor` (The ProseMirror proof state document)
- **Placement**: `left` or `top`
- **Title**: The Living Proof State
- **Body**:
  > The goal is `⊢ (n + 0) * 1 = n` with hypothesis `n : Nat`.
  > Unlike a standard static output window, this panel is an interactive editor.
- **Trigger / Advance**: Click `"Next >"`.

#### Step 5: Enabling Suggestions
- **Step ID**: `ENABLE_SUGGESTIONS`
- **Target Selector**: `.menu button:first-child` (The `Enable Suggestions` button)
- **Placement**: `bottom`
- **Title**: Enable Track-Changes Mode
- **Body**:
  > To edit the proof state, you first turn on suggestion mode. This acts like track-changes in a text document.
- **Instruction**: *Click the **Enable Suggestions** button now.*
- **Trigger / Advance**: `DOM_CLICK` on `Enable Suggestions`. The button text transitions to `"Disable Suggestions"`, and `.suggestion-commands` container appears.

#### Step 6: Direct Manipulation (Output Editing)
- **Step ID**: `EDIT_GOAL_TERM`
- **Target Selector**: `#editor .goal-type` (or text node containing `(n + 0)`)
- **Placement**: `top`
- **Title**: Edit the Goal Directly
- **Body**:
  > We know `n + 0` simplifies to `n`. 
  > Double-click `(n + 0)` in the goal and replace it with `n`.
- **Instruction**: *Change `(n + 0) * 1 = n` to `n * 1 = n`.*
- **Trigger / Advance**: `PROSEMIRROR_DOC_CHANGE`: Verified by ProseMirror plugin checking for a replacement mark where `deletedText` matches `(n + 0)` (or `n + 0`) and `insertedText` matches `n`.
- **Visual Feedback**: Once edited, the deleted portion is struck through in red, and `→ n` is displayed in green. The card automatically shows a green checkmark and enables `"Continue"`.

---

### Phase 3: Agent Tactics & CodeLens (Steps 7 – 9)

#### Step 7: Synthesizing the Tactics
- **Step ID**: `IMPLEMENT_CHANGES`
- **Target Selector**: `.synthesize-button` (`Implement Changes` button)
- **Placement**: `bottom`
- **Title**: Ask the Prover Agent
- **Body**:
  > Now let the agent find the exact Lean tactics to produce this state transformation!
- **Instruction**: *Click **Implement Changes**.*
- **Trigger / Advance**: `DOM_CLICK` on `Implement Changes`. 
  - Status indicator `#synthesizingIndicator` becomes visible (`"Synthesizing proof..."`).
  - Button disabled during in-flight synthesis.
  - Automatically advances when extension host emits `tacticSuggested`.

#### Step 8: Reviewing Suggested Tactics in Editor
- **Step ID**: `REVIEW_SUGGESTION`
- **Target Selector**: Screen Center / Floating Left Anchor
- **Placement**: `center`
- **Title**: CodeLens in the Editor
- **Body**:
  > Look at your editor on the left!
  > The agent synthesized a tactic (e.g., `rw [Nat.add_zero]`) and inserted it into the file highlighted in green.
  > Above the line are two CodeLens actions: **Accept** and **Reject**.
- **Instruction**: *Click **Accept** in the editor, or press `Cmd+Shift+Y` (`Ctrl+Shift+Y`).*
- **Trigger / Advance**: `EXTENSION_EVENT`: Message `{ type: "suggestionAccepted" }`.
- **Reaction**: The decoration clears, the file is saved, and the proof state updates to `⊢ n * 1 = n`.

#### Step 9: Immediate Feedback & Verification
- **Step ID**: `PROOF_STATE_UPDATED`
- **Target Selector**: `#editor`
- **Placement**: `top`
- **Title**: Verified Proof Progression
- **Body**:
  > Look at the proof state now: `(n + 0)` is gone, and the new goal is `n * 1 = n`!
  > Lean's kernel verified the tactic step with 100% formal soundness.
- **Trigger / Advance**: Click `"Next >"`.

---

### Phase 4: Conversational Assistant Chat (Steps 10 – 11)

#### Step 10: The Assistant Chat
- **Step ID**: `CHAT_CONSULT`
- **Target Selector**: `#chat` (Chat panel container at bottom)
- **Placement**: `top`
- **Title**: Need Ideas? Consult the Assistant
- **Body**:
  > If you aren't sure what transformation to make, you can ask the assistant in natural language.
- **Instruction**: *Type `"What lemma simplifies n * 1 = n?"` or click the quick prompt below.*
- **Quick Action**: Button inside card: `[Insert prompt: "What lemma simplifies n * 1 = n?"]`.
- **Trigger / Advance**: `DOM_CLICK` on `#chatSend` or `Enter` on `#chatInput`.

#### Step 11: Projected Suggestions from Chat
- **Step ID**: `CHAT_PROJECTED_SUGGESTION`
- **Target Selector**: `#chatLog`
- **Placement**: `top`
- **Title**: Projected State Changes
- **Body**:
  > The assistant explains the lemma (e.g. `Nat.mul_one`) and can even project the suggested state change directly into your Proof State editor for you to review and implement!
- **Trigger / Advance**: Click `"Continue to Hands-on Practice >"`.

---

### Phase 5: Self-Paced Practice & Wrap-Up (Steps 12 – 14)

#### Step 12: Move to `warmup_exercise`
- **Step ID**: `WARMUP_EXERCISE_START`
- **Target Selector**: `#editor`
- **Placement**: `top`
- **Title**: Your Turn: Solve the Warmup Exercise
- **Body**:
  > In `tutorial_warmup.lean`, scroll down to `theorem warmup_exercise`:
  > `∀ (n m : Nat), (n * 1) + (0 + m) = n + m`
  > Place your cursor on line 16 after `intro n m`.
- **Trigger / Advance**: `EXTENSION_EVENT`: `{ type: "cursorMoved", theorem: "warmup_exercise", line: 16 }`.

#### Step 13: Perform Your Own Output Edit
- **Step ID**: `WARMUP_EDIT`
- **Target Selector**: `#editor`
- **Placement**: `top`
- **Title**: Simplify `(n * 1)` or `(0 + m)`
- **Body**:
  > 1. Click **Enable Suggestions**.
  > 2. Replace `n * 1` with `n` (or `0 + m` with `m`).
  > 3. Click **Implement Changes**.
  > 4. Accept the suggested tactic.
- **Trigger / Advance**: `EXTENSION_EVENT`: `{ type: "suggestionAccepted" }` inside `warmup_exercise`.

#### Step 14: Celebration & Free Exploration
- **Step ID**: `TUTORIAL_COMPLETE`
- **Target**: Screen Center (Modal presentation)
- **Title**: You're Ready to Prove!
- **Body**:
  > You've mastered Output-Directed Theorem Proving!
  > 
  > **Quick Reference Cheatsheet:**
  > - `Cmd + Enter`: Refresh proof state manually
  > - `Cmd + Shift + Y`: Accept suggested tactic
  > - `Cmd + Shift + N`: Reject suggested tactic
  > - `Cmd + Z`: Undo edits in the Proof State panel
  > - `Revert All`: Discard all unapplied state edits
- **Trigger / Advance**: Click **"Start Exploring"** (`.odtp-tour-btn-primary`).
- **Action**: Tour closes, `localStorage.setItem('odtp_tutorial_completed', 'true')` is saved, and full normal editor operation is restored.

---

## 5. Technical Architecture & State Machine

### 5.1 TypeScript / JavaScript Interfaces

```typescript
export type StepTriggerType = 
  | 'MANUAL_NEXT'          // User clicks "Next" or "Continue"
  | 'DOM_CLICK'            // User clicks target DOM selector
  | 'DOM_INPUT'            // User inputs matching value in target
  | 'PROSEMIRROR_CHANGE'   // Specific diff detected in proof state doc
  | 'EXTENSION_MESSAGE';   // Host extension pushes specific event

export interface TourStep {
  id: string;
  phase: number;
  title: string;
  bodyHtml: string;
  targetSelector: string | null;  // null = centered modal
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  instructionPrompt?: string;
  trigger: {
    type: StepTriggerType;
    event?: string;
    validate?: (payload: any) => boolean;
  };
  onEnter?: () => void;
  onExit?: () => void;
  quickActions?: Array<{ label: string; action: () => void }>;
}

export interface TourState {
  isActive: boolean;
  currentStepIndex: number;
  totalSteps: number;
  history: number[];
  isWaitingForAction: boolean;
}
```

### 5.2 Tour Engine Class Interface (`src/webview/tourEngine.js`)

```javascript
export class TourEngine {
  constructor(options) {
    this.steps = options.steps;
    this.vscode = options.vscode;
    this.currentIndex = 0;
    this.isActive = false;
    this.overlayContainer = null;
    this.popoverElement = null;
    this.focusRing = null;
  }

  start(fromStepIndex = 0);
  next();
  prev();
  goTo(index);
  stop();
  
  // DOM Spotlight & Popover Positioning
  renderOverlay();
  updateSpotlight(targetEl);
  positionPopover(targetEl, placement);
  
  // Event Listeners & Interactive Gating
  bindStepTriggers(step);
  unbindStepTriggers(step);
  onExtensionMessage(msg);
  onProseMirrorDocChanged(doc);
}
```

### 5.3 Collision-Aware Positioning Math
To guarantee that the popover card never renders off-screen regardless of webview width or zoom level:
```javascript
function calculatePopoverPosition(targetRect, popoverRect, preferredPlacement) {
  const margin = 12;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let placement = preferredPlacement;
  let top = 0;
  let left = 0;

  // Auto-flip if overflowing viewport
  if (placement === 'bottom' && targetRect.bottom + popoverRect.height + margin > viewportHeight) {
    placement = 'top';
  } else if (placement === 'top' && targetRect.top - popoverRect.height - margin < 0) {
    placement = 'bottom';
  }

  if (placement === 'bottom') {
    top = targetRect.bottom + margin;
    left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
  } else if (placement === 'top') {
    top = targetRect.top - popoverRect.height - margin;
    left = targetRect.left + (targetRect.width / 2) - (popoverRect.width / 2);
  } else if (placement === 'left') {
    top = targetRect.top + (targetRect.height / 2) - (popoverRect.height / 2);
    left = targetRect.left - popoverRect.width - margin;
  } else if (placement === 'right') {
    top = targetRect.top + (targetRect.height / 2) - (popoverRect.height / 2);
    left = targetRect.right + margin;
  }

  // Horizontal clamping within viewport
  left = Math.max(margin, Math.min(left, viewportWidth - popoverRect.width - margin));
  top = Math.max(margin, Math.min(top, viewportHeight - popoverRect.height - margin));

  return { top, left, placement };
}
```

---

## 6. Extension Host Integration & RPC Protocol

### 6.1 Messages from Extension Host -> Webview
```typescript
type TourExtensionMessage =
  | { command: 'tour:start'; stepIndex?: number }
  | { command: 'tour:cursorMoved'; theorem: string; line: number }
  | { command: 'tour:suggestionAccepted' }
  | { command: 'tour:suggestionRejected' }
  | { command: 'tour:proofStateUpdated'; goalCount: number; isComplete: boolean };
```

### 6.2 Messages from Webview -> Extension Host
```typescript
type TourWebviewMessage =
  | { command: 'tour:ready' }
  | { command: 'tour:jumpToLocation'; file: string; line: number }
  | { command: 'tour:completed' }
  | { command: 'tour:dismissed' };
```

### 6.3 Command Palette Activation
Register command in `package.json`:
```json
{
  "command": "outputdirectedtheoremproving.startTutorialWalkthrough",
  "title": "Start Interactive Tutorial Walkthrough"
}
```

In `src/extension.ts`:
```typescript
const startTutorialCmd = vscode.commands.registerCommand(
  'outputdirectedtheoremproving.startTutorialWalkthrough',
  async () => {
    // 1. Open tutorial_warmup.lean on the left editor column
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    const tutorialUri = vscode.Uri.file(path.join(workspaceRoot, 'tutorial', 'tutorial_warmup.lean'));
    const doc = await vscode.workspace.openTextDocument(tutorialUri);
    await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.One });

    // 2. Open or reveal the Proof State panel beside it (ViewColumn.Beside)
    await vscode.commands.executeCommand('outputdirectedtheoremproving.openProofState');

    // 3. Post start message to webview
    ProofStatePanel.currentPanel?.postMessage({ command: 'tour:start' });
  }
);
context.subscriptions.push(startTutorialCmd);
```

---

## 7. File Modifications & Work Breakdown

| File Path | Nature | Purpose |
| :--- | :--- | :--- |
| `src/webview/tour/tourEngine.js` | **[NEW]** | Core tour engine, SVG spotlight cutout, popover anchoring, step transitions. |
| `src/webview/tour/tourSteps.js` | **[NEW]** | Detailed data structures and logic for Steps 1–14. |
| `src/webview/tour/tour.css` | **[NEW]** | CSS for spotlight mask, focus beacon, popover cards, and celebration modal. |
| `src/webview/main.js` | **[MODIFY]** | Import and initialize `TourEngine`, hook ProseMirror doc change listener to report edits to tour. |
| `src/webview/proofStatePanel.ts` | **[MODIFY]** | Include `tour.css` in HTML bundle, relay editor cursor movements and suggestion events to webview. |
| `src/extension.ts` | **[MODIFY]** | Register `outputdirectedtheoremproving.startTutorialWalkthrough` command palette entry. |
| `package.json` | **[MODIFY]** | Declare the walkthrough command under `contributes.commands`. |

---

## 8. Verification & Acceptance Criteria

1. **Self-Paced Navigation**:
   - The user can step forward with `Next` (on informational steps) and step backward with `Previous` at any point.
   - Pressing `Esc` or clicking `×` gracefully pauses/dismisses the walkthrough without breaking standard editor functionality.
2. **Interactive Gating**:
   - On Step 5, the tour refuses to advance until the user clicks `Enable Suggestions`.
   - On Step 6, the tour detects when `(n + 0)` is edited to `n` in ProseMirror before unlocking the next button.
   - On Step 8, the tour automatically advances when the user clicks `Accept` on the CodeLens in VS Code.
3. **Responsive Visual Polish**:
   - Resizing or scrolling the panel dynamically repositions the spotlight cutout and popover card.
   - Spotlight smoothly glides from header controls to ProseMirror editor to chat panel.
4. **Clean Handoff**:
   - Completing the tour dismisses all overlay DOM elements cleanly, leaving zero memory leaks or dangling event listeners.
