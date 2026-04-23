# Greenfield monorepo (Turborepo + Bun)

Use this checklist when implementing a **full-stack monorepo** with **Bun** as the package manager/runtime for workspace installs and **Turborepo** for task orchestration.

## When to use

- `.aidlc/project.yaml` has `bootstrap.shape: monorepo`, or the approved PRD states full-stack monorepo bootstrap.

## Layout (typical)

```text
repo-root/
  package.json          # workspaces, turbo scripts
  bun.lockb
  turbo.json
  apps/
    api/                # NestJS — follow bootstrap-backend.md
    web/                # React+Vite — follow greenfield-frontend.md
  packages/             # optional shared eslint/tsconfig/types
```

Adjust `apps/*` names to match the PRD.

## Preferred: vendored template

1. Copy **`templates/turborepo-bun-root/`** to the monorepo root (`package.json`, `turbo.json`, `.gitignore`, `README.md`).
2. Copy **`templates/nest-backend/`** → `apps/api/` (see `templates/turborepo-bun-root/README.md`).
3. Copy **`templates/react-frontend/`** → `apps/web/`.
4. Ensure each app exposes `dev`, `build`, and `lint` scripts (and API `test` / `test:cov` if you run `turbo test`). Run **`bun install`** at the root.
5. **Local full-stack dev** — `turbo dev` starts **api and web in parallel**; **`dev` must not `dependOn` the other app**, so the SPA does not assume the API is up. If the frontend calls the API, document (and follow): **Postgres** — before `docker compose up -d` at repo root, apply **`skills/_reference/docker-postgres-host-port.md`** if the default mapped port is busy — then **API** (env + migrations + `dev:api` or `apps/api` dev script) → **web** (`dev:web` or `apps/web` dev script). Root scripts **`dev:api`** / **`dev:web`** use `--filter` so each app can run in its own terminal; update filters if you rename `greenfield-api` / `greenfield-web`.

## Checklist (manual / drift repair)

1. **Root `package.json`** — `"packageManager"` / Bun workspace field: `"workspaces": ["apps/*", "packages/*"]` (or your layout); root scripts: `dev`, `dev:api`, `dev:web`, `build`, `lint`, `test` delegating to Turbo (see `templates/turborepo-bun-root/package.json`).
2. **`turbo.json`** — `build` → `dependsOn: ["^build"]`; **`dev` → explicit empty `dependsOn`** (no ordering between apps); `lint` → `^lint`; `test` / `test:cov` → `^build` for workspace packages that must be built before tests. See `templates/turborepo-bun-root/README.md` for the task table.
3. **Per-app packages** — Each app has its own `package.json`; API app follows `bootstrap-backend.md`, web app follows `greenfield-frontend.md`.
4. **Root Postgres compose** — If the monorepo root has `docker-compose.yml` for Postgres, run **`skills/_reference/docker-postgres-host-port.md`** before `docker compose up -d`; keep **`apps/api/.env.template`** `DATABASE_URL` on the same **host** port as the compose mapping.
5. **Auth in `apps/web`** — Copy `.env.template` → `.env` under `apps/web` and fill auth env vars per your domain skill (`skills/<your-auth>/SKILL.md`). CORS for browser calls to the API stays in the **API** env (`templates/nest-backend/.env.template` → `CORS_ORIGINS`).
6. **Auth in `apps/api`** — Add your auth package to `apps/api`, follow your domain skill, and document required env vars in `apps/api/.env.template`.
7. **Shared config (optional)** — `packages/eslint-config`, `packages/tsconfig` to dedupe ESLint/TS configs; wire via `extends` in app configs.
8. **CI** — Document or add CI steps: `bun install`, `turbo run lint test build` (exact commands per team).

## Package manager note

- Scripts and lockfile are **Bun**-oriented; if a package must stay npm-compatible, document exceptions per app.

## Non-goals

- Forcing a single shared UI library or shared DB client unless the PRD asks — start with two apps and minimal `packages/` until duplication hurts.
