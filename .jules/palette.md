## 2024-05-24 - Focus States and ARIA labels for Composite Inputs
**Learning:** When using composite inputs (e.g., an icon alongside an `<input>` inside a wrapper `div` or `label`) where the inner `<input>` has `outline-none`, the keyboard focus state is lost, making it inaccessible for keyboard users.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper container so the focus ring is visible when the inner input is active. Ensure the inner `<input>` has an explicit `aria-label` if it lacks a visually associated `<label>`.
