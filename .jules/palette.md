## 2024-10-02 - SearchBox & Chat Input Accessibility
**Learning:** Found inputs in `src/main.jsx` lacking `aria-label` and `focus-within` visual cues, and no labels for chat input or search input despite using `outline-none` inside a container.
**Action:** Add `aria-label` to these inputs and `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper label/div container.
