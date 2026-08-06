## 2026-06-04 - Large component architecture issue
**Learning:** Monolithic files like `src/main.jsx` (~1800 lines) slow down feature additions and lead to state fatigue.
**Action:** When adding big UI elements next time, modularize early and push for splitting components into separate files instead of maintaining the monolith.
## 2026-06-04 - The `read_file` truncation issue
**Learning:** The `read_file` tool can truncate large files (like the ~1800-line `src/main.jsx`), leading to hallucinated code structure in execution plans.
**Action:** When working with large monolithic files, always use `run_in_bash_session` with `grep -n -C 5` to confirm the exact location and variable names of code segments before proposing edits or execution plans.
