## 2023-10-23 - Focus Accessibility for Composite Inputs
**Learning:** When using custom composite input wrappers (like a `<label>` containing an `outline-none` `<input>` and an icon), adding `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper correctly styles the focus ring for keyboard users, and the inner `<input>` must have an explicit `aria-label` since the visual icon doesn't announce its purpose to screen readers.
**Action:** Always pair `focus-within` on custom input wrappers with an explicit `aria-label` on the unstyled inner `<input>`.
