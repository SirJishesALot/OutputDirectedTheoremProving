const vscode = acquireVsCodeApi();
console.log('Webview script starting');
const refreshBtn = document.getElementById('refreshBtn');
console.log('Found refresh button:', refreshBtn);

function renderGoals(goals, content ) {
    if (!content) { return; }

    if (goals.length === 0) {
        content.innerHTML = '<i>No goals at the current cursor position.</i>';
        return;
    }

    // Clear previous state
    content.innerHTML = '';

    for (let i = 0; i < goals.length; i++) {
        const g = goals[i];
        const goalDiv = document.createElement('div');
        goalDiv.className = 'goal';

        if (g.hyps && g.hyps.length > 0) {
            const hypsDiv = document.createElement('div');
            hypsDiv.className = 'hyps';
            g.hyps.forEach(h => {
                const hypEl = document.createElement('div');
                hypEl.className = 'hypothesis'; 
                hypEl.textContent = h.names.join(', ') + ': ' + h.ty;
                hypEl.contentEditable = 'true'; 
                hypsDiv.appendChild(hypEl);
            });
            goalDiv.appendChild(hypsDiv);
        }

        const goalTypeEl = document.createElement('div');
        goalTypeEl.className = 'goalType';
        goalTypeEl.textContent = g.ty;
        goalTypeEl.contentEditable = 'true'; 
        goalDiv.appendChild(goalTypeEl);
        
        content.appendChild(goalDiv);
    }
}

window.addEventListener('message', event => {
    const content = document.getElementById('content');
    if (!content) { return; }
    const msg = event.data;
    switch (msg.type) {
        case 'noDocument':
            content.innerHTML = '<i>No active Coq document or cursor not inside a proof.</i>';
            break;
        case 'error':
            content.innerHTML = '<div class="error">Error: ' + escapeHtml(msg.message) + '</div>';
            break;
        case 'proofUpdate':
            renderGoals(msg.goals || [], content);
            break;
        default:
            console.warn('Received unknown message type:', msg.type);
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