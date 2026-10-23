# Facilitator Tutorial Script: Output-Directed Theorem Proving (ODTP)

> **Target Audience**: Study participants (students, researchers, or developers familiar with basic interactive theorem proving in Coq/Rocq or Lean).  
> **Estimated Run Time**: 10–12 minutes (Introduction + Live Demo + Hands-on Warm-up + Q&A).  
> **Facilitator Setup**: VS Code open with a sample theorem file (`tutorial_warmup.v` or starter `.lean` file) on the left, and the **Output Directed Prover** webview panel open on the right.

---

## Facilitator Preparation Checklist (Before Participant Sits Down)

- [ ] Open VS Code with the workspace loaded.
- [ ] Ensure the language server (`coq-lsp` or `lean`) is running and responsive.
- [ ] Run command: `Open Output Directed Proof State` (`Cmd/Ctrl + Shift + P` → select `Open Output Directed Proof State`).
- [ ] Place the proof state panel on the right side (`ViewColumn.Beside`).
- [ ] Open the tutorial practice file (`tutorial_warmup.v` or practice task) on the left.
- [ ] Verify LLM backend connection (test a simple ping or chat query).
- [ ] Have the 1-Page Participant Cheat Sheet (at the end of this document) ready on the table or screen.
- [ ] If recording/audio-capturing the session, ensure consent is signed and recording is started.

---

## Section 1: Welcome & Framing (2 minutes)

> [!NOTE]
> **Facilitator Goal**: Demystify the concept of "Output-Directed" proving and contrast it with traditional "Input-Directed" proving.

### 🎙️ [Say out loud]

> "Hi everyone, thank you for participating in this pilot study!
>
> Today, you’ll be trying out a new tool called **Output-Directed Theorem Proving**—or **ODTP**.
> 
> When you typically write proofs in interactive theorem provers like Coq, Rocq, or Lean, the process is what we call **input-directed**: you have a goal in mind, but to make progress, you have to remember specific tactic names, lemma names, and exact syntax—like `induction n`, `rewrite Nat.mul_comm`, or `destruct H`. You type those commands into the editor, run them, and then inspect the proof state to see if you got what you wanted.
>
> **Output-Directed Theorem Proving turns this around:**
> Instead of guessing tactics, you focus directly on the **output**—the proof state itself. If you see a hypothesis or a goal that you want simplified, rewritten, or transformed, you can directly **edit the proof state** to show what you want it to look like. 
>
> Behind the scenes, our AI agent analyzes the change you made, figures out the appropriate tactics to achieve that transformation, verifies them with the proof assistant, and suggests the exact code directly into your file for you to accept or reject.
>
> Before we start the study tasks, I’m going to walk you through the interface, show you a quick demo, and have you do a 2-minute practice exercise so you feel completely comfortable."

---

## Section 2: Interface Overview (3 minutes)

> [!NOTE]
> **Facilitator Action**: Point your cursor at the respective areas of the screen as you explain each element.

### 🎙️ [Say out loud]

> "Let's take a look at the screen. It is split into two main sections:
>
> 1. **On the left** is the standard file editor showing your proof script (`.v` or `.lean`). This is where the actual code of your proof lives.
>
> 2. **On the right** is the **Output Directed Prover** panel. This panel has three main components:
>    - **The Header Controls**:
>      - **Prover Indicator**: You can see whether the active prover is set to `Coq` or `Lean`.
>      - **Mode Toggle (`Auto` vs `Manual`)**: In `Auto` mode, the proof state automatically updates whenever you move your cursor in the editor. In `Manual` mode, it only updates when you click `Refresh` or press `Cmd+Enter` (on Mac) / `Ctrl+Enter` (on Windows/Linux).
>    - **The Proof State Editor (Center)**:
>      - Shows your current hypotheses and goals.
>      - At the top of this area, you'll see a button labeled **`Enable Suggestions`**. When clicked, this enables track-changes mode, allowing you to edit the hypotheses or goals.
>      - You also have **`Implement Changes`**, which triggers the AI prover agent to synthesize tactics for your edits.
>    - **The Assistant Chat (Bottom)**:
>      - An interactive AI assistant that can answer questions, explain hypotheses, and even propose direct edits to your proof state.
>      - You can also click **`Pop out`** if you prefer the chat in a separate side tab."

