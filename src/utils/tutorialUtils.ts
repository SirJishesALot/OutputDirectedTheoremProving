import * as path from 'path';

export interface TheoremCursorContext {
    /** Enclosing theorem name (e.g. 'demo_step' or 'warmup_exercise'), or null if outside any theorem. */
    theorem: string | null;
    /** True when the cursor is inside the proof body strictly after the theorem's `intro` line (or after the declaration line if no `intro` exists). */
    isInProofZone: boolean;
    /** 1-based cursor line number. */
    oneBasedLine: number;
}

interface ParsedTheoremBlock {
    name: string;
    declLine: number;
    introLine: number | null;
    sorryLine: number | null;
    endLine: number;
}

const THEOREM_DECL_RE = /^\s*(?:theorem|lemma|example)\s+([A-Za-z0-9_']+)/;
const SECTION_DIVIDER_RE = /^\s*--\s*={5,}/;
const TOP_LEVEL_CMD_RE = /^(?:theorem|lemma|def|example|inductive|structure|class|instance|namespace|section|end|#check|#eval|set_option)\b/;

/**
 * Checks whether a file path or URI corresponds to `tutorial_warmup.lean`.
 */
export function isTutorialWarmupPath(fsPath: string): boolean {
    const base = path.basename(fsPath).toLowerCase();
    return base === 'tutorial_warmup.lean';
}

/**
 * Parses top-level theorem blocks in a Lean tutorial file so line shifts from inserted tactics
 * never break cursor detection or "Jump to ..." actions.
 */
export function parseTutorialTheorems(documentText: string): ParsedTheoremBlock[] {
    const lines = documentText.split(/\r?\n/);
    const declIndices: Array<{ name: string; line: number }> = [];

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(THEOREM_DECL_RE);
        if (match && match[1]) {
            declIndices.push({ name: match[1], line: i });
        }
    }

    const blocks: ParsedTheoremBlock[] = [];

    for (let idx = 0; idx < declIndices.length; idx++) {
        const current = declIndices[idx];
        const nextDeclLine = idx + 1 < declIndices.length ? declIndices[idx + 1].line : lines.length;

        let rawEnd = nextDeclLine - 1;
        for (let l = current.line + 1; l < nextDeclLine; l++) {
            const text = lines[l];
            if (SECTION_DIVIDER_RE.test(text) || TOP_LEVEL_CMD_RE.test(text)) {
                rawEnd = l - 1;
                break;
            }
        }

        // Trim trailing blank lines at the end of the theorem block, keeping at least 1 line after the last proof line if cursor rests there
        while (rawEnd > current.line + 1 && lines[rawEnd].trim() === '' && lines[rawEnd - 1].trim() === '') {
            rawEnd--;
        }

        let introLine: number | null = null;
        let sorryLine: number | null = null;
        for (let l = current.line + 1; l <= rawEnd; l++) {
            const trimmed = lines[l].trim();
            if (introLine === null && /^intro(?:s)?\b/.test(trimmed)) {
                introLine = l;
            }
            if (sorryLine === null && /^sorry\b/.test(trimmed)) {
                sorryLine = l;
            }
        }

        blocks.push({
            name: current.name,
            declLine: current.line,
            introLine,
            sorryLine,
            endLine: rawEnd,
        });
    }

    return blocks;
}

/**
 * Determines which theorem encloses `zeroBasedLine` and whether the cursor is positioned
 * in the active proof zone (after `intro ...`, ready to inspect/edit the simplified goal).
 */
export function detectTheoremCursorContext(
    documentText: string,
    zeroBasedLine: number
): TheoremCursorContext {
    const blocks = parseTutorialTheorems(documentText);
    const oneBasedLine = zeroBasedLine + 1;

    for (const block of blocks) {
        if (zeroBasedLine >= block.declLine && zeroBasedLine <= block.endLine) {
            const minProofLine = block.introLine !== null ? block.introLine + 1 : block.declLine + 1;
            const isInProofZone = zeroBasedLine >= minProofLine;
            return {
                theorem: block.name,
                isInProofZone,
                oneBasedLine,
            };
        }
    }

    return {
        theorem: null,
        isInProofZone: false,
        oneBasedLine,
    };
}

/**
 * Finds the ideal 0-based `{ line, character }` position to place the cursor for a tutorial theorem.
 * Prefers column 0 of the theorem's `sorry` line so Lean displays the goal right before `sorry`
 * and synthesized tactics insert cleanly above `sorry` with preserved 2-space indentation.
 */
export function findTheoremJumpPosition(
    documentText: string,
    theoremName: string
): { line: number; character: number } | null {
    const blocks = parseTutorialTheorems(documentText);
    const block = blocks.find((b) => b.name === theoremName);
    if (!block) {
        return null;
    }

    if (block.sorryLine !== null) {
        return { line: block.sorryLine, character: 0 };
    }

    if (block.introLine !== null) {
        return { line: Math.min(block.introLine + 1, block.endLine), character: 0 };
    }

    return { line: Math.min(block.declLine + 1, block.endLine), character: 0 };
}
