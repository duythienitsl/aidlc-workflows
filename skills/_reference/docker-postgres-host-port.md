# Local Postgres in Docker: host port conflicts

Use this when **adding or vendoring** `docker-compose.yml` with Postgres (templates under `templates/nest-backend/` and `templates/turborepo-bun-root/`), or when **`docker compose up` fails** because the mapped host port is already taken.

## Goal

Keep **one** host port across:

- `docker-compose.yml` → `ports: - '<HOST>:5432'` (only **HOST** changes; container stays **5432**)
- API **`.env.template`** → `DATABASE_URL=...localhost:<HOST>/...`
- If a committed or local **`.env`** already exists beside that template and is used for dev, update **`DATABASE_URL`** there too when you change the port (or tell the human to re-copy from `.env.template`).
- Any **README** in the same tree that states a fixed Postgres URL or port for this compose file

## When to run the check

- **Before** first `docker compose up -d` in a new scaffold, or
- **Immediately after** copying templates into the app repo, or
- When compose errors mention **port is already allocated** / **bind: address already in use**

## Detect a listening port on the host

Interpret “in use” as: **something is listening on TCP on that port on the host** (not whether Docker is running).

1. Read the intended **host** port from `docker-compose.yml` (the number before `:5432` in the `postgres` service `ports` entry). Default in templates: **5432**.

2. Test that port:

   - **macOS / Linux (preferred):**  
     `lsof -nP -iTCP:<PORT> -sTCP:LISTEN`  
     If this prints **one or more lines**, the port is **in use**.

   - **Linux (if `lsof` unavailable):**  
     `ss -lnt | grep -E ":<PORT>\s"` — matching output means **in use**.

   - **Windows (PowerShell):**  
     `Get-NetTCPConnection -LocalPort <PORT> -State Listen -ErrorAction SilentlyContinue` — any rows mean **in use**.

3. If **in use**, choose the next candidate: **`<PORT> + 1`** (5433, 5434, …). Re-test until you find a **free** port or reach a **reasonable cap** (e.g. **5449**). If nothing is free in that range, **stop** and ask the human to free a port or pick one explicitly.

4. Apply the chosen **HOST** port everywhere in step “Goal” (compose + env templates + README mentions). **Do not** change the container’s internal **5432**.

## After changing the port

- Tell the human in the summary: *which* host port you chose and *why* (e.g. “5432 was in use by a local Postgres; aligned compose and `DATABASE_URL` to **5433**”).
- If they already had containers from an **older** mapping, remind them: `docker compose down` (and recreate) may be needed so the new mapping applies.

## Red flags

- Updating **only** `docker-compose.yml` and leaving **`DATABASE_URL`** on the old port — the API will fail to connect.
- Changing the **container** side of the mapping (should stay **5432** unless the image is non-standard).
- Assuming port freeness without running a check when the human reports DB connection issues on first boot.
