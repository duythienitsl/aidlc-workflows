---
name: test
description: Runs and strengthens automated verification — TDD for new behavior, prove-it tests for bugs, full suite before review. Use after execute-tasks changes or when validating a release candidate locally.
---

# Test

## Overview

Make automated checks the gate for “done”: new code should have tests where the project already tests similar code; regressions should be caught before review.

## When to Use

- After implementing a task or before opening a PR
- When fixing a bug — prove the bug with a failing test first when feasible
- When the human asks for confidence before review

## Process

1. **Project context** — Apply `skills/_reference/project-context.md` in the target repo. If `validation.require_domain_context` is true and domain files are missing or empty, stop and report (unless the human explicitly overrides for this session). Use `domain.tech_stack_file` when choosing test commands or conventions if it exists.
2. **Discover** — Read `package.json`, `Makefile`, or CI config for the canonical commands (`npm test`, `pnpm test`, `pytest`, etc.).
3. **New behavior** — Prefer tests that encode acceptance criteria from the task; RED → GREEN → refactor.
4. **Bug fixes** — Add a test that fails on the old behavior, passes after the fix; then run the full suite.
5. **Run** — Execute the full test suite (and lint/build if that’s standard for this repo).
6. **Report** — Summarize pass/fail, coverage gaps only if the project tracks coverage, and any flaky tests.

For UI flows that need a browser, use the project’s e2e tooling or documented manual checklist if no automation exists.

## Verification

- [ ] Relevant tests exist for the change or there is a documented reason (e.g. pure config).
- [ ] Full suite green locally (or failures explained and ticketed).

## Red flags

- “Works on my machine” without running the same commands CI runs.
- Disabling tests to go green — fix or quarantine with team agreement only.
