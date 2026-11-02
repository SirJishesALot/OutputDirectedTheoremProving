#!/usr/bin/env bash
set -e

echo "=== Pulling latest changes from git ==="
git pull

echo "=== Installing dependencies ==="
npm install

echo "=== Packaging updated VSIX ==="
rm -f outputdirectedtheoremproving-*.vsix
npx --yes @vscode/vsce package --no-dependencies

echo "=== Installing fresh VSIX into VS Code ==="
VSIX_FILE=$(ls -t outputdirectedtheoremproving-*.vsix | head -n 1)
if [ -n "$VSIX_FILE" ]; then
    echo "Found package: $VSIX_FILE"
    if command -v code >/dev/null 2>&1; then
        code --install-extension "$VSIX_FILE" --force
        echo "=== Successfully installed $VSIX_FILE ==="
        echo "Please run 'Developer: Reload Window' from the Command Palette (Cmd+Shift+P / Ctrl+Shift+P) to activate!"
    else
        echo "Warning: 'code' CLI not found. Please install $VSIX_FILE via the Extensions view: '...' menu -> 'Install from VSIX...'"
    fi
else
    echo "Error: No .vsix file was generated."
    exit 1
fi
