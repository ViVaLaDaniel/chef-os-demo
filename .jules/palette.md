## 2024-03-24 - Missing Focus Rings on Unstyled Inputs
**Learning:** When using `outline-none` on `<input>` elements inside composite components (like a search bar or chat input with an adjacent button), keyboard users lose focus visibility. Standard focus rings apply to the input itself, which can look awkward if the container is styled as the "input box".
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or the brand focus color) to the parent wrapper of any input using `outline-none` to ensure the entire composite component visually indicates keyboard focus.
