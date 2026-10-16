## 2024-05-18 - Focus Rings and ARIA Labels on Composite Inputs
**Learning:** For composite input components where the inner `<input>` uses `outline-none` and relies solely on placeholders for visual context, the element lacks an explicit accessible name and the keyboard focus indicator is invisible.
**Action:** When an inner `<input>` uses `outline-none`, apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper container (like `div` or `label`) to ensure a visible focus state, and add an explicit `aria-label` to the inner `<input>` so screen readers can interpret it.
