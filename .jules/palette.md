## 2024-05-18 - Restoring Focus States for outline-none Inputs
**Learning:** When using `outline-none` on inputs to remove default browser focus rings (often done when inputs are nested inside styled wrapper elements like labels or divs), the focus state becomes invisible to keyboard users. This is a common accessibility issue in custom UI components.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` (or appropriate primary color/style) to the wrapper element when removing outlines from child inputs, ensuring keyboard navigation remains visible and accessible.
