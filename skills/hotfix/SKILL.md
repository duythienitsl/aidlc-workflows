---
name: hotfix
description: Patches production outside the sprint cycle across LH-v1's repos (api-platform, platform, infrastructure) — asks which repo, resolves the next production version, cuts the hotfix branch from origin/main, applies and verifies the fix, then syncs the same fix back into the working branch and opens the resulting Merge Requests. Use when something is broken in production and the fix cannot wait for the next sprint release.
---

# Hotfix

## Overview

A hotfix is a patch that goes **straight to production**, bypassing the sprint release cut. It leaves two obligations behind: the fix must reach `main`, and the *same* fix must reach the working branch (`dev` / `develop`) so the next sprint release does not overwrite it.

This skill runs that whole cycle: pick the repo, derive the next production version, cut the branch, apply and verify the fix, then open **two** Merge Requests (one into `main`, one into the working branch). `infrastructure` is the exception and gets a single MR.

The skill **never merges** an MR. Review stays a human gate.

## When to Use

- Production is broken (or actively harmful) and the fix cannot wait for the next sprint release
- A patch already merged to `main` needs to be carried back into `dev` / `develop`

**When not to use:**

- Cutting a sprint release — that is `/release` (`release/1.xx.0` from `dev` / `develop`).
- Ordinary feature or bug work headed for the next sprint — that is `/create-mr` (feature branch into `dev` / `develop`).
- The cause of the production issue is not yet known — run `/investigate` first, read-only, then come back here.

## Hard rules

- **Scope every git command to the sub-repo** with `git -C <repo> …`. Never run git from the LH-v1 root.
- **Never commit from the LH-v1 root repo.** `docs/` and `.aidlc/` there stay dirty for the human's per-sprint commit.
- **No `Co-Authored-By` trailer** in any commit message.
- **Never merge, approve, or deploy an MR.** Open it and leave it for review.
- **Never guess the target repo.** Ask (step 1).
- Both `git@lh-brian:little-hinges1/…` remotes are **GitLab**. `glab` is not installed and `gh` is GitHub-only, so Merge Requests are opened via **git push options**, never a CLI.
- Read version and branch state from **`origin/*`**, never from local branches — the local `main` in both app repos is stale.

## Repo matrix

| Layer | Repo | Branch from | Hotfix branch | Sync branch | Sync base | MRs |
|-------|------|-------------|---------------|-------------|-----------|-----|
| Backend (BE) | `api-platform/` | `origin/main` | `release/<new>` | `sync/release.<new>` | `origin/dev` | 2 |
| Frontend (FE) | `platform/` | `origin/main` | `release/<new>` | `sync/release.<new>` | `origin/develop` | 2 |
| Infrastructure | `infrastructure/` | `origin/main` | `hotfix/LHP-XXXX` | none | none | 1 |

`infrastructure` is Terraform: it has no `dev` branch and no `package.json`, so it gets no version bump and no sync branch. See **Infrastructure variant** below.

---

## Step 1 — Resolve the target repo(s)

Raw argument: `$ARGUMENTS`

Parse it for:

- A ticket like `LHP-2260` (case-insensitive) → the ticket id.
- A repo hint:
  - `BE`, `backend`, `api-platform`, `api`, `nest` → **api-platform**
  - `FE`, `frontend`, `platform`, `next`, `web` → **platform**
  - `infra`, `infrastructure`, `terraform` → **infrastructure**
- The rest → a description of what is broken.

**If the argument does not clearly identify a repo, STOP and ask the human**, offering `api-platform` (BE), `platform` (FE), and `infrastructure` as a **multi-select** — a hotfix may legitimately span backend and frontend. Do **not** infer the repo from the description, from the last repo you touched, or from which files happen to be dirty.

Nothing in this step touches git. No fetch, no checkout, no branch — the repo question comes first.

State back to the human, before continuing: the resolved repo(s), the ticket id (or that there is none), and your one-line understanding of the fix. Then process each selected repo **in turn**, independently.

---

## Step 2 — Preflight (per repo)

Run these and abort with a clear message if any fail:

1. **Working tree is clean** — `git -C <repo> status --porcelain` is empty. If it is dirty, stop and show the human. Never stash or discard their work.
2. **Fetch** — `git -C <repo> fetch origin --prune`.
3. **`origin/main` exists.** For app repos also confirm `origin/dev` (api-platform) or `origin/develop` (platform) exists, since step 9 needs it.

If a sprint release MR into `main` is currently open, **warn** the human (the version you are about to claim may collide with it) but do not block — they decide.

---

## Step 3 — Resolve the hotfix version (app repos only)

Skip this entirely for `infrastructure`.

Read **two** sources and reconcile them:

