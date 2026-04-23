# Execution playbooks (complement `execute-tasks`)

Use this document when running **`execute-tasks`** in an application repo that vendors **aidlc-workflows** `skills/` (including `skills/playbooks/` and **domain-specific** skills next to them).

## Rules

1. **Pipeline first** — Product scope and task breakdown come from **`write-prd`** and **`create-tasks`**. Do **not** replace them with **`spec-driven-development`** or **`planning-and-task-breakdown`** from agent-skills for the same initiative.
2. **Playbooks and domain skills** — After picking the next backlog task, **classify** it and read the matching **`skills/playbooks/<name>/SKILL.md`** file(s) **and** any matching **`skills/<domain-skill>/SKILL.md`** listed in the table below. Follow **`execute-tasks`** and those docs before coding (they refine *how*; `execute-tasks` owns *what* task and backlog updates).
3. **`review`** — Use **`skills/playbooks/code-review-and-quality/SKILL.md`** as the detailed checklist inside the **`review`** skill (see `skills/review/SKILL.md`).

## Task classification → playbooks

| Kind of work | Signals (examples) | Load these playbooks (in order) |
|--------------|-------------------|-----------------------------------|
| **Feature / new behavior** | New endpoints, UI, business rules; task reads like a user-facing slice | `incremental-implementation`, `test-driven-development` |
| **Bug / failure** | Failing tests, regressions, errors, "fix", "broken" | `debugging-and-error-recovery`; add `test-driven-development` if fixing via tests |
| **Refactor / simplify** | "Clean up", reduce duplication, rename without behavior change | `code-simplification`; optional `incremental-implementation` if large |
| **API or contract** | DTOs, routes, versioning, breaking changes | `api-and-interface-design` (+ `test-driven-development` for contracts) |
| **UI** | Components, layout, a11y, client state | `frontend-ui-engineering` (+ `incremental-implementation` if multi-file); add **`browser-testing-with-devtools`** when verifying in a real browser with Chrome DevTools MCP |
| **Browser / runtime UI verification** | Live DOM, console, network, performance, screenshots; DevTools MCP available | **`browser-testing-with-devtools`** (+ `frontend-ui-engineering` and/or `debugging-and-error-recovery` as needed) |
| **Auth / OAuth / JWT (project-specific)** | Login flow, token handling, protected routes, auth SDK integration | Load your project's domain skill at **`skills/<your-auth>/SKILL.md`** **plus** `incremental-implementation` + `test-driven-development`; add `frontend-ui-engineering` for login/callback UI or `api-and-interface-design` for protected API routes |
| **Any multi-step commit work** | Task touches many files or needs atomic commits | `git-workflow-and-versioning` |

> **Adding domain skills:** Create `skills/<kebab-name>/SKILL.md` for project-specific SDKs, auth providers, or platform patterns. Add a row to the table above so agents load it automatically during `execute-tasks`.

Load **multiple** playbooks and **domain skills** when appropriate (e.g. feature + UI → `incremental-implementation` + `test-driven-development` + `frontend-ui-engineering`; UI verified in Chrome → add **`browser-testing-with-devtools`** when MCP is enabled).

**Domain-specific skills** live at **`skills/<kebab-name>/SKILL.md`** (same level as `skills/playbooks/`, not inside `playbooks/`).

## Relation to `test`

- **`test`** skill — run/harden automation after a batch or before merge.
- **`test-driven-development`** playbook — discipline **while** implementing a task under **`execute-tasks`**.

## Files

- **Playbooks** — `skills/playbooks/<kebab-name>/SKILL.md`. See `skills/playbooks/README.md` for provenance and the list of vendored playbooks.
- **Domain skills** (project-specific recipes) — `skills/<kebab-name>/SKILL.md`. Add your own alongside the pipeline skills.
