// This file is now: src/webview-src/main.js

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TrackChangeExtension } from 'track-change-extension';

// @ts-ignore
const vscode = acquireVsCodeApi();

// --- Tiptap Editor Instance ---
let editor;

// --- Get UI elements ---
const applyBtn = document.getElementById('applyBtn');
const refreshBtn = document.getElementById('refreshBtn');
const tacticInput = document.getElementById('tacticInput');
const editorElement = document.getElementById('editor');

/**
 * Escapes HTML special characters.
 * @param {string | undefined | null} s
 */
function escapeHtml(s) {
    if (!s) { return ''; }
    return s.replace(/[&<>"']/g, (c) => 
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c
    );
}

/**
 * Generates an HTML string for Tiptap to consume.
 * @param {Array<any>} goals
 * @returns {string}
 */
function renderGoalsToHtml(goals) {
    if (goals.length === 0) {
        return '<p><i>No goals at the current cursor position.</i></p>';
    }

    let html = '';
    for (let i = 0; i < goals.length; i++) {
        const g = goals[i];
        html += '<div class="goal">'; // Use a div, not a <p>

        // --- Render Hypotheses ---
        if (g.hyps && g.hyps.length > 0) {
            html += '<div class="hyps">'; // Container
            g.hyps.forEach(h => {
                const text = escapeHtml(h.names.join(', ') + ': ' + h.ty);
                // Use a <p> tag inside the div for Tiptap to recognize as editable block
                html += `<p class="hypothesis">${text}</p>`; 
            });
            html += '</div>';
        }

        // --- Render Goal Type ---
        const goalText = escapeHtml(g.ty);
        html += `<div class="goalType">${goalText}</div>`;

        html += '</div>';
    }
    return html;
}

// --- Listen for messages from the extension ---
window.addEventListener('message', event => {
    const msg = event.data;
    if (!editor) { return; }

    switch (msg.type) {
        case 'noDocument':
            editor.commands.setContent('<p><i>No active Coq document or cursor not inside a proof.</i></p>');
            break;
        case 'error':
            editor.commands.setContent('<p><div class="error">Error: ' + escapeHtml(msg.message) + '</div></p>');
            break;
        case 'proofUpdate':
            const goals = msg.goals || [];
            const html = renderGoalsToHtml(goals);
            // Load the new content AND disable track changes
            // so the *loading* isn't seen as a "change".
            editor.commands.setTrackChanges(false);
            editor.commands.setContent(html);
            // Re-enable track changes for user edits.
            editor.commands.setTrackChanges(true);
            break;
    }
});

// --- Add listeners for webview UI controls ---
if (applyBtn) {
    applyBtn.addEventListener('click', () => {
        if (tacticInput) {
            vscode.postMessage({ command: 'applyTactic', tactic: tacticInput.value });
        }
    });
}

if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        console.log('Refresh button clicked');
        vscode.postMessage({ command: 'requestUpdate' });
    });
}

// --- Initialize Tiptap ---
if (editorElement) {
    editor = new Editor({
        element: editorElement,
        extensions: [
            StarterKit, // Basic Tiptap nodes (doc, paragraph, text)
            TrackChangeExtension.configure({
                enable: true, // Start with it on
            }),
        ],
        editable: true,
        // When the user clicks on the webview, don't trigger
        // the `onDidChangeTextEditorSelection` in the extension.
        // We handle this by checking `this.panel.active` in `updateProofState`
    });
} else {
    console.error('Tiptap editor element not found');
}

// Request initial state on load
vscode.postMessage({ command: 'requestUpdate' });
console.log('Webview script loaded and Tiptap initialized.');