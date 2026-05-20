---
description: Produce focused, vector-DB-ready documentation files with EN + VI versions — ready for Pinecone or any vector database ingestion
---

Read and follow the skill at `skills/write-docs/SKILL.md` in this repository.

## MANDATORY process — do not skip any step

1. **Read** `skills/write-docs/SKILL.md` fully before doing anything else
2. **Enter plan mode** (`EnterPlanMode`) — do NOT write files yet
3. **Clarify** scope with the human: which domain(s)? target vector DB? file size constraints?
4. **Explore** the codebase — read Prisma schema, API modules, frontend types as needed
5. **Plan the split** — determine file names and content boundaries (100–300 lines each)
6. **Write EN files** first, then **VI files** for each domain
7. **Update index files** (`00-index.md` and `00-index-vi.md`)
8. **Exit plan mode** (`ExitPlanMode`) — show the human what was created and any gaps
9. **Gate** — stop and wait for explicit confirmation before any follow-up tasks

## Output location

All files go in `docs/lh-knowledge-base/`:
- EN: `{NN}-{domain-slug}.md`
- VI: `{NN}-{domain-slug}-vi.md`

## Key constraints

- **100–300 lines per file** — split larger domains into sub-files
- **Never exceed 400 lines** — degrades vector search precision
- **Keep technical terms in English** in VI files (table names, field names, enums, API paths)
- **Both EN and VI required** every time — never produce only one version
- **Always read source code** — do not document from memory

> **Anti-patterns to avoid:**
> - Writing one giant file covering multiple unrelated domains
> - Translating table names, field names, or enum values in VI files
> - Skipping the VI version
> - Forgetting to update `00-index.md` and `00-index-vi.md`
> - Documenting speculative/planned features instead of implemented behaviour
