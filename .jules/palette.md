## 2024-03-24 - Focus states for outline-none inputs
**Learning:** When using `outline-none` on an `<input>` and relying on a parent container for styling, the input's focus state becomes invisible. Users rely on visual focus rings to navigate by keyboard. Also, icon-only or placeholder-only inputs must still have an explicit `aria-label` for screen readers.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper container (like `div` or `label`) so the focus ring is visible when the inner input is active. Ensure inner `<input>` has an explicit `aria-label`.
