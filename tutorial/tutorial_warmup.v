Require Import Arith.
Require Import Nat.

(* ========================================================================= *)
(* Facilitator Demo: Used in Section 3 of PILOT_TUTORIAL_SCRIPT.md          *)
(* ========================================================================= *)
Theorem demo_step : forall n : nat, (n + 0) * 1 = n.
Proof.
  intros n.  
  (* Place cursor on the line below to demo editing (n + 0) -> n *)
  
Admitted.

(* ========================================================================= *)
(* Participant Warm-up: Used in Section 4 of PILOT_TUTORIAL_SCRIPT.md       *)
(* ========================================================================= *)
Theorem warmup_exercise : forall (n m : nat), (n * 1) + (0 + m) = n + m.
Proof.
  intros n m.
  (* Participant places cursor on the line below *)

Admitted.
