# LH-v1 known issues (RCA catalog)

A growing catalog of solved production issues — symptom → root cause patterns — so a recurring issue is recognized, not re-derived. `investigate` reads this during triage (step 3) and appends to it at the end (step 11) after the human confirms a new conclusion.

**Append new entries using this template** (keep newest at the bottom of the relevant area; re-verify IDs before trusting an old entry):

```markdown
### <Issue title> <(ticket if any, e.g. LHP-2093)>
- **Symptom:** observable behaviour that signals this issue.
- **Systems:** the systems/flow involved (and legacy vs api-platform owner).
- **Root cause:** the confirmed mechanism.
- **Where to look:** files (`path:line`), tables, scenario/workflow IDs, partition-key formats.
- **Fix / status:** fixed where / still open / external-config.
- **Example IDs:** real entities seen, for re-verification.
```

> Seeded from long-term memory RCAs. Each was confirmed once; treat as a strong lead and re-verify the specific IDs/paths still exist before concluding.

---

## Delivery / HubSpot / Make

### Tour stuck at "full suite ready", HS deal stage never advances (LHP-2093)
- **Symptom:** ClickUp scan task sits at status "full suite ready"; the HubSpot deal stays on its prior stage (e.g. "Scan Booked"/`appointmentscheduled`) with no Close Date; no delivery email.
- **Systems:** Make scenarios 1361500 → 1361501; ClickUp; HubSpot. (Automation lives in Make, not the repo.)
- **Root cause:** Make **1361500** has a `BasicRouter` with no fallback route — Global Platform tasks whose tour link is only in the ClickUp *description* (not the `VT Property URL` / `Portal Link` form fields) match no route and are silently skipped, so the status never advances. Because the task never reaches "fsr email sent"/"fs complete", **1361501** (which only watches those statuses) never runs → deal stage never set to `5892159`.
- **Where to look:** Make `scenarios_get` 1361500 (module 86 router) + 1361501 (status filter `["fsr email sent","fs complete","booking completed"]`); ClickUp custom fields `VT Property URL`, `Portal Link`, `VT`, `Deal Id`; HS deal stage (`5892159` = Full Suite Sent). Team 355593 / org 886535.
- **Fix / status:** external — fix the Make 1361500 router (add a fallback / read the link from description). Not a repo change.
- **Example IDs:** Global Platform tours whose links live only in the description field.

### Duplicate "tour delivered" email on revisit bookings
- **Symptom:** Customer gets a second "your assets have been delivered" email when a **revisit** re-scan is delivered.
- **Systems:** HubSpot workflow 187350328; revisit deal records; revisit builders (api-platform + legacy).
- **Root cause:** The email is sent by HubSpot workflow **187350328**, which enrolls a deal at `dealstage=4516088` AND `email_sent_tourdelivery=false`. Its **only** revisit guard is `description DOES_NOT_CONTAIN ["vidsta","revisit","extended hosting"]` — but revisit deals **never write `description`** (api-platform `buildRevisitHubspotProperties` and legacy `API/API/Bookings/RevisitBooking` both omit it). The "revisit" signal lives only in `dealname`/`is_revisit_booking`/`revisit_type`, which the workflow doesn't inspect → guard passes → revisit gets the email. (HubSpot dedupes near-simultaneous identical sends, so you may see 2 enrollments but 1 delivered duplicate.)
- **Where to look:** `hubspot-get-workflow` 187350328 (guard); deal props `dealstage`, `email_sent_tourdelivery`, `is_revisit_booking`, `revisit_type`, `description`; associations typeId 451 (revisit↔parent). HubSpot only logs property history on a value change — a re-fire on an already-delivered deal leaves no footprint.
- **Fix / status:** durable fix is HubSpot-side (exclude on `is_revisit_booking=Yes` / revisit pipeline, not free-text), and/or ensure revisit deals don't enter stage 4516088 with `email_sent_tourdelivery=false`. Tracked under `docs/fix-revisit-gaps/`.
- **Example IDs:** deal 58373959250 (CAMP HILL); revisit deals 59159531164 + 59231105829 (delivered 28/05); contact marlini.patel@raywhite.com.

## Tours / portal assets

