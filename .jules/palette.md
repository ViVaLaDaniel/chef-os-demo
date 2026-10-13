## 2024-05-18 - Added focus-within to composite inputs
**Learning:** For composite inputs (like search boxes or chat inputs) where an inner `<input>` uses `outline-none`, apply `focus-within` classes to the outer wrapper container so the focus ring is visible when the inner input is active.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper div/label and ensure the inner `<input>` has an explicit `aria-label` if it relies solely on `placeholder` text or lacks a visually associated `<label>`.
