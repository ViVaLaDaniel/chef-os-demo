## 2024-03-20 - Focus states on composite input components
**Learning:** When using `outline-none` on an inner `<input>`, the focus ring is lost for keyboard users. For composite components (like a search box with an icon inside a wrapper), it's essential to apply `focus-within` styles to the wrapper to indicate focus. Inputs without a visible text label also must have an `aria-label`.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to outer wrappers of inputs with `outline-none`, and add descriptive `aria-label`s to inputs relying solely on placeholders.