- **Source A — what is deployed:**
  ```bash
  git -C <repo> show origin/main:package.json      # read the "version" field
  ```
- **Source B — the highest release branch on the remote:**
  ```bash
  git -C <repo> branch -r | grep -oE 'release/[0-9]+\.[0-9]+\.[0-9]+'
  ```
  Compare **numerically, segment by segment** — never as strings, or `1.94.10` sorts below `1.94.9`.

Then:

| Case | What to do |
|------|------------|
| A and B agree | Use it as the baseline and continue. |
| A and B disagree | **STOP.** Show both values, say which is which, and ask the human which baseline to use. Do not auto-pick — a mismatch usually means someone forgot a bump, and guessing wrong ships the wrong version number. |

The **new version increments the last segment by one**. Worked example: `origin/main` is on `1.94.5` and the highest remote branch is `release/1.94.5`, so the hotfix is **`release/1.94.6`**.

If `origin/release/<new>` already exists on the remote, warn the human and ask whether to (a) update the existing branch, or (b) pick a different version. Wait for their answer.

State the resolved version and branch name back before continuing.

---

## Step 4 — Cut the hotfix branch

```bash
git -C <repo> checkout -B release/<new> origin/main
```

Always from **`origin/main`**. The local `main` in both app repos is stale and cutting from it silently ships old code to production. Same rule for `infrastructure` (see the variant below), which uses `hotfix/LHP-XXXX` instead.

---

## Step 5 — Apply the fix and record its SHA

Apply the patch by whichever route fits:

- **Write it here** when the cause is already understood (from `/investigate`, from the human's description, or from your own reading of the code). Keep it minimal — a hotfix is the smallest change that stops the bleeding, not a refactor.
- **Cherry-pick it** when the fix already exists as a commit on a feature branch or on `dev`: `git -C <repo> cherry-pick <sha>`.

Stage deliberately — explicit paths, not `git add -A`, so nothing unrelated is swept in. Then commit:

```bash
git -C <repo> commit -m "fix(LHP-XXXX): <what the patch does>"
```

**Record the resulting SHA immediately** (`git -C <repo> rev-parse HEAD`). If the fix took several commits, record all of them, in order. That list is the **only** input to the cherry-pick in step 9 — losing it means redoing the sync by hand.

No `Co-Authored-By` trailer.

---

## Step 6 — Gates (before anything is pushed)

This code goes straight to production, so it is verified at least as strictly as an ordinary feature MR. Run all four, from inside the repo:

```bash
npx tsc --noEmit
./node_modules/.bin/eslint <the files you touched>
npx jest <the suites covering your change>
npm run build                       # production build
```

- **Always use `./node_modules/.bin/eslint`.** A global ESLint 9 shadows the repo's local ESLint 8; a bare `eslint` or `npx eslint` lints against the wrong config.
- **Production build is not optional here.** A type-clean change can still fail a Next.js or Nest build, and there is no staging step between this branch and production.

### Separating pre-existing failures

Not every red result is yours. Confirm ownership before acting:

```bash
git -C <repo> stash -u
# re-run the failing check on the clean base
git -C <repo> stash pop
```

If it fails on the clean base too, it is **pre-existing**: report it plainly and continue. Known cases, both pre-existing and neither a blocker:

- `api-platform` — a full `tsc --noEmit` surfaces roughly 15 errors confined to unrelated `*.spec.ts` files; `tsconfig.build.json` is clean. Verify your own files are error-free and that you added none.
- `platform` — `bookingFormDateTimeSection.test.ts` already fails one assertion on `develop`. Never block on it and never "fix" it inside a hotfix.

If the failure **is** yours and you cannot resolve it quickly, **stop and report**. Do not push red.

### Husky / lint-staged

The `pre-commit` hook prints a `husky - DEPRECATED` banner — that is a **warning, not a failure**; ignore it. It then runs lint-staged, which auto-fixes and re-stages. If the commit genuinely aborts, read the real error, fix the source, re-stage, and retry. **Do not use `--no-verify`** unless the human explicitly asks — the hook is the team's quality gate.

---

## Step 7 — Bump the version (separate commit, app repos only)

Set the `version` field in the repo's `package.json` to the new version — a targeted edit of that one line, no reformatting. Then commit it **on its own**:

```bash
git -C <repo> add package.json
git -C <repo> commit -m "chore(release): <new>"
```

**Why this must be a separate commit:** step 9 cherry-picks the fix into a branch based on `dev` / `develop`, and those branches are deliberately never version-bumped (`api-platform` `dev` sits on an older version, `platform` `develop` on an unrelated one entirely). Bundling the bump with the fix drags a wrong `package.json` into the working branch. Keeping them apart is what makes the sync a clean, single-purpose cherry-pick.
