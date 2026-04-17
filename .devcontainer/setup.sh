#!/bin/bash
set -e

# System Dependencies
# Added 'm4' which is often required for opam package compilation
sudo apt-get update && sudo apt-get install -y opam libgmp-dev pkg-config curl m4

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Initialize opam
# Using OCaml 4.14.1 for maximum stability with the Rocq 9.0 series
opam init --bare --disable-sandboxing -y
opam switch create rocq-9.0 ocaml-base-compiler.4.14.1 -y
eval $(opam env --switch=rocq-9.0)

# Add the Rocq Repository
opam repo add rocq-released https://rocq-prover.org/opam/released -y

# PIN AND INSTALL ROCQ 9.0.0 & TOOLS
# -j 1 prevents OOM (Out of Memory) kills in GitHub Codespaces
# We install both vsrocq (for stepping) and coq-lsp (for research/async)
opam install -y -j 1 \
    rocq-runtime.9.0.0 \
    rocq-core.9.0.0 \
    rocq-stdlib.9.0.0 \
    rocq-prover.9.0.0 \
    vsrocq-language-server \
    coq-lsp.0.2.5+9.0

# Build and Sideload Extension (If you are developing the VS Code tool)
npm install
npx --yes @vscode/vsce package

echo 'eval $(opam env --switch=rocq-9.0 --set-switch)' >> ~/.bashrc
echo "Setup complete."