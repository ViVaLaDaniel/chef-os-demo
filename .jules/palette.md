## 2024-08-11 - Accessibility for Composite Inputs
**Learning:** In composite components (like `SearchBox` or Chat inputs) where an inner `<input>` has `outline-none` and is wrapped in a styled container (`<div>` or `<label>`), the default focus ring is lost, making it invisible to keyboard navigators.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or the primary app color) and `transition-shadow` to the outer wrapper container so the entire composite element shows a clear focus state when the inner input is active.
