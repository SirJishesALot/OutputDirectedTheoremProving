Require Import List.
Import ListNotations.

(* -----------------------------------------------------------------
   Definitions
   ----------------------------------------------------------------- *)

Inductive Char : Type :=
  | z : Char
  | o : Char.

Definition String := list Char.

Inductive RegExp : Type :=
  | emp : RegExp
  | eps : RegExp
  | char : Char -> RegExp
  | star : RegExp -> RegExp
  | union : RegExp -> RegExp -> RegExp
  | concat : RegExp -> RegExp -> RegExp.

(* Coercion to allow using Char directly as a RegExp *)
Coercion char : Char >-> RegExp.

Declare Scope regexp_scope.
Notation "∅" := emp (at level 0) : regexp_scope.
Notation "'ε'" := eps (at level 0) : regexp_scope.
Notation "r1 <|> r2" := (union r1 r2)
  (at level 50, left associativity, r2 at level 50) : regexp_scope.
Notation "r1 <·> r2" := (concat r1 r2)
  (at level 40, left associativity, r2 at level 40) : regexp_scope.
Notation "r '*'" := (star r) (at level 30) : regexp_scope.
Open Scope regexp_scope.

Inductive accepts : RegExp -> String -> Prop :=
  | accepts_eps : accepts ε []
  | accepts_char : forall (c : Char), accepts (char c) [c]
  | accepts_unionLeft : forall r1 r2 s, accepts r1 s -> accepts (r1 <|> r2) s
  | accepts_unionRight : forall r1 r2 s, accepts r2 s -> accepts (r1 <|> r2) s
  | accepts_concat : forall r1 r2 s1 s2,
      accepts r1 s1 ->
      accepts r2 s2 ->
      accepts (r1 <·> r2) (s1 ++ s2)
  | accepts_starEmpty : forall r, accepts (r*) []
  | accepts_starNonempty : forall r s1 s2,
      accepts r s1 ->
      accepts (r*) s2 ->
      accepts (r*) (s1 ++ s2).

(* -----------------------------------------------------------------
   Definitions of Languages
   ----------------------------------------------------------------- *)

Definition Language := String -> Prop.

Definition is_regular (l : Language) : Prop :=
  exists r, forall s, l s <-> accepts r s.

Definition concat_lang (l1 l2 : Language) : Language :=
  fun s => exists s1 s2, s = s1 ++ s2 /\ l1 s1 /\ l2 s2.

Definition reverse_lang (l : Language) : Language :=
  fun s => exists s', rev s = s' /\ l s'.

(* -----------------------------------------------------------------
   Warmup Theorems
   ----------------------------------------------------------------- *)

Theorem accepts_concat_thm : forall r1 r2 s1 s2, 
  accepts r1 s1 -> accepts r2 s2 -> accepts (r1 <·> r2) (s1 ++ s2).
Proof.
  Admitted.

Theorem accepts_unionLeft_thm : forall r1 r2 s, 
  accepts r1 s -> accepts (r1 <|> r2) s.
Proof.
  Admitted.

Theorem accepts_star_empty_thm : forall r, 
  accepts (r*) [].
Proof.
  Admitted.

Theorem accepts_not_emp : forall r, 
  (exists s, accepts r s) -> r <> ∅.
Proof.
  Admitted.

(* -----------------------------------------------------------------
   Theorem 1
   ----------------------------------------------------------------- *)

Theorem cat_char_disjoint : forall (c1 c2 : Char) r s1 s2,
  c1 <> c2 ->
  accepts (char c1 <·> r) s1 ->
  accepts (char c2 <·> r) s2 ->
  s1 <> s2.
Proof.
  Admitted.

(* -----------------------------------------------------------------
   Theorem 2
   ----------------------------------------------------------------- *)

Fixpoint reverse (r : RegExp) : RegExp :=
  match r with
  | emp => emp
  | eps => eps
  | char c => char c
  | star r' => (reverse r')*
  | union r1 r2 => (reverse r1) <|> (reverse r2)
  | concat r1 r2 => (reverse r2) <·> (reverse r1)
  end.

Theorem reverse_correct_mp : forall r s, 
  accepts r s -> accepts (reverse r) (rev s).
Proof.
  Admitted.

(* -----------------------------------------------------------------
   Theorem 3
   ----------------------------------------------------------------- *)

Theorem concat_regular : forall (l1 l2 : Language),
  is_regular l1 ->
  is_regular l2 ->
  is_regular (concat_lang l1 l2).
Proof.
  Admitted.