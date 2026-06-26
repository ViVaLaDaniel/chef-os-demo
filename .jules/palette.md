## 2024-12-20 - Restoring Focus States on Custom Input Wrappers
**Learning:** When using `outline-none` on an `<input>` element to hide the default browser focus ring (usually done to style a wrapper element like a rounded pill or search bar), keyboard navigation users lose the visual indicator of focus, causing a severe accessibility issue.
**Action:** Apply `focus-within:ring-2 focus-within:ring-[color]` to the parent wrapper (e.g., the `<label>` or `<div>` containing the input and icon) to restore a clear, visible focus state whenever the inner input receives focus.
