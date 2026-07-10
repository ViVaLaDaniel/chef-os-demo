## 2024-07-10 - Outline-None Input Focus States
**Learning:** When using `outline-none` on an `<input>` element inside a stylized wrapper container (like a rounded `div` or `label`), keyboard users lose the visual focus indicator.
**Action:** Always add `focus-within:ring-2 focus-within:ring-amber-500` (or appropriate primary color) to the parent wrapper container to restore the accessibility focus cue.
