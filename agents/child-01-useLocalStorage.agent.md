Child Agent: useLocalStorage
=============================

Goal
----
Implement a robust React hook `useLocalStorage(key, defaultValue)` in `src/hooks/useLocalStorage.js` and supply a minimal usage example.

Acceptance criteria
-------------------
- File created at `src/hooks/useLocalStorage.js` exporting a default hook function.
- Hook API: `const [value, setValue] = useLocalStorage(key, defaultValue)`.
- Handles JSON-serializable values; stores as JSON string.
- Uses lazy initialization to read from `localStorage` once.
- Synchronizes to `localStorage` on changes and listens to `storage` events to stay in sync across tabs.
- Includes basic input validation and try/catch around `JSON.parse`.
- Produces a small note explaining how other child agents should import and use it.

Conventions & safety
--------------------
- Create the file using `apply_patch` or `create_file` and update `todo.md` via `manage_todo_list` when complete.
- Do not edit unrelated files without approval from Parent.
- If file deletion or major structural change is needed, write `/agents/requests/delete-<file>.req` with justification and ask Parent to request user approval.

Deliverables
------------
- `src/hooks/useLocalStorage.js` (patch)
- Short result file `/agents/results/child-useLocalStorage-<timestamp>.result.md` describing the patch and a usage example.

***
