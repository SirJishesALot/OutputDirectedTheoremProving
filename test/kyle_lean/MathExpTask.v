Require Import Reals.
Require Import Arith.
Require Import Nat.
Require Import Arith.Factorial.

(* -----------------------------------------------------------------
   Warmup Theorems (Real Numbers)
   ----------------------------------------------------------------- *)
Open Scope R_scope.

Theorem expand_thm : forall a b : R,
  (a + b) ^ 2 = a ^ 2 + 2 * a * b + b ^ 2.
Proof.
  Admitted.

Theorem quadratic_gt_zero : forall a b : R, 
  0 <= a ^ 2 + 2 * a * b + b ^ 2.
Proof.
  Admitted.

Close Scope R_scope.

(* -----------------------------------------------------------------
   Natural Numbers & Summation
   ----------------------------------------------------------------- *)
Open Scope nat_scope.

(* Helper to emulate Lean's Finset sum over a range without relying on MathComp *)
Fixpoint sum_range (n : nat) (f : nat -> nat) : nat :=
  match n with
  | 0 => 0
  | S n' => sum_range n' f + f n'
  end.

(* -----------------------------------------------------------------
   Theorem 1
   ----------------------------------------------------------------- *)
(* The notation sum_range (S n) f takes the sum of a function over a finite set.
   In this case the finite set is {0, 1, ..., n} and the function is f(i) = i. *)
Theorem sum_n : forall n : nat, 
  sum_range (S n) (fun i => i) = (n * (n + 1)) / 2.
Proof.  
  
  Admitted.

(* -----------------------------------------------------------------
   Theorem 2
   ----------------------------------------------------------------- *)
(* fact j denotes factorial *)
Theorem fac_le : forall n : nat, 
  sum_range (S n) (fun j => fact j) <= fact (S n + 1).
Proof.
  Admitted.

(* -----------------------------------------------------------------
   Theorem 3
   ----------------------------------------------------------------- *)
(* Nat.divide is the standard Coq definition for divides:
   Definition divide x y := exists z, y = z * x. *)
Theorem dvd_k : forall n k : nat, 
  Nat.divide k ((k + 1) ^ n - 1).
Proof. 
  Admitted.