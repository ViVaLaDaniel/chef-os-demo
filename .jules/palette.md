## 2024-05-19 - Restoring keyboard accessibility for custom inputs
**Learning:** When using `outline-none` to remove the default browser focus ring on input elements for stylistic reasons, keyboard navigation accessibility is broken because users cannot see which element has focus.
**Action:** Always restore a visual focus indicator on a parent container using pseudo-classes like `focus-within:ring-2` (and typically matching the app's primary active color) when removing the default outline from a text input, ensuring the app remains keyboard accessible.
