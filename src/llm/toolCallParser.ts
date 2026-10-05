import Ajv, { ValidateFunction } from 'ajv';
import { toolSchemas } from '../tools/toolDefinitions';

export interface ExtractedToolCall {
    tool: string;
    args: Record<string, unknown>;
    raw: string;
}

export interface ParseToolResult {
    toolCalls: ExtractedToolCall[];
    prose: string;
    hasMalformedJson: boolean;
    malformedSnippets?: string[];
}

const ajv = new Ajv({ allErrors: true, coerceTypes: true });
const compiledValidators = new Map<string, ValidateFunction>();

function getValidator(toolName: string): ValidateFunction | undefined {
    if (compiledValidators.has(toolName)) {
        return compiledValidators.get(toolName);
    }
    const schema = toolSchemas[toolName];
    if (!schema) {
        return undefined;
    }
    try {
        const validator = ajv.compile(schema);
        compiledValidators.set(toolName, validator);
        return validator;
    } catch {
        return undefined;
    }
}

/**
 * Normalizes common parameter name aliases produced by various LLMs.
 */
export function normalizeToolArgs(
    toolName: string,
    rawArgs: unknown
): Record<string, unknown> {
    if (!rawArgs || typeof rawArgs !== 'object' || Array.isArray(rawArgs)) {
        return {};
    }
    const args = { ...(rawArgs as Record<string, unknown>) };

    if (toolName === 'validate_proof_state_change') {
        if (args.originalValue === undefined && args.original !== undefined) {
            args.originalValue = args.original;
        }
        if (args.desiredValue === undefined && args.desired !== undefined) {
            args.desiredValue = args.desired;
        }
        if (args.proposedAddition === undefined) {
            if (args.addition !== undefined) args.proposedAddition = args.addition;
            else if (args.tactic !== undefined) args.proposedAddition = args.tactic;
            else if (args.tactics !== undefined) args.proposedAddition = args.tactics;
            else if (args.code !== undefined) args.proposedAddition = args.code;
        }
    } else if (toolName === 'suggest_proof_state_edit') {
        if (args.hypothesisName === undefined) {
            if (args.hypothesis !== undefined) args.hypothesisName = args.hypothesis;
            else if (args.hyp !== undefined) args.hypothesisName = args.hyp;
            else if (args.hypName !== undefined) args.hypothesisName = args.hypName;
            else if (args.name !== undefined) args.hypothesisName = args.name;
        }
        if (args.originalValue === undefined) {
            if (args.original !== undefined) args.originalValue = args.original;
            else if (args.oldValue !== undefined) args.originalValue = args.oldValue;
            else if (args.old !== undefined) args.originalValue = args.old;
        }
        if (args.suggestedValue === undefined) {
            if (args.suggested !== undefined) args.suggestedValue = args.suggested;
            else if (args.newValue !== undefined) args.suggestedValue = args.newValue;
            else if (args.new !== undefined) args.suggestedValue = args.new;
        }
        if (args.goalIndex === undefined) {
            if (args.goal !== undefined) args.goalIndex = args.goal;
            else if (args.goal_index !== undefined) args.goalIndex = args.goal_index;
            else if (args.index !== undefined) args.goalIndex = args.index;
        }
        if (args.goalIndex !== undefined && typeof args.goalIndex === 'string') {
            const parsed = parseInt(args.goalIndex, 10);
            if (!isNaN(parsed)) args.goalIndex = parsed;
        }
    } else if (toolName === 'suggest_proof_script_edit') {
        if (args.oldText === undefined && args.old !== undefined) {
            args.oldText = args.old;
        }
        if (args.newText === undefined && args.new !== undefined) {
            args.newText = args.new;
        }
        if (args.character === undefined) {
            if (args.char !== undefined) args.character = args.char;
            else if (args.col !== undefined) args.character = args.col;
            else if (args.column !== undefined) args.character = args.column;
        }
        if (args.line !== undefined && typeof args.line === 'string') {
            const parsed = parseInt(args.line, 10);
            if (!isNaN(parsed)) args.line = parsed;
        }
        if (args.character !== undefined && typeof args.character === 'string') {
            const parsed = parseInt(args.character, 10);
            if (!isNaN(parsed)) args.character = parsed;
        }
    } else if (toolName === 'check_term_validity') {
        if (args.term === undefined && args.code !== undefined) {
            args.term = args.code;
        }
    }

    return args;
}

