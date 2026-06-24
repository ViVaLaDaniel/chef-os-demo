## 2023-10-27 - Restore keyboard focus rings on outline-none inputs
**Learning:** Using Tailwind's `outline-none` class on `<input>` elements disables the default browser focus ring, making keyboard navigation and accessibility worse for users relying on keyboard tabbing.
**Action:** When using `outline-none`, restore accessibility by adding `focus-within:ring-2 focus-within:ring-[color]` (e.g. `amber-500`) to the input wrapper, which applies the focus visual to the container when the input inside gets focused.
