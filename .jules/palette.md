
## 2024-03-10 - Adding focus rings and ARIA labels to composite inputs
**Learning:** In composite input components (like SearchBox and Chat input) where an inner `<input>` uses `outline-none`, the focus state is completely lost for keyboard users.
**Action:** Apply `focus-within` classes (e.g., `focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500`) to the outer wrapper container so the focus ring is visible when the inner input is active. Furthermore, ensure the inner `<input>` has an explicit `aria-label` since they lack visually associated `<label>`s and rely solely on `placeholder` text which is insufficient for screen readers.
