## 2024-05-24 - Focus states for composite inputs
**Learning:** When using composite input components where an inner `<input>` uses `outline-none`, the focus ring is lost, making keyboard navigation inaccessible.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper container (e.g., `div` or `label`) so the focus ring is visible when the inner input is active.
