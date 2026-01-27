import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema as basicSchema, marks as basicMarks } from 'prosemirror-schema-basic';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { marked } from 'marked'; 

import hljs from 'highlight.js/lib/core'; 
import coq from 'highlight.js/lib/languages/coq'; 

hljs.registerLanguage('coq', (hljs) => {
    const lang = coq(hljs);
    const standardTypes = 'nat list bool string unit option sum prod Z Z0 positive N';
    
    if (lang.keywords && lang.keywords.built_in) {
        lang.keywords.built_in += ' ' + standardTypes;
    } else if (lang.keywords) {
        lang.keywords.built_in = standardTypes;
    }
    return lang;
});

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
        content: "(goal | paragraph | messagesSection)*", // Can contain goals, errors, or messages
        marks: 'insertion modification deletion',
    },
    paragraph: basicSchema.spec.nodes.get('paragraph'), // Use basic paragraph for errors
    text: basicSchema.spec.nodes.get('text'), // Use basic text

    goal: {
        content: "hyps? goalType", // A goal contains optional 'hyps' and one 'goalType'
        group: "block",
        toDOM() { return ['div', { class: 'goal' }, 0]; },
        parseDOM: [{ tag: "div.goal", priority: 60 }]
    },
    hyps: {
        content: "hypothesis+", // 'hyps' contains one or more 'hypothesis' paragraphs
        group: "block",
        toDOM() { return ['div', { class: 'hyps' }, 0]; },
        parseDOM: [{ tag: "div.hyps", priority: 60 }]
    },
    hypothesis: { 
        content: "text*",
        group: "block",
        toDOM() { 
            return ['pre', { 
                class: 'hypothesis', 
                style: 'margin: 0; white-space: pre-wrap; font-family: var(--vscode-editor-font-family);' 
            }, 0]; 
        },
        // ADD preserveWhitespace: "full" HERE
        parseDOM: [{ tag: "pre.hypothesis", priority: 60, preserveWhitespace: "full" }]
    },
    goalType: { 
        content: "text*",
        group: "block",
        toDOM() { 
            return ['pre', { 
                class: 'goalType', 
                style: 'margin: 0; white-space: pre-wrap; font-weight: bold; font-family: var(--vscode-editor-font-family);' 
            }, 0]; 
        },
        // ADD preserveWhitespace: "full" HERE
        parseDOM: [{ tag: "pre.goalType", priority: 60, preserveWhitespace: "full" }]
    },
    messagesSection: {
        content: "messagesHeader message*",
        group: "block",
        toDOM() { return ['div', { class: 'messages-section' }, 0]; },
        parseDOM: [{ tag: "div.messages-section", priority: 60 }]
    },
    messagesHeader: {
        content: "text*",
        group: "block",
        toDOM() { return ['div', { class: 'messages-header' }, 0]; },
        parseDOM: [{ tag: "div.messages-header", priority: 60 }]
    },
    message: {
        content: "text*",
        group: "block",
        toDOM() { return ['div', { class: 'message' }, 0]; },
        parseDOM: [{ tag: "div.message", priority: 60 }, { tag: "div.error-message", priority: 50 }]
    }
};


const myMarks = {
    ...basicMarks, 
    syntax: {
        attrs: { class: {} },
        parseDOM: [{ 
            tag: "span", 
            getAttrs: dom => {
                const cls = dom.getAttribute("class");
                return cls && cls.startsWith('hljs-') ? { class: cls } : false; 
            }
        }],
        toDOM(node) { return ["span", { class: node.attrs.class }, 0]; }
    }
};

const marks = addSuggestionMarks(myMarks);
const schema = new Schema({
    nodes,
    marks
});

function getDiffFromNode(node) {
    let deletedText = "";
    let insertedText = "";

    node.content.forEach((child) => {
        const isDeleted = child.marks.some(m => m.type.name === 'deletion');
        const isInserted = child.marks.some(m => m.type.name === 'insertion');

        if (isDeleted) deletedText += child.text;
        if (isInserted) insertedText += child.text;
    });

    return { deletedText, insertedText };
}

