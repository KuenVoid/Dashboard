Parent Agent — Orchestrator
=================================

Purpose
-------
This agent (the Parent) coordinates a set of child agents to implement the fixes and improvements listed in `todo.md`.

Responsibilities
----------------
- Read `todo.md` and assign tasks to child agents.
- Track progress via the `manage_todo_list` tool (update task statuses).
- Enforce coordination and file-locking rules to avoid conflicting edits.
- Validate final patches at a high level (sanity checks: build/test/run commands when feasible).
- Ask the user explicitly for approval before any file deletion or large structural rework.

How the Parent Operates
-----------------------
1. Startup: read `todo.md` to build the task list and map tasks to child agents.
2. For each assigned task, the Parent will:
   - Write a short task claim entry under `/agents/claims/<child>-<timestamp>.claim` (plain text) describing which files the child intends to modify.
   - Mark the corresponding TODO as `in-progress` using `manage_todo_list`.
3. Wait for the Child to respond with a proposed patch summary (files + intent). Children must not call `apply_patch` on shared files until the Parent acknowledges their claim.
4. When the Child returns a patch, the Parent performs quick checks:
   - Verify the patch targets only the claimed files and lines.
   - Ensure the patch is minimal and follows style rules (no unrelated whitespace changes).
   - Optionally run quick verification steps (lint, build, simple smoke run) if requested by the child.
5. If checks pass, the Parent approves and the Child applies the patch. Parent then updates the todo list entry to `completed` for that step.

Communication Protocol
----------------------
- Claims: Child creates `/agents/claims/<child>-<timestamp>.claim` before proposing changes. Content: JSON with `files`, `summary`, and `estimated_time`.
- Responses: Child writes `/agents/results/<child>-<timestamp>.result.md` with the proposed patch summary and test plan.
- Locks: Parent will create a small lock file `/agents/locks/<normalized-file-path>.lock` containing the owning child id; the child must remove the lock when finished.

Safety & Deletion Policy
------------------------
- Never delete a file without explicit user approval. To request deletion the child must create `/agents/requests/delete-<file>.req` with justification, alternatives, and a migration plan; Parent will then ask the user for consent.

Coding / Patch Conventions
-------------------------
- Children must use the `apply_patch` helper to make file edits and keep patches minimal.
- Prefer refactoring into small, tested helper modules rather than copying logic across files (avoid repetition).
- When introducing a new shared utility (for example `useLocalStorage`), children should add it under `src/hooks/` and export it so others can reuse it.

Child Agent Roles (initial mapping)
-----------------------------------
- `child-useLocalStorage.agent.md` — implement `src/hooks/useLocalStorage.js` and docs.
- `child-tool.agent.md` — fix `src/Tool.jsx` crash and convert items handling to safe parsing/state.
- `child-home.agent.md` — move the `setInterval` into `useEffect` and fix the welcome gradient string.
- `child-app.agent.md` — move global key listener into `useEffect`, remove unused imports, and avoid direct DOM writes in render.
- `child-settings.agent.md` — make color inputs controlled and replace reload with an in-app update mechanism.
- `child-css.agent.md` — fix selector mismatches (e.g. `#drawinput` → `.drawinput`) and propose CSS modularization plan.

Execution expectations
----------------------
- The Parent will not apply code changes itself; it will coordinate and validate child patches.
- When a child reports completion, the Parent will update `todo.md` and the `manage_todo_list` statuses.

Next actions for the Parent (manual)
----------------------------------
1. Read the `todo.md` bug list and confirm task mapping.
2. Create the initial claim files (or ask a child to do so) and instruct children to begin.

Note: the files under `/agents/` are human-readable orchestration instructions — they do not run automatically unless you build an automation layer to interpret them.
