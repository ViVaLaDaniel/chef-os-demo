## 2024-05-24 - Focus Rings on Composite Inputs
**Learning:** When creating composite input components where an inner `<input>` uses `outline-none` to hide its default browser focus ring, the component becomes inaccessible for keyboard users because there is no visual indicator of focus.
**Action:** Apply `focus-within` classes (e.g., `focus-within:ring-2 focus-within:ring-amber-500`) to the outer wrapper container (like the `div` or `label`) so the custom focus ring is visible whenever the inner input is active.
