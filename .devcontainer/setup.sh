#!/bin/bash
set -e

# System & Opam Setup (Rocq 9.0)
# Note: nodejs and npm removed from this line!
sudo apt-get update && sudo apt-get install -y opam libgmp-dev pkg-config curl

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Initialize opam
opam init --bare --disable-sandboxing -y
opam switch create rocq-9.0 ocaml-base-compiler.5.4.1 -y
eval $(opam env --switch=rocq-9.0)
opam repo add rocq-released https://rocq-prover.org/opam/released -y
opam install vsrocq-language-server -y

# Build and Sideload Extension
npm install
npx --yes @vscode/vsce package
# code --install-extension *.vsix