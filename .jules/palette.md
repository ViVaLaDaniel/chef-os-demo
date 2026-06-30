## 2024-06-30 - Focus Rings on Outline-None Inputs
**Learning:** When using `outline-none` on an `<input>` field, it removes the default focus styles which is bad for keyboard accessibility.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` (or the primary active state color) to the input's parent wrapper element to restore clear focus indicators for keyboard users.
