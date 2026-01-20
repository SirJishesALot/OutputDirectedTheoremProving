# Autoformaliser Agent Tools

This document describes the tools available to the autoformaliser agent, which suggests edits to the proof state to help progress Coq proofs.

## Overview

The autoformaliser agent analyzes the current proof state, edit history, and context to suggest transformations (edits) that can be made to hypotheses in the proof state. These suggestions are presented to the user, who can accept or reject them.

## Available Tools

### 1. `get_current_proof_state`

**Purpose**: Retrieves the current proof state at the cursor position.

**Returns**: 
- All active goals and their types
- All hypotheses with their names and types
- Goal stack information if available

**Usage**: The agent should call this first to understand what needs to be proved and what hypotheses are available.

**Example Output**:
```
=== CURRENT PROOF STATE ===

--- Goal 1 ---
Goal Type: nat = nat

Hypotheses:
  n : nat
  H : n + 0 = n
```

### 2. `get_proof_context`

**Purpose**: Gets surrounding proof context including the proof script and available theorems.

**Parameters**:
- `linesBefore` (optional): Number of lines of proof script to include (default: 20)
- `includeTheorems` (optional): Whether to include available theorems (default: true)

**Returns**:
- Last N lines of proof script before cursor
- List of available theorems/lemmas in the current file

**Usage**: Helps the agent understand the proof strategy and what lemmas might be applicable.

### 3. `get_edit_history`

**Purpose**: Retrieves the history of all edits made to the proof state.

**Returns**: List of all previous edits (lhs -> rhs pairs) with timestamps.

**Usage**: Helps the agent understand what transformations have already been attempted, avoiding redundant suggestions.

**Example Output**:
```
=== EDIT HISTORY (3 edits) ===

1. "n + 0" -> "n"
2. "x * 1" -> "x"
3. "H : P -> Q" -> "H : Q"
```

### 4. `check_term_validity`

**Purpose**: Validates whether a Coq term or assertion is type-valid in the current context.

**Parameters**:
- `term`: The Coq term to check (e.g., "assert (x + 0 = x).")

**Returns**: 
- `"valid"` if the term is valid
- Error message if invalid

**Usage**: The agent should validate suggested edits before proposing them to ensure they're type-correct.

**Example**:
```json
{
  "tool": "check_term_validity",
  "args": {
    "term": "assert (n + 0 = n)."
  }
}
```

### 5. `suggest_proof_state_edit`

**Purpose**: **Main tool** for proposing edits to the proof state.

**Parameters**:
- `hypothesisName`: The name of the hypothesis being edited (e.g., "H", "x", "n")
- `originalValue`: The current text/value of the hypothesis type
- `suggestedValue`: The proposed new text/value
- `reason` (optional): Explanation of why this edit is suggested

**Returns**: Confirmation message with suggestion details.

**Usage**: This is the primary tool the agent uses to suggest edits. The suggestion will be presented to the user in the UI.

**Example**:
```json
{
  "tool": "suggest_proof_state_edit",
  "args": {
    "hypothesisName": "H",
    "originalValue": "n + 0 = n",
    "suggestedValue": "n = n",
    "reason": "Using the fact that n + 0 simplifies to n"
  }
}
```

### 6. `get_goal_structure`

**Purpose**: Gets a structured, detailed representation of the current goal(s).

**Returns**:
- Goal type broken down by structure
- Hypothesis dependencies
- Detailed type information for each hypothesis

**Usage**: Useful for understanding the structure of what needs to be proved and identifying potential transformation opportunities.

## Agent Workflow

The typical workflow for the autoformaliser agent should be:

1. **Understand the current state**: Call `get_current_proof_state` to see what needs to be proved
2. **Get context**: Call `get_proof_context` to understand the proof strategy and available lemmas
3. **Review history**: Call `get_edit_history` to see what's already been tried
4. **Analyze structure**: Optionally call `get_goal_structure` for detailed analysis
5. **Generate suggestions**: Based on analysis, call `suggest_proof_state_edit` for each suggested transformation
6. **Validate suggestions**: Optionally call `check_term_validity` to ensure suggestions are type-correct

## Integration with Proof State Panel

The suggestions made by `suggest_proof_state_edit` should be:
1. Captured by the proof state panel
2. Presented to the user in the UI (e.g., as highlighted suggestions in ProseMirror)
3. Made available for user acceptance/rejection
4. If accepted, passed to the "prover" agent for application to the proof script

## Example Agent Prompt

When invoking the autoformaliser agent, provide a prompt like:

```
You are an autoformaliser agent helping with a Coq proof. The user has made the following edits to the proof state:
[list of edits from edit history]

Your task is to:
1. Analyze the current proof state
2. Understand what needs to be proved
3. Suggest new edits to hypotheses that will help progress the proof
4. Validate your suggestions before proposing them

Use the available tools to gather information and make informed suggestions.
```

## Notes

- The agent should focus on suggesting **transformations** (lhs -> rhs) that simplify or progress the proof
- Suggestions should be **type-correct** - use `check_term_validity` to verify
- Avoid suggesting edits that have already been tried (check `get_edit_history`)
- Consider the proof context and available lemmas when making suggestions
- Each suggestion should be clear and justified (use the `reason` parameter)
