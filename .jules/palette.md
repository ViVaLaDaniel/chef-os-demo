## 2025-03-09 - Accessible Focus Rings on Composite Inputs
**Learning:** When using composite inputs (e.g., an icon and an input inside a shared background container) where the inner `<input>` element uses `outline-none`, keyboard users lose their focus indication.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper (like the `div` or `label`) so the focus ring is visually clear when the inner input is active. Also always remember to add an `aria-label` to the inner input for screen readers.
