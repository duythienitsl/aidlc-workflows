# Greenfield bootstrap PRD

**Status:** Draft — complete **Project shape** and product sections before `create-tasks`.  
**AIDLC:** Created by `init-aidlc-project`; refine with `write-prd` if needed.

## Project shape (required)

Choose **one** and remove the others:

- [ ] **Backend only** — API/service repository (no first-party UI in this repo).
- [ ] **Frontend only** — Browser UI (no API owned in this repo, or API is external).
- [ ] **Full-stack monorepo** — API + UI in one repo (see Turborepo + Bun in reference docs).

Record the choice in `.aidlc/project.yaml` under `bootstrap.shape` as `backend`, `frontend`, or `monorepo`.

## Default stack (by shape)

Agents align `.aidlc/tech-stack.md` and implementation with these defaults unless the PRD overrides them.

### If backend only

- NestJS, TypeORM, PostgreSQL (or team DB), Swagger/OpenAPI, Winston, Jest, Husky, ESLint + Prettier.
- DTO validation: **class-validator** / class-transformer. **Zod is optional** (e.g. env/config), not required for API DTOs.

### If frontend only

- React, TypeScript, Vite, Tailwind. Folder style: `src/app/`, `src/features/<feature>/`, `src/shared/`.
- **Zod** recommended for forms, query params, and env where the team wants runtime validation.

### If full-stack monorepo

- **Bun** workspaces + **Turborepo**; typical `apps/api` and `apps/web` (names flexible).
- Compose backend and frontend defaults above; shared tooling at repo root as appropriate.

## Problem Statement

<!-- Why this repo or initiative exists; pain or opportunity. -->

## Solution

<!-- Product-level outcome (not file-by-file implementation). -->

## Acceptance criteria

Numbered, **observable** criteria (e.g. `AC1`, `AC2`). Example patterns:

- AC1: Given a fresh clone, documented commands install deps and run the app(s) locally.
- AC2: Health or smoke endpoint/page proves the chosen stack runs end-to-end (adjust per shape).

## User Stories

1. As a developer, I want a documented baseline stack, so that I can ship features without re-deciding tooling.
2. <!-- Add product-specific stories. -->

## Goals

- <!-- ... -->

## Non-goals / out of scope

- <!-- ... -->

## Implementation Decisions

- Project shape: (backend | frontend | monorepo)
- **File scaffold:** copy `templates/` from the AIDLC Workflows repo (`templates/nest-backend`, `templates/react-frontend`, `templates/turborepo-bun-root` + `templates/README.md`) before hand-rolling configs.
- Reference playbooks (when skills are vendored): `skills/_reference/bootstrap-backend.md`, `skills/_reference/greenfield-frontend.md`, `skills/_reference/greenfield-monorepo-turborepo-bun.md`

## Testing Decisions

- <!-- e.g. Jest + supertest for API; Vitest/RTL for UI if adopted -->

## Dependencies & risks

- <!-- ... -->

## Open questions

1. Database and hosting assumptions?
2. Add **Zod** on the API for env/config only, or stay class-validator-only?
3. <!-- ... -->

## Further notes

- After this PRD is approved, run `create-tasks`, then `execute-tasks`, using the reference doc that matches `bootstrap.shape`.
