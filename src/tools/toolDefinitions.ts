export const toolsSchema = [
    {
        type: "function",
        function: {
            name: "check_term_validity",
            description: "Checks if a Coq term or assertion is type-valid in the current context (i.e., syntactically correct and types match). Returns 'valid' or an error message.",
            parameters: {
                type: "object",
                properties: {
                    term: {
                        type: "string",
                        description: "The Coq term to check (e.g., 'assert (x + 0 = x).')"
                    }
                },
                required: ["term"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "insert_code",
            description: "Writes code into the active editor at the cursor position.",
            parameters: {
                type: "object",
                properties: {
                    code: {
                        type: "string",
                        description: "The Coq code to insert."
                    }
                },
                required: ["code"]
            }
        }
    }
];