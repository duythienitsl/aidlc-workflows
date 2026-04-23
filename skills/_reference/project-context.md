# AIDLC project context resolution

When any AIDLC pipeline skill runs in a **target application repository**, apply this resolution **before** steps that read or write PRDs, backlogs, or domain-specific rules.

## 1. Locate configuration

- If `.aidlc/project.yaml` exists at the **repository root**, load it as project context.
- If it does not exist, use **defaults** below (one folder per PRD under `docs/`). Skip sections 2–3 except where defaults are used below. Do not treat missing `.aidlc/` as an error.

## 2. Resolve paths

From `project.yaml`, read (defaults shown). All paths are relative to the repository root.

| Key | Purpose | Default if omitted |
|-----|---------|-------------------|
| `bootstrap.shape` | Optional hint: `unset`, greenfield scaffolding (`backend`, `frontend`, `monorepo`), or **`brownfield`** for an existing codebase (see `skills/init-aidlc-project/project.yaml.example`) | omit → treat as unset |
| `paths.prds_dir` | Folder for **one** PRD initiative: `docs/<prd-slug>/` (same name as the slug for that PRD) | `docs/example-prd` |
| `paths.prd_file` | The PRD Markdown file for that initiative | `<prds_dir>/prd-document.md` |
| `paths.backlog_file` | Full backlog | `<prds_dir>/tasks/backlog.md` |
| `paths.todo_file` | Execution checklist | `<prds_dir>/tasks/todo.md` |
| `domain.tech_stack_file` | Stack and tooling rules | `.aidlc/tech-stack.md` |
| `domain.architecture_file` | Domain/architecture constraints | `.aidlc/architecture.md` |

If `paths` or `domain` sections are absent, apply defaults for missing keys only. Resolve `<prds_dir>` first, then substitute it into `prd_file`, `backlog_file`, and `todo_file` when those values reference `<prds_dir>` or when defaults are applied.

## 3. Validate required domain context

If `validation.require_domain_context` is **true**:

1. For `domain.tech_stack_file` and `domain.architecture_file` (after applying defaults), verify each file **exists** under the repo root.
2. Verify each file has **substantive content**: at least one line that is not only whitespace or Markdown comment syntax (non-empty body).
3. If any check fails: **stop the skill**; list missing or empty files and remediation (fill the templates in `.aidlc/` or run `init-aidlc-project`). Do not write PRDs, tasks, implementation work, tests, or reviews until this is fixed—unless the human explicitly overrides for this session and states that override in chat.

If `validation.require_domain_context` is **false** or omitted: missing or empty domain files are a **single warning** at context load, not a hard stop.

## 4. Use resolved paths and domain docs

- **Layout:** Each call to `write-prd` uses a **new** folder `docs/<prd-slug>/` (short kebab-case slug, e.g. `login-and-welcome-ui`). Inside that folder the PRD file is always **`prd-document.md`**. Task artifacts from `create-tasks` live in **`docs/<prd-slug>/tasks/`** (`backlog.md`, `todo.md`). Update `paths.prds_dir` (and aligned `prd_file` / `backlog_file` / `todo_file` if you list them explicitly) in `.aidlc/project.yaml` when switching which PRD initiative you are executing—each slug is its own tree under `docs/`.
- Save and read the PRD at the resolved `prd_file` (default `<prds_dir>/prd-document.md`) unless the project documents a different convention in chat.
- Use `paths.backlog_file` and `paths.todo_file` for task artifacts.
- When making technology, testing, or architecture decisions (planning, implementation, review), read `domain.tech_stack_file` and `domain.architecture_file` when they exist so work aligns with project rules.
- If `bootstrap.shape` is `backend`, `frontend`, or `monorepo`, use the matching playbook under `skills/_reference/` when scaffolding or bootstrapping a **new** codebase (`bootstrap-backend.md`, `greenfield-frontend.md`, `greenfield-monorepo-turborepo-bun.md`). When bringing up **Docker Postgres** from the vendored templates, follow **`docker-postgres-host-port.md`** so the **host** port and **`DATABASE_URL`** stay aligned if **5432** (or the chosen port) is already in use.
- If `bootstrap.shape` is **`brownfield`**, do **not** assume greenfield templates or those playbooks for new scaffolds; rely on **`domain.tech_stack_file`**, **`domain.architecture_file`**, and the **actual repository** (source layout, manifests, README, existing services) when planning and implementing changes.
- When running **`execute-tasks`** or **`review`**, if `skills/playbooks/` exists in the workflows copy, apply `skills/_reference/execution-playbooks.md`, the referenced `skills/playbooks/<name>/SKILL.md` files, and any **domain-specific** skills listed there (e.g. `skills/<your-domain>/SKILL.md` for project-specific SDK or auth patterns).
