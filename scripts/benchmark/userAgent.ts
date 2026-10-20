import { normalizeState, isProofCompleteState } from './headlessProver';

export interface UserAgentRequest {
    prover: 'rocq' | 'lean';
    theorem: string;
    prefixCode: string;
    currentState: string;
    tier?: 'single' | 'multistep' | 'completion';
}

export interface UserAgentProposal {
    desiredState: string;
    intent: string;
    rawResponse: string;
}

/**
 * Builds the system prompt for the human simulator User Agent.
 */
function buildUserAgentSystemPrompt(prover: 'rocq' | 'lean'): string {
    const proverName = prover === 'lean' ? 'Lean 4' : 'Rocq (Coq)';

    return `You are an expert mathematician and interactive theorem prover practitioner using ${proverName} in an advanced IDE.

The IDE features "Output-Directed Theorem Proving":
Instead of writing low-level tactics, the human user specifies the DESIRED NEXT PROOF STATE they want to reach. An automated multi-tool agent then generates and validates the tactics needed to reach that desired state.

YOUR ROLE:
You act as this human user. You are given:
1. The theorem statement and the proof script up to the current point.
2. The current proof state (active goals and hypotheses) directly from the ${proverName} compiler.

YOUR TASK:
Advance the proof toward completion by proposing the next milestone proof state.
Depending on the current state, good intermediate goals include:
- Applying induction on a variable (advancing to the base case or inductive step).
- Case splitting / destructing a hypothesis.
- Introducing variables or hypotheses (e.g. intro x, intros).
- Simplifying or unfolding terms in the goal or hypotheses.
- Rewriting using a lemma or hypothesis.
- Proving a helper subgoal.
- If the goal is already solvable in one step, target proof completion ("Proof completed (No subgoals).").

CRITICAL CONSTRAINTS:
1. Do NOT write tactics or code (e.g., do NOT output "induction n.", "simp", "intro x").
2. Output the mathematical PROOF STATE (the hypotheses and goal) that should exist AFTER that step.
3. Keep hypotheses and types realistic and sound—do not hallucinate contradictory or unprovable goals.
4. Inside the \`\`\`proof_state code block, output ONLY the proof state (goals and hypotheses).
   Do NOT output conversational thoughts, internal reasoning, or commentary inside the code block.

FORMAT:
Provide your response in the following format:

Intent: <1-2 sentences explaining what step or transformation you want to achieve>

Desired State:
\`\`\`proof_state
<exact goal and hypotheses for the target state>
\`\`\``;
}

/**
 * Builds the user prompt presenting the theorem script and current compiler state.
 */
function buildUserAgentUserPrompt(request: UserAgentRequest): string {
    const proverName = request.prover === 'lean' ? 'Lean 4' : 'Rocq (Coq)';
    let tierInstruction = '';
    if (request.tier === 'multistep') {
        tierInstruction =
            '\nTarget difficulty: MULTI-STEP JUMP. Propose a milestone proof state that makes substantial progress (representing a 2 to 4 tactic leap forward).';
    } else if (request.tier === 'single') {
        tierInstruction =
            '\nTarget difficulty: IMMEDIATE SINGLE STEP. Propose the immediate next proof state resulting from 1 tactic step.';
    }

    return `Please propose the next desired proof state to advance this proof in ${proverName}.${tierInstruction}

Theorem: ${request.theorem}

Current Proof Script Prefix:
\`\`\`
${request.prefixCode.trim()}
\`\`\`

Current Compiler Proof State:
\`\`\`
${request.currentState.trim()}
\`\`\`

Propose your Intent and Desired State now.`;
}

/**
 * Parses the User Agent's text output into intent and desired proof state.
 */
export function parseUserAgentResponse(rawText: string): { intent: string; desiredState: string } {
    const text = rawText.trim();

    // 1. Extract Intent
    let intent = '';
    const intentMatch = text.match(/Intent:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
    if (intentMatch && intentMatch[1]) {
        intent = intentMatch[1].trim();
    } else {
        // Fallback: take prose before code block
        const beforeBlock = text.split(/```/)[0];
        if (beforeBlock && beforeBlock.trim().length > 10) {
            intent = beforeBlock.trim().split('\n')[0].replace(/^#+\s*/, '').trim();
        }
    }

    // 2. Extract Desired State from code fence
    let desiredState = '';

    // Check for ```proof_state ... ```
    const proofStateMatch = text.match(/```(?:proof_state|state)?\s*([\s\S]*?)```/i);
    if (proofStateMatch && proofStateMatch[1]) {
        desiredState = proofStateMatch[1].trim();
    } else {
        // Fallback to any code block
        const anyBlockMatch = text.match(/```(?:lean|coq|rocq)?\s*([\s\S]*?)```/i);
        if (anyBlockMatch && anyBlockMatch[1]) {
            desiredState = anyBlockMatch[1].trim();
        }
    }

    // 3. Fallback: If no code block or contains completion indicators
    if (!desiredState) {
        if (isProofCompleteState(text)) {
            desiredState = 'Proof completed (No subgoals).';
        } else {
            // If the model just outputted lines after "Desired State:"
            const desiredSection = text.split(/Desired State:?/i)[1];
            if (desiredSection) {
                desiredState = desiredSection.replace(/```/g, '').trim();
            } else {
                desiredState = text;
            }
        }
    }

    // 4. Sanitize proof state string
    desiredState = sanitizeProofStateString(desiredState);

    // Check if proof state implies completion
    if (isProofCompleteState(desiredState)) {
        desiredState = 'Proof completed (No subgoals).';
    }

    return {
        intent: intent || 'Advance the proof toward completion.',
        desiredState: desiredState.trim(),
    };
}

/**
 * Strips conversational preamble, reasoning remarks, or leaked prompt commentary from proof state blocks.
 */
export function sanitizeProofStateString(rawState: string): string {
    if (!rawState) return '';
    const lines = rawState.split('\n');
    const cleanLines: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            cleanLines.push(line);
            continue;
        }

        // Filter out conversational reasoning lines if model accidentally outputted thought process
        if (/^(?:wait|actually|let's|i should|if the|if i|which is|propose|target difficulty)/i.test(trimmed)) {
            continue;
        }

        cleanLines.push(line);
    }
    return cleanLines.join('\n').trim();
}

/**
 * Invokes the model to synthesize the desired next proof state.
 */
export async function synthesizeDesiredState(
    request: UserAgentRequest,
    modelAdapter: any
): Promise<UserAgentProposal> {
    const systemPrompt = buildUserAgentSystemPrompt(request.prover);
    const userPrompt = buildUserAgentUserPrompt(request);

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ];

    const stream = await modelAdapter.sendRequest(messages, { maxTokens: 2048 });
    let rawResponse = '';
    for await (const chunk of stream.text) {
        rawResponse += chunk;
    }

    const { intent, desiredState } = parseUserAgentResponse(rawResponse);

    return {
        desiredState,
        intent,
        rawResponse,
    };
}
