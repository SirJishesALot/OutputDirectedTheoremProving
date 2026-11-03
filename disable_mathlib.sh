#!/usr/bin/env bash
set -e

echo "=== Terminating running Lean/Lake processes ==="
killall -9 lean lake 2>/dev/null || true

echo "=== Disabling lakefile.lean ==="
if [ -f "lakefile.lean" ]; then
    mv lakefile.lean lakefile.lean.mathlib
fi
rm -f lake-manifest.json OutputDirectedTheoremProving.lean

echo "=== Lean reverted to standalone mode (<0.1s startup) ==="
echo "Reload your VS Code window (Developer: Reload Window) to apply."
