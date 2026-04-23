# Greenfield frontend

Use this checklist when implementing or scaffolding a **frontend-only** repository.

## When to use

- `.aidlc/project.yaml` has `bootstrap.shape: frontend`, or the approved PRD states frontend-only greenfield bootstrap.

## Preferred: vendored template

Copy **`templates/react-frontend/`** from this workflows repository into the target UI root (or monorepo `apps/web/`). It includes **Vite + React + SWC**, **Tailwind**, **TypeScript** configs, **ESLint** flat config, **Zod**, and the **`src/app` / `src/features` / `src/shared`** layout. **Testing:** **Vitest 4** with **unit** (jsdom, `*.spec.tsx`) and **browser** (Playwright Chromium, `*.browser.spec.tsx`, **`vitest-browser-react`**); after install run **`npx playwright install chromium`**; see **`templates/react-frontend/README.md`**. Default Vite config is SPA-only; use `vite.config.module-federation.example.ts` when the PRD requires MFE.

## Suggested layout

- `src/app/` — App shell, routes, top-level providers.
- `src/features/<feature>/` — Feature modules (`pages/`, `components/`, `lib/`, `index.ts` barrels as needed).
- `src/shared/` — Layouts, shared components, types, data used across features.
- `src/main.tsx` — Entry.

## Checklist (agent-driven)

1. **Tooling** — `vite.config.ts`, `tsconfig.json` / `tsconfig.app.json`, `@vitejs/plugin-react-swc` (or team choice), path alias (e.g. `@/` → `src/`).
2. **Styling** — Tailwind: `tailwind.config`, `postcss.config`, `index` CSS entry; align with design system packages if used.
3. **Routing** — `react-router-dom` (or team router) with routes colocated in `src/app` or feature modules.
4. **Quality** — ESLint for React/TS; Prettier if the monorepo or team uses it.
5. **Runtime validation** — **Zod** recommended for forms, search params, and env (`import.meta.env`) when you want parse-time errors.
6. **Automated tests** — **`npm run test`** (unit + browser). Prefer **`*.spec.tsx`** under jsdom for logic and a11y; add **`*.browser.spec.tsx`** when you need real **CSS**, layout, or browser APIs. **`npm run test:browser`** keeps Chromium open (watch). **`CI=true`** runs browser tests headless. First-time: **`npx playwright install chromium`**.
7. **Auth (when the PRD requires login)** — Follow your project's domain skill (e.g. `skills/<your-auth>/SKILL.md`); copy `.env.template` → `.env` and fill auth env vars per that skill.

## Module Federation

- Only adopt if the PRD requires micro-frontend remotes; otherwise prefer a single SPA for simplicity.

## Non-goals

- Copying product-specific routes or MFE remotes from another app — reuse **folder conventions** and **build pipeline** ideas only.
