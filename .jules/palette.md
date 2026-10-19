## 2023-10-27 - Focus States for Composite Inputs
**Learning:** When using `outline-none` on inner `<input>` elements within composite components (like a search box with an icon), the focus state is lost.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` (or appropriate primary color) to the outer wrapper container (`div` or `label`) so the focus ring is visible when the inner input is active. Also, ensure the inner `<input>` has an explicit `aria-label` if it relies solely on `placeholder` text or lacks a visually associated `<label>`.
