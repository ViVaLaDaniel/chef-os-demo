## 2024-05-14 - Keyboard Accessibility for Composite Inputs
**Learning:** In composite input components (like SearchBox or Chat input) where the inner `<input>` uses `outline-none` to blend into a styled container (like a `label` or `div`), the element loses its native focus indicator for keyboard users.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or the theme's active color) to the parent wrapper container to ensure the focus state is clearly visible when the inner input is active. Also add explicit `aria-label`s to inputs that lack a visible `<label>` text.
