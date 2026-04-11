#!/bin/bash
set -e

# System & Opam Setup (Rocq 9.0)
sudo apt-get update && sudo apt-get install -y opam libgmp-dev pkg-config nodejs npm
opam init --disabled-switch -y
opam switch create rocq-9.0 ocaml-base-compiler.5.4.1 -y
eval $(opam env --switch=rocq-9.0)
opam repo add rocq-released https://rocq-prover.org/opam/released -y
opam install vsrocq-language-server -y

# Build and Sideload Extension
npm install
npx @vscode/vsce package
code --install-extension *.vsix