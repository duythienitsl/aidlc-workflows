# LH-v1 system map (for `investigate`)

Where things live and how data flows, so triage starts from the right place. Treat IDs/paths as **leads to verify**, not gospel — the backend is mid-port and details drift. Re-confirm a file path, table, scenario, or workflow ID before you build on it.

## Backends — legacy vs api-platform (the #1 triage question)

LH-v1 runs **two backends in parallel** during an ongoing port. Always establish *which one actually ran in prod* for the flow you're chasing.

- **Legacy Wappi** — `API/API/<Domain>/<Action>/<version>/` (e.g. `API/API/Webhook/ClickUpWatchTaskMoved/1.0.0/`, `API/API/Bookings/RevisitBooking/1.0.0/`, `API/API/Analytics/Collect/1.0.0/`). Versioned action folders. Some flows **still run here in prod** even though an api-platform port exists (e.g. ClickUp "Ready For Portal" webhook).
- **api-platform (NestJS)** — `api-platform/src/<module>/`. Modules include: `acuity`, `additional-assets`, `analytics`, `appointment`, `auth`, `bookings`, `corelogic`, `depreciation-form`, `feature-flags`, `global-platform`, `hubspot`, `llm`, `matterport`, `notifications`, `payment`, `tour`, `user`, `webhooks`. Shared integrations under `api-platform/src/shared/integrations/` (`acuity`, `clickup`, `corelogic`, `dynamodb`, `posthog`, `sms`, `stripe`, `aws`). Data via Prisma → MySQL (`api-platform/prisma/schema.prisma`). Config in `api-platform/src/config/configuration.ts` + `validation.schema.ts`.
- **Frontend** — `platform/` (Next.js). FE work lands on the **`uat` branch** (Vercel deploys uat from it). UAT FE calls **dev** api-platform (`https://dev-api.littlehinges.com/api/api-platform`) → **dev** MySQL.

## Data stores

- **MySQL `platform`** (AWS RDS, ap-southeast-2). Dev and prod instances — see `tooling-and-access.md`. Key tables (Prisma `*_p` suffix):
  - `tours_p` (id, idString, idv0, matterport, virtualTourType, uploadTime, hubspotDealId, clickupId, organisationId)
  - `bookings_p`, `revisit_bookings_p`, `flexi_bookings_p`
  - `analytics_overview_p` (propertyIdString, views, avgSessionTime, engagedVisitor, repeatVisitor, totalVisitor, totalInspections, roomAnalytics), `interaction_p` (sessionId, idv0, ip, data JSON, interactionTime, interactionType), `reports_*_p`
  - `users_p`, `organisation_p`, `groups_p`, `groupMembers_p`, `product_p`, `additional_assets_p` / `additional_asset_orders_p`
  - GVX/CoreLogic/depreciation: `tour_rooms_*_gvx`, `tours_estimates_p`, `matterport_floorplans_p`, `depreciation_*_p`
- **DynamoDB** (ap-southeast-2): `analytics` (prod) / `analytics_dev` (dev) raw events + `analytics_results` aggregates. **Partition key = `YYYY-MM-DD-<propertyIdString>` (idString)**. Query by **exact partition key**, never `contains`/non-key scan (Console PartiQL paginates → false "No results").
- **S3** — tour assets/thumbnails (`{idString}/images/thumbnail.jpg`), presigned URLs in tour links.

## External systems & flows

### Make.com (team 355593 / org 886535; ClickUp workspace 3463095, space 3543990, Scans folder 5615422, "New Bookings List" 156642034)
- **1361500 "Notify | Send Tour Delivery Email (new)"** — polls every 10 min, `watchTasksPolling` on ClickUp status **"full suite ready"**. A `BasicRouter` (module 86) routes on custom fields (`VT Property URL`, `Portal Link`, `VT=True`). **No fallback route** — a task matching none (e.g. Global Platform tasks whose tour link is only in the *description*, not the form fields) is silently skipped → status never advances past "full suite ready".
- **1361501 "Update HS Deals for FS Complete in ClickUp"** — polls every 4h. Filters ClickUp statuses **["fsr email sent","fs complete","booking completed"]** only. For each, looks up the HS deal by custom field `Deal Id`; if `dealstage != 5892159` ("Full Suite Sent") sets it. **Does NOT set closedate.**

