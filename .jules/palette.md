## 2024-09-01 - Focus states on composite inputs
**Learning:** When using `outline-none` on inner `<input>` elements (like in `SearchBox` or chat drafts), the focus state is lost, causing accessibility issues.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` to the parent wrapper (e.g., `label` or `div`) of inputs using `outline-none` to ensure keyboard navigation visibility.
