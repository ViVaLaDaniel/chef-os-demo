## 2025-03-09 - Restoring Focus Rings on `outline-none` Inputs
**Learning:** When using `outline-none` on `<input>` elements to rely on parent containers for visual styling (e.g., search boxes or chat inputs), the keyboard focus ring is completely lost, which is a major accessibility issue for keyboard users.
**Action:** Always add `focus-within:ring-2` (and appropriate colors/offsets) to the parent container when suppressing outline on the child input.
