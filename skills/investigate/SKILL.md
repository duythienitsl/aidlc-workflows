---
name: investigate
description: Diagnoses a production issue from a symptom to a confirmed root cause across LH-v1's integrated systems (Make, HubSpot, Acuity, ClickUp, MySQL, DynamoDB, Matterport, legacy Wappi API/, api-platform NestJS, Stripe, Vertex, S3), strictly read-only, then writes a root-cause analysis that feeds the pipeline. Use when something is broken or behaving unexpectedly in prod/uat and the cause is not yet known.
---

# Investigate

## Overview

Stage 0 of the pipeline: turn a production **symptom** into a confirmed **root cause + affected scope + evidence**. You work *backwards* across LH-v1's ~12 integrated systems, gathering evidence **read-only**, never mutating production. The output is a root-cause analysis (`investigation.md`) that becomes the *Problem Statement* for `write-prd` when a fix needs planning — or a direct, scoped fix when it doesn't. Lean on the embedded playbook (`system-map.md`, `tooling-and-access.md`, `known-issues.md`) so you start from what's already known, not a blank page.

## When to Use

- A customer/internal report or alert describes broken or unexpected behaviour in **prod or uat** and the cause is unknown
- An issue spans multiple systems (a Make scenario, a HubSpot workflow, a DB record, the FE, legacy vs api-platform) and you need to localize it
- You need a defensible, evidence-backed conclusion before deciding whether to change code, config, or an external workflow

**When not to use:** The root cause is already known and the change is fully specified (go straight to `execute-tasks` or `write-prd`). Greenfield/new-feature work with no symptom to diagnose (start at `write-prd`).

## Process

1. **Load context** — Apply `skills/_reference/project-context.md` to resolve `docs/` paths. Read all three playbook files in this skill: `system-map.md` (where things live + data flows), `tooling-and-access.md` (which MCP for which system + the read-only contract), `known-issues.md` (catalog of solved RCAs). Also scan long-term memory at `~/.claude/projects/-Users-thien-hoang-Works-LH-v1/memory/` for any prior RCA touching the same system — but **verify anything a memory claims still exists** (file, table, scenario ID, workflow ID) before relying on it; memories reflect what was true when written.
2. **Intake** — Capture the symptom precisely: environment (prod/uat), affected entity IDs (tour `idString` / `idv0`, HubSpot deal id, booking id, ClickUp task, customer email), expected vs actual behaviour, and when it was first seen. If any of these are missing and matter, ask the human before guessing.
3. **Match the catalog** — Check the symptom against `known-issues.md`. If it matches a known pattern, start from that entry's hypothesis and where-to-look — don't re-derive it from scratch. Still confirm with fresh evidence (step 6); a match is a head start, not a conclusion.
4. **Triage systems** — Use `system-map.md` to identify which systems sit in the suspect path and **who owns the flow** (legacy Wappi `API/` vs api-platform `api-platform/src/`). Example: "duplicate tour-delivered email" → HubSpot workflow 187350328 + revisit booking record + the deal's `description`/`is_revisit_booking` props.
5. **Hypothesize** — Write a short, ranked list of candidate root causes. Keep it to plausible mechanisms, not a guess about a single record.
6. **Gather evidence (READ-ONLY)** — Confirm or refute each hypothesis using MCP tools and code reading per `tooling-and-access.md`. **No write/update/transition/delete call against any external system.** Record every query and its result as an evidence trail (you will paste this into the report). Prefer exact lookups (DB primary keys, DynamoDB partition keys, deal/task IDs) over broad scans.
7. **Adversarially verify** — Do not stop at the first plausible cause. Corroborate the leading hypothesis with **at least one independent signal** (a second system, a second record, a log timestamp) and actively try to rule out the runner-up. A cause you only confirmed one way is a candidate, not a conclusion.
8. **Conclude** — State the root cause, the **affected scope** (which records, how many, since when), the evidence trail, and **fix options** with rough effort/risk and *where* the fix belongs (api-platform code, legacy code, a HubSpot workflow, a Make scenario, external config).
9. **Write the report** — Save `investigation.md` to `docs/<issue-slug>/` (short kebab-case slug, e.g. `duplicate-revisit-delivery-email`) using the **Investigation Template** below. This folder is reused: if the issue proceeds to `write-prd`, the PRD lands in the same `docs/<issue-slug>/`.
10. **Handoff gate** — Branch on the conclusion and **stop for the human**:
    - **Trivial / fully specified** → propose the direct fix as a single `execute-tasks` slice (or a one-off change), naming the file/workflow/config to change. No PRD needed.
    - **Non-trivial / needs scoping** → recommend `/write-prd` in the same `docs/<issue-slug>/` folder, with this `investigation.md` as the Problem Statement input.
    - **External-only** (the fix lives in a HubSpot workflow, Make scenario, or third-party console, not the repo) → say so explicitly and hand the human the exact change; do not attempt it from the skill.
