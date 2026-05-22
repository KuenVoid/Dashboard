Child Agent: fix-Home.jsx
==========================

Goal
----
Fix `src/Home.jsx` issues: move timers into `useEffect`, prevent leaks, fix malformed gradient, and normalize `localStorage` reads.

Primary issues to fix
---------------------
- `setInterval(...)` is called during render — move into `useEffect` with cleanup.
- `useEffect` is imported but unused — use it for the timer and any side-effects.
- `newwelcomeblock` fallback is missing a closing `)` — fix the string.
- Avoid concatenating `localStorage` values directly; normalize missing values to empty strings.

Implementation steps
--------------------
1. Replace ad-hoc `setInterval` usage with a `useEffect` that sets an interval and clears it on unmount.
2. Use `useLocalStorage` (if present) or safe read helpers: `const safeGet = k => localStorage.getItem(k) || ''`.
3. Fix `newwelcomeblock` fallback to include the closing parenthesis.
4. Optional: replace multiple `var` reads with grouped state or a small helper to reduce repetition.
5. Create a patch via `apply_patch` and summarize changes under `/agents/results/child-home-<timestamp>.result.md`.

Constraints & safety
--------------------
- Don't change unrelated UI layout in this patch; focus on removing leaks and fixing invalid strings.

Deliverables
------------
- Patch updating `src/Home.jsx`.
- Result file describing what changed and suggested follow-ups.

***
