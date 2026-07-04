## 2024-05-15 - Restore focus rings on inputs with outline-none
**Learning:** Found custom `outline-none` usage on inputs without any `focus-visible` or `focus-within` fallbacks, making keyboard navigation hard to track on Chat and Search inputs.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` (using the project's standard amber color) to the parent wrapper when stripping outlines from an input inside a custom container. Also add `transition-shadow` for smoother feedback.
