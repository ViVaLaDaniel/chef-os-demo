## 2024-07-27 - Restoring Keyboard Focus Visibility
**Learning:** When using `outline-none` on inputs (like text fields) to style them seamlessly within a parent container, the default browser focus ring is removed. This harms accessibility for keyboard users who rely on visual indicators.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or the appropriate focus styling and active state color) to the parent container of the input to restore visual focus indication when the input is focused.
