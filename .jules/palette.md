## 2024-09-07 - Accessible Outline-None Inputs
**Learning:** When using `outline-none` on inner `<input>` elements (like in `SearchBox` or chat), they lose their native focus ring. Relying solely on placeholder text is also inaccessible for screen readers.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper container so the focus ring is visible when the inner input is active. Also, ensure the inner `<input>` has an explicit `aria-label`.
