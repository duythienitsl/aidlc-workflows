---
description: Produce an approved product requirements document — the first step of the AIDLC pipeline
---

Read and follow the skill at `skills/write-prd/SKILL.md` in this repository.

## MANDATORY process — do not skip any step

1. **Read** `skills/write-prd/SKILL.md` fully before doing anything else
2. **Enter plan mode** (`EnterPlanMode`) — do NOT implement, write files, or execute tasks yet
3. **Clarify** requirements with the human (interview until problem + solution are concrete)
4. **Explore** the codebase for context and constraints
5. **Write the PRD** in plan mode using the template from SKILL.md
6. **Exit plan mode** (`ExitPlanMode`) to get human confirmation
7. **Gate** — stop and wait for explicit approval before proceeding to `create-tasks`

Do not start implementation or task breakdown until the human confirms the PRD. Always produce **two PRD files**:
- `docs/<prd-slug>/prd-document.md` — English version
- `docs/<prd-slug>/prd-document-vi.md` — Vietnamese version

Task artifacts live in `docs/<prd-slug>/tasks/` (see `skills/_reference/project-context.md`) unless the project already standardizes another location.

> **Anti-patterns to avoid:**
> - Jumping to implementation without a confirmed PRD
> - Using `Skill` tool (for built-in skills only) — read `SKILL.md` directly instead
> - Treating this as a documentation task and executing immediately
