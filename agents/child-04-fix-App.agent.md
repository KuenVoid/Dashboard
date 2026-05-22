Child Agent: fix-App.jsx
=========================

Goal
----
Fix `src/App.jsx` problems: remove render-time DOM writes, move global keydown listener into `useEffect` with cleanup, and remove unused imports.

Primary issues to fix
---------------------
- `document.addEventListener('keydown', ...)` is registered on every render — move this into `useEffect` and remove on unmount.
- Avoid direct DOM writes during render (`document.getElementsByClassName('blocks')` style assignments). Use React state/props to set styles or perform those writes inside `useEffect` as needed.
- Remove the unused `invoke` import.
- Avoid preventing normal browser behavior unintentionally; ensure `Tab` handling is deliberate.

Implementation steps
--------------------
1. Wrap keydown handler registration in a `useEffect` with proper cleanup.
2. Move block color assignment into an effect that runs when `blockcolour` changes; prefer applying a CSS class or pass `blockcolour` to child components via props/context instead of direct DOM writes.
3. Remove `invoke` import if unused.
4. Create a patch with `apply_patch` and produce a result file.

Constraints & safety
--------------------
- Do not modify pages' layout significantly. Aim for behavioral fixes and safer lifecycle handling.

Deliverables
------------
- Patch for `src/App.jsx`.
- `/agents/results/child-app-<timestamp>.result.md` with summary.

***