/**
 * Validates tool arguments against the registered JSON schema.
 */
export function validateToolArgs(
    toolName: string,
    args: Record<string, unknown>
): { valid: boolean; errors?: string[] } {
    const validator = getValidator(toolName);
    if (!validator) {
        // If no schema registered, allow as valid
        return { valid: true };
    }

    const valid = validator(args);
    if (valid) {
        return { valid: true };
    }

    const errors = (validator.errors || []).map((err) => {
        const prop = err.instancePath ? err.instancePath.replace(/^\//, '') : '';
        const propDesc = prop ? `Property "${prop}"` : 'Input';
        return `${propDesc} ${err.message || 'is invalid'}`;
    });

    return { valid: false, errors };
}

/**
 * Sanitizes and repairs common formatting errors in JSON strings emitted by LLMs.
 */
export function sanitizeAndRepairJson(raw: string): string {
    let s = raw.trim();

    // Remove markdown codeblock wrapper if entire string is wrapped
    const blockMatch = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (blockMatch) {
        s = blockMatch[1].trim();
    }

    // Normalize unicode quotes
    s = s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");

    // Repair unescaped backslashes in math/logic expressions (e.g. \forall, \exists, /\, \/)
    // JSON permits \", \\, \/, \b, \f, \n, \r, \t, \uXXXX
    s = s.replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1');

    // Remove trailing commas before closing braces/brackets
    s = s.replace(/,\s*([}\]])/g, '$1');

    // Balance unclosed braces/brackets if truncated
    let depthBrace = 0;
    let depthBracket = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (escape) {
            escape = false;
            continue;
        }
        if (c === '\\') {
            escape = true;
            continue;
        }
        if (c === '"') {
            inString = !inString;
            continue;
        }
        if (!inString) {
            if (c === '{') depthBrace++;
            else if (c === '}') depthBrace = Math.max(0, depthBrace - 1);
            else if (c === '[') depthBracket++;
            else if (c === ']') depthBracket = Math.max(0, depthBracket - 1);
        }
    }

    if (inString) {
        s += '"';
    }
    while (depthBracket > 0) {
        s += ']';
        depthBracket--;
    }
    while (depthBrace > 0) {
        s += '}';
        depthBrace--;
    }

    return s;
}

/**
 * Extracts a single balanced JSON object starting at a specific index.
 */
function extractBalancedJsonObject(
    text: string,
    startIndex: number
): { json: string; endIndex: number } | null {
    let depth = 0;
    let inDouble = false;
    let inSingle = false;
    let escape = false;

    for (let i = startIndex; i < text.length; i++) {
        const c = text[i];
        if (escape) {
            escape = false;
            continue;
        }
        if (c === '\\' && (inDouble || inSingle)) {
            escape = true;
            continue;
        }
        if (!inDouble && !inSingle) {
            if (c === '{') {
                depth++;
            } else if (c === '}') {
                depth--;
                if (depth === 0) {
                    return {
                        json: text.slice(startIndex, i + 1),
                        endIndex: i + 1,
                    };
                }
            } else if (c === '"') {
                inDouble = true;
            } else if (c === "'") {
                inSingle = true;
            }
        } else if (c === '"' && inDouble) {
            inDouble = false;
        } else if (c === "'" && inSingle) {
            inSingle = false;
        }
    }

    // If string ended with unclosed brace, try repairing
    if (depth > 0) {
        const partial = text.slice(startIndex);
        return {
            json: sanitizeAndRepairJson(partial),
            endIndex: text.length,
        };
    }

    return null;
}

