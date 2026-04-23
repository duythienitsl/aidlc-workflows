# React + Vite template

- `tsconfig*` / Tailwind / PostCSS — standard Vite + React setup.
- Default **`vite.config.ts`** is a simple SPA (no Module Federation). For MFE, add a separate `vite.config.module-federation.ts`.
- `eslint.config.js` flat config for TypeScript + React.
- **Zod** included in `package.json` for runtime validation.
- Folder pattern: `src/app/`, `src/features/`, `src/shared/`.
- **`.env.template`** — Copy to **`.env`** and fill in your environment values.

Copy into `apps/web` or a standalone UI package, install deps, rename `package.json` `name`.

## Tests (Vitest: unit jsdom + browser Chromium)

- **Stack** — **Vitest 4** with two **projects**: **unit** (`*.spec.ts(x)` except `*.browser.spec.*`, **jsdom**) and **browser** (`*.browser.spec.*`, **Chromium** via **`@vitest/browser-playwright`** + **`vitest-browser-react`**). **`vitest.browser.setup.ts`** imports **`src/index.css`** so Tailwind resolves in real-browser assertions (`getComputedStyle`).
- **First install** — after **`npm install`** / **`bun install`**, run **`npx playwright install chromium`** once (Playwright browser binary).
- **`npm run test`** — **`vitest run`**: unit + browser, headless when **`CI=true`**.
- **`npm run test:browser`** — watch **browser** project only; Chromium stays open for inspection (**Ctrl+C** to exit).
- **`npm run test:browser:run`** — one-shot browser tests (exits and closes Chromium).
- **`npm run test:unit`** — jsdom only.
- **`npm run test:ui`** — Vitest UI.
- **Conventions** — Co-locate **`MyWidget.spec.tsx`** (fast, jsdom) vs **`MyWidget.browser.spec.tsx`** (real layout/CSS/interaction). Use **`await render(...)`** with **`vitest-browser-react`** (async API).

## Auth

If the PRD requires login, add a domain skill under `skills/<your-auth>/SKILL.md` and follow it during `execute-tasks`. Copy `.env.template` → `.env` and fill in the auth env vars required by that skill.
