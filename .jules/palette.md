## 2024-10-24 - Restore Input Focus Using Containers
**Learning:** For components that compose visual inputs using a wrapper element with inner `outline-none` elements, native browser focus states are lost, creating accessibility issues.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` to the wrapper (e.g. `label` or `div`) of an `outline-none` input to restore keyboard accessibility focus indicators.
