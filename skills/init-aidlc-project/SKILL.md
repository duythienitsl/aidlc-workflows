---
name: init-aidlc-project
description: Scaffolds a `.aidlc/` project context folder with configurable artifact paths, tech stack and architecture templates, an optional draft greenfield PRD (backend vs frontend vs monorepo), and optional validation hooks for other AIDLC skills. Use when adopting AIDLC in a new repo, when onboarding an existing (brownfield) application, or when you want PRD/backlog paths and domain rules centralized for agents.
---

# Init AIDLC project

## Overview

Create **`.aidlc/`** at the target repository root so pipeline skills (`write-prd`, `create-tasks`, `execute-tasks`, `test`, `review`) can read **where PRDs and tasks live** and optional **domain-level tech and architecture rules**. Other skills resolve paths and validation via `skills/_reference/project-context.md`.

## When to Use

- First-time setup of AIDLC in an application repository (**greenfield** or **brownfield**)
- You want non-default paths for PRDs or task files
- You want agents to **enforce** filled-in tech stack and architecture docs before planning or coding

**When not to use:** This workflows repo only — skills here are documentation; run `init-aidlc-project` in the **application** repo that will hold PRDs and code.

## Process

1. **Confirm root** — Use the repository root where `docs/` (one folder per PRD under `docs/<prd-slug>/`), and `.aidlc/` should live (usually the git root). If unclear, ask the human.
2. **Choose init mode** — Ask which applies:
   - **Greenfield bootstrap** — New product or repo stack; optional draft PRD with backend/frontend/monorepo shape; may copy **`templates/`** scaffolds during later implementation. Leave `bootstrap.shape` as `unset` until the human picks a shape in the draft PRD, then set `backend`, `frontend`, or `monorepo`.
   - **Brownfield** — Application and meaningful codebase **already exist**. Do **not** treat this as a greenfield scaffold. Set **`bootstrap.shape: brownfield`** in `project.yaml` immediately. **Skip** step 7 (greenfield PRD stub) and **skip** step 10 (vendored `templates/` and greenfield first-run playbook). Use **`write-prd`** for the next feature or initiative when the team is ready; do not require `greenfield-prd.template.md` for brownfield unless the human explicitly wants that stub.
   - **AIDLC context only** — Paths + domain file templates; no draft PRD; human fills domain docs later without a full brownfield inventory in-session. Use **`bootstrap.shape: unset`** unless the repo is clearly brownfield (then prefer **brownfield** mode and document the real stack).
3. **Choose PRD slug** — For greenfield bootstrap, default slug: `greenfield-bootstrap` → `docs/greenfield-bootstrap/`. For brownfield, use the initiative slug the human gives for **default paths** (e.g. next epic name), or a neutral slug like `product` / `mainline` if they only want `.aidlc` wired first—**`write-prd`** will create or use `docs/<prd-slug>/` per initiative; align `paths.*` in `project.yaml` with the slug you create dirs for. Keep `paths.*` consistent with that slug.
4. **Create `.aidlc/`** — Add directory `.aidlc/` at that root.
5. **Write `project.yaml`** — Copy from `skills/init-aidlc-project/project.yaml.example` in this workflows repo into `.aidlc/project.yaml`. Replace path placeholders so `prds_dir`, `prd_file`, `backlog_file`, and `todo_file` match the chosen slug. Keep `domain.*` paths pointing at the tech stack and architecture files you will maintain (defaults: `.aidlc/tech-stack.md`, `.aidlc/architecture.md`). For greenfield, leave `bootstrap.shape` as `unset` until the human selects backend, frontend, or monorepo in the draft PRD, then set it. For brownfield, set **`bootstrap.shape: brownfield`**.
6. **Create artifact dirs** — Create `docs/<prd-slug>/` and `docs/<prd-slug>/tasks/` if missing.
7. **Draft greenfield PRD** (greenfield bootstrap only) — Copy `greenfield-prd.template.md` → `<prds_dir>/prd-document.md` (same skill folder). Tell the human to complete **Project shape** (one checkbox), set `bootstrap.shape` in `project.yaml`, and fill Problem/Solution/AC. They may run `write-prd` next to expand the stub to the full PRD template if needed. **Gate:** do not run `create-tasks` until the human approves the PRD content for this initiative. **Brownfield:** skip this step.
8. **Write domain templates** — Copy `tech-stack.template.md` → `.aidlc/tech-stack.md` and `architecture.template.md` → `.aidlc/architecture.md` from the same skill folder.
   - **Greenfield:** After the human picks a shape, pre-fill `.aidlc/tech-stack.md` from the matching `skills/_reference/` playbook (`bootstrap-backend.md`, `greenfield-frontend.md`, `greenfield-monorepo-turborepo-bun.md`).
   - **Brownfield:** **Inventory the existing repository** and fill both files from **facts on disk**, not from greenfield playbooks. Typical sources: root and package **`package.json`** / **`pnpm-workspace.yaml`** / **`turbo.json`**, language manifests (**`go.mod`**, **`Cargo.toml`**, **`pyproject.toml`**, etc.), **`README`**, **`Dockerfile`** / **`docker-compose.yml`**, **`/.github/workflows`**, top-level app folders (`apps/`, `packages/`, `src/`). Summarize runtime, frameworks, data stores, test and lint commands, and how services are split. For **architecture**, describe real boundaries (what this repo owns, major modules, deployment units, auth/data flows) as implemented—not a hypothetical target state unless the human asks for gap notes separately.
