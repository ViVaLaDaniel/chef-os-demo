
## 2024-05-24 - Apply focus-within to composite input wrappers
**Learning:** For composite input components where an inner `<input>` uses `outline-none`, the keyboard focus state can become invisible to users, severely impacting accessibility.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-[primary-color]` classes to the outer wrapper container (e.g., the `div` or `label`) so the focus ring is visible when the inner input is active. Ensure the inner input retains a clear `aria-label`.
