## 2024-08-01 - Focus Visible Styles for Inputs without Outline
**Learning:** When using `outline-none` to suppress default browser focus outlines on `<input>` fields, the keyboard focus indicator is lost. Applying `focus-within:ring-2 focus-within:ring-amber-500` to a parent wrapper restores a highly visible, on-brand focus state when navigating via keyboard or clicking.
**Action:** Always check the parent element or wrapper and apply `focus-within` styles whenever an inner input requires `outline-none`.
