## 2024-05-24 - Restoring Focus States for Custom Inputs
**Learning:** When using `outline-none` on inputs inside stylized containers (like a rounded div or label with a search icon), the native focus ring is lost, making it impossible for keyboard users to identify the active field.
**Action:** Always apply `focus-within:ring-2 focus-within:ring-amber-500` (or the project's primary active color) to the parent container when suppressing the native outline on an input.
