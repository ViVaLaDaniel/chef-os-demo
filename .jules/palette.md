## 2024-09-20 - Focus Rings on Composite Inputs
**Learning:** When using `outline-none` on an inner `<input>` that relies on an outer wrapper (like a `div` or `label`) for its visual border or background, users lose keyboard focus visibility.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or appropriate project color) to the parent container so the entire visual component shows a focus ring when the inner input is active. Ensure the inner input has an `aria-label` if it lacks an associated visible `<label>`.
