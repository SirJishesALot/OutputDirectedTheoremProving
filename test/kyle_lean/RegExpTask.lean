set_option maxHeartbeats 10000000

namespace RegExp
open Lean Elab


inductive Char where
  | z
  | o
deriving Repr

notation "c(0)" => Char.z
notation "c(1)" => Char.o

abbrev String := List Char


inductive RegExp : Type where
  | emp : RegExp
  | eps : RegExp
  | char : Char → RegExp
  | star : RegExp → RegExp
  | union : RegExp → RegExp → RegExp
  | concat : RegExp → RegExp → RegExp
deriving Nonempty, Inhabited, Repr


instance : Coe Char RegExp where
  coe c := RegExp.char c

notation "∅" => RegExp.emp
notation "ε" => RegExp.eps
notation r1 " <|> " r2  => RegExp.union r1 r2
notation r1 " <·> " r2 => RegExp.concat r1 r2
notation r "*" => RegExp.star r

/-
Notation Examples:
- ∅                 -> ∅
- ε                 -> ""
- c(0) <·> c(1)     -> 01
- c(0) <|> c(1)     -> 0|1
- (c(0))*           -> 0*
- c(0) <·> c(1)     -> 01
- c(0) <|> c(1)     -> 0|1
- (c(0) <·> c(1))*  -> 01
-/


inductive accepts : RegExp → String → Prop where
  | eps : accepts ε []

  | char (c : Char) : accepts c [c]

  | unionLeft r1 r2 s : accepts r1 s → accepts (r1 <|> r2) s

  | unionRight r1 r2 s : accepts r2 s → accepts (r1 <|> r2) s

  | concat r1 r2 s1 s2:
    accepts r1 s1 →
    accepts r2 s2 →
    accepts (r1 <·> r2) (s1 ++ s2)

  | starEmpty r : accepts (r*) []

  | starNonempty r s1 s2 :
    accepts r s1 →
    accepts (r*) s2 →
    accepts (r*) (s1 ++ s2)


----------------------------
-- Definitions of Languages
----------------------------
def Language := String → Prop

def is_regular (l : Language) : Prop :=
  ∃ r, ∀ s, l s ↔ accepts r s

def concat_lang (l₁ l₂ : Language) : Language :=
  λ (s : String) => ∃ s₁ s₂, s = s₁ ++ s₂ ∧ l₁ s₁ ∧ l₂ s₂

def reverse_lang (l : Language) : Language :=
  λ (s : String) => ∃ s', s.reverse = s' ∧ l s'



--------------------
-- Warmup Theorems
--------------------
theorem accepts_concat : ∀ r₁ r₂ s₁ s₂, accepts r₁ s₁ → accepts r₂ s₂ → accepts (r₁ <·> r₂) (s₁ ++ s₂) := by
  sorry

theorem accepts_unionLeft : ∀ r₁ r₂ s, accepts r₁ s → accepts (r₁ <|> r₂) s := by
  sorry

theorem accepts_star_empty : ∀ r, accepts (r*) [] := by
  sorry

theorem accepts_not_emp : ∀ r, (∃ s, accepts r s) → r ≠ ∅ := by
  sorry


---------------
-- Theorem 1
---------------
theorem cat_char_disjoint : ∀ (c₁ c₂ : Char) r s₁ s₂,
  c₁ ≠ c₂ →
  (accepts (c₁ <·> r) s₁) →
  (accepts (c₂ <·> r) s₂) →
  s₁ ≠ s₂ := by
  sorry


---------------
-- Theorem 2
---------------
def reverse : RegExp → RegExp
  | .emp => ∅
  | .eps => ε
  | .char c => c
  | .star r => (reverse r)*
  | .union r₁ r₂ => (reverse r₁) <|> (reverse r₂)
  | .concat r₁ r₂ => (reverse r₂) <·> (reverse r₁)


theorem reverse_correct_mp : ∀ r s, accepts r s → accepts (reverse r) (s.reverse) := by
  sorry

---------------
-- Theorem 3
---------------
theorem concat_regular : ∀ (l₁ l₂ : Language),
  is_regular l₁ →
  is_regular l₂ →
  is_regular (concat_lang l₁ l₂) := by
  sorry

end RegExp