function renderGoalsToHtml(goals, messages, error) {
    let html = '';
    
    // Render goals
    if (!goals || goals.length === 0) {
        html += '<p class="error"><i>No goals at the current cursor position.</i></p>';
    } else {
        for (const g of goals) {
            html += '<div class="goal">'; // Wrapper div
            if (g.hyps && g.hyps.length > 0) {
                html += '<div class="hyps">';
                g.hyps.forEach(h => {
                    const rawText = h.names.join(', ') + ': ' + h.ty; 
                    const highlighted = hljs.highlight(rawText, {language: 'coq'}).value; 
                    html += `<pre class="hypothesis">${highlighted}</pre>`;
                });
                html += '</div>';
            }
            const highlightedGoal = hljs.highlight(g.ty, { language: 'coq' }).value;
            html += `<pre class="goalType">${highlightedGoal}</pre>`;
            html += '</div>';
        }
    }
    
    // Render messages section if there are messages or errors
    if ((messages && messages.length > 0) || error) {
        html += '<div class="messages-section">';
        html += '<div class="messages-header">Messages</div>';
        
        // Render error if present
        if (error) {
            html += `<div class="message error-message">${escapeHtml(error)}</div>`;
        }
        
        // Render other messages
        if (messages && messages.length > 0) {
            messages.forEach(msg => {
                html += `<div class="message">${escapeHtml(msg)}</div>`;
            });
        }
        
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
        toggleButton.textContent = 'Enable Suggestions'; 
        toggleButton.addEventListener('click', () => {
            toggleSuggestChanges(view.state, view.dispatch);
            view.focus();
        });

        const applyAllButton = document.createElement('button');
        applyAllButton.classList.add('apply-all-button');
        applyAllButton.textContent = 'Apply All'; 
        applyAllButton.addEventListener('click', () => {
            applySuggestions(view.state, view.dispatch);
            view.focus();
        });

        const revertAllButton = document.createElement('button');
        revertAllButton.classList.add('revert-all-button');
        revertAllButton.textContent = 'Revert All'; 
        revertAllButton.addEventListener('click', () => {
            revertSuggestions(view.state, view.dispatch);
            view.focus();
        });

        const synthesizeButton = document.createElement('button');
        synthesizeButton.textContent = 'Synthesize Equality'; 
        synthesizeButton.classList.add('synthesize-button');
        synthesizeButton.style.display = 'none'; // Hidden by default
        
        synthesizeButton.addEventListener('click', () => {
            // Scan the document for the first hypothesis that has changes
            let diffFound = false;
            
            view.state.doc.descendants((node, pos) => {
                if (diffFound) return false; // Stop if already found

                if (node.type.name === 'hypothesis') {
                    const { deletedText, insertedText } = getDiffFromNode(node);
                    
                    // Only trigger if we have a valid replacement (something deleted AND inserted)
                    if (deletedText && insertedText) {
                        diffFound = true;
                        
                        // Send the context to VS Code
                        console.log("Sending agent request:", deletedText, "->", insertedText);
                        vscode.postMessage({ 
                            command: 'agentRequest', 
                            context: { lhs: deletedText, rhs: insertedText } 
                        });
                    }
                }
                return true; 
            });

            if (!diffFound) {
                // Optional: Show a toast notification in the webview
                console.log("No hypothesis changes found.");
            }
        });

        const commandsContainer = document.createElement('div');
        commandsContainer.classList.add('suggestion-commands'); 
        commandsContainer.append(applyAllButton, revertAllButton, synthesizeButton);

        const container = document.createElement('div');
        container.classList.add('menu');
        container.append(toggleButton, commandsContainer);

        view.dom.parentElement?.prepend(container);

        const syncUI = (state) => {
            if (isSuggestChangesEnabled(state)) {
                toggleButton.textContent = 'Disable Suggestions'; 
                commandsContainer.style.display = 'flex';
                synthesizeButton.style.display = 'inline-block';
            } else {
                toggleButton.textContent = 'Enable Suggestions'; 
                commandsContainer.style.display = 'none'; 
                synthesizeButton.style.display = 'none';
            }
        }; 

        syncUI(view.state);

        return {
            update(view, _prevState) { 
                syncUI(view.state);
            },
            destroy() {
                container.remove();
            },
        };
    },
});

const readOnlyGoalsPlugin = new Plugin({
    filterTransaction(tr, state) {
        if (isSuggestChangesEnabled(state) || !tr.docChanged) return true; 
        return false; 
    }
});

// Plugin to track edits in real-time and update edit history
const editHistoryTrackingPlugin = new Plugin({
    view(editorView) {
        // Track which edits we've already sent to avoid duplicates
        const sentEdits = new Set();
        
        // Helper to create a unique key for an edit
        const editKey = (lhs, rhs) => `${lhs}|||${rhs}`;
        
        return {
            update(view, prevState) {
                // Only track if document changed and suggestions are enabled
                if (!view.state.doc.eq(prevState.doc) && isSuggestChangesEnabled(view.state)) {
                    // Scan for hypothesis nodes with edits
                    const currentEdits = [];
                    
                    view.state.doc.descendants((node, pos) => {
                        if (node.type.name === 'hypothesis') {
                            const { deletedText, insertedText } = getDiffFromNode(node);
                            
                            // Only track if we have a valid replacement (something deleted AND inserted)
                            if (deletedText && insertedText) {
                                const key = editKey(deletedText, insertedText);
                                currentEdits.push({
                                    lhs: deletedText,
                                    rhs: insertedText,
                                    key: key
                                });
                            }
                        }
                        return true;
                    });
                    
                    // Only send edits that we haven't sent before
                    currentEdits.forEach(edit => {
                        if (!sentEdits.has(edit.key)) {
                            sentEdits.add(edit.key);
                            vscode.postMessage({
                                command: 'updateEditHistory',
                                edit: {
                                    lhs: edit.lhs,
                                    rhs: edit.rhs,
                                    timestamp: Date.now()
                                }
                            });
                        }
                    });
                    
                    // Clean up sentEdits set - remove edits that are no longer in the document
                    // This allows re-tracking if user reverts and re-applies the same edit
                    const currentKeys = new Set(currentEdits.map(e => e.key));
                    for (const key of sentEdits) {
                        if (!currentKeys.has(key)) {
                            sentEdits.delete(key);
                        }
                    }
                }
            }
        };
    }
});

