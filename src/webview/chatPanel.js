/**
 * Chat-only panel script (no ProseMirror). Used when the user pops out the chat to a separate webview.
 */
import {
    initChatStreamUi,
    appendChatMessage,
    appendChatStreamPart,
    appendToolActivity,
    finalizeChatStream,
    resetChatStream,
} from './chatStreamUi.js';

const vscode = typeof acquireVsCodeApi !== 'undefined' ? acquireVsCodeApi() : null;

const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatStop = document.getElementById('chatStop');
const synthesizingIndicator = document.getElementById('synthesizingIndicator');
const popBackBtn = document.getElementById('popBackChat');

initChatStreamUi({
    chatLog: document.getElementById('chatLog'),
    chatTypingIndicator: document.getElementById('chatTypingIndicator'),
});

function setSynthesizingIndicator(visible) {
    if (synthesizingIndicator) {
        synthesizingIndicator.classList.toggle('visible', !!visible);
        synthesizingIndicator.setAttribute('aria-hidden', !visible);
    }
}

if (chatSend && chatInput && vscode) {
    chatSend.addEventListener('click', () => {
        const prompt = (chatInput.value || '').trim();
        if (!prompt) return;
        appendChatMessage(prompt, 'user');
        chatInput.value = '';
        resetChatStream();
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

if (chatStop && vscode) {
    chatStop.addEventListener('click', () => {
        vscode.postMessage({ command: 'stopGeneration' });
    });
}

if (vscode) {
    window.addEventListener('message', (event) => {
        const msg = event.data;
        if (!msg || !msg.type) return;
        switch (msg.type) {
            case 'initialChatLogContent': {
                const chatLog = document.getElementById('chatLog');
                if (chatLog && msg.content != null) {
                    chatLog.innerHTML = msg.content;
                    chatLog.scrollTop = chatLog.scrollHeight;
                }
                break;
            }
            case 'chatResponsePart':
                appendChatStreamPart(msg.text);
                break;
            case 'chatToolActivity':
                appendToolActivity(msg.activity);
                break;
            case 'chatResponseDone':
                finalizeChatStream();
                break;
            case 'suggestionNotice':
            case 'suggestion': {
                const s = msg.suggestion;
                if (!s || s.suggestedValue == null || s.suggestedValue === '') {
                    break;
                }
                const isAdd =
                    s.originalValue == null || String(s.originalValue).trim() === '';
                const text = isAdd
                    ? `Suggestion: Add hypothesis "${s.hypothesisName} : ${s.suggestedValue}"${s.reason ? ` (${s.reason})` : ''}`
                    : `Suggestion: Replace "${s.originalValue}" with "${s.suggestedValue}" in hypothesis "${s.hypothesisName || 'Goal'}"${s.reason ? ` (${s.reason})` : ''}`;
                appendChatMessage(text, 'assistant');
                break;
            }
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
