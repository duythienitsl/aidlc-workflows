# Execution playbooks

These directories are **vendored** from the **agent-skills** pack (same machine often: `ai-initiative/agent-skills/skills/`). They **complement** the AIDLC pipeline skill **`execute-tasks`**: use them for *how* to implement a backlog item, not as a substitute for **`write-prd`** or **`create-tasks`**.

## Included playbooks

| Playbook | Role |
|----------|------|
| `incremental-implementation/` | Thin vertical slices, commit cadence |
| `test-driven-development/` | Red–green–refactor discipline |
| `debugging-and-error-recovery/` | Systematic failure diagnosis |
| `code-simplification/` | Refactors and complexity reduction |
| `api-and-interface-design/` | API and boundary design during build |
| `frontend-ui-engineering/` | UI implementation patterns |
| `git-workflow-and-versioning/` | Commits, branches, messages |
| `code-review-and-quality/` | Checklist depth for **`review`** (not a separate pipeline step) |
| `browser-testing-with-devtools/` | In-browser verification via Chrome DevTools MCP (DOM, console, network, performance, screenshots) |

## Not vendored here (use AIDLC skills instead)

- **`spec-driven-development`** — Prefer **`write-prd`** for product spec; avoid a second spec workflow for the same initiative.
- **`planning-and-task-breakdown`** — Prefer **`create-tasks`** from an approved PRD.

## Resolution path

When **`execute-tasks`** (or **`review`**) tells you to load a playbook, read:

`skills/playbooks/<playbook-name>/SKILL.md`

in **this** workflows repository (or the copy vendored into the target app repo alongside `skills/`).

Refresh vendored files when upstream agent-skills change. **`browser-testing-with-devtools`** is kept in sync with the same-named skill in **agent-skills** (MCP install notes in the playbook reflect the published `chrome-devtools-mcp` package).
