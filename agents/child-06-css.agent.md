Child Agent: css-refactor
==========================

Goal
----
Fix CSS selector mismatches and propose a minimal plan for modularizing CSS to avoid collisions and repetition.

Primary issues to fix
---------------------
- Selector mismatch: `#drawinput` is defined in `src/App.css` but JSX uses `className="drawinput"` — make them consistent (prefer `.drawinput`).
- Identify other obvious selector mismatches or duplicated rules.
- Propose a phased plan to migrate component styles to CSS modules or scoped files.

Implementation steps
--------------------
1. Update `src/App.css` to use `.drawinput` instead of `#drawinput` (small patch).
2. Scan `src/` for other likely clashes and list them in `/agents/results/child-css-<timestamp>.result.md`.
3. Produce a short migration plan with recommended per-component module names (e.g., `Home.module.css`, `Tool.module.css`) and a minimal example.

Constraints & safety
--------------------
- Keep style changes minimal; do not change layout values unless necessary.
- If a file rename or deletion is proposed, create a `/agents/requests/delete-*.req` and wait for Parent/user approval.

Deliverables
------------
- Patch updating `src/App.css`.
- `/agents/results/child-css-<timestamp>.result.md` with findings and migration plan.

***
