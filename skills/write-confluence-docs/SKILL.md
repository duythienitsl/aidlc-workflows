---
name: write-confluence-docs
description: Produces a Confluence-ready explainer document for a feature, ticket, workflow, or domain — in both English and Vietnamese (parallel `<slug>.md` and `<slug>-vi.md` files). Use when the user wants a narrative document, readable by non-technical stakeholders, to publish to Confluence or share as markdown. Input can be a feature name, a Jira ticket URL/key, an existing PRD, or a code area. Distinct from `write-docs` (which produces vector-DB chunks).
---

# Write Confluence Docs

## Overview

Produce two parallel self-contained documents — one English (`<slug>.md`) and one Vietnamese (`<slug>-vi.md`) — that explain a feature, ticket, workflow, or domain to a mixed audience including non-technical readers. Each file pastes cleanly into Confluence or can be published via the Atlassian MCP.

Bilingual is the default. The same source material drives both files. The Vietnamese file is not a rough translation — it follows the Vietnamese style rules in [style-guide.md](style-guide.md#vietnamese-version-rules) (plain professional Vietnamese, LH product terms kept in English, standard heading translations).

This skill is the human-readable counterpart to [write-docs](../write-docs/SKILL.md):

| Aspect | `write-docs` | `write-confluence-docs` (this skill) |
|---|---|---|
| Reader | AI / vector retrieval | Humans, including non-technical |
| Format | 100–300 line chunks, YAML frontmatter | Narrative, TOC, sections, Mermaid diagrams |
| Output path | `docs/lh-knowledge-base/NN-*.md` | `docs/confluence/<slug>.md` + `<slug>-vi.md` |
| Languages | English only | English + Vietnamese (parallel files) |
| Tone | Dense, schema-first | Plain professional, why-before-how |
| Source | Code only | Code + Jira + PRD + conversation |

## When to Use

- Documenting a shipped or planned feature for Confluence
- Turning a Jira ticket (e.g. `LHP-2126`) into a stakeholder-readable explainer
- Producing an onboarding doc for a domain or workflow
- Writing a runbook or behaviour spec that ops/CS will read
- Refreshing a stale Confluence page after a release

**When not to use:**
- Writing a PRD for a new initiative — use [write-prd](../write-prd/SKILL.md)
- Producing vector-DB knowledge base chunks — use [write-docs](../write-docs/SKILL.md)
- Writing inline code comments or per-function docs
- One-paragraph release notes — just write them inline

## Inputs Accepted

The skill accepts any combination of:
- **Feature name or topic** — e.g. "Partner Booking", "Depreciation upload flow"
- **Jira ticket URL or key** — e.g. `https://productdev-littlehinges.atlassian.net/browse/LHP-2126` or `LHP-2126`
- **Existing PRD path** — e.g. `docs/depreciation-auto-hubspot-status/prd-document.md`
- **Code area** — e.g. `API/API/Bookings/`, `platform/src/pages/partner/`

## Process

### 1. Clarify inputs and audience

Ask the human, in one short message:
1. **What** — feature name, Jira key/URL, or PRD path?
2. **Who reads it** — PM only, Ops/CS, Engineers, or Mixed?
3. **Languages** — both EN and VI (default), EN only, or VI only?
4. **Publish target** — paste-into-Confluence, push via MCP, or just file in repo?
5. **Slug** — confirm the file slug (default: derive from feature/ticket).

If the user already supplied all of this, skip the question.

### 2. Gather source material

In order, for each available input:

**A. Jira ticket** — if the user gave a URL or key:
- Use `mcp__atlassian__getJiraIssue` to fetch the ticket
- Use `mcp__atlassian__getJiraIssueRemoteIssueLinks` to find linked PRs, Confluence pages, related tickets
- Pull: summary, description, acceptance criteria, labels, status, fix version, linked issues

**B. Existing PRD** — if `docs/<slug>/prd-document.md` exists or the user pointed to one:
- Read it in full; reuse problem statement, acceptance criteria, user stories
- Do not re-derive what the PRD already states well

**C. Code exploration** — for features grounded in shipped code:
- Read schema, API routes, services, frontend components
- Read `docs/lh-knowledge-base/` to use **existing domain vocabulary** rather than inventing new terms
- Verify behaviour from code, not memory — every business rule cited must trace to a file

**D. Existing Confluence page** — if the doc is a refresh:
- Ask the user for the page URL
- Use `mcp__atlassian__getConfluencePage` to read the current version
- Preserve the page ID for an update later

### 3. Propose the outline (human gate)

Write a short outline message and **stop**. Default outline:

```
1. Summary (3–5 sentences any reader can follow)
2. Why it exists
3. Who it affects (user types, teams)
4. How it works (narrative; Mermaid diagram if a flow)
5. Key business rules
6. Edge cases and known limits
7. Glossary (terms defined in plain English)
8. References (Jira, PRs, source files, related docs)
```

For multi-audience mode, prepend:

```
0. Executive Summary (one screen, no jargon — what / why / who / status)
```

Adapt sections to the input — a workflow doc has a "Step-by-step" section; a domain doc has a "Data model" section. Confirm with the user before drafting.

### 4. Draft the document(s)

Apply the rules in [style-guide.md](style-guide.md) strictly. Start from the right template:

- **Single audience**: [templates/single-audience.md](templates/single-audience.md)
- **Multi audience** (PM + engineer in one file): [templates/multi-audience.md](templates/multi-audience.md)

While drafting:
- Define every technical term on first use, in the same paragraph
- Cite every business rule with a source: `file.ts:line` or `LHP-XXXX`
- Use Mermaid for flows and sequences — never image attachments
- Use tables for structured comparison; numbered lists for sequence; bullets for unordered facts
- Keep each file between **200 and 800 lines** — longer docs hurt readability and Confluence rendering

**Bilingual drafting order:**
1. Write the English file (`<slug>.md`) fully first — it is the canonical version
2. Then write the Vietnamese file (`<slug>-vi.md`) as a parallel document, not a literal translation:
   - Section structure is identical (same headings in the same order)
   - Translate headings using the table in [style-guide.md](style-guide.md#vietnamese-section-heading-translations)
   - Apply the Vietnamese rules in [style-guide.md](style-guide.md#vietnamese-version-rules)
   - Keep LH product terms and code references in English (booking, partner, tour, dropzone, `bookingService.ts:142`, etc.)
   - Keep Jira keys, file paths, Mermaid diagrams, tables, and code blocks identical to the EN version
3. The two files must stay in sync — every rule, edge case, and reference in EN must appear in VI

If the user chose EN only or VI only in step 1, skip the other file. State this in the gate report.

### 5. Self-review (mandatory)

Run through [checklist.md](checklist.md) for **each language file** produced. Report which checks pass and which need revision. Fix issues before going to the gate.

The bilingual sync check (every section in EN exists in VI, every source reference matches) is mandatory when both files are produced.

### 6. Human gate

Report:
- Output file paths (both `<slug>.md` and `<slug>-vi.md` when bilingual)
- Word/line count for each file
- Sections produced
- Checklist results for each language
- Bilingual sync status (when applicable)
- Any gaps the user must answer (decisions not in the source material)

**Stop and wait for approval.** Do not auto-publish to Confluence in the same turn.

### 7. Optional publish (only on explicit request)

When the user approves publication:
1. Ask which language(s) to publish (default: both, as two separate Confluence pages)
2. Ask for the Confluence space key and parent page ID (or page ID for an update)
3. Use `mcp__atlassian__createConfluencePage` (new) or `mcp__atlassian__updateConfluencePage` (existing) for each language
4. Convention for bilingual pages: title the EN page as the canonical title; title the VI page with " (VI)" suffix, and keep them as siblings under the same parent
5. Report the published URL(s) back

Never publish without an explicit go-ahead in that turn — the link is shareable and visible to the whole org.

## Output Location

```
docs/confluence/
  <feature-slug>.md          # English (canonical)
  <feature-slug>-vi.md       # Vietnamese parallel
```

Slug rules:
- Kebab-case, ≤ 60 chars
- Prefer the Jira summary slug if a ticket is the source: `lhp-2126-<short-summary>.md`
- Otherwise derive from the feature name: `partner-booking-overview.md`
- The `-vi.md` suffix follows the same project convention used by [write-prd](../write-prd/SKILL.md) (`prd-document.md` + `prd-document-vi.md`)

If `docs/confluence/` does not exist, create it. Do **not** add an index file in this skill — Confluence is the index of record.

## File Header (every doc starts with this)

```markdown
# {Title in Sentence Case}

> **Status:** Draft | Review | Published
> **Audience:** PM / Ops / Engineering / Mixed
> **Source:** {Jira key} · {PRD path} · {code paths}
> **Last updated:** {Month Year}
> **Owner:** {Team or person, if known}

[Table of contents — auto-generated by Confluence; in markdown, list the H2 headings]
```

## Anti-Patterns

- Emojis anywhere in the document body. **Exception:** `✓` and a red `✗` (HTML `<span style="color:red">✗</span>`) inside comparison tables or checklists only.
- Using `🚀`, `✨`, `📌`, `🔥`, or any decorative emoji in headings or bullets.
- Marketing voice ("powerful", "seamless", "delightful", "leverage", "unlock").
- Unexplained jargon. If a term appears for the first time, define it in the same paragraph or in the Glossary.
- Restating section headings as the first sentence ("This section describes…").
- Writing from memory or speculation. Every behaviour must trace to code, the PRD, or the Jira ticket.
- Image attachments. Use Mermaid diagrams — they diff in git and render in Confluence.
- Pasting raw acceptance criteria verbatim — rewrite into a Behaviour section that a non-engineer can follow, then link the criteria.
- Translating LH product terms (booking, partner, tour, dropzone, deal stage) into Vietnamese. Keep them in English in the VI file too; add a one-line gloss on first use.
- A Vietnamese file that drifts from the English file. The two must stay in sync — same sections, same business rules, same source references. If you change one, update the other in the same turn.
- Creating extra files beyond `<slug>.md` and `<slug>-vi.md`. Each language is a single self-contained file; Confluence pages are atomic units.

## References

- [style-guide.md](style-guide.md) — required reading; covers voice, formatting, emoji policy, Mermaid conventions
- [checklist.md](checklist.md) — required self-review before the human gate
- [templates/single-audience.md](templates/single-audience.md)
- [templates/multi-audience.md](templates/multi-audience.md)
- [docs/lh-knowledge-base/](../../../docs/lh-knowledge-base/) — domain glossary; reuse terms from here
- [write-docs/SKILL.md](../write-docs/SKILL.md) — sibling skill for vector-DB chunks (different output, different purpose)
