---
description: Scaffold `.aidlc/` project context (paths, tech stack, architecture) so other AIDLC skills resolve configuration in your repo
---

Read and follow the skill at `skills/init-aidlc-project/SKILL.md` in this repository.

Copy `project.yaml.example`, `tech-stack.template.md`, and `architecture.template.md` from `skills/init-aidlc-project/` into the **target application repo** as `.aidlc/project.yaml`, `.aidlc/tech-stack.md`, and `.aidlc/architecture.md`. For **greenfield** bootstrap, also copy `greenfield-prd.template.md` → `docs/<prd-slug>/prd-document.md` and set `bootstrap.shape` after the human chooses backend, frontend, or monorepo. For **brownfield** (existing codebase), set **`bootstrap.shape: brownfield`**, skip the greenfield PRD stub and vendored **`templates/`** steps, and fill domain files from the real repo. Greenfield reference playbooks live under `skills/_reference/` (`bootstrap-backend.md`, `greenfield-frontend.md`, `greenfield-monorepo-turborepo-bun.md`). Other skills load paths and validation from `skills/_reference/project-context.md`.