---

## Section 3: Live Facilitator Demo (3 minutes)

> [!IMPORTANT]
> **Facilitator Action**: Execute this demo step-by-step in front of the participant using `demo_step` in `tutorial_warmup.v`:
> ```coq
> Theorem demo_step : forall n : nat, (n + 0) * 1 = n.
> Proof.
>   intros n.
>   (* Place cursor here: Goal is (n + 0) * 1 = n *)
> ```

### Step 1: Placing the cursor & viewing proof state

### 🎙️ [Say out loud]

> "Watch how this works in practice. I place my cursor right inside the proof after `intros n.`.
> On the right, the panel displays our goal: `(n + 0) * 1 = n` with hypothesis `n : nat`."

---

### Step 2: Editing the proof state (Direct Manipulation)

### 🎙️ [Say out loud]

> "Now, I know that `n + 0` simplifies to `n`. Instead of searching for the exact lemma name or tactic, I'll click **`Enable Suggestions`** at the top of the proof state panel.
>
> I highlight `n + 0` in the goal, and I simply type `n`.
>
> Notice what happened: the panel shows a clear visual diff—the old term `n + 0` is struck through in red, and the new target `n` is shown in green (or marked with an arrow). We have declared our desired state: `n * 1 = n`."

---

### Step 3: Implementing changes with the Prover Agent

### 🎙️ [Say out loud]

> "Now, I click the **`Implement Changes`** button.
>
> Notice the status indicator: *'Synthesizing proof...'*. 
>
> The agent takes our before-and-after states, searches for valid proof steps, tests them against the theorem prover in the background, and finds a solution."

---

### Step 4: Accepting or Rejecting the Suggested Tactic

### 🎙️ [Say out loud]

> "Look back at the editor on the left!
> 
> The agent has inserted the tactic directly into our editor with an inline highlight and two buttons above it: **`Accept`** and **`Reject`**.
>
> - If the tactic is what you wanted, click **`Accept`** or press **`Cmd+Shift+Y`** (on Windows: **`Ctrl+Shift+Y`**).
> - If you don't like it or it took a wrong path, click **`Reject`** or press **`Cmd+Shift+N`** (on Windows: **`Ctrl+Shift+N`**), which cleanly reverts the file back to how it was.
>
> Let's press **`Accept`**. The tactic is committed, the proof state updates, and we are ready for the next step!"

---

### Step 5: Using the Assistant Chat for Suggestions

### 🎙️ [Say out loud]

> "Sometimes, you might not know exactly what rewrite or simplification to make yourself. That's where the **Assistant Chat** at the bottom comes in.
>
> You can ask it natural language questions like:
> *'Can you simplify the current goal?'* or *'What lemma applies here?'*
>
> When the assistant has a suggestion, it doesn't just give you text—it can actually project the suggested edit directly onto your Proof State panel with the strikethrough and new values! You can then review its suggestion in place, and if you agree, click **`Implement Changes`**."

---

## Section 4: Participant Hands-on Warm-up (3 minutes)

> [!NOTE]
> **Facilitator Goal**: Put the participant in the driver's seat. Ensure they physically click the buttons, make an edit, and use the keyboard shortcuts.

### 🎙️ [Say out loud]

> "Now it's your turn! Let's do a quick warm-up together. Please take the keyboard and mouse.
>
> In `tutorial_warmup.v`, let's look at `warmup_exercise`:
> 1. Click on the empty line inside `warmup_exercise`.
> 2. Look at the goal in the Proof State panel on the right.
> 3. Click **`Enable Suggestions`**.
> 4. Select the expression you want to simplify or rewrite and type your replacement.
> 5. Click **`Implement Changes`**.
> 6. When the CodeLens buttons appear above the inserted tactic in the editor, press **`Cmd+Shift+Y`** (or click Accept) to accept it."

*(Facilitator silently observes. If the participant hesitates or runs into an issue, offer minimal guidance.)*

### 🎙️ [Say out loud after completion]

> "Great job! You've just performed an output-directed proof step. 
> Now, try typing a quick question into the chat, such as: *'What is the next step to finish this goal?'*, and press Enter."

