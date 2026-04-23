# Bootstrap backend

Use this checklist when implementing or scaffolding a **backend-only** repository.

## When to use

- `.aidlc/project.yaml` has `bootstrap.shape: backend`, or the approved PRD states backend-only greenfield bootstrap.

## Preferred: vendored template

Copy the tree **`templates/nest-backend/`** from this workflows repository into the target app root (or monorepo `apps/api/`). It already includes **ESLint**, **Prettier**, **tsconfig**, **Husky pre-push**, **Jest**, **TypeORM CLI layout**, **`TypeOrmModule`** in `AppModule`, **`docker-compose.yml`** for local **Postgres**, **`AppBaseEntity`** in `src/common/entities/app-base.entity.ts`, **Winston** bootstrap logging, **Swagger**, and a minimal **health** module. Then rename `package.json` / Swagger metadata and run install.

If the template is missing or outdated, fall back to the manual checklist below.

## Checklist (manual / drift repair)

1. **Project metadata** — `package.json`: NestJS dependencies, scripts for `build`, `start:dev`, `test`, `test:cov`, `lint`, `format`, TypeORM migration commands if using TypeORM CLI pattern.
2. **Nest CLI / TypeScript** — `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`, path aliases if the project uses `src/` mapping in Jest.
3. **Lint and format** — `.eslintrc.js`, `.prettierrc`, `tsconfig.eslint.json` if present; match rule style to the team standard.
4. **Git hooks** — `.husky/` and `prepare` script; pre-commit or pre-push aligned with team policy.
5. **Tests** — Jest config in `package.json` and/or dedicated config; `test/setup.ts`; `test/jest-e2e.json` if e2e pattern is used; `*.spec.ts` beside sources.
6. **App entry** — `src/main.ts`: Swagger setup, global pipes/filters as appropriate; `src/app.module.ts` module graph pattern.
7. **TypeORM** — `typeorm/config/typeorm.config.ts`, `typeorm/migrations/` layout, migration scripts in `package.json`. Domain **`@Entity`** classes extend **`AppBaseEntity`** (see template `src/common/entities/app-base.entity.ts`) unless the table is intentionally legacy-shaped.
8. **Logging** — Winston (or equivalent) wiring consistent with team patterns for request/error logging.
9. **HTTP** — Controllers/services/modules layout under `src/<domain>/`; DTOs with **class-validator** / class-transformer; Swagger decorators for public APIs.
10. **Env** — `.env.template` listing required variables; `DATABASE_URL` aligned with **Docker Compose** when using the template's `docker-compose.yml`.
11. **Local database** — `docker-compose.yml` with Postgres; `npm run docker:up` / `docker compose down` scripts if copied from template. **Before first `docker compose up`**, follow **`skills/_reference/docker-postgres-host-port.md`**: if the default host port (5432) is **already listening**, pick the next free port and update **compose + `DATABASE_URL` in `.env.template` (and `.env` if present) + any local README** in sync.
12. **Auth (when protecting routes)** — Add your project's auth package and follow the matching domain skill under `skills/<your-auth>/SKILL.md`. Wire the auth module after `ConfigModule.forRoot` and document required env vars in `.env.template`.

## Zod

- Optional for strict env parsing or shared schemas if the team chooses; not required for API DTOs (class-validator is the default).

## Non-goals

- Copying auth domain modules wholesale from another app — reuse **infrastructure** and **layout** patterns. Wiring your project's auth SDK with env + guards is in scope; follow your domain skill.
