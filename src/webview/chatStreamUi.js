/**
 * Shared chat stream UI: main assistant text vs collapsible tool-activity log.
 */
import { marked } from 'marked';
import katex from 'katex';

let chatLog = null;
let chatTypingIndicator = null;
let currentTurnElem = null;
let mainResponseElem = null;
let toolDetailsElem = null;
let toolSummaryElem = null;
let toolLogElem = null;
let streamBuffer = '';
let toolEntryCount = 0;

export function initChatStreamUi(options = {}) {
    chatLog = options.chatLog ?? document.getElementById('chatLog');
    chatTypingIndicator = options.chatTypingIndicator ?? document.getElementById('chatTypingIndicator');
}

function setTypingIndicator(visible) {
    if (chatTypingIndicator) {
        chatTypingIndicator.classList.toggle('visible', !!visible);
        chatTypingIndicator.setAttribute('aria-hidden', !visible);
    }
}

export function renderMarkdownWithMath(text) {
    if (!text) {
        return '';
    }
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
            html = html.replace(
                `{{MATHB_${i}}}`,
                katex.renderToString(math, { ...katexOpts, displayMode: true })
            );
        } catch (_) {
            html = html.replace(`{{MATHB_${i}}}`, `<span class="katex-error">$$${math}$$</span>`);
        }
    });
    inlinePlaceholders.forEach((math, i) => {
        try {
            html = html.replace(
                `{{MATHI_${i}}}`,
                katex.renderToString(math, { ...katexOpts, displayMode: false })
            );
        } catch (_) {
            html = html.replace(`{{MATHI_${i}}}`, `<span class="katex-error">$${math}$</span>`);
        }
    });
    return html;
}

function scrollChatToBottom() {
    if (chatLog) {
        chatLog.scrollTop = chatLog.scrollHeight;
    }
}

function updateToolSummary() {
    if (!toolSummaryElem) {
        return;
    }
    const n = toolEntryCount;
    toolSummaryElem.textContent =
        n === 0 ? 'Tool activity' : n === 1 ? '1 tool call' : `${n} tool calls`;
}

function ensureAssistantTurn() {
    if (!chatLog) {
        return;
    }
    if (!currentTurnElem) {
        setTypingIndicator(true);
        currentTurnElem = document.createElement('div');
        currentTurnElem.className = 'chatMessage assistant streaming';

        mainResponseElem = document.createElement('div');
        mainResponseElem.className = 'chat-response-main';

        toolDetailsElem = document.createElement('details');
        toolDetailsElem.className = 'chat-tool-activity';
        toolSummaryElem = document.createElement('summary');
        toolSummaryElem.className = 'chat-tool-activity-summary';
        toolLogElem = document.createElement('div');
        toolLogElem.className = 'chat-tool-activity-log';

        toolDetailsElem.appendChild(toolSummaryElem);
        toolDetailsElem.appendChild(toolLogElem);
        currentTurnElem.appendChild(mainResponseElem);
        currentTurnElem.appendChild(toolDetailsElem);

        chatLog.appendChild(currentTurnElem);
        streamBuffer = '';
        toolEntryCount = 0;
        updateToolSummary();
    }
}

function formatToolActivityLabel(activity) {
    const name = activity.toolName ? activity.toolName : 'agent';
    switch (activity.kind) {
        case 'call':
            return `Model requested: ${name}`;
        case 'executing':
            return `Running: ${name}`;
        case 'result':
            return `Result: ${name}`;
        case 'error':
            return `Error: ${name}`;
        default:
            return activity.toolName ? `Status: ${name}` : 'Status';
    }
}

export function appendChatMessage(text, cls = 'assistant') {
    if (!chatLog) {
        return null;
    }
    const el = document.createElement('div');
    el.className = 'chatMessage ' + cls;
    el.innerHTML = renderMarkdownWithMath(text);
    chatLog.appendChild(el);
    scrollChatToBottom();
    return el;
}

export function appendChatStreamPart(text) {
    if (!text || !chatLog) {
        return;
    }
    ensureAssistantTurn();
    streamBuffer += text;
    if (mainResponseElem) {
        mainResponseElem.innerHTML = renderMarkdownWithMath(streamBuffer);
    }
    scrollChatToBottom();
}

export function appendToolActivity(activity) {
    if (!activity?.detail || !chatLog) {
        return;
    }
    ensureAssistantTurn();
    toolEntryCount += 1;
    if (toolDetailsElem) {
        toolDetailsElem.hidden = false;
    }
    updateToolSummary();

    const entry = document.createElement('div');
    entry.className = 'chat-tool-activity-entry chat-tool-activity-' + (activity.kind || 'status');
    const label = document.createElement('div');
    label.className = 'chat-tool-activity-entry-label';
    label.textContent = formatToolActivityLabel(activity);
    const body = document.createElement('pre');
    body.className = 'chat-tool-activity-entry-body';
    body.textContent = activity.detail;
    entry.appendChild(label);
    entry.appendChild(body);
    if (toolLogElem) {
        toolLogElem.appendChild(entry);
    }
    scrollChatToBottom();
}

export function finalizeChatStream() {
    setTypingIndicator(false);
    if (currentTurnElem) {
        currentTurnElem.classList.remove('streaming');
        if (toolDetailsElem && toolEntryCount === 0) {
            toolDetailsElem.remove();
        }
        if (mainResponseElem && !streamBuffer.trim()) {
            mainResponseElem.remove();
        }
    }
    currentTurnElem = null;
    mainResponseElem = null;
    toolDetailsElem = null;
    toolSummaryElem = null;
    toolLogElem = null;
    streamBuffer = '';
    toolEntryCount = 0;
}

export function resetChatStream() {
    finalizeChatStream();
}