const plugins = [
    keymap(baseKeymap),
    history(),
    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    suggestChanges(), 
    suggestChangesViewPlugin, 
    readOnlyGoalsPlugin,
    editHistoryTrackingPlugin
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
            html = renderGoalsToHtml(msg.goals, msg.messages, msg.error); 
            break;
        case 'chatResponsePart':
            // Append or update the last partial chat message
            appendChatStreamPart(msg.text);
            return;
        case 'chatResponseDone':
            finalizeChatStream();
            return;
        case 'suggestion':
            handleSuggestion(msg.suggestion);
            return;
        default:
            console.warn("Unknown message type:", msg.type);
            return;
    }

    const domNode = document.createElement('div');
    domNode.innerHTML = html;
    
    const newDoc = DOMParser.fromSchema(schema).parse(domNode);
    const newState = EditorState.create({
        doc: newDoc,
        plugins: view.state.plugins 
    });
    view.updateState(newState);
});

// Handle suggestions from the agent
function handleSuggestion(suggestion) {
    if (!suggestion || !suggestion.hypothesisName || !suggestion.originalValue || !suggestion.suggestedValue) {
        console.warn('Invalid suggestion received:', suggestion);
        return;
    }

    let state = view.state;
    const doc = state.doc;
    
    // Find the text matching originalValue in the document
    // We'll search through all text nodes to find the originalValue
    let foundPos = -1;
    let foundLength = 0;
    
    doc.descendants((node, pos) => {
        if (node.isText) {
            const text = node.text;
            const searchText = suggestion.originalValue;
            const index = text.indexOf(searchText);
            
            if (index !== -1 && foundPos === -1) {
                foundPos = pos + index;
                foundLength = searchText.length;
                return false; // Stop searching
            }
        }
    });

    if (foundPos === -1) {
        console.warn(`Could not find original value "${suggestion.originalValue}" in document`);
        // Still show the suggestion in chat
        appendChatMessage(`Suggestion: Replace "${suggestion.originalValue}" with "${suggestion.suggestedValue}" in hypothesis "${suggestion.hypothesisName}"${suggestion.reason ? ` (${suggestion.reason})` : ''}`, 'assistant');
        return;
    }

    // Generate a unique ID for this suggestion
    const suggestionId = `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Enable suggestions if not already enabled
    if (!isSuggestChangesEnabled(state)) {
        // Enable suggestions mode first
        toggleSuggestChanges(state, (newTr) => {
            view.dispatch(newTr);
        });
        // Get the updated state after enabling
        state = view.state;
    }

    // Create a transaction to add the modification mark
    const tr = state.tr;
    const modificationMark = schema.marks.modification.create({
        id: suggestionId,
        type: 'replace',
        previousValue: suggestion.originalValue,
        newValue: suggestion.suggestedValue
    });

    // Apply the modification mark to the found text
    tr.addMark(foundPos, foundPos + foundLength, modificationMark);
    view.dispatch(tr);

    // Also show the suggestion in chat
    const suggestionMsg = `Suggestion: Replace "${suggestion.originalValue}" with "${suggestion.suggestedValue}" in hypothesis "${suggestion.hypothesisName}"${suggestion.reason ? ` (${suggestion.reason})` : ''}`;
    appendChatMessage(suggestionMsg, 'assistant');
}

// Chat UI helpers
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
let currentPartialElem = null;
let streamBuffer = ""; 

function appendChatMessage(text, cls = 'assistant') {
    if (!chatLog) return; 
    const el = document.createElement('div');
    el.className = 'chatMessage ' + cls;
    el.innerHTML = marked.parse(text); 
    chatLog.appendChild(el);
    chatLog.scrollTop = chatLog.scrollHeight;
    return el;
}

function appendChatStreamPart(text) {
    if (!chatLog) return;
    if (!currentPartialElem) {
        currentPartialElem = document.createElement('div'); 
        currentPartialElem.className = 'chatMessage assistant streaming';
        chatLog.appendChild(currentPartialElem);
        streamBuffer = ""; 
    } 
    streamBuffer += text; 
    currentPartialElem.innerHTML = marked.parse(streamBuffer); 
    chatLog.scrollTop = chatLog.scrollHeight;
}

function finalizeChatStream() {
    if (currentPartialElem) { 
        currentPartialElem.classList.remove('streaming'); 
    }
    currentPartialElem = null; 
    streamBuffer = ""; 
}

if (chatSend) {
    chatSend.addEventListener('click', () => {
        if (!chatInput) return;
        const prompt = (chatInput.value || '').trim();
        if (!prompt) return;

        appendChatMessage(prompt, 'user');
        chatInput.value = '';

        currentPartialElem = null;
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

vscode.postMessage({ command: 'requestUpdate' });