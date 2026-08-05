## 2026-08-05 - Restore keyboard focus styles
**Learning:** When using `outline-none` on inputs for aesthetic reasons inside styled wrappers, keyboard users lose focus indicators.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper element (`div` or `label`) so the entire component shows focus.
