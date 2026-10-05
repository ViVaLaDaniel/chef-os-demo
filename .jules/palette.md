
## 2024-05-14 - Accessible Composite Inputs
**Learning:** For composite input components where the inner `<input>` element uses `outline-none` (hiding the default focus ring), keyboard navigation becomes invisible. Also, inputs without visible labels relying solely on placeholders lack context for screen reader users.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper container (`div` or `label`) so the focus state is clearly visible when interacting with the inner input. Additionally, ensure the `<input>` element has an explicit `aria-label` when no visual label is present.