/**
 * Extracts all tool calls from the model output. Supports:
 * - Markdown ```json ... ``` blocks
 * - Bare JSON objects: { "tool": "...", "args": { ... } }
 * - JSON arrays of tool calls: [ { "tool": ... }, { "tool": ... } ]
 * - Strips <thought>...</thought> reasoning tags from user-facing prose.
 */
export function extractAllToolCalls(text: string): ParseToolResult {
    const toolCalls: ExtractedToolCall[] = [];
    const malformedSnippets: string[] = [];
    let hasMalformedJson = false;

    // Remove thoughts tag blocks from prose calculation
    let cleanText = text.replace(/<thought>[\s\S]*?<\/thought>/gi, '').trim();

    // 1. First, search for markdown code blocks containing JSON
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
    let blockMatch: RegExpExecArray | null;
    const rangesToRemove: Array<{ start: number; end: number }> = [];

    while ((blockMatch = codeBlockRegex.exec(cleanText)) !== null) {
        const snippet = blockMatch[1].trim();
        if (snippet.includes('"tool"') || snippet.includes("'tool'")) {
            rangesToRemove.push({
                start: blockMatch.index,
                end: blockMatch.index + blockMatch[0].length,
            });

            try {
                const repaired = sanitizeAndRepairJson(snippet);
                const parsed = JSON.parse(repaired);
                if (Array.isArray(parsed)) {
                    for (const item of parsed) {
                        if (item && typeof item === 'object' && typeof item.tool === 'string') {
                            toolCalls.push({
                                tool: item.tool,
                                args: normalizeToolArgs(item.tool, item.args),
                                raw: JSON.stringify(item),
                            });
                        }
                    }
                } else if (parsed && typeof parsed.tool === 'string') {
                    toolCalls.push({
                        tool: parsed.tool,
                        args: normalizeToolArgs(parsed.tool, parsed.args),
                        raw: snippet,
                    });
                }
            } catch {
                hasMalformedJson = true;
                malformedSnippets.push(snippet);
            }
        }
    }

    // 2. If no code blocks produced tools, search for bare JSON objects with "tool":
    if (toolCalls.length === 0) {
        const toolPattern = /\{\s*["']tool["']\s*:/g;
        let match: RegExpExecArray | null;
        let lastEnd = 0;

        while ((match = toolPattern.exec(cleanText)) !== null) {
            if (match.index < lastEnd) continue;
            const extracted = extractBalancedJsonObject(cleanText, match.index);
            if (extracted) {
                lastEnd = extracted.endIndex;
                rangesToRemove.push({ start: match.index, end: extracted.endIndex });
                try {
                    const repaired = sanitizeAndRepairJson(extracted.json);
                    const parsed = JSON.parse(repaired);
                    if (parsed && typeof parsed.tool === 'string') {
                        toolCalls.push({
                            tool: parsed.tool,
                            args: normalizeToolArgs(parsed.tool, parsed.args),
                            raw: extracted.json,
                        });
                    }
                } catch {
                    hasMalformedJson = true;
                    malformedSnippets.push(extracted.json);
                }
            }
        }
    }

    // 3. Compute remaining user-facing prose by cutting out tool call ranges
    let prose = '';
    let cursor = 0;
    // Sort ranges by start position
    rangesToRemove.sort((a, b) => a.start - b.start);

    for (const r of rangesToRemove) {
        if (r.start > cursor) {
            prose += cleanText.slice(cursor, r.start);
        }
        cursor = Math.max(cursor, r.end);
    }
    if (cursor < cleanText.length) {
        prose += cleanText.slice(cursor);
    }

    return {
        toolCalls,
        prose: prose.trim(),
        hasMalformedJson,
        malformedSnippets: malformedSnippets.length > 0 ? malformedSnippets : undefined,
    };
}

/**
 * Checks whether a tool is read-only (safe for batch execution).
 */
export function isReadOnlyTool(toolName: string): boolean {
    const readOnlyTools = new Set([
        'get_current_proof_state',
        'get_current_proof_script',
        'get_proof_context',
        'get_edit_history',
        'check_term_validity',
    ]);
    return readOnlyTools.has(toolName);
}
