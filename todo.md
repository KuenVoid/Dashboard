# DashBoard — Code Review TODOs

Date: 2026-05-19

Summary
-------
This document summarizes a lightweight code review of the workspace front-end (files under `src/`). It lists findings, places where logic is hardcoded, whether logic can be refined, whether code can be split into smaller files, and an actionable refactor plan to improve structure and logic while keeping the current UI.

Files reviewed
--------------
- src/App.jsx
- src/Home.jsx
- src/Settings.jsx
- src/Tool.jsx
- src/main.jsx
- src/App.css
- src/styles.css
- src/data.json
- src-tauri/* (config + main.rs)

Per-file findings, hardcodings and "logic required"
--------------------------------------------------

### src/App.jsx
- Findings:
  - Component mixes presentation (markup/CSS) with imperative DOM side-effects.
  - Direct DOM access: `document.getElementsByClassName('blocks')` and manual style writes.
  - Global event listener: `document.addEventListener('keydown', ...)` attached during render with no cleanup.
  - Unused import: `invoke` from `@tauri-apps/api/tauri` is imported but not used.
  - State uses string values for visibility/positions (e.g. `'-20vw'`, `'block'`, `'none'`) rather than boolean flags / classes.
- Can be split:
  - `components/Menu.jsx` — markup for the side menu and menu buttons.
  - `components/MenuButton.jsx` — the hamburger/menu icon and its behaviour (presentation-only component if logic moved out).
  - `components/PageContainer.jsx` — wrapper for the pages that receives layout props from a parent controller.
- Hardcodings / logic required:
  - Hardcoded defaults for colors and offsets (e.g. `'rgb(230, 230, 230)'`, `'-20vw'`).
    - logic required: centralize defaults in a small `constants` or `theme` module and provide a `ThemeContext`.
  - Manual DOM style writes (blocking improvements to React model).
    - logic required: replace with className toggles / CSS variables and control via state or context.
  - Global keyboard listener added during render.
    - logic required: attach listeners in `useEffect` with cleanup and avoid re-adding on each render.

### src/Home.jsx
- Findings:
  - Reads many values directly from `localStorage` during render and concatenates them (risking `null` values appearing in UI).
  - Calls `setInterval` at top-level (not inside `useEffect`) — will create multiple intervals and leak timers.
  - Uses many small UI toggles stored as display strings and animation strings — brittle and repetitive.
  - Progress bars, todos and goals are implemented inline and repeated for four items.
- Can be split:
  - `components/Home/Welcome.jsx` — header, date/time display.
  - `components/Home/Goals.jsx` — goals display and editor.
  - `components/Home/TodoList.jsx` — to-do list and editor.
  - `components/Home/ProgressBars.jsx` — activity monitor / progress bars.
- Hardcodings / logic required:
  - LocalStorage keys used directly (`todo1..todo4`, `dl1..dl4`, `goal1..goal4`, `progress1..progress4`, `percentage1..4`, `blockcolor`, etc.).
    - logic required: centralize keys and access via a `useLocalStorage` hook that supplies defaults and parsing.
  - `setInterval` called at render-time.
    - logic required: move the clock/timer into a `useEffect` with cleanup; consider `useClock` custom hook.
  - Animation strings used inline (e.g. `'editopen 400ms linear'`).
    - logic required: toggle CSS classes rather than writing animation strings inline.

### src/Settings.jsx
- Findings:
  - Reads color defaults from `localStorage` and initialises `useState` directly (common pattern but could be centralized).
  - Uses `window.location.reload(false)` to apply changes — heavy-handed and breaks single-page UX.
- Can be split:
  - `components/Settings/ColorPicker.jsx` — color inputs & preview.
  - `components/Settings/UserSettings.jsx` — username and other fields.
- Hardcodings / logic required:
  - Default color strings are hardcoded in the component.
    - logic required: extract defaults to `constants/theme.js` and drive styles via `ThemeContext`. Avoid reload; instead update the context so UI re-renders.

### src/Tool.jsx
- Findings:
  - Unsafe parsing: `localStorage.getItem('items').split(',')` without null-check will throw when `items` is not set.
  - Multiple uncontrolled inputs writing directly to `localStorage` by `id` (no local state, no validation).
  - Minor style: `var [result, setresult] = useState();` — prefer `const`.
- Can be split:
  - `components/Tools/LuckyDraw.jsx` — spin UI and items editor.
  - `components/Tools/Log.jsx` — items log area.
  - `components/Tools/ActivityMonitor.jsx` — progress inputs.
- Hardcodings / logic required:
  - `items` stored as comma-separated string.
    - logic required: store `items` as JSON array, provide safe parse/serialize in `useLocalStorage`.
  - Hardcoded element ids (`log1..log4`, `progress1..4`) used as persistence keys.
    - logic required: centralize keys and use controlled inputs.

### CSS: src/App.css & src/styles.css
- Findings:
  - Two global CSS files combine global app styles and component styles; this invites selector collisions.
  - Many fixed `vw`/`vh` values and layout styles are inline in CSS.
- Can be split:
  - Convert to per-component CSS files (CSS Modules) or scoped styles (styled-components) e.g. `Home.module.css`, `Menu.module.css`.
- Hardcodings / logic required:
  - Design tokens (colors, spacing, radii) are repeated.
    - logic required: extract CSS variables (`:root`) for tokens; drive theme colors from `ThemeContext` into CSS variables.

### src/main.jsx
- Findings: small, standard React entry — OK.

### src/data.json
- Findings: empty file. Either populate, remove, or use for static seeds.

Global hardcoding summary
------------------------
- Repeated localStorage keys: `username`, `bgcolor`, `menucolor`, `blockcolor`, `barcolor`, `todo1..4`, `dl1..4`, `goal1..4`, `items`, `progress1..4`, `percentage1..4`.
  - logic required: centralize keys/constants + provide `useLocalStorage(key, default)` so defaults and validation are applied consistently.
- Inline color/default strings (`rgb(230, 230, 230)`, gradients, etc.).
  - logic required: move to theme constants and CSS variables.
- Inline layout strings (`'-20vw'`, `'22vw'`) used to represent menu positions.
  - logic required: use boolean state + CSS transitions or computed styles derived from numeric values.

Recommended refactor plan (actionable)
------------------------------------
1. Add utilities and hooks
   - `src/hooks/useLocalStorage.js` — safe get/set wrapper that handles JSON, defaults, and optional change events.
   - `src/hooks/useClock.js` — encapsulate clock logic and cleanup.
2. Add context for app-wide state
   - `src/context/ThemeContext.jsx` — holds and provides background/menu/block/bar colors and setters.
   - `src/context/UIContext.jsx` (optional) — manage open page (home/tools/settings), menu open/close.
3. Component extraction
   - Move large chunks into small presentational components under `src/components/` (see per-file split suggestions above).
4. Remove direct DOM side-effects from render
   - Move `document.addEventListener`, `setInterval`, direct DOM writes into `useEffect` inside appropriate controller components/hooks, with cleanup functions.
5. Replace uncontrolled / id-based persistence
   - Convert inputs to controlled components; persist changes via `useLocalStorage` or context, not by referencing DOM `id`.
6. Improve persistence format
   - Store complex lists (like `items`) as JSON arrays instead of CSV strings.
7. Styling
   - Extract CSS variables and move to per-component styles (CSS Modules or styled-components).
8. QA and safety
   - Add validation for values read from storage and guarded parsing.
   - Add ESLint + Prettier and a couple unit tests for critical utilities (`useLocalStorage`, `spin` logic).

Prioritized short TODOs
----------------------
- [ ] Implement `useLocalStorage` and migrate direct `localStorage` calls.
- [ ] Fix timers and listeners: wrap `setInterval` and `document.addEventListener` in `useEffect` with cleanup.
- [ ] Replace `window.location.reload(false)` in `Settings.jsx` with context updates.
- [ ] Parse `items` safely and store as JSON array.
- [ ] Extract `Menu`, `Home` subcomponents, and `Tools` subcomponents.
- [ ] Extract design tokens to CSS variables and move component CSS into modules.

Estimated effort (rough)
- Small cleanup (hooks + timers + safety checks): ~1 day.
- Component extraction + theme/context + tests: ~2–4 days.
- Optional TypeScript migration: extra 2–4 days depending on scope.

Conclusion — How to refine structure & logic
-------------------------------------------
Split presentation and logic: keep all markup/CSS in presentational components and move all imperative logic (storage, timers, global handlers, algorithms) into hooks and context providers. Centralize persistence keys and defaults in a constants/theme module. Replace direct DOM writes and global listeners with React lifecycle (`useEffect`) and state-driven class toggles. This keeps the interface unchanged while making the codebase safer, testable, and easier to maintain.

If you want, I can start by implementing `useLocalStorage` and migrating one component (suggest `Tool.jsx` or `Home.jsx`) as a proof-of-concept. Tell me which to start with.

Bugs found (detailed)
---------------------
Below are concrete bugs, crash risks, and logic flaws found during a quick scan (2026-05-19). I prioritized items that will stop the app or cause memory leaks.

- **src/Tool.jsx** — CRITICAL (stops app)
  - `ReferenceError`: the code uses `itemsData` but the variable doesn't exist:
    `var itemarray = itemsData ? itemsData.split(",") : [];` — this throws during render and prevents the app from mounting. Replace `itemsData` with the actual `items` variable and add safe parsing.
  - `if(!itemarray) { itemarray == ''; }` uses `==` instead of assignment; this has no effect.
  - `items` is read from `localStorage` into a plain variable (not state) and `itemarray` is not recalculated when `items` changes — UI won't update after setting items.
  - `drawinput` CSS/id mismatch: CSS defines `#drawinput` while JSX uses `className="drawinput"`.
  - Uncontrolled inputs and missing persistence for log inputs (`log1..log4` have no onChange).

- **src/Home.jsx** — HIGH (leaks / broken UI)
  - `setInterval` is called during render (top-level) without `useEffect` and without cleanup: this will create multiple intervals and leak timers.
  - `useEffect` is imported but unused — likely the interval was intended to be placed in a `useEffect`.
  - `newwelcomeblock` else branch builds `linear-gradient(...` but is missing a closing `)` — the background value will be invalid.
  - Many direct `localStorage.getItem(...)` calls are concatenated without normalization; UI can show `null` or `"null -null"` if keys are missing. Use a safe read helper or defaults.
  - `Welcome {user}` can render `null` when `username` unset — default to empty string.

- **src/App.jsx** — HIGH (logic / event leaks)
  - `document.addEventListener('keydown', ...)` is attached on every render with no cleanup — leads to duplicate handlers and inconsistent behavior. Move to `useEffect` with cleanup.
  - Direct DOM writes in render: `document.getElementsByClassName('blocks')` and immediate style assignment should be done inside effects or via React `style`/className.
  - Unused import: `invoke` from `@tauri-apps/api/tauri`.
  - Intercepting `Tab` key prevents normal focus navigation; consider another shortcut or call `e.preventDefault()` intentionally.

- **src/Settings.jsx** — MEDIUM (UX / correctness)
  - Color inputs are uncontrolled (no `value` prop) so the color pickers don't reflect current `useState` values.
  - `savecolor` and `resetcolor` call `window.location.reload(false)` — heavy-handed; update app state/context instead.
  - Validation checks use `== ' '` (single-space) — trim and check empty strings instead.

- **src/App.css / src/styles.css** — MEDIUM (styling / selector bugs)
  - Selector mismatch: `#drawinput` (id) vs `.drawinput` (class) — styles won't apply.
  - Global CSS mixing with component CSS increases risk of collisions; would benefit from scoping (modules).

- **src/main.jsx** — LOW
  - Trailing comma in `render(...)` call is syntactically allowed but unusual; no crash.

- **src/data.json** — LOW
  - Empty file — either remove or populate if intended.

Fix priorities:
- CRITICAL: `src/Tool.jsx` (itemsData → items) — fixes app crash.
- HIGH: move intervals & event listeners to `useEffect`, fix gradient string, avoid global DOM writes.
- MEDIUM: make color inputs controlled, avoid full-page reloads, normalize storage reads.

If you'd like, I can:
- Implement a safe `useLocalStorage` hook and migrate `src/Tool.jsx` (fixing the `itemsData` bug) as a first PR.
- Or start by moving the `setInterval` in `src/Home.jsx` into a `useEffect` with cleanup.

Progress: I scanned the main `src/` files and appended this bug list to `todo.md`. Next I can implement fixes — which file do you want me to start with?
