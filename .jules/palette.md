## 2024-07-08 - Accessible Focus States for Custom Inputs
**Learning:** In Tailwind, when `outline-none` is applied to an `<input>` element within a custom wrapper (e.g., to create a pill-shaped search box), keyboard users lose focus visibility. Standard `focus:ring` on the input won't style the wrapper.
**Action:** Use `focus-within:ring-2 focus-within:ring-amber-500` (or the primary brand color) on the parent wrapper element to restore clear focus indicators for the entire composite input component. Also ensure all inputs have an `aria-label` or `<label>` for screen readers.
