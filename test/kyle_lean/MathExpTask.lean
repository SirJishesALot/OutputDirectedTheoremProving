set_option maxHeartbeats 10000000

/- -----------------------------------------------------------------
   Warmup Theorems (Real / Natural Numbers)
   ----------------------------------------------------------------- -/

-- In standard Lean 4 core (without Mathlib), R is abbreviated to Nat.
-- If Mathlib is imported in your environment, this can alternatively be Real.
abbrev R := Nat

theorem pow_two_nat (x : Nat) : x ^ 2 = x * x := by
  change x ^ (2 : Nat) = x * x
  rw [Nat.pow_succ, Nat.pow_succ, Nat.pow_zero, Nat.one_mul]

theorem expand_thm (a b : R) :
  (a + b) ^ 2 = a ^ 2 + 2 * a * b + b ^ 2 := by
  sorry

theorem quadratic_gt_zero (a b : R) :
  0 ≤ a ^ 2 + 2 * a * b + b ^ 2 := by
  sorry

/- -----------------------------------------------------------------
   Natural Numbers & Summation
   ----------------------------------------------------------------- -/

-- Sum of a function f over the range [0, n - 1] (similar to Finset.sum)
def sum_range (n : Nat) (f : Nat → Nat) : Nat :=
  match n with
  | 0 => 0
  | n' + 1 => sum_range n' f + f n'

/- -----------------------------------------------------------------
   Theorem 1
   ----------------------------------------------------------------- -/
-- The notation sum_range (n + 1) f takes the sum of a function over {0, 1, ..., n}.
-- In this case the function is f(i) = i.
theorem sum_n : ∀ n : Nat,
  sum_range (n + 1) (fun i => i) = (n * (n + 1)) / 2 := by
  intro n
  induction n with
  | zero => rfl
  | succ n IH =>
    sorry

/- -----------------------------------------------------------------
   Theorem 2
   ----------------------------------------------------------------- -/

-- Factorial definition on Nat
def fact : Nat → Nat
  | 0 => 1
  | n + 1 => (n + 1) * fact n

theorem fact_pos (k : Nat) : 0 < fact k := by
  induction k with
  | zero => decide
  | succ k IH =>
    show 0 < (k + 1) * fact k
    apply Nat.mul_pos
    · omega
    · exact IH

theorem fact_le_succ (k : Nat) : fact k ≤ fact (k + 1) := by
  show fact k ≤ (k + 1) * fact k
  have h_pos := fact_pos k
  rw [Nat.add_mul, Nat.one_mul]
  omega

-- fact j denotes factorial; fact (n + 2) corresponds to Coq's fact (S n + 1)
theorem fac_le (n : Nat) :
  sum_range (n + 1) (fun j => fact j) ≤ fact (n + 2) := by
  sorry

/- -----------------------------------------------------------------
   Theorem 3
   ----------------------------------------------------------------- -/
-- In Lean 4, `k ∣ y` denotes `Nat.dvd k y` (exists z, y = k * z),
-- which directly corresponds to Coq's `Nat.divide k y`.
theorem dvd_k (n k : Nat) :
  k ∣ (k + 1) ^ n - 1 := by
  sorry
