## 2025-03-01 - Focus states for composite inputs
**Learning:** Composite components where the inner `<input>` uses `outline-none` lack visual focus unless `focus-within` is applied to the outer container. They also need `aria-label`s if they lack a visual `<label>`.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper and `aria-label` to the inner input for `outline-none` inputs.