### HubSpot
- LH platform only **sets deal props**; HubSpot **workflows** send the emails.
- **Deal stages:** `4516088` = Ready For Portal / Scan Completed; `5892159` = Full Suite Sent; `12559175` = Cancelled (Bookings); `27598356` = Revisit.
- **Workflow 187350328 "EMAIL | Service Delivery - Tour Delivery (VT)"** — sends the "assets delivered" email. Enrolls when `dealstage=4516088` AND `email_sent_tourdelivery=false`. Its **only** revisit exclusion is `description DOES_NOT_CONTAIN ["vidsta","revisit","extended hosting"]` — a free-text guard (see known-issues: revisit deals never write `description`).
- Revisit deals carry `is_revisit_booking=Yes`, `revisit_type`, `dealname` "… - Revisit"; linked to parent via association **typeId 451**.
- HubSpot records property history only on a *value change* — a re-fire on an already-delivered deal leaves no footprint.

### Acuity Scheduling
- api-platform `api-platform/src/acuity/` + `shared/integrations/acuity/`; legacy `API/API/Acuity/*`. `calendarId` = technician calendar, `appointmentTypeId` = service type (varies by state). Postcode→type map in `appointment_type_postcodes_p`; flexi in `flexi_booking_settings_p`. Creds `ACUITY_USER_ID` / `ACUITY_API_KEY`. (No Acuity MCP — inspect via code + DB + Make scenarios that touch Acuity.)

### ClickUp
- api-platform `shared/integrations/clickup/`; legacy webhook `API/API/Webhook/ClickUpWatchTaskMoved/1.0.0/`. Tasks created on booking/add-on order; bidirectional via `tours_p.clickupId`. Custom-field registry: `api-platform/src/webhooks/helpers/clickup-custom-fields-registry.data.ts`.

### Matterport
- SDK loaded in FE `platform/src/components/tour/virtualTourScreen.tsx` (~L421), key from `NEXT_PUBLIC_MATTERPORT_SDK_KEY` (`8kyczd0qmdk64p4zr2a29kqqc`), **referrer-restricted** to prod domain. On a non-prod domain, `MP_SDK.connect()` rejects → `setTourLoaded(true)` never runs → SDK-gated analytics (10s "User Time Spent", "Inspection Started", "Tour Loading Started") never fire.

### Others
- **Stripe** (`shared/integrations/stripe/`, payment intents/sessions), **CoreLogic** (AVM → `tours_estimates_p`), **Vertex AI / GVX** (room analysis → `tour_rooms_*_gvx`), **PostHog** (FE captures with `source:'FE'`; BE capture intentionally disabled in `AnalyticsService.collect`), **Mailgun**, **SMSGlobal**, **Google Places**.

## Analytics / insights flow (common issue area)

FE `platform/src/components/insights/propertyInsightsScreen.tsx` + `analyticsFunctions/getVisitorAnalytics.tsx` → reads aggregates. Collection: FE `platform/src/API/requests/analyticsCollect.ts` → api-platform `analytics/analytics.service.ts` `collect()` → DynamoDB raw → nightly `analytics-orchestrator.service.ts` → `analytics_overview_p`.

Metric formulas (insights screen):
- **Unique** = Σ daily `visitors`
- **Engaged** = Σ daily `engaged` (loaded + inspection started + >5s)
- **Repeat** = Σ daily `repeat` (multi-window in one session)
- **Avg Session Time** = `Σ totalSession / count(days with sessions)`
- Missing dates in range are filled `y:0`.

If engagement metrics are zero but the one-shot "Visitor Analytics" event exists → suspect the Matterport SDK referrer gate (analytics never collected), not the aggregation.
