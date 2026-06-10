## 2026-06-10 - Focus States for outline-none Inputs
**Learning:** When using `outline-none` on input fields (which removes default browser focus rings), users navigating via keyboard cannot see which element is focused, causing a significant accessibility issue.
**Action:** Always add `focus-within:ring-2 focus-within:ring-[color]` to the immediate parent wrapper of any `outline-none` input to ensure keyboard users have clear visual feedback when interacting with the form field.
