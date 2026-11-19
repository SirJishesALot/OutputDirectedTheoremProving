set_option maxHeartbeats 10000000

/- -----------------------------------------------------------------
   Warmup Theorems (Real / Natural Numbers)
   ----------------------------------------------------------------- -/

-- In standard Lean 4 core (without Mathlib), R is abbreviated to Nat.
-- If Mathlib is imported in your environment, this can alternatively be Real.
abbrev R := Nat

/- -----------------------------------------------------------------
   Theorem
   ----------------------------------------------------------------- -/
-- In Lean 4, `k ∣ y` denotes `Nat.dvd k y` (exists z, y = k * z),
-- which directly corresponds to Coq's `Nat.divide k y`.
theorem dvd_k (n k : Nat) :
  k ∣ (k + 1) ^ n - 1 := by
  sorry
