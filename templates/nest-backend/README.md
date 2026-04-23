# Nest backend template

NestJS API scaffold with TypeORM, Postgres, Jest, Husky, ESLint, Prettier, Swagger, and Winston logging.

- ESLint / Prettier / `tsconfig*` / `nest-cli.json` — standard NestJS setup.
- Husky `pre-push` runs `test:cov`, `lint`, `format:check`.
- **Local Postgres** — `docker-compose.yml` (Postgres 16). Before `docker compose up -d`, follow **`skills/_reference/docker-postgres-host-port.md`** in this workflows repo: if the mapped **host** port (default **5432**) is already listening, pick the next free port and update **both** `docker-compose.yml` and **`DATABASE_URL`** in `.env.template` (and `.env` if it exists) so they match.
- TypeORM: `TypeOrmModule` is registered in `AppModule` (`DATABASE_URL`, `autoLoadEntities`, `synchronize: false`). CLI: `typeorm/config/typeorm.config.ts` + `typeorm/migrations/` for `migration:generate` / `migration:run`.
- **Entities** — Extend **`AppBaseEntity`** from `src/common/entities/app-base.entity.ts` (UUID `id`, `record_status`, audit columns, `version`). New `@Entity` classes should `export class MyThing extends AppBaseEntity { ... }` so migrations pick up standard columns via `migration:generate`.
- Winston: `src/common/app-logger.ts`, used from `main.ts`.
- **Auth (optional)** — `AppModule` does not import any auth module by default. Add your project's auth package, import its module after `ConfigModule.forRoot`, and follow your domain skill under `skills/<your-auth>/SKILL.md`. Document required env vars in `.env.template`.

## First run

1. Copy this directory into your repo (or `apps/api` in a monorepo), then `npm install` / `bun install`, rename `package.json` `name`, and adjust Swagger strings in `src/main.ts`.
2. `cp .env.template .env` (defaults match `docker-compose.yml`).
3. `npm run docker:up` and wait until Postgres is healthy (`docker compose ps`).
4. When you have migrations under `typeorm/migrations/`, run `npm run migration:run`.
5. `npm run start:dev`.

Monorepos: run `docker compose up -d` from the **repo root** if you copied `docker-compose.yml` from `templates/turborepo-bun-root/`; keep `DATABASE_URL` in `apps/api/.env` aligned with the **host** port in that root compose file (same **`docker-postgres-host-port`** procedure if 5432 is busy).
