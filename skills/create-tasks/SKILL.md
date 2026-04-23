---
name: create-tasks
description: Turns an approved PRD into an ordered, implementable backlog with acceptance criteria. Use after write-prd is accepted, before execute-tasks.
---

# Create Tasks

## Overview

Derive small, verifiable tasks from the PRD. Each task should be completable in a focused session, with clear acceptance criteria and dependency order.

## When to Use

- A PRD (or equivalent) exists and is approved
- Work spans multiple files or sessions
- You need a shared backlog for implementation and review

**When not to use:** The PRD is missing or still draft — finish `write-prd` first.

## Process

1. **Project context** — Apply `skills/_reference/project-context.md` in the target repo. If `validation.require_domain_context` is true and domain files are missing or empty, stop and report (unless the human explicitly overrides for this session).
2. **Read-only pass** — Read the approved PRD at the resolved `prd_file` (default `<prds_dir>/prd-document.md`, e.g. `docs/login-and-welcome-ui/prd-document.md`) or the agreed PRD path, and the relevant parts of the codebase. Read `domain.tech_stack_file` / `domain.architecture_file` when present. Do not implement yet.
3. **Dependency graph** — Note what must exist before what (schema → API → UI, etc.).
4. **Vertical slices** — Prefer end-to-end thin slices over “all DB, then all API, then all UI.”
5. **Write tasks** — For each task include:
   - **ID** (e.g. T1, T2) and short title
   - **Description** — what to build
   - **Acceptance criteria** — testable bullets
   - **Depends on** — task IDs or “none”
6. **Save artifacts** — Write to the resolved paths (defaults keep backlog/todo under `docs/<prd-slug>/tasks/` next to `prd-document.md`):
   - `<backlog_file>` — full backlog with criteria and ordering (default `<prds_dir>/tasks/backlog.md`)
   - `<todo_file>` — checklist of task IDs in execution order (one line per task, optional notes) (default `<prds_dir>/tasks/todo.md`)
7. **Gate** — Present the backlog for human review; adjust before execution.

## Task shape (per item)

```markdown
### Tn — <Title>
**Depends on:** Tx | none
**Description:** ...
**Acceptance criteria:**
- [ ] ...
**Verification:** commands or manual steps (e.g. `npm test`, smoke test path)
```

## Verification

- [ ] Every PRD must-have maps to at least one task (or is explicitly deferred with reason).
- [ ] Tasks are ordered with dependencies respected.
- [ ] No task is “implement everything” — split until each slice is testable.

## Red flags

- Tasks that are only “do the backend” / “do the frontend” with no slice.
- Missing acceptance criteria — execution will drift.
- Starting implementation inside this skill — planning only here.
