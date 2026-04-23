# AGENTS.md

This file guides AI coding agents (Claude Code, Cursor, Copilot, Antigravity, OpenCode, etc.) when using this repository’s **AIDLC** workflow: product definition → backlog → implementation → automated verification → review → deploy.

## Repository overview

**AIDLC Workflows** ships a small, ordered set of skills under `skills/` and Claude Code slash commands under `.claude/commands/`. Each step is one `SKILL.md` file with YAML frontmatter (`name`, `description`). The pipeline and default artifact paths are summarized in [README.md](README.md).

## Skill-driven execution

### Core rules

- If the user’s request matches a skill—even slightly—you **must** read and follow `skills/<skill-name>/SKILL.md`.
- Skills live at `skills/<skill-name>/SKILL.md` (kebab-case directory names).
- Do **not** skip to implementation when the workflow requires an earlier gate (e.g. no coding before an approved PRD and backlog, when the skill says to gate).
- Follow the skill **completely**—do not partially apply it.

### Intent → skill mapping

Map user intent to skills so the right process runs:


| User intent                                                                                                                                 | Skill                     |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| First-time AIDLC setup in an app repo; centralize PRD/task paths, domain rules; optional greenfield PRD (backend / frontend / monorepo) or **brownfield** (existing codebase, inventory into `.aidlc/`) | `init-aidlc-project`      |
| New initiative, feature, or unclear requirements; need a PRD                                                                                | `write-prd`               |
| PRD exists; break work into ordered tasks with acceptance criteria                                                                          | `create-tasks`            |
| Backlog exists; implement the next task with tests and commits                                                                              | `execute-tasks`           |
| Strengthen or run automated checks after changes                                                                                            | `test`                    |
| Quality / risk review of a diff or branch                                                                                                   | `review`                  |
| Production release: pre-launch checklist, staged rollout, monitoring, rollback                                                              | `deploy`                  |
| Project-specific SDK, auth, or platform pattern (add your own domain skill under `skills/<name>/`)                                          | `skills/<name>/SKILL.md`  |


**Typical sequence for greenfield work:** optional `init-aidlc-project` → `write-prd` → `create-tasks` → `execute-tasks` → `test` → `review` → `deploy`. Only **`init-aidlc-project`** is optional (one-time setup). For **brownfield** repos, run `init-aidlc-project` once to set paths and document the real stack, then start new initiatives at `write-prd` (or later steps if artifacts exist). Jump in at the right step if earlier artifacts already exist and are approved.

### Execution playbooks (inside `execute-tasks` / `review`)

After `**write-prd`** and `**create-tasks**`, implementation detail is guided by `**skills/playbooks/***` **and** **domain-specific** skills at `**skills/<name>/SKILL.md`** (project-specific SDKs, auth patterns, platform integrations). See `skills/_reference/execution-playbooks.md` for **task kind → playbook / domain skill** mapping.


| Task / intent (during `execute-tasks`)                                                     | Playbook(s) under `skills/playbooks/`                                                                                   |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Feature / new functionality (multi-file)                                                   | `incremental-implementation`, `test-driven-development`                                                                 |
| Bug / failure / unexpected behavior                                                        | `debugging-and-error-recovery` (+ `test-driven-development` when fixing via tests)                                      |
| Refactoring / simplification                                                               | `code-simplification`                                                                                                   |
| API or interface design                                                                    | `api-and-interface-design`                                                                                              |
| UI work                                                                                    | `frontend-ui-engineering`                                                                                               |
| Auth / OAuth / JWT / login flow (project-specific)                                         | Load your domain skill at **`skills/<your-auth>/SKILL.md`** (plus playbooks listed in `execution-playbooks.md` for that task kind) |
| Commits / branching discipline                                                             | `git-workflow-and-versioning`                                                                                           |


**Do not** use agent-skills `**spec-driven-development`** or `**planning-and-task-breakdown**` as substitutes for `**write-prd**` / `**create-tasks**` on the same initiative.

For `**review**`, load `**skills/playbooks/code-review-and-quality/SKILL.md**` for a deeper checklist (see `skills/review/SKILL.md`).

### Lifecycle mapping (pipeline)

The canonical order is:

```text
write-prd  →  create-tasks  →  execute-tasks  →  test  →  review  →  deploy
```

Rough alignment with generic phases:


| Phase                                    | Skill                |
| ---------------------------------------- | -------------------- |
| Optional: project paths and domain rules | `init-aidlc-project` |
| Define scope and success                 | `write-prd`          |
| Plan work                                | `create-tasks`       |
| Build                                    | `execute-tasks`      |
| Verify                                   | `test`               |
| Review                                   | `review`             |
| Ship / production readiness            | `deploy`             |


### Claude Code vs OpenCode

- **Claude Code:** Slash commands in `.claude/commands/` map to the same skills (e.g. `/write-prd` → read `skills/write-prd/SKILL.md`; `/deploy` → read `skills/deploy/SKILL.md`).
- **OpenCode (no slash commands):** Treat the pipeline above as the implicit lifecycle. When the user’s message matches a step, load and follow the corresponding `SKILL.md`—same rules as Claude Code.

### Execution model

For every request:

1. Decide whether `init-aidlc-project`, `write-prd`, `create-tasks`, `execute-tasks`, `test`, `review`, or `deploy` applies (even a small chance → use the skill).
2. Read the full `SKILL.md` for that skill.
3. Execute its workflow in order, including human gates where specified.
4. Only implement product code after `write-prd` / `create-tasks` are satisfied when the initiative requires them.

### Anti-rationalization

These thoughts are wrong—ignore them:

- “This is too small for a skill.”
- “I’ll just implement it quickly.”
- “I’ll only gather context first.” (Gather context **through** the relevant skill’s steps.)

Correct behavior: **check for a matching skill first**, then follow it.

---

## Adding or editing skills

### Layout

```
skills/
  {skill-name}/     # kebab-case — pipeline skills (init, write-prd, create-tasks, execute-tasks, test, review, deploy)
    SKILL.md        # required
  playbooks/        # optional — execution playbooks (complement execute-tasks; see playbooks/README.md)
    {playbook-name}/
      SKILL.md
  _reference/       # project-context, execution-playbooks, etc.
```

Optional: `scripts/`, templates, or reference files one level deep; link from `SKILL.md` if content would exceed ~500 lines in one file.

### Conventions

- **Directory name:** kebab-case (e.g. `write-prd`, `create-tasks`).
- **File name:** `SKILL.md` (exact).
- **Frontmatter:** `name` and `description` (description starts with what the skill does, then “Use when…”).

### New skill checklist

1. Add `skills/<name>/SKILL.md` with overview, when to use, process, verification, and red flags as appropriate.
2. Add `.claude/commands/<name>.md` that tells the agent to read `skills/<name>/SKILL.md`.
3. Update [README.md](README.md) pipeline table if the public flow changes.

---

## Boundaries

- This repo documents **workflow**; it is not an application runtime. Skills are instructions, not deployed services. Greenfield **file scaffolds** live under `**templates/`** (Nest, React, Turborepo root) for copy into application repos. **Execution playbooks** live under `**skills/playbooks/`** and are loaded from `**execute-tasks**` / `**review**` per `skills/_reference/execution-playbooks.md`.
- When this repo is copied into an application repo, agents should follow the **application’s** tech stack and tests—use `test` and `execute-tasks` to discover real commands from that project’s config.

