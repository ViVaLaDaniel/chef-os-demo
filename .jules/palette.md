## 2025-02-28 - Composite Input Accessibility
**Learning:** In compound input structures where outer wrappers (like `div` or `label`) style the input border and inner `<input>` tags use `outline-none`, keyboard focus states become invisible.
**Action:** Always apply Tailwind's `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper element to restore visible focus rings for keyboard users, and add explicit `aria-label`s to the raw `<input>` elements (especially if they lack visually associated `<label>` text or rely only on placeholders).
