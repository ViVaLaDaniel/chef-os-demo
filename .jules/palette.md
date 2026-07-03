## 2026-07-03 - Restore Focus States with outline-none
**Learning:** When using `outline-none` on inputs for custom styling, keyboard accessibility is easily lost. This project uses wrapper elements for input styling.
**Action:** Use `focus-within:ring-2 focus-within:ring-amber-500` on the wrapper elements to restore native-like focus indication without adding arbitrary CSS.