*(Wait for the model response and point out any suggestion or tactic explanation).*

---

## Section 5: Study Tips & "Think-Aloud" Instructions (1-2 minutes)

### 🎙️ [Say out loud]

> "Before we begin the main evaluation tasks, keep these three practical tips in mind:
>
> 1. **Keep edits focused (step-by-step)**: The agent works best when you make concrete, incremental transformations—like rewriting an algebraic term, applying a hypothesis, or simplifying a subterm—rather than trying to jump 10 steps ahead in a single edit.
> 2. **Undo & Revert are safe**: If you make a typo in the proof state panel, you can use `Cmd+Z` to undo in the panel or click `Revert All`. If the agent suggests a tactic that doesn't look right, simply click `Reject`.
> 3. **Think Aloud**: As part of this pilot study, we are really interested in what you are thinking. Please verbalize your thought process out loud as you work:
>    - Tell me what you are looking at.
>    - Tell me what transformation you are hoping to achieve.
>    - Tell me whether the agent's suggestion matches your expectations.
>    - If anything feels confusing, slow, or unintuitive, please speak it out! There are no wrong answers; you are helping us evaluate and improve the tool.
>
> Do you have any questions before we jump into the first task?"

---

## Section 6: Facilitator Troubleshooting Cheatsheet

| Issue / Symptom | Cause | Facilitator Remedy |
| :--- | :--- | :--- |
| **Proof state panel is blank or says "No active prover document"** | Focus is not in a valid `.v` or `.lean` file or cursor is outside a proof. | Click back into the editor inside a `Proof. ... Qed.` block. Click `Refresh` or press `Cmd+Enter`. |
| **"Synthesize clicked - No proof state change selected"** | Participant clicked `Implement Changes` without marking a change. | Remind participant to click `Enable Suggestions` and actually edit a term so the red/green diff is visible. |
| **Agent takes too long or gets stuck** | LLM latency or network timeout. | Click the **`Stop`** button in the chat controls. Try simplifying the edit to an atomic step and retry. |
| **Accept/Reject CodeLens buttons didn't appear** | Editor focus changed or file not active. | Click into the editor on the line with the suggested tactic. The shortcuts `Cmd+Shift+Y` and `Cmd+Shift+N` will work whenever suggestion is active. |
| **Accidental mess in the Proof State panel** | Participant deleted too many tokens or lost formatting. | Click **`Revert All`** in the panel header, or toggle `Disable Suggestions` then `Enable Suggestions` to reset to the true LSP state. |

---

## Appendix: 1-Page Participant Quick Reference Card

*(Print or display on a side card for participants during the session)*

```
================================================================================
           OUTPUT-DIRECTED THEOREM PROVING (ODTP) - QUICK REFERENCE
================================================================================

1. CORE WORKFLOW
   [Cursor in Editor]   -->  Proof State updates on the right
          |
   [Enable Suggestions] -->  Click button in Proof State panel
          |
   [Edit Proof State]   -->  Highlight term & type desired replacement (old -> new)
          |
   [Implement Changes]  -->  Click button to run Prover Agent
          |
   [Review in Editor]   -->  Accept (Cmd+Shift+Y) or Reject (Cmd+Shift+N)

--------------------------------------------------------------------------------
2. KEYBOARD SHORTCUTS
   Action                            macOS                 Windows / Linux
   -----------------------------------------------------------------------------
   Update Proof State at Cursor      Cmd + Enter           Ctrl + Enter
   Accept Suggested Tactic           Cmd + Shift + Y       Ctrl + Shift + Y
   Reject Suggested Tactic           Cmd + Shift + N       Ctrl + Shift + N
   Undo in Proof State Panel         Cmd + Z               Ctrl + Z

--------------------------------------------------------------------------------
3. HELPFUL CONTROLS
   - Mode Toggle: "Auto" (updates as you type/move) vs "Manual" (updates on demand).
   - "Revert All": Discards your edits in the proof state panel.
   - Assistant Chat: Ask for hints or prompt the AI to suggest state changes.
   - Stop Button: Cancels agent synthesis if taking too long.

--------------------------------------------------------------------------------
4. PILOT REMINDER: Please think out loud as you work!
================================================================================
```
