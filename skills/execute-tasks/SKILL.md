---
name: execute-tasks
description: Implements backlog items one at a time with tests and small commits, optionally guided by execution playbooks under skills/playbooks/. Use when the backlog and todo files exist (default under docs/<prd-slug>/tasks/ per project-context, or paths from .aidlc/project.yaml) and you are ready to ship code for the next item.
---

# Execute Tasks

## Overview

Take the next task from the agreed backlog, implement it with tests, run the suite, and commit. Repeat until the slice for this session is done or blocked. Use **`skills/_reference/execution-playbooks.md`** and **`skills/playbooks/*`** to choose *how* to implement (TDD, slicing, debugging, UI, browser DevTools verification, API design)—without replacing **`write-prd`** or **`create-tasks`**.

## When to Use

- Resolved `<backlog_file>` / `<todo_file>` exist (defaults: `<prds_dir>/tasks/backlog.md` and `<prds_dir>/tasks/todo.md` per `skills/_reference/project-context.md`) and PRD is approved
- You are implementing (not replanning the whole initiative)

**When not to use:** No task breakdown yet — run `create-tasks` first.

## Process

1. **Project context** — Apply `skills/_reference/project-context.md` in the target repo. If `validation.require_domain_context` is true and domain files are missing or empty, stop and report (unless the human explicitly overrides for this session).
2. **Pick the next task** — Use dependency order from the resolved `<backlog_file>` / `<todo_file>`; mark “in progress” in `<todo_file>` if you track status there.
3. **Load context** — PRD acceptance, task acceptance criteria, existing patterns in the repo, and `domain.tech_stack_file` / `domain.architecture_file` when present. If `.aidlc/project.yaml` sets `bootstrap.shape` to `backend`, `frontend`, or `monorepo` (greenfield scaffold), **copy `templates/`** from this workflows repo first (`templates/README.md`), then follow the matching playbook under `skills/_reference/` for any remaining gaps (`bootstrap-backend.md`, `greenfield-frontend.md`, `greenfield-monorepo-turborepo-bun.md`). If `bootstrap.shape` is **`brownfield`** or **`unset`**, do **not** copy greenfield **`templates/`** as a default—work within the existing codebase and domain docs unless the task explicitly asks for a new scaffold.
4. **Classify task & load execution playbooks** — Apply `skills/_reference/execution-playbooks.md`: infer task kind (feature, bug, refactor, API, UI, auth, etc.) from the task text, acceptance criteria, and user message. Read each matching `skills/playbooks/<name>/SKILL.md` **and** any matching **domain-specific** skill path listed there (e.g. `skills/<your-domain>/SKILL.md` for project-specific SDKs or auth patterns) **before** writing production code. **Do not** use `spec-driven-development` or `planning-and-task-breakdown` playbooks here when this initiative already used `write-prd` and `create-tasks`—those AIDLC skills own spec and task breakdown.
5. **Test-first when practical** — Align with `skills/playbooks/test-driven-development/SKILL.md` when loaded: add or adjust tests that describe the behavior (RED → GREEN → refactor).
6. **Implement the minimum** to satisfy the task’s acceptance criteria — follow `incremental-implementation` / `frontend-ui-engineering` / `api-and-interface-design` when loaded; no scope creep into other tasks.
7. **Verify** — Project test command (e.g. `npm test`), lint/build if applicable, quick manual check where needed.
8. **Commit** — Follow `skills/playbooks/git-workflow-and-versioning/SKILL.md` when loaded; otherwise one commit per completed task (or one logical commit per task if the team prefers), message references task ID and PRD/initiative.
9. **Update backlog** — Mark task complete in `<todo_file>` / `<backlog_file>`; **tick each `- [ ]` acceptance criterion that has been met (`- [x]`), and leave any unmet criterion unchecked with the reason recorded in the task's Status note** (cite the gap, the cause, and the follow-up owner). Note blockers with owner + next step.

If something fails, use `skills/playbooks/debugging-and-error-recovery/SKILL.md` when the work is diagnosis-heavy; then re-run the suite for regressions.

## Verification

- Task acceptance criteria are all satisfied or explicitly deferred with human approval.
- Tests and build pass for the touched areas.
- Backlog reflects completed work.

## Red flags

- Implementing multiple unrelated tasks in one undifferentiated commit.
- Skipping tests because “it’s small” — smallest tasks are where regressions hide.
- Changing the PRD under pressure — negotiate scope, then update PRD/tasks if needed.
- Starting a parallel “spec” or “planning” workflow when the PRD and `create-tasks` backlog already define scope.
