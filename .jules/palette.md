## 2024-10-08 - Added focus-within for composite inputs
**Learning:** In composite inputs where an inner `<input>` has `outline-none` (like `SearchBox` or `ChatTab`), screen readers and keyboard navigators lose focus visibility.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500 transition-shadow` to the outer wrapper container (like the `div` or `label`) so the focus ring is visible when the inner input is active. Ensure the inner `<input>` has an explicit `aria-label` when no visual label exists.