11. **Learning-loop gate** — Offer to record this issue as a new entry in `known-issues.md` (using the **Known-Issue Entry Template**), and optionally as a long-term memory file. Only append after the human confirms the conclusion. This is how the catalog compounds.

## Investigation Template

```markdown
# Investigation: <short issue title>

## Symptom
What was reported, in observable terms. Environment (prod/uat). First seen.

## Affected entities
Concrete IDs used in this investigation (tour idString, deal id, booking id, ClickUp task, customer).

## Systems in scope
Which systems were suspected and which owns the flow (legacy API/ vs api-platform), per system-map.md.

## Hypotheses
1. <candidate root cause> — ranked, with the mechanism.
2. ...

## Evidence (read-only)
Each query/check run and its result — DB rows, MCP reads, code references (file:line), timestamps.
Note which hypothesis each piece confirms or refutes.

## Root cause
The confirmed mechanism, corroborated by >=1 independent signal.

## Affected scope
Which records, how many, since when. How to identify them all (a query if possible).

## Fix options
- Option A — where it lives (code/workflow/config), effort, risk.
- Option B — ...
Recommended option and why.

## Handoff
Trivial fix | needs write-prd | external-only. The exact next step.
```

## Known-Issue Entry Template

```markdown
### <Issue title> <(ticket if any, e.g. LHP-2093)>
- **Symptom:** observable behaviour that signals this issue.
- **Systems:** the systems/flow involved (and legacy vs api-platform owner).
- **Root cause:** the confirmed mechanism.
- **Where to look:** files (`path:line`), tables, scenario/workflow IDs, partition-key formats.
- **Fix / status:** fixed where / still open / external-config.
- **Example IDs:** real entities seen (tour idString, deal id, ClickUp task) for re-verification.
```

## Verification

- [ ] `investigation.md` exists at `docs/<issue-slug>/` and follows the template (symptom, evidence trail, root cause, affected scope, fix options, handoff).
- [ ] Root cause is corroborated by at least one independent signal — not a single plausible read.
- [ ] No mutating call was made against any production system during the investigation.
- [ ] The handoff branch (trivial / write-prd / external-only) is stated with the concrete next step.
- [ ] The learning-loop gate was offered; if the human accepted, a `known-issues.md` entry was appended.

## Red flags

- **Any** write/update/transition/delete against prod (HubSpot, ClickUp, Make, MySQL) — investigation is observe-only; route mutations to `write-prd`/`execute-tasks`.
- Stopping at the first plausible cause without an independent corroborating signal.
- Confusing legacy Wappi `API/` ownership with api-platform — many flows are mid-port; confirm which code actually ran in prod.
- Concluding from a memory/catalog entry without re-verifying the IDs still exist.
- DynamoDB `contains`/non-key scans instead of exact partition-key lookups (false "no results").
- Writing the report without the entity IDs that prove it (an RCA with no evidence trail is a guess).
