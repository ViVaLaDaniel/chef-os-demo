## 2024-05-15 - Restore Focus Indicators
**Learning:** Using `outline-none` on form inputs without providing an alternative focus state removes visual feedback for keyboard users, making navigation inaccessible.
**Action:** When removing default browser outlines with `outline-none`, always restore focus visibility on the wrapping element using `focus-within:ring-2 focus-within:ring-amber-500` (or the app's primary active state color) to maintain accessibility.
