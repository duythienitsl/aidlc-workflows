# AIDLC Workflows

Agent-oriented workflows for product definition, task breakdown, implementation, verification, review, and deploy. Skills live under `skills/`; Claude Code slash commands under `.claude/commands/` invoke those skills.

## Pipeline

Work moves in order. Each step has a matching skill and command — complete and get human approval before moving on when the skill says to gate.

```text
[init-aidlc-project]  →  [investigate]  →  write-prd  →  create-tasks  →  execute-tasks  →  test  →  review  →  deploy
```

| Step | Purpose | Skill | Command (Claude Code) |
|------|---------|--------|------------------------|
| 0 (optional) | Scaffold `.aidlc/` with paths, tech stack, architecture templates, and optional **draft greenfield PRD** (backend / frontend / monorepo) | `skills/init-aidlc-project/` | `/init-aidlc-project` |
| 0 (optional) | Diagnose a production issue from symptom to root cause (read-only); write `investigation.md` that feeds `write-prd` or a direct fix | `skills/investigate/` | `/investigate` |
| 1 | Capture problem, scope, and success in a PRD | `skills/write-prd/` | `/write-prd` |
| 2 | Break the PRD into ordered tasks with acceptance criteria | `skills/create-tasks/` | `/create-tasks` |
| 3 | Implement tasks incrementally with tests and commits | `skills/execute-tasks/` | `/execute-tasks` |
| 4 | Run and harden automated verification | `skills/test/` | `/test` |
| 5 | Review the diff for quality and risk | `skills/review/` | `/review` |
| 6 | Pre-launch checklist, rollout, monitoring, and rollback before production | `skills/deploy/` | `/deploy` |

### Default artifacts

Each **`write-prd`** run creates **one folder** under `docs/<prd-slug>/` so the PRD and generated tasks stay together (easy to see which PRD produced the backlog).

| Artifact | Typical path |
|----------|----------------|
| PRD folder (one per PRD) | `docs/<prd-slug>/` (e.g. `docs/login-and-welcome-ui/`) |
| PRD document | `docs/<prd-slug>/prd-document.md` |
| Backlog | `docs/<prd-slug>/tasks/backlog.md` |
| Execution checklist | `docs/<prd-slug>/tasks/todo.md` |

### Project context (optional)

Run `/init-aidlc-project` once in an **application** repo to add `.aidlc/project.yaml` plus `.aidlc/tech-stack.md` and `.aidlc/architecture.md`. For **greenfield** repos, the same skill can add `docs/<prd-slug>/prd-document.md` from `greenfield-prd.template.md` so the team records **backend-only**, **frontend-only**, or **monorepo** before task breakdown. After the shape is chosen, set `bootstrap.shape` in `project.yaml`. For **concrete file scaffolds** (Nest/ESLint/TypeORM/Husky and Vite/Tailwind layout), copy from **`templates/`** in this repo (`templates/README.md`), then use `skills/_reference/bootstrap-backend.md`, `greenfield-frontend.md`, or `greenfield-monorepo-turborepo-bun.md` during `execute-tasks` if anything still needs adjustment.

Pipeline skills read `skills/_reference/project-context.md` and use those paths; set `validation.require_domain_context: true` when you want skills to **stop** if domain files are missing or empty.

Without `.aidlc/project.yaml`, behavior matches the default artifact paths in `skills/_reference/project-context.md` (e.g. `docs/example-prd/` as the illustrative default `prds_dir`).

Adjust paths in `project.yaml` if your repo uses different conventions; keep PRD and tasks in version control.

### Using this repo in another project

1. Copy `skills/` (including **`skills/playbooks/`** for execution guidance, plus any **domain skills** your project needs under `skills/<name>/`) and **`templates/`** (or symlink / submodule the whole repo) into the target project so agents can follow the pipeline, **load playbooks and domain skills** during `/execute-tasks` (see `skills/_reference/execution-playbooks.md`), and **copy scaffolds** from `templates/`.
2. Copy `.claude/commands/` into the target repo’s `.claude/commands/` so slash commands resolve.
3. Optionally run `/init-aidlc-project` in the application repo to create `.aidlc/` and align artifact paths with your project.
4. Run the pipeline from `/write-prd` through `/deploy` for each initiative (production release follows `/review`).

Skills are plain Markdown with YAML frontmatter; any agent that can read files can follow them without Claude-specific features.
