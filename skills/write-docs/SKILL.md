---
name: write-docs
description: Produces focused, vector-DB-ready English documentation files from codebase exploration. Creates small domain-specific markdown files with YAML frontmatter, suitable for ingestion into Pinecone or any other vector database. Use when you need to document a feature, domain, workflow, or data model for AI-assistant knowledge bases.
---

# Write Docs

## Overview

Generate lean, focused documentation files from live code — not from memory. Each output file covers exactly one domain (e.g. bookings, pricing, analytics) so that vector search returns precise, citable results. All files are in English. No Vietnamese versions.

## When to Use

- Creating or updating a knowledge base for AI assistant ingestion (Pinecone, Weaviate, pgvector, etc.)
- Documenting a domain that changed significantly (new model, new workflow, new integration)
- Bootstrapping docs for a new team member or AI context window
- Refreshing stale docs after a large refactor

**When not to use:**
- Writing user-facing product docs (use `write-prd` instead)
- Writing inline code comments (do that in the code editor)
- Documenting a single function in isolation (too fine-grained for a knowledge base chunk)

## Process

1. **Clarify scope** — Ask the human: what domain(s) to document? What is the target vector DB / ingestion pipeline? Any file size constraints? Are existing docs stale or missing?

2. **Explore** — Read the relevant code:
   - Prisma schema for data models
   - API module files for workflows and business logic
   - Frontend request modules (`platform/src/API/requests/`) for client-side types
   - Component files for UI/page structure
   - `docs/lh-knowledge-base/` for existing docs to update rather than recreate

3. **Plan the file split** — Determine one file per domain. Aim for **100–300 lines per file**. Split larger domains into sub-files (e.g. `data-models-bookings.md`, `workflow-booking-creation.md`). Never let a single file exceed 400 lines — it degrades vector search precision.

4. **Write the file** — For each domain file:
   - Use a descriptive filename: `{NN}-{domain-slug}.md` (e.g. `11-workflow-booking-creation.md`)
   - Add YAML frontmatter (see template below) — required for Pinecone metadata filtering
   - Write in clear English; keep table field names and enum values in English
   - Include: data model fields + types + descriptions, enum values, business rules, calculation formulas, key constraints
   - Do NOT include: speculative features, implementation opinions, or inline code beyond illustrative snippets

5. **Update index** — Add an entry to `docs/lh-knowledge-base/00-index.md` for each new file.

6. **Gate** — Report what was created or updated, and list any domains that still need documentation (gaps). Stop and wait for human confirmation before proceeding to other tasks.

## File Structure

All docs live in `docs/lh-knowledge-base/`:

```
docs/lh-knowledge-base/
├── 00-index.md                              # Index — list of all files
├── 01-platform-overview-stack-glossary.md
├── 11-workflow-booking-creation.md
└── ...
```

Numbering convention:
- `01–09` — Core concepts and glossary
- `02–10` — Data models (by domain)
- `11–13` — Workflow and business logic
- `14` — Frontend pages and components
- `15` — External integrations
- `16–17` — System operations and business rules

New files: pick the next available number in the appropriate range.

## File Template

```markdown
---
domain: "{broad category: Data Model | Workflow | Frontend | Integration | Business Rules | Migration}"
file: "{nn-filename.md}"
topics: ["{primary topic}", "{secondary topic}"]
source: ["{/path/to/source/file.ts}"]
last_scanned: "{Month Year}"
---

# LH Knowledge Base — {Title}

---

## {Section heading}

{Content — tables, bullet lists, code snippets as needed}

---

## {Next section}

...
```

## Quality Criteria

All files must pass these five checks before being considered complete:

### 1. Signal-to-Noise Ratio (SNR)
- Every sentence must carry information a retrieval model could match against a query
- Remove: boilerplate intros ("This document describes..."), restatements of section headings, padding prose
- Target: if you removed a paragraph and an engineer wouldn't miss anything, remove it

### 2. Chunk Coherence
- Each file must be self-explanatory without external context
- A chunk retrieved in isolation must answer its topic completely
- Bad: "See file 02 for user roles" — include the relevant detail inline instead
- Inline the essential cross-domain facts rather than referencing other files

### 3. Density (>70% meaningful lines)
- At least 70% of lines must carry schema facts, business rules, formulas, or code
- Blank lines, heading separators, and closing prose should not dominate the file
- Check: count lines with `| `, code, or dense prose vs total lines

### 4. Semantic Completeness
- One file = one complete topic
- A file covering 3 unrelated concerns must be split
- A file with fewer than 60 meaningful lines is likely too sparse — expand or merge
- A file exceeding 400 lines must be split

### 5. Structured Metadata (YAML frontmatter)
- Every file must have YAML frontmatter with: `domain`, `file`, `topics`, `source`, `last_scanned`
- `domain` drives Pinecone metadata filtering — use a consistent controlled vocabulary
- `topics` is an array of keyword tags for fine-grained retrieval

## Anti-Patterns to Avoid

- Writing one giant file for all domains (kills vector search precision)
- Files under 60 meaningful lines (insufficient embedding signal)
- Files over 400 lines (dilutes semantic focus, hurts retrieval precision)
- Using `> Domain:` inline headers instead of YAML frontmatter
- Documenting from memory — always read source code first
- Writing docs that describe intent rather than implemented behaviour
- Forgetting to update `00-index.md`
- Producing Vietnamese versions (English only — no `-vi.md` files)
- Referencing other files ("see file 02") instead of inlining the relevant detail
