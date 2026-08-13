## 2024-05-14 - Missing focus indicators on composite inputs
**Learning:** When using `outline-none` on an inner `<input>` element within a composite component (like a custom search box or chat input wrapper), the visual focus indicator is lost, making keyboard navigation inaccessible.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer container (e.g., `div` or `label`) so the entire component visually indicates focus when the inner input is active, ensuring keyboard accessibility.
