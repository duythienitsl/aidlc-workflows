---
description: Diagnose a production issue from symptom to root cause across LH-v1's systems (read-only) — Stage 0 before write-prd
---

Read and follow the skill at `skills/investigate/SKILL.md` in this repository.

## MANDATORY process — do not skip any step

1. **Read** `skills/investigate/SKILL.md` fully, plus its three playbook files: `skills/investigate/system-map.md`, `skills/investigate/tooling-and-access.md`, `skills/investigate/known-issues.md`.
2. **Intake** the symptom — environment (prod/uat), affected entity IDs (tour `idString`, deal id, booking id, ClickUp task, customer), expected vs actual, first seen. Ask if anything material is missing.
3. **Match the catalog** in `known-issues.md`; **triage** which systems own the flow (legacy `API/` vs api-platform) via `system-map.md`.
4. **Gather evidence READ-ONLY** per `tooling-and-access.md` — record every query and result. **No write/update/transition/delete against any production system.**
5. **Adversarially verify** — corroborate the root cause with at least one independent signal before concluding.
6. **Write** `docs/<issue-slug>/investigation.md` (template in SKILL.md).
7. **Handoff gate** — branch: trivial → propose a direct `execute-tasks` fix; non-trivial → recommend `/write-prd` in the same `docs/<issue-slug>/`; external-only → hand the human the exact console change.
8. **Learning-loop gate** — offer to append this issue to `known-issues.md` (and optionally a memory file) after the human confirms.

> **Anti-patterns to avoid:**
> - Any mutating call against prod (HubSpot, ClickUp, Make, MySQL) — investigation is observe-only; route fixes to `write-prd` / `execute-tasks`.
> - Stopping at the first plausible cause without an independent corroborating signal.
> - Trusting a memory/catalog ID without re-verifying it still exists.
> - DynamoDB `contains`/non-key scans instead of exact partition-key lookups.
> - Jumping to a fix (editing code/config) — that's a later stage, not `investigate`.