## 2024-05-18 - Restoring Focus Indicators for outline-none Inputs
**Learning:** When using `outline-none` on standard `<input>` elements in Tailwind to remove default browser styling, it destroys keyboard navigation accessibility unless explicitly restored.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` (or the respective primary color) to the parent wrapper of the input (e.g. the `<label>` or `<div>` wrapper) to restore keyboard focus visibility while maintaining custom styling.
