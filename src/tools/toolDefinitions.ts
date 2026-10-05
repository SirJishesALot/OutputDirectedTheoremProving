/**
 * JSON schemas for all agent tools across Coq and Lean environments.
 */
export const toolSchemas: Record<string, Record<string, unknown>> = {
    get_current_proof_state: {
        type: 'object',
        properties: {},
        additionalProperties: true,
    },
    get_current_proof_script: {
        type: 'object',
        properties: {},
        additionalProperties: true,
    },
    get_proof_context: {
        type: 'object',
        properties: {
            linesBefore: { type: 'integer', minimum: 1 },
        },
        additionalProperties: true,
    },
    get_edit_history: {
        type: 'object',
        properties: {},
        additionalProperties: true,
    },
    check_term_validity: {
        type: 'object',
        properties: {
            term: { type: 'string', minLength: 1 },
        },
        required: ['term'],
        additionalProperties: true,
    },
    suggest_proof_state_edit: {
        type: 'object',
        properties: {
            hypothesisName: { type: 'string' },
            originalValue: { type: 'string' },
            suggestedValue: { type: 'string' },
            reason: { type: 'string' },
            goalIndex: { type: 'integer' },
        },
        required: ['hypothesisName', 'suggestedValue'],
        additionalProperties: true,
    },
    validate_proof_state_change: {
        type: 'object',
        properties: {
            originalValue: { type: 'string' },
            desiredValue: { type: 'string' },
            proposedAddition: { type: 'string', minLength: 1 },
        },
        required: ['originalValue', 'desiredValue', 'proposedAddition'],
        additionalProperties: true,
    },
    suggest_proof_script_edit: {
        type: 'object',
        properties: {
            line: { type: 'integer', minimum: 0 },
            character: { type: 'integer', minimum: 0 },
            oldText: { type: 'string' },
            newText: { type: 'string' },
        },
        required: ['line', 'character', 'oldText', 'newText'],
        additionalProperties: true,
    },
};

/**
 * Standard OpenAI-compatible tool definitions (for legacy or native function calling).
 */
export const toolsSchema = [
    {
        type: 'function',
        function: {
            name: 'check_term_validity',
            description:
                "Checks if a Coq term or assertion is type-valid in the current context. Returns 'valid' or an error message.",
            parameters: toolSchemas.check_term_validity,
        },
    },
    {
        type: 'function',
        function: {
            name: 'insert_code',
            description: 'Writes code into the active editor at the cursor position.',
            parameters: {
                type: 'object',
                properties: {
                    code: { type: 'string', description: 'The Coq code to insert.' },
                },
                required: ['code'],
            },
        },
    },
];