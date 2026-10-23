import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import darkPlus from '@shikijs/themes/dark-plus';
import lightPlus from '@shikijs/themes/light-plus';
import rocqGrammar from './syntaxes/rocq.tmLanguage.json';
import leanGrammar from './syntaxes/lean4.json';

const enhancedRocq = {
    ...rocqGrammar,
    name: 'rocq',
    aliases: ['coq'],
    patterns: [
        {
            match: "^([a-zA-Z_][\\w\\u00A0']*(?:\\s*,\\s*[a-zA-Z_][\\w\\u00A0']*)*)\\s*(?=:)",
            name: 'variable.other.hypothesis.rocq'
        },
        ...rocqGrammar.patterns
    ]
};

const enhancedLean = {
    ...leanGrammar,
    name: 'lean4',
    aliases: ['lean'],
    patterns: [
        {
            match: "^([a-zA-Z_][\\w']*(?:\\s*,\\s*[a-zA-Z_][\\w']*)*)\\s*(?=:)",
            name: 'variable.other.hypothesis.lean4'
        },
        {
            match: '\\b(Nat|Int|String|Bool|Char|Float|Option|List|Array|Vector|Fin|UInt8|UInt16|UInt32|UInt64|USize)\\b',
            name: 'support.type.lean4'
        },
        {
            match: '⊢|\\|-',
            name: 'keyword.operator.turnstile.lean4'
        },
        ...leanGrammar.patterns
    ]
};

let highlighterPromise = null;
let highlighterInstance = null;

export async function getHighlighter() {
    if (highlighterInstance) {
        return highlighterInstance;
    }
    if (!highlighterPromise) {
        highlighterPromise = createHighlighterCore({
            engine: createJavaScriptRegexEngine(),
            langs: [enhancedRocq, enhancedLean],
            themes: [darkPlus, lightPlus]
        }).then((h) => {
            highlighterInstance = h;
            return h;
        }).catch((err) => {
            console.error('Failed to initialize Shiki highlighter:', err);
            highlighterPromise = null;
            throw err;
        });
    }
    return highlighterPromise;
}

export function isThemeLight() {
    return typeof document !== 'undefined' && document.body.classList.contains('vscode-light');
}

/**
 * Tokenizes text for a given language.
 * Returns an array of tokens: [{ content, start, end, color, fontStyle }]
 */
export function tokenizeCode(text, lang = 'rocq') {
    if (!highlighterInstance || !text) {
        return null;
    }
    const theme = isThemeLight() ? 'light-plus' : 'dark-plus';
    const targetLang = (lang === 'lean' || lang === 'lean4') ? 'lean4' : 'rocq';
    try {
        const result = highlighterInstance.codeToTokens(text, { lang: targetLang, theme });
        const tokens = [];
        let lineOffset = 0;
        for (let i = 0; i < result.tokens.length; i++) {
            const line = result.tokens[i];
            let charOffset = 0;
            for (const token of line) {
                const start = lineOffset + charOffset;
                const end = start + token.content.length;
                if (token.color) {
                    tokens.push({
                        content: token.content,
                        start,
                        end,
                        color: token.color,
                        fontStyle: token.fontStyle
                    });
                }
                charOffset += token.content.length;
            }
            lineOffset += charOffset + 1;
        }
        return tokens;
    } catch (e) {
        console.error('Shiki tokenizeCode error:', e);
        return null;
    }
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function highlightCodeHtml(code, lang = 'rocq') {
    if (!highlighterInstance || !code) {
        return escapeHtml(code);
    }
    const theme = isThemeLight() ? 'light-plus' : 'dark-plus';
    const targetLang = (lang === 'lean' || lang === 'lean4') ? 'lean4' : 'rocq';
    try {
        return highlighterInstance.codeToHtml(code, {
            lang: targetLang,
            theme,
            structure: 'inline'
        });
    } catch {
        return escapeHtml(code);
    }
}
