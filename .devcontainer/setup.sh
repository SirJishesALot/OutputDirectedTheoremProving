#!/bin/bash
set -e

# Install necessary system libraries for Rocq/Opam
sudo apt-get update && sudo apt-get install -y opam libgmp-dev pkg-config

# Initialize opam
opam init --disabled-switch -y

# Recreate your rocq-9.0 switch with OCaml 5.4.1
opam switch create rocq-9.0 ocaml-base-compiler.5.4.1 -y
eval $(opam env --switch=rocq-9.0)

# Add the Rocq repo and install the core prover + language server
opam repo add rocq-released https://rocq-prover.org/opam/released -y
opam pin add rocq-prover 9.0.0 -y
opam install vsrocq-language-server -y

# Verify the installation for the logs
which rocq
which vsrocqtop