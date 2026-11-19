import Lake
open Lake DSL

package «outputdirectedtheoremproving» where

require "leanprover-community" / "mathlib" @ git "v4.30.0"

@[default_target]
lean_lib «OutputDirectedTheoremProving» where
