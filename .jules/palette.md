## 2024-08-25 - Focus rings for composite input components
**Learning:** For accessibility, when building composite input components (like a search box with an icon or a chat input with an inline send button) where the inner `<input>` element uses `outline-none`, keyboard users lose their focus indication.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer wrapper container (like the `div` or `label`) so the focus ring is visible when the inner input is active.
