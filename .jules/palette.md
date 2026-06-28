## 2026-06-28 - Custom Input Wrapper Focus State

**Learning:** When inputs use `outline-none` in a custom container setup (e.g., to create a rounded, styled input area), keyboard navigation and accessibility focus indicators are completely lost. Tailwind's `focus-within:` utility on the parent container is the ideal way to restore this globally while maintaining the custom design.

**Action:** Always verify keyboard focus visibility on custom search bars or chat inputs. If `outline-none` is present, apply `focus-within:ring-2 focus-within:ring-[primary-color] focus-within:ring-offset-2` to the parent wrapper.
