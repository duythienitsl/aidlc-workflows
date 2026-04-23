---
name: review
description: Structured review of recent changes for correctness, maintainability, architecture, security, and performance. Use before merge or when the human wants a quality pass on a branch or diff.
---

# Review

## Overview

Review the *current* change set (staged diff, branch vs main, or recent commits) as a human would: specific, actionable, prioritized.

## When to Use

- Before merge or after a batch of `execute-tasks` work
- When the human asks for a quality or security pass

## Process

1. **Project context** — Apply `skills/_reference/project-context.md` in the target repo. If `validation.require_domain_context` is true and domain files are missing or empty, stop and report (unless the human explicitly overrides for this session).
2. **Deep checklist (optional but recommended)** — Read and apply `skills/playbooks/code-review-and-quality/SKILL.md` when this repo vendors `skills/playbooks/` — use it for breadth (security, maintainability, naming). Merge its outputs with the steps below; this playbook does **not** replace the `review` skill, it deepens it.
3. **Scope** — Identify what to review (files, commits, or PR). If unclear, default to `git diff` against the base branch.
4. **Correctness** — Matches PRD/task acceptance? Edge cases? Error handling?
5. **Readability** — Names, structure, duplication, comments only where they add signal.
6. **Architecture** — Fits existing patterns; boundaries; no unnecessary coupling. If `domain.architecture_file` exists, check the diff against those rules explicitly.
7. **Security** — Inputs validated, secrets out of code, authz/authn as required for the change.
8. **Performance** — Hot paths, N+1, unbounded work — only where relevant to the diff.
9. **Output** — Findings grouped **Critical / Important / Suggestion** with file:line references and concrete fixes.

Optional: note test gaps and suggest one test per serious risk.

## Verification

- [ ] Review references specific locations, not vague praise or blame.
- [ ] Critical issues are called out before merge.

## Red flags

- Style-only nits when behavior is wrong — prioritize correctness.
- No file:line references — hard for humans to act on.
