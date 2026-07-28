---
description: Patch production outside the sprint cycle — cut release/1.xx.x from main, verify, then sync the same fix back into dev/develop and open both MRs
argument-hint: "optional: LHP-XXXX, a repo (BE / FE / infra), and what is broken — e.g. LHP-2260 BE cancellation SMS not sending"
---

Read and follow the skill at `skills/hotfix/SKILL.md` in this repository.

## MANDATORY process — do not skip any step

1. **Read** `skills/hotfix/SKILL.md` fully before touching git.
2. **Resolve the target repo(s)** — if the argument does not clearly say BE (`api-platform`), FE (`platform`), or `infrastructure`, **STOP and ask** with a multi-select. Never guess.
3. **Preflight and resolve the version** — clean tree, `fetch --prune`, then cross-check `origin/main:package.json` against the highest remote `release/*` branch. If they disagree, **stop and ask**.
4. **Cut the hotfix branch from `origin/main`** — never from the local `main`, which is stale.
5. **Apply the fix, then gate it** — tsc, local eslint, the relevant tests, and a production build. Straight-to-prod code is verified at least as strictly as a feature MR.
6. **Keep the fix commit separate from the `chore(release)` version bump** — the sync step cherry-picks only the fix.
7. **Push and open MR #1** into `main` via git push options, with blast radius and rollback in the description.
8. **Sync back** — cut `sync/release.<version>` from `dev`/`develop`, cherry-pick only the fix SHAs, open MR #2.
9. **Report** — every branch, both MR URLs, blast radius, rollback, and merge ordering when several repos changed.

> **Anti-patterns to avoid:**
> - Guessing which repo to patch instead of asking.
> - Cutting the hotfix branch from a local `main` or from `dev`/`develop`.
> - Merging the fix branch into the sync branch (it drags the version bump into `dev`).
> - Auto-resolving a cherry-pick conflict, or pushing with a gate you broke still red.
> - Merging, approving, or deploying any MR — review is a human gate.
