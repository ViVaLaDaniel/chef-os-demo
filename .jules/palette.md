## 2023-10-25 - Focus-within for Outline-none Containers
**Learning:** In composite inputs where an inner `<input>` uses `outline-none` and relies on an outer wrapper (`div` or `label`) for its background and borders, keyboard users lose focus visibility. Standard `focus-visible` on the input doesn't work well due to the wrapper.
**Action:** Apply `focus-within:ring-2 focus-within:ring-amber-500` to the outer container. Ensure inner inputs without visually associated labels have explicit `aria-label` attributes.
