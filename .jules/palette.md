## 2024-05-18 - Restoring Focus States for outline-none Inputs
**Learning:** When using `outline-none` on `input` elements to achieve a custom look (like a seamless search bar or chat input), it completely breaks keyboard navigation visibility. Screen reader users can still hear it, but sighted keyboard users have no idea where their focus is.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or appropriate project colors) to the parent wrapper of any `outline-none` input to restore clear, accessible focus states while maintaining the custom design.
