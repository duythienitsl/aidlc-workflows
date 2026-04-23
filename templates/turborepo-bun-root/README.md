# Turborepo + Bun (template root)

1. Copy this folder’s `package.json`, `turbo.json`, `.gitignore`, and `docker-compose.yml` to your monorepo root.
2. Copy `../nest-backend/` → `apps/api/` (adjust `package.json` `name` if you rename the app; then update root `dev:api` / `dev:web` filters to match).
3. Copy `../react-frontend/` → `apps/web/` (same note: default filters assume `greenfield-api` and `greenfield-web`).
4. In each app `package.json`, ensure scripts exist: `dev`, `build`, `lint`, and for API `test` / `test:cov` so `turbo` can run them.
5. Run `bun install` at the repo root.

Example `apps/api/package.json` addition: `"dev": "nest start --watch"`.

## Turbo pipeline and local dev

- **`turbo dev` (root `bun run dev`)** runs **`dev` in every workspace that defines it**, in parallel. The **`dev` task has no `dependsOn`**, so **`apps/web` does not wait for `apps/api`** and Turbo does not imply the API (or Postgres) is ready when Vite starts.
- If the SPA calls the **API**, start infrastructure and the API yourself before relying on those calls:
  1. From the repo root: if Postgres port **5432** (or whatever is in `docker-compose.yml`) is **already in use**, follow **`skills/_reference/docker-postgres-host-port.md`** in **aidlc-workflows**, then `docker compose up -d` (Postgres).
  2. In `apps/api`: copy `.env.template` → `.env`, run migrations if needed, then start the API (`bun run dev:api` from root, or `cd apps/api && bun run start:dev`).
  3. Start the web app (`bun run dev:web` from root, or `cd apps/web && bun run dev`).
- Use **`bun run dev:api`** and **`bun run dev:web`** when you want **one app at a time** in separate terminals instead of `bun run dev` for both.

### Task graph (explicit `dependsOn`)

| Task       | `dependsOn` | Notes |
|------------|-------------|--------|
| `build`    | `^build`    | Internal workspace packages build before dependents. |
| `dev`      | _(none)_    | Parallel, persistent; no ordering between `api` and `web`. |
| `lint`     | `^lint`     | Lint workspace dependencies first when applicable. |
| `test`     | `^build`    | Build workspace dependencies before tests when applicable. |
| `test:cov` | `^build`    | Same as `test`. |
