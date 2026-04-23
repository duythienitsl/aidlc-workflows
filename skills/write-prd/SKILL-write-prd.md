---
name: write-prd
description: Create a PRD through user interview, codebase exploration, and module design, then write it as docs/<prd-slug>/prd-document.md. Use when user wants to write a PRD, create a product requirements document, or plan a new feature.
---

# Write PRD (alternate brief)

**PRD files live here:** each run uses **one new folder** `docs/<prd-slug>/` (short kebab-case slug, e.g. `login-and-welcome-ui`). The PRD file is always **`prd-document.md`** inside that folder. Task artifacts from `create-tasks` sit in **`docs/<prd-slug>/tasks/`** (`backlog.md`, `todo.md`). Create `docs/<prd-slug>/` if missing. Update `.aidlc/project.yaml` paths to the slug you are executing when using project context. Only use a different layout if the user explicitly asks for this session.

## Process (short)

1. Apply `skills/_reference/project-context.md` in the target repo; read domain files if present.
2. Clarify problem, users, constraints, and definition of done with the human.
3. Explore the codebase as needed.
4. Propose module boundaries and testing approach; surface assumptions.
5. Once you have a complete understanding of the problem and solution, use the template in `SKILL.md` to write the PRD. Save it under **`docs/<prd-slug>/prd-document.md`** per **PRD files live here** above. Do not create or update GitHub issues for PRDs as part of this skill.
6. Stop for human approval before `create-tasks` or implementation.
