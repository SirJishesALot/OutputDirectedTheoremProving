set_option maxHeartbeats 10000000

-- ========================================================================= --
-- Facilitator Demo: Used in Section 3 of PILOT_TUTORIAL_SCRIPT.md           --
-- ========================================================================= --
theorem demo_step : ∀ n : Nat, (n + 0) * 1 = n := by
  intro n
  -- Place cursor on the line below to demo editing (n + 0) -> n
  sorry

-- ========================================================================= --
-- Participant Warm-up: Used in Section 4 of PILOT_TUTORIAL_SCRIPT.md       --
-- ========================================================================= --
theorem warmup_exercise : ∀ (n m : Nat), (n * 1) + (0 + m) = n + m := by
  intro n m
  -- Participant places cursor on the line below
  sorry
