## 2025-03-09 - Ensure focus states for composite inputs
**Learning:** Using `outline-none` on inner `<input>` elements in composite components (like Chat and SearchBox) hides focus state, causing accessibility issues for keyboard users.
**Action:** When an inner `<input>` uses `outline-none`, apply `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper container (`div` or `label`) so the focus ring is visible when the input is active.
