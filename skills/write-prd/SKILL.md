---
name: write-prd
description: Produces a product requirements document through interview, codebase exploration, and module design before implementation. Use when starting a feature or initiative, when requirements are fuzzy, or when you need a single source of truth for scope and success criteria.
---

# Write PRD

## Overview

Capture the *what* and *why* in a structured PRD. No implementation detail until this is agreed — the PRD anchors later task breakdown and execution. You may skip steps that are unnecessary for a small or already-clear initiative; use judgment.

## When to Use

- New feature, significant refactor, or cross-team initiative
- Requirements live only in chat or ad hoc notes
- You need alignment on scope, success, and out-of-scope before tasks

**When not to use:** One-line fixes, typos, or changes that are already fully specified elsewhere.

## Process

1. **Project context** — Apply `skills/_reference/project-context.md` in the target repo. If `validation.require_domain_context` is true and domain files are missing or empty, stop and report; do not draft the PRD until resolved (unless the human explicitly overrides for this session). If `<prds_dir>/prd-document.md` is already a **draft** from `init-aidlc-project` (`greenfield-prd.template.md`), treat it as the starting point: interview the human, then merge content into the **PRD Template** sections below (Problem Statement, Solution, Acceptance criteria, User Stories, etc.) instead of discarding the file. Preserve the **Project shape** decision and stack notes unless the human changes them.
2. **Clarify** — Ask for a detailed description of the problem and any solution ideas. Ask until these are concrete: primary users, must-haves vs nice-to-haves, constraints (time, tech, compliance), and definition of done. If `.aidlc/project.yaml` resolved `domain.tech_stack_file` / `domain.architecture_file`, read them when clarifying constraints and decisions.
3. **Explore** — Read the repo to verify assertions and understand the current state of the codebase.
4. **Interview** — Work with the human until you share an understanding of the plan. Walk branches of the design tree and resolve dependencies between decisions.
5. **Design modules** — Sketch the major modules to build or modify. Prefer **deep modules**: a lot of functionality behind a simple, stable interface that can be tested in isolation (vs shallow modules that expose complexity). Check that modules match the human’s expectations and which modules should have tests.
6. **Surface assumptions** — List assumptions explicitly; ask the human to confirm or correct.
7. **Write the PRD** — Use the template below (adapt if the project already has a standard).
8. **Save** — Each `write-prd` run creates **one new folder** `docs/<prd-slug>/` (short kebab-case `prd-slug`, e.g. `login-and-welcome-ui`). Write **two PRD files** — always produce both:
   - **`<prds_dir>/prd-document.md`** — English version (default `docs/<prd-slug>/prd-document.md`)
   - **`<prds_dir>/prd-document-vi.md`** — Vietnamese version (default `docs/<prd-slug>/prd-document-vi.md`)

   Both files use the same template and carry identical content and decisions — section names, headings, and all prose are translated into the respective language. Create `docs/<prd-slug>/` if needed. Task files from `create-tasks` live in **`docs/<prd-slug>/tasks/`**. After saving, update `.aidlc/project.yaml` so `paths.prds_dir`, `prd_file`, `backlog_file`, and `todo_file` point at this slug’s tree when the repo uses project context for execution (`prd_file` points at the English file `prd-document.md`; downstream skills read this file). If there is no `.aidlc/project.yaml`, only use a different layout than `docs/<prd-slug>/prd-document.md` + `docs/<prd-slug>/tasks/` when the user explicitly asks for this session or the repo already standardizes another location (e.g. `docs/prd.md`, `PRD.md` at root).
9. **Gate** — Stop and get human confirmation before `create-tasks` or any code. Do not create or update GitHub issues for PRDs as part of this skill.

## PRD Template

```markdown
# <Initiative title>

## Problem Statement

The problem from the user’s perspective — why now, what pain or opportunity.

## Solution

The solution from the user’s perspective (what we will deliver at a product level, not code).

## Acceptance criteria

Testable conditions that decide when work is done. Each criterion must be **observable** (what can be checked), not subjective intent. Number them (e.g. `AC1`, `AC2`). A PRD with no testable acceptance criteria is not a valid handoff to task creation.

**User Stories** (below) are narrative actor/benefit coverage; **Acceptance criteria** are the measurable done bar. Both belong in a PRD; do not collapse them into one list.

## User Stories

A long, numbered list of user stories:

1. As an <actor>, I want <feature>, so that <benefit>
2. ...

Cover all aspects of the feature.

## User flows (high level)

1. ...
2. ...

(Optional if flows are already clear from user stories.)

## Goals

- ...

## Non-goals / out of scope

- ...

## Implementation Decisions

Decisions made during planning (no file paths or code snippets — they go stale):

- Modules to build or modify and their interfaces
- Technical clarifications, architecture, schema, API contracts, interactions

## Testing Decisions

- What makes a good test (e.g. external behavior, not implementation details)
- Which modules will be tested
- Prior art in the codebase (similar tests)

## Dependencies & risks

Teams, systems, unknowns.

## Open questions

Numbered list; resolve before or during execution.

## Further notes

Anything else that helps execution (optional).
```

## Verification

- [ ] Both PRD files exist and are readable in-repo: `prd-document.md` (English) and `prd-document-vi.md` (Vietnamese) at the resolved `prds_dir`.
- [ ] Both files carry the same content — no section, decision, or criterion is missing from either version.
- [ ] Acceptance criteria are observable and numbered; user stories and AC are distinct.
- [ ] No implementation tickets or code mixed into the PRD at the wrong level — product/requirements and agreed technical *decisions*, not a patch list.
- [ ] Human has explicitly approved proceeding to task creation.

## Red flags

- Vague success criteria (“better UX”) without observable signals or numbered AC.
- Hiding assumptions in prose instead of an explicit list.
- Skipping non-goals and then scope-creeping later.
- Collapsing user stories and acceptance criteria into one list.
- Dumping file paths and snippets into **Implementation Decisions** (they rot quickly).
