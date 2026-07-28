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