### "No Value Found" matterport + wrong thumbnail on a no-Matterport tour
- **Symptom:** A transfer-to-us / global add-on tour (customer supplied no Matterport ID) shows a **wrong** thumbnail in the portal and has `tours_p.matterport="No Value Found"` (literal text, not NULL); the "COMING SOON" badge is suppressed.
- **Systems:** **legacy** `API/API/Webhook/ClickUpWatchTaskMoved/1.0.0/` (still live in prod); Matterport GraphQL; S3.
- **Root cause:** On "Ready For Portal", the legacy handler runs unconditionally: `getCustomFieldValue('Matterport VT-IDs')` returns the sentinel `"No Value Found"` → written to `tours_p.matterport`; then `GetMatterportThumbnailImage("No Value Found")` calls the plural `models(query: "id: No Value Found")` SEARCH (not the singular `model(id:)` lookup, which 404s), which returns an arbitrary ranked model → a **wrong** image uploaded to `{idString}/images/thumbnail.jpg`. FE renders it because `'No Value Found' !== ''`.
- **Where to look:** legacy `helpers/getCustomFieldValue.ts:8`, `helpers/addMatterportIdsToDB.ts:54`; api-platform guards `webhooks.service.ts:2205` (`matterportRaw === 'No Value Found' → false`) and `helpers/clickup-ready-for-portal.helpers.ts:251` (`if (!matterportId) SKIPPED`).
- **Fix / status:** fixed in api-platform port; stops after the legacy→api-platform cut-over for this webhook. Until then prod still hits legacy.
- **Example IDs:** tour `6_Chilott_Ct-_Bushland_Beach_QLD_4818-_Australia` (ClickUp SCAN-103352).

## Analytics / insights

### Missing engagement analytics ("User Time Spent" etc.) on non-prod domains
- **Symptom:** On UAT (or any non-prod domain), a tour collects only the one-shot "Visitor Analytics" event; the 10s "User Time Spent", "Inspection Started", "Tour Loading Started" never appear → insights engagement metrics read as zero.
- **Systems:** Matterport SDK (FE); analytics collection → DynamoDB. Not a code diff.
- **Root cause:** Matterport SDK key `8kyczd0qmdk64p4zr2a29kqqc` (`NEXT_PUBLIC_MATTERPORT_SDK_KEY`) is **referrer-restricted to the prod domain**. On `uat.platform.littlehinges.com` the console shows `Key/referrer mismatch`, `MP_SDK.connect()` rejects (swallowed by `catch`), so `setTourLoaded(true)` never runs and the `sendTimeData()` 10s loop (gated by `if (tourLoaded)`) no-ops forever.
- **Where to look:** FE `platform/src/components/tour/virtualTourScreen.tsx` (~L421 connect, ~L439 setTourLoaded); browser console for the mismatch; DynamoDB `analytics_dev` by exact partition key `YYYY-MM-DD-<idString>`.
- **Fix / status:** external config — add the non-prod domain to the SDK key allowlist (Matterport → Settings → Developer Tools), or use a UAT-specific key. Optional code hardening: `setTourLoaded(true)` in the connect `catch`.
- **Example IDs:** any tour viewed on `uat.platform.littlehinges.com`.

### Insights metric formulas & DynamoDB partition-key gotcha (reference)
- **Symptom:** Insights numbers look wrong/misaligned, or a DynamoDB query returns false "No results".
- **Systems:** FE insights screen; DynamoDB; `analytics_overview_p`.
- **Root cause / reference:** Formulas — Unique = Σ daily `visitors`; Engaged = Σ daily `engaged` (loaded + inspection + >5s); Repeat = Σ daily `repeat`; Avg Session Time = `Σ totalSession / count(days with sessions)`; missing dates filled `y:0`. DynamoDB partition key is **`YYYY-MM-DD-<idString>`** — query by **exact** key; `contains`/non-key scans paginate in the Console and show false "No results".
- **Where to look:** FE `platform/src/components/insights/propertyInsightsScreen.tsx`, `analyticsFunctions/getVisitorAnalytics.tsx`; api-platform `analytics/analytics.service.ts`, `analytics-orchestrator.service.ts`.
- **Fix / status:** reference, not a bug — use when validating insights numbers.

### PostHog backend capture intentionally disabled (do-not-"fix")
- **Symptom:** api-platform doesn't emit PostHog events from `AnalyticsService.collect`; might look like a missing-events bug.
- **Systems:** api-platform analytics; PostHog.
- **Root cause:** The `${eventName} - BE` capture block in `api-platform/src/analytics/analytics.service.ts` `collect()` is **intentionally** commented out — the FE already captures the same event with `source:'FE'` (`platform/src/API/requests/analyticsCollect.ts`); BE capture would duplicate during the legacy→api-platform port.
- **Where to look:** `analytics.service.ts` `collect()`; the matching `it.skip` in `analytics.service.spec.ts`.
- **Fix / status:** **not a bug — do NOT uncomment without explicit user approval.** Recorded so investigations don't "fix" it.
- **Example IDs:** n/a.

## Environment caveats (not bugs, but common red herrings)

### UAT data is in the dev DB; FE ships via the `uat` branch
- UAT FE (`uat.platform.littlehinges.com`) → **dev** api-platform (`https://dev-api.littlehinges.com/api/api-platform`) → **dev** MySQL. Don't hunt a UAT repro in the prod DB.
- FE fixes reach UAT only after merging into the **protected `uat` branch** (feature branch → MR → uat → Vercel rebuild). A "still broken" UAT is often a stale deploy — check the last uat deploy time vs the merge, redeploy + hard-refresh before assuming the fix is wrong.
