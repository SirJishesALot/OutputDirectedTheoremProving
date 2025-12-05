import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema as basicSchema, marks as basicMarks } from 'prosemirror-schema-basic';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import {
    addSuggestionMarks,
    suggestChanges,
    withSuggestChanges,
    toggleSuggestChanges,
    applySuggestions,
    revertSuggestions,
    isSuggestChangesEnabled,
} from '@handlewithcare/prosemirror-suggest-changes';


const vscode = acquireVsCodeApi();
const nodes = {
    doc: { 
        content: "(goal | paragraph)*", // Can contain goals OR error paragraphs
        marks: 'insertion modification deletion',
    },
    paragraph: basicSchema.spec.nodes.get('paragraph'), // Use basic paragraph for errors
    text: basicSchema.spec.nodes.get('text'), // Use basic text

    goal: {
        content: "hyps? goalType", // A goal contains optional 'hyps' and one 'goalType'
        group: "block",
        toDOM() { return ['div', { class: 'goal' }, 0]; },
        parseDOM: [{ tag: "div.goal" }]
    },
    hyps: {
        content: "hypothesis+", // 'hyps' contains one or more 'hypothesis' paragraphs
        group: "block",
        toDOM() { return ['div', { class: 'hyps' }, 0]; },
        parseDOM: [{ tag: "div.hyps" }]
    },
    hypothesis: { // This is a styled paragraph
        content: "text*",
        group: "block",
        toDOM() { return ['p', { class: 'hypothesis' }, 0]; },
        parseDOM: [{ tag: "p.hypothesis" }]
    },
    goalType: { // This is also a styled paragraph
        content: "text*",
        group: "block",
        toDOM() { return ['p', { class: 'goalType' }, 0]; },
        parseDOM: [{ tag: "p.goalType" }]
    }
};


const marks = addSuggestionMarks(basicMarks);
const schema = new Schema({
    nodes,
    marks
});

function renderGoalsToHtml(goals) {
    if (!goals || goals.length === 0) {
        return '<p class="error"><i>No goals at the current cursor position.</i></p>';
    }

    let html = '';
    for (const g of goals) {
        html += '<div class="goal">'; // Wrapper div
        if (g.hyps && g.hyps.length > 0) {
            html += '<div class="hyps">';
            g.hyps.forEach(h => {
                const text = escapeHtml(h.names.join(', ') + ': ' + h.ty);
                html += `<p class="hypothesis">${text}</p>`;
            });
            html += '</div>';
        }
        const goalText = escapeHtml(g.ty);
        html += `<p class="goalType">${goalText}</p>`;
        html += '</div>';
    }
    return html;
}

function escapeHtml(s) {
    if (!s) { return ''; }
    return s.replace(/[&<>"']/g, (c) => 
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c
    );
}

const suggestChangesViewPlugin = new Plugin({
    view(view) {
        const toggleButton = document.createElement('button');
        toggleButton.appendChild(document.createTextNode('Enable Suggestions'));
        toggleButton.addEventListener('click', () => {
            toggleSuggestChanges(view.state, view.dispatch);
            view.focus();
        });

        const applyAllButton = document.createElement('button');
        applyAllButton.appendChild(document.createTextNode('Apply All'));
        applyAllButton.addEventListener('click', () => {
            applySuggestions(view.state, view.dispatch);
            view.focus();
        });

        const revertAllButton = document.createElement('button');
        revertAllButton.appendChild(document.createTextNode('Revert All'));
        revertAllButton.addEventListener('click', () => {
            revertSuggestions(view.state, view.dispatch);
            view.focus();
        });

        const commandsContainer = document.createElement('div');
        commandsContainer.append(applyAllButton, revertAllButton);

        const container = document.createElement('div');
        container.classList.add('menu');
        container.append(toggleButton, commandsContainer);

        view.dom.parentElement?.prepend(container);

        return {
            update() {
                if (isSuggestChangesEnabled(view.state)) {
                    toggleButton.replaceChildren(
                        document.createTextNode('Disable Suggestions'),
                    );
                    commandsContainer.style.display = '';
                } else {
                    toggleButton.replaceChildren(
                        document.createTextNode('Enable Suggestions'),
                    );
                    commandsContainer.style.display = 'none';
                }
            },
            destroy() {
                container.remove();
            },
        };
    },
});


const plugins = [
    keymap(baseKeymap),
    history(),
    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    suggestChanges(), // Add the main plugin
    suggestChangesViewPlugin, // Add the menu plugin
];


let initialState = EditorState.create({
    schema,
    plugins: plugins,
});


const view = new EditorView(document.getElementById('editor'), {
    state: initialState,
    dispatchTransaction: withSuggestChanges(),
});

window.addEventListener('message', (event) => {
    const msg = event.data;
    let html;

    switch (msg.type) {
        case 'noDocument':
            html = '<p><i>No active Coq document or cursor not inside a proof.</i></p>';
            break;
        case 'error':
            html = '<p><i>Error: ' + escapeHtml(msg.message) + '</i></p>';
            break;
        case 'proofUpdate':
            console.log("proof update request receieved");
            html = renderGoalsToHtml(msg.goals); 
            break;
        case 'chatResponsePart':
            // Append or update the last partial chat message
            appendChatStreamPart(msg.text);
            return;
        case 'chatResponseDone':
            finalizeChatStream();
            return;
        default:
            console.warn("Unknown message type:", msg.type);
            return;
    }

    const domNode = document.createElement('div');
    domNode.innerHTML = html;
    console.log("new html created");
    
    const newDoc = DOMParser.fromSchema(schema).parse(domNode);
    console.log("domNode parsed");
    
    const newState = EditorState.create({
        doc: newDoc,
        plugins: view.state.plugins 
    });
    view.updateState(newState);
    console.log("after view.updateState is called");
});

    // Chat UI helpers
    const chatLog = document.getElementById('chatLog');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    let currentPartialElem = null;

    function appendChatMessage(text, cls = 'assistant') {
        if (!chatLog) { return; }
        const el = document.createElement('div');
        el.className = 'chatMessage ' + cls;
        el.textContent = text;
        chatLog.appendChild(el);
        chatLog.scrollTop = chatLog.scrollHeight;
        return el;
    }

    function appendChatStreamPart(text) {
        if (!chatLog) { return; }
        if (!currentPartialElem) {
            currentPartialElem = appendChatMessage(text, 'assistant streaming');
        } else {
            // update text
            currentPartialElem.textContent += text;
        }
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function finalizeChatStream() {
        currentPartialElem = null;
    }

    if (chatSend) {
        chatSend.addEventListener('click', () => {
            if (!chatInput) { return; }
            const prompt = (chatInput.value || '').trim();
            if (!prompt) { return; }
            // show user message
            appendChatMessage(prompt, 'user');
            chatInput.value = '';
            // reset any partial
            currentPartialElem = null;
            // request a chat from the extension
            vscode.postMessage({ command: 'chat', prompt });
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                chatSend?.click();
            }
        });
    }

document.getElementById('applyBtn').addEventListener('click', () => {
    const tactic = document.getElementById('tacticInput').value;
    vscode.postMessage({ command: 'applyTactic', tactic });
});

document.getElementById('refreshBtn').addEventListener('click', () => {
    vscode.postMessage({ command: 'requestUpdate' });
});

vscode.postMessage({ command: 'requestUpdate' });