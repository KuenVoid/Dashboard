Child Agent: fix-Settings.jsx
==============================

Goal
----
Make `src/Settings.jsx` color inputs controlled, remove `window.location.reload(false)`, and update state/localStorage in a user-friendly way.

Primary issues to fix
---------------------
- Color inputs are uncontrolled; they should use the component state (`bgcolor`, `menucolor`, `blockcolor`, `barcolor`) as `value` so the pickers reflect current values.
- `savecolor` and `resetcolor` call `window.location.reload(false)` — replace with an in-app update (e.g., write colors to `localStorage` and optionally set CSS variables or trigger context updates) so the app re-renders without a full reload.
- Validation checks using `== ' '` are fragile — use `trim()` and check empty strings.

Implementation steps
--------------------
1. Make all `<input type="color">` elements controlled by adding `value={bgcolor}` etc.
2. Update `savecolor` to persist to `localStorage` and (optionally) set CSS variables on `document.documentElement.style.setProperty('--bgcolor', bgcolor)`.
3. Remove `window.location.reload(false)`.
4. Create a patch and a result file summarizing changes.

Constraints & safety
--------------------
- Avoid changing the app theme system until a `ThemeContext` exists — prefer minimal changes that preserve current behavior but avoid reloads.

Deliverables
------------
- Patch updating `src/Settings.jsx`.
- `/agents/results/child-settings-<timestamp>.result.md` with changed files and notes.

***
