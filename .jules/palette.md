## 2024-05-14 - Add focus visible styles for keyboard navigation in composite inputs
**Learning:** For composite input components where an inner `<input>` uses `outline-none`, the visual focus indicator (like the default blue browser ring) is lost.
**Action:** Apply `focus-within` classes (e.g., `focus-within:ring-2 focus-within:ring-amber-500`) to the outer wrapper container (like the `div` or `label`) so the focus ring is properly displayed and accessible when the inner input receives focus.
