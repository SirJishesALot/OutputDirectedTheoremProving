import Lake
open Lake DSL

package «outputdirectedtheoremproving» where
  -- Additional package configuration options

require mathlib from git
  "https://github.com/leanprover-community/mathlib4.git" @ "v4.30.0"

@[default_target]
lean_lib «OutputDirectedTheoremProving» where
  -- Library configuration
