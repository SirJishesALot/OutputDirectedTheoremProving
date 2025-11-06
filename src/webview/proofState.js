const vscode = acquireVsCodeApi();
console.log('Webview script starting');
const refreshBtn = document.getElementById('refreshBtn');
console.log('Found refresh button:', refreshBtn);

window.addEventListener('message', event => {
    const msg = event.data;
    const content = document.getElementById('content');
    if (msg.type === 'noDocument') {
        content.innerHTML = '<i>No active Coq document or cursor not inside a proof.</i>';
    } else if (msg.type === 'error') {
        content.innerHTML = '<div class="error">Error: ' + escapeHtml(msg.message) + '</div>';
    } else if (msg.type === 'proofUpdate') {
        const goals = msg.goals || [];
        if (goals.length === 0) {
            content.innerHTML = '<i>No goals at the current cursor position.</i>';
            return;
        }
        content.innerHTML = '';
        for (let i = 0; i < goals.length; i++) {
            const g = goals[i];
            const div = document.createElement('div');
            div.className = 'goal';
            let inner = '';
            if (g.hyps && g.hyps.length > 0) {
            inner += '<div class="hyps">' + escapeHtml(g.hyps.map(h => h.names.join(', ') + ': ' + h.ty).join('\n')) + '</div>';
            }
            inner += '<div class="goalType">' + escapeHtml(g.ty) + '</div>';
            div.innerHTML = inner;
            content.appendChild(div);
        }
    } else {
        content.innerHTML = '<i>Unknown message type.</i>';
    }
});

document.getElementById('applyBtn').addEventListener('click', () => {
    const tactic = document.getElementById('tacticInput').value;
    vscode.postMessage({ command: 'applyTactic', tactic });
});

document.getElementById('refreshBtn').addEventListener('click', () => {
    console.log('Refresh button clicked');
    vscode.postMessage({ command: 'requestUpdate' });
    console.log('Sent requestUpdate message');
});

function escapeHtml(s) {
    if (!s) { return ''; }
    return s.replace(/[&<>"']/g, function(c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]; });
}
vscode.postMessage({ command: 'requestUpdate' });