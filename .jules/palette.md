## 2024-03-20 - Composite Input Accessibility
**Learning:** When creating composite input components (like SearchBox or Chat input) where the inner `<input>` has `outline-none` and relies on an outer container for styling, keyboard accessibility is lost because the outer container doesn't show focus rings.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer container (like `div` or `label`) and ensure the inner `<input>` has an explicit `aria-label` when it lacks a visually associated label or relies on placeholder text.
