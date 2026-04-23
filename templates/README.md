# Greenfield file templates

These directories are **copy-paste scaffolds** for application repos.

## Layout

| Directory | Use |
|-----------|-----|
| `nest-backend/` | Single NestJS API package (or copy into monorepo `apps/api`). |
| `react-frontend/` | Single SPA (or copy into monorepo `apps/web`). **Vitest 4**: unit (jsdom) + browser (Playwright Chromium, `vitest-browser-react`); run **`npx playwright install chromium`** after install. Includes **`.env.template`** — copy to **`.env`** and fill in your environment values. Default Vite config is **without** Module Federation; add `vite.config.module-federation.example.ts` when MFE is required. |
| `turborepo-bun-root/` | Repo root for Bun workspaces + Turborepo (merge `package.json` keys into your root). |

The **nest-backend** template includes **`AppBaseEntity`** / **`RecordStatus`** (`src/common/entities/app-base.entity.ts`) so new TypeORM entities can extend a consistent column set (UUID id, `record_status`, audit fields, `version`). It also ships **`docker-compose.yml`** for local **Postgres 16**; `.env.template` `DATABASE_URL` matches the compose defaults. **`turborepo-bun-root/`** includes the same compose file so you can start Postgres from the monorepo root.

## How agents should apply them

1. Resolve the path to **this** workflows repo. If you only copied `skills/` into another repo, also copy **`templates/`** (or submodule the full `aidlc-workflows` repo) so paths like `templates/nest-backend/` exist.
2. **Recursive copy** the chosen template into the target path (e.g. `cp -R templates/nest-backend/* apps/api/`).
3. Rename `package.json` `name` field and Swagger title strings.
4. Run `bun install` / `npm install` per repo policy.
5. For monorepos: copy `turborepo-bun-root` files to the repo root, then nest + react templates into `apps/api` and `apps/web`. **`turbo dev` runs `api` and `web` in parallel** with **no cross-app `dependsOn`**; if the SPA calls the API, start **Docker Postgres + API** before relying on those calls (see [`turborepo-bun-root/README.md`](turborepo-bun-root/README.md)). Root **`dev:api`** / **`dev:web`** scripts use Turbo `--filter` on `greenfield-api` / `greenfield-web` — update them if you rename those packages.

## Maintenance

When the team's standard stacks change, update these templates and the checklists in `skills/_reference/bootstrap-backend.md` and `skills/_reference/greenfield-frontend.md`. For Postgres **host port** conflicts after copy, agents follow `skills/_reference/docker-postgres-host-port.md`.
