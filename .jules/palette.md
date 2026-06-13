## 2024-06-13 - Restoring focus rings for styled inputs
**Learning:** In Tailwind, styling input wrappers (like a `<label>` or `<div>` with rounded corners and shadows) while removing the input's default outline with `outline-none` causes a complete loss of focus indication for keyboard users.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-inset focus-within:ring-[color]` (or similar focus classes) to the parent wrapper of any input that uses `outline-none` to ensure keyboard accessibility is maintained.
