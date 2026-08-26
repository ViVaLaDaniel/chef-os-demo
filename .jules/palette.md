## 2024-08-26 - Add focus states to composite inputs
**Learning:** Composite input components (like SearchBox and Chat input) in this app use an inner `<input>` with `outline-none` inside a rounded outer container, which removes the default browser focus ring, making them inaccessible to keyboard navigation.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper container (e.g., `div` or `label`) so the focus ring is visible when the inner input is active.
