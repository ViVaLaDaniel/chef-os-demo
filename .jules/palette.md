## 2024-07-20 - Focus styles on inputs with outline-none
**Learning:** When inputs are stripped of their default focus rings using `outline-none` and placed inside custom wrappers, keyboard users lose vital visual feedback. Using `focus-within:ring-2 focus-within:ring-amber-500` on the wrapper element restores the focus state properly while keeping the custom UI design.
**Action:** Always verify that input wrappers have `focus-within` styles if the input itself uses `outline-none`. Apply this especially for complex components like search bars or message boxes with inline buttons.
