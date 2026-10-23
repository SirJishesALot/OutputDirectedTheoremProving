#!/bin/bash
set -e

echo "=== Starting Devcontainer Setup ==="

# 1. System Dependencies
# Added essential build tools, m4, libgmp, and z3 for theorem proving & opam compilation
echo "=== Installing system dependencies ==="
sudo apt-get update && sudo apt-get install -y \
    build-essential \
    curl \
    git \
    libgmp-dev \
    pkg-config \
    m4 \
    bubblewrap \
    unzip \
    z3 \
    opam

# 2. Install Node.js 20.x
echo "=== Installing Node.js 20.x ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Setup OPAM and Rocq 9.0.0 with OCaml 5.4.1
echo "=== Initializing OPAM with OCaml 5.4.1 ==="
opam init --bare --disable-sandboxing -y
if ! opam switch show 2>/dev/null | grep -q "^rocq-9.0$"; then
    opam switch create rocq-9.0 ocaml-base-compiler.5.4.1 -y
fi
eval $(opam env --switch=rocq-9.0)

# Add Rocq OPAM Repository
echo "=== Adding Rocq OPAM repository ==="
if ! opam repo list 2>/dev/null | grep -q "rocq-released"; then
    opam repo add rocq-released https://rocq-prover.org/opam/released -y
fi

# Install Rocq 9.0.0, Language Servers (coq-lsp, vsrocq), and stdpp
# -j 1 prevents OOM (Out of Memory) kills in GitHub Codespaces
echo "=== Installing Rocq 9.0.0, coq-lsp, vsrocq, and stdpp ==="
opam install -y -j 1 \
    coq.9.0.0 \
    rocq-runtime.9.0.0 \
    rocq-core.9.0.0 \
    rocq-stdlib.9.0.0 \
    rocq-prover.9.0.0 \
    rocq-stdpp.1.13.0 \
    vscoq-language-server.2.3.4 \
    vsrocq-language-server \
    coq-lsp.0.2.5+9.0

# 4. Setup Lean 4 (v4.30.0) via elan
echo "=== Installing elan and Lean 4 (v4.30.0) ==="
if [ ! -d "$HOME/.elan" ]; then
    curl -sSf https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh | sh -s -- -y --default-toolchain leanprover/lean4:v4.30.0
fi
source "$HOME/.elan/env"
elan toolchain install leanprover/lean4:v4.30.0
elan default leanprover/lean4:v4.30.0

# 5. Persist environment for shells
echo "=== Configuring environment persistence ==="
echo 'eval $(opam env --switch=rocq-9.0 --set-switch)' >> ~/.bashrc
echo '[ -f "$HOME/.elan/env" ] && source "$HOME/.elan/env"' >> ~/.bashrc
if [ -f "$HOME/.profile" ]; then
    echo 'eval $(opam env --switch=rocq-9.0 --set-switch)' >> ~/.profile
    echo '[ -f "$HOME/.elan/env" ] && source "$HOME/.elan/env"' >> ~/.profile
fi
if [ -f "$HOME/.zshrc" ]; then
    echo 'eval $(opam env --switch=rocq-9.0 --set-switch)' >> ~/.zshrc
    echo '[ -f "$HOME/.elan/env" ] && source "$HOME/.elan/env"' >> ~/.zshrc
fi

# 6. Install project dependencies, compile, and package extension
echo "=== Installing Node dependencies & building VS Code extension ==="
npm install
npm run compile
npx --yes @vscode/vsce package

# Sideload the generated .vsix if the code CLI is present
if command -v code >/dev/null 2>&1; then
    code --install-extension outputdirectedtheoremproving-*.vsix || true
fi

echo "=== Devcontainer Setup complete ==="
