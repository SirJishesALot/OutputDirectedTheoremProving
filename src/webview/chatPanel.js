/**
 * Chat-only panel script (no ProseMirror). Used when the user pops out the chat to a separate webview.
 * Same chat UI and message handling as main panel; communicates with extension via postMessage.
 */
import { marked } from 'marked';
import katex from 'katex';

const vscode = typeof acquireVsCodeApi !== 'undefined' ? acquireVsCodeApi() : null;

const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatTypingIndicator = document.getElementById('chatTypingIndicator');
const synthesizingIndicator = document.getElementById('synthesizingIndicator');
const popBackBtn = document.getElementById('popBackChat');
let currentPartialElem = null;
let streamBuffer = '';

function setTypingIndicator(visible) {
    if (chatTypingIndicator) {
        chatTypingIndicator.classList.toggle('visible', !!visible);
        chatTypingIndicator.setAttribute('aria-hidden', !visible);
    }
}

function setSynthesizingIndicator(visible) {
    if (synthesizingIndicator) {
        synthesizingIndicator.classList.toggle('visible', !!visible);
        synthesizingIndicator.setAttribute('aria-hidden', !visible);
    }
}

function renderMarkdownWithMath(text) {
    if (!text) return '';
    const blockPlaceholders = [];
    const inlinePlaceholders = [];
    const s = String(text)
        .replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
            const i = blockPlaceholders.length;
            blockPlaceholders.push(math.trim());
            return `{{MATHB_${i}}}`;
        })
        .replace(/\$([^$\n]+)\$/g, (_, math) => {
            const i = inlinePlaceholders.length;
            inlinePlaceholders.push(math.trim());
            return `{{MATHI_${i}}}`;
        });
    let html = marked.parse(s);
    const katexOpts = { throwOnError: false, output: 'html' };
    blockPlaceholders.forEach((math, i) => {
        try {
            html = html.replace(`{{MATHB_${i}}}`, katex.renderToString(math, { ...katexOpts, displayMode: true }));
        } catch (_) {
            html = html.replace(`{{MATHB_${i}}}`, `<span class="katex-error">$$${math}$$</span>`);
        }
    });
    inlinePlaceholders.forEach((math, i) => {
        try {
            html = html.replace(`{{MATHI_${i}}}`, katex.renderToString(math, { ...katexOpts, displayMode: false }));
        } catch (_) {
            html = html.replace(`{{MATHI_${i}}}`, `<span class="katex-error">$${math}$</span>`);
        }
    });
    return html;
}

function appendChatMessage(text, cls = 'assistant') {
    if (!chatLog) return;
    const el = document.createElement('div');
    el.className = 'chatMessage ' + cls;
    el.innerHTML = renderMarkdownWithMath(text);
    chatLog.appendChild(el);
    chatLog.scrollTop = chatLog.scrollHeight;
    return el;
}

function appendChatStreamPart(text) {
    if (!chatLog) return;
    if (!currentPartialElem) {
        setTypingIndicator(true);
        currentPartialElem = document.createElement('div');
        currentPartialElem.className = 'chatMessage assistant streaming';
        chatLog.appendChild(currentPartialElem);
        streamBuffer = '';
    }
    streamBuffer += text;
    currentPartialElem.innerHTML = renderMarkdownWithMath(streamBuffer);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function finalizeChatStream() {
    setTypingIndicator(false);
    if (currentPartialElem) {
        currentPartialElem.classList.remove('streaming');
    }
    currentPartialElem = null;
    streamBuffer = '';
}

if (chatSend && chatInput && vscode) {
    chatSend.addEventListener('click', () => {
        const prompt = (chatInput.value || '').trim();
        if (!prompt) return;
        appendChatMessage(prompt, 'user');
        chatInput.value = '';
        currentPartialElem = null;
        setTypingIndicator(true);
        vscode.postMessage({ command: 'chat', prompt });
    });
}

if (chatInput && chatSend) {
    chatInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            chatSend.click();
        }
    });
}

if (popBackBtn && vscode) {
    popBackBtn.addEventListener('click', () => {
        vscode.postMessage({ command: 'popBackChat' });
    });
}

if (vscode) {
    window.addEventListener('message', (event) => {
        const msg = event.data;
        if (!msg || !msg.type) return;
        switch (msg.type) {
            case 'initialChatLogContent':
                if (chatLog && msg.content != null) {
                    chatLog.innerHTML = msg.content;
                    chatLog.scrollTop = chatLog.scrollHeight;
                }
                break;
            case 'chatResponsePart':
                appendChatStreamPart(msg.text);
                break;
            case 'chatResponseDone':
                finalizeChatStream();
                break;
            case 'suggestion':
                if (msg.suggestion && msg.suggestion.originalValue && msg.suggestion.suggestedValue) {
                    const s = msg.suggestion;
                    appendChatMessage(
                        `Suggestion: Replace "${s.originalValue}" with "${s.suggestedValue}" in hypothesis "${s.hypothesisName || 'Goal'}"${s.reason ? ` (${s.reason})` : ''}`,
                        'assistant'
                    );
                }
                break;
            case 'proverAgentStarted':
                setSynthesizingIndicator(true);
                break;
            case 'proverAgentDone':
                setSynthesizingIndicator(false);
                break;
            default:
                break;
        }
    });
}
