#!/usr/bin/env bash
set -e

echo "=== 1. Configuring lakefile.lean for Mathlib v4.30.0 ==="
cat << 'EOF' > lakefile.lean
import Lake
open Lake DSL

package «outputdirectedtheoremproving» where

require "leanprover-community" / "mathlib" @ git "v4.30.0"

@[default_target]
lean_lib «OutputDirectedTheoremProving» where
EOF

echo "=== 2. Creating root module OutputDirectedTheoremProving.lean ==="
cat << 'EOF' > OutputDirectedTheoremProving.lean
-- Root module for OutputDirectedTheoremProving
import Mathlib
EOF

echo "=== 3. Resolving Mathlib dependencies (lake update) ==="
lake update

echo "=== 4. Fetching precompiled Mathlib binary cache (lake exe cache get) ==="
lake exe cache get

echo ""
echo "=== Mathlib setup complete! ==="
echo "Please reload your VS Code window now:"
echo "1. Press Cmd+Shift+P (or Ctrl+Shift+P on Linux/Windows)"
echo "2. Select 'Developer: Reload Window'"
echo "3. 'import Mathlib' will now resolve instantly without errors!"
