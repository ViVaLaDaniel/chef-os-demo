
## 2026-06-18 - Wrapper Focus for outline-none Inputs
**Learning:** The application uses `outline-none` on inputs (like search and chat) to style them seamlessly within rounded wrapper elements (`label` or `div`). This strips away default browser focus indicators, causing an accessibility issue for keyboard users who lose track of the active element.
**Action:** Always add `focus-within` styles (e.g., `focus-within:ring-2 focus-within:ring-amber-500`) to the parent wrapper of any `outline-none` input to ensure a visible focus state is maintained for accessibility.
