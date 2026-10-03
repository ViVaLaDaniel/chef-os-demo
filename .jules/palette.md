## 2023-10-25 - Focus visibility on composite inputs
**Learning:** When inputs lack borders (like using `outline-none`) and rely on wrapper elements to appear like input fields, users navigating with keyboards lose focus context.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or appropriate primary color classes) to the wrapper element of a composite input so the focus state encompasses the whole visible "field". Additionally, ensure the inner input has an `aria-label` even if visually there is placeholder text.
