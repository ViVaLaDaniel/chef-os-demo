## 2024-12-14 - Composite Input Accessibility and Focus Rings
**Learning:** Inputs that use `outline-none` within a styled wrapper (composite input) lack visual focus indicators. Additionally, inputs lacking `<label>` and relying only on placeholders are not fully accessible to screen readers.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper element and add explicit `aria-label` attributes to the inner `<input>` elements.