9. **Validation toggle** — When tech stack and architecture are substantive, set `validation.require_domain_context: true` in `project.yaml` so pipeline skills **stop** if those files are missing or empty (see `skills/_reference/project-context.md`).
10. **Vendored stack templates (greenfield bootstrap only)** — Point the human to **`templates/`** in this workflows repo: `nest-backend/`, `react-frontend/`, and `turborepo-bun-root/` (see `templates/README.md`). Agents should **copy** (not re-type) those trees into the application repo when implementing the scaffold; the `skills/_reference/*` playbooks assume this first. For **backend** or **monorepo** shapes, after the copy, **before `docker compose up`**, apply **`skills/_reference/docker-postgres-host-port.md`**: if the Postgres **host** port from compose is already in use on the machine, **increment the host port** and align **`docker-compose.yml`**, **`.env.template`** `DATABASE_URL`, and any README that hardcodes that port. Then run **`docker compose up -d`** (or **`npm run docker:up`** from the API package) from the directory that contains **`docker-compose.yml`** (monorepo: repo root from `turborepo-bun-root`; single API: Nest package root from `nest-backend`). Then **`cp .env.template .env`** in the API package so **`DATABASE_URL`** matches Postgres before **`migration:run`** or **`start:dev`**. For **monorepo**, root **`turbo dev`** starts **API and web in parallel** with **no Turbo ordering between them**; if the SPA calls the API, bring up **Postgres + API** before relying on those calls — see **`templates/turborepo-bun-root/README.md`**; use **`bun run dev:api`** / **`bun run dev:web`** (after renaming package `name` fields if needed) for one app per terminal. After installing the **react-frontend** template deps, run **`npx playwright install chromium`** once so Vitest **browser** tests can launch Chromium. If the PRD requires **auth / login**, add a domain skill under `skills/<your-auth>/SKILL.md` and follow it during `execute-tasks` (see `skills/_reference/execution-playbooks.md`). **Brownfield:** skip this step; use existing project setup and env conventions documented in `.aidlc/` and repo README.
11. **Summarize** — List created paths. For **greenfield**, include `templates/` copy instructions, reference playbooks, Docker/Postgres first-run notes, and remind the human to add a domain skill if auth is needed. For **brownfield**, emphasize **`bootstrap.shape: brownfield`**, that **`skills/_reference/project-context.md`** tells other skills not to assume greenfield scaffolds, and that the next initiative typically starts with **`write-prd`**. State that other skills read `.aidlc/project.yaml` when present.

## Verification

- [ ] `.aidlc/project.yaml` exists and parses as YAML (no stray merge conflict markers).
- [ ] `.aidlc/tech-stack.md` and `.aidlc/architecture.md` exist (from templates at minimum).
- [ ] `paths.prds_dir`, optional `paths.prd_file` (or default `<prds_dir>/prd-document.md`), `paths.backlog_file`, and `paths.todo_file` match directories/files that exist or were created.
- [ ] `bootstrap.shape` is set appropriately: **`brownfield`** for existing codebases; **`unset`** until shape is chosen for greenfield; **`backend` / `frontend` / `monorepo`** after greenfield shape is chosen.
- [ ] `<prds_dir>/prd-document.md` exists from `greenfield-prd.template.md` when **greenfield bootstrap** was chosen (skipped for brownfield and for context-only init without a stub).
- [ ] **Greenfield:** Human knows to set `bootstrap.shape` after choosing project shape, to copy **`templates/`** when bootstrapping code, to resolve **Postgres host port conflicts** per **`skills/_reference/docker-postgres-host-port.md`** before **`docker compose up`**, to start **Postgres** with **`docker compose`** (and `.env` from `.env.template`) for backend/monorepo before first API run, that **monorepo `turbo dev` does not wait for the API**, to add a domain skill if auth is needed, and to set `require_domain_context` when ready for strict checks.
- [ ] **Brownfield:** Domain files reflect the **actual** stack and layout; human knows greenfield **`templates/`** and greenfield playbooks are **not** the default path for new work.

## Red flags

- Writing `project.yaml` only without templates — domain files will be empty when validation is turned on.
- Absolute machine-specific paths in `project.yaml` — prefer repo-relative paths for portability.
- Treating **brownfield** repos like greenfield — copying **`templates/`** over existing apps, or filling **tech-stack** / **architecture** from greenfield playbooks instead of the real codebase.
- Leaving **`bootstrap.shape`** at **`unset`** on a mature repo when the team expects agents to follow **brownfield** rules — set **`brownfield`** so `project-context` resolution stays explicit.
