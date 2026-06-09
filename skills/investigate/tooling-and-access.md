# Tooling & access (for `investigate`)

How to reach each system, and the **read-only contract**. MCP servers are configured in the repo-root `.mcp.json` (gitignored — holds credentials).

## The read-only contract (non-negotiable during investigate)

> **Investigate observes. It never mutates.**
> No `create`, `update`, `delete`, `transition`, `move`, `batch-create/update`, `send`, or any write call against **any** production system — HubSpot, ClickUp, Make, MySQL, S3, DynamoDB. If the conclusion requires a change, **STOP** and hand off to `write-prd` / `execute-tasks` (or hand the human the exact external-console change). A read that *needs* a permission prompt is fine; a write is not.

Reproduction on **dev** MySQL is permitted **only** when read-only checks can't confirm the hypothesis, and must be **flagged in the report** ("reproduced on dev DB"). Never reproduce against prod.

## System → tool cheat-sheet

| System | Tool / location | Allowed (read-only) | Never (during investigate) |
|---|---|---|---|
| **Prod MySQL** (`platform`) | `mcp__mysql-prod__mysql_query` — enforced read-only (`claude_ro`, ALLOW_* all false) | `SELECT … FROM tours_p WHERE idString = '…'` | any DML — server rejects anyway |
| **Dev MySQL** (`platform`) | `mcp__mysql__mysql_query` — ALLOW_* true, **prompt-gated** | `SELECT …` for repro/comparison | INSERT/UPDATE/DELETE (only with explicit human OK, flagged) |
| **HubSpot** | `mcp__hubspot__*` | `hubspot-search-objects`, `hubspot-batch-read-objects`, `hubspot-list-associations`, `hubspot-get-workflow`, `hubspot-list-workflows`, `hubspot-get-property`/`list-properties`, `hubspot-get-engagement` | `*-create-*`, `*-update-*`, `transition`, `create-engagement`, `create-property` |
| **Make** | `mcp__make__*` | `scenarios_get`, `scenarios_list`, `scenarios_interface`, `executions_list`, `executions_get-detail`, `hooks_list`, `hooks_get`, `data-store-records_list`, `connections_list` | `rpc_execute` with side effects, any scenario edit/run |
| **ClickUp** | `mcp__clickup__*` | `clickup_get_task`, `clickup_get_task_comments`, `clickup_get_task_time_in_status`, `clickup_get_custom_fields`, `clickup_filter_tasks`, `clickup_search` | `clickup_create_*`, `clickup_update_*`, `clickup_move_task`, `clickup_add_*`, `clickup_delete_task` |
| **Atlassian (Jira/Confluence)** | `mcp__atlassian__*` | `getJiraIssue`, `searchJiraIssuesUsingJql`, `getConfluencePage`, `search` — to read the ticket (e.g. LHP-XXXX) | create/edit/transition/comment |
| **DynamoDB** | AWS console / api-platform code | exact partition-key read `YYYY-MM-DD-<idString>` | `contains`/non-key scans (false negatives), any put/update/delete |
| **Codebase** | `Read`, `Grep`, `Glob` | read legacy `API/` + `api-platform/src/` to confirm which code ran | editing code (that's `execute-tasks`) |
| **Browser (FE repro)** | `mcp__chrome-devtools__*` | navigate uat/prod tour, read console/network to observe behaviour | submitting forms that create prod records |

## Useful read patterns

- **A tour by idString:** prod DB `SELECT id, idString, idv0, matterport, virtualTourType, hubspotDealId, clickupId, organisationId FROM tours_p WHERE idString = '…'`.
- **A HubSpot deal + revisit flags:** `hubspot-search-objects` on `deals` filtering by `dealname`/`hs_object_id`; read props `dealstage`, `email_sent_tourdelivery`, `is_revisit_booking`, `revisit_type`, `description`; `hubspot-list-associations` (typeId 451) for revisit parent/child links.
- **A workflow's guard logic:** `hubspot-get-workflow` on `187350328`.
- **Why a ClickUp task is stuck:** `clickup_get_task` + `clickup_get_task_time_in_status` + custom fields (`VT Property URL`, `Portal Link`, `VT`, `Deal Id`); cross-check against Make scenario filters (1361500/1361501).
- **A Make scenario's behaviour:** `scenarios_get` for the blueprint, `executions_list` + `executions_get-detail` to see whether/why a run skipped a task.
- **Missing engagement analytics:** check DynamoDB `analytics`/`analytics_dev` by exact partition key for the tour's idString + date; if only the one-shot event exists, suspect the Matterport SDK referrer gate (FE), not the DB.

## Environment caveats

- **UAT data lives in the dev DB** (UAT FE → dev api-platform → dev MySQL). Don't look for a UAT-only repro in the prod DB.
- A FE fix only reaches UAT after merging into the protected **`uat`** branch (feature branch → MR → uat → Vercel rebuild). A "still broken" UAT may just be a stale deploy.
- Some prod flows still run on **legacy** code despite an api-platform port — confirm the actual code path before blaming either side.
