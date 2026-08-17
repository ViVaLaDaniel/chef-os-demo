## 2024-06-25 - Focus rings on composite inputs with outline-none
**Learning:** For composite input components where an inner `<input>` uses `outline-none`, apply `focus-within` classes (e.g., `focus-within:ring-2 focus-within:ring-amber-500`) to the outer wrapper container (like the `div` or `label`) so the focus ring is visible when the inner input is active.
**Action:** When inspecting inputs without visible focus states, check if they are wrapped and have `outline-none`. If so, apply `focus-within` styling to the wrapper.
