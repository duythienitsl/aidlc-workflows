# {Feature or topic title in sentence case}

> **Status:** Draft
> **Audience:** {PM | Ops | Engineering | Mixed}
> **Source:** {LHP-XXXX} · {path/to/prd-document.md} · {key source files}
> **Last updated:** {Month Year}
> **Owner:** {Team or person}

## Table of contents

1. [Summary](#summary)
2. [Why it exists](#why-it-exists)
3. [Who it affects](#who-it-affects)
4. [How it works](#how-it-works)
5. [Key business rules](#key-business-rules)
6. [Edge cases and limits](#edge-cases-and-limits)
7. [Glossary](#glossary)
8. [References](#references)

---

## Summary

{Three to five sentences any reader can follow on first read. State the user-visible behaviour, who triggers it, what the outcome is, and why it matters. No jargon — define anything technical inline or move it to the Glossary.}

## Why it exists

{One or two paragraphs on the problem this solves. Quote the original pain point from the PRD or ticket if possible. Avoid restating the Summary.}

## Who it affects

| Audience | What changes for them |
|---|---|
| {Customers} | {Plain-English impact} |
| {Operations / CS} | {Plain-English impact} |
| {Internal engineers} | {Plain-English impact} |
| {Partners / third parties} | {Plain-English impact} |

## How it works

{Open with one sentence of orientation. Then either a Mermaid diagram, a numbered step-by-step, or both.}

```mermaid
flowchart TD
    A[{Trigger}] --> B{{Decision}}
    B -- yes --> C[{Action}]
    B -- no --> D[{Alternative}]
```

### Step-by-step

1. {Step one — what happens, who does it, what state changes}
2. {Step two}
3. {Step three}

{Reference the source: "Implemented in [serviceName.ts:42](path/to/serviceName.ts#L42)."}

## Key business rules

- **{Rule name}** — {plain-English statement}. Source: {file:line or Jira key}.
- **{Rule name}** — {plain-English statement}. Source: {file:line}.
- **{Rule name}** — {plain-English statement}. Source: {file:line}.

## Edge cases and limits

| Scenario | Behaviour | Source |
|---|---|---|
| {Edge case description} | {What the system does} | {file:line or Jira} |
| {Idempotency case} | {What the system does on retry} | {file:line} |
| {Failure case} | {What the user/operator sees} | {file:line} |

## Glossary

| Term | Meaning in this document |
|---|---|
| {Term} | {Plain-English definition specific to LH} |
| {Term} | {Plain-English definition specific to LH} |

## References

- Jira: [LHP-XXXX]({jira-url})
- PRD: [{prd filename}]({prd path})
- Pull requests: {PR links if known}
- Source files:
  - [{file}]({path})
  - [{file}]({path})
- Related docs:
  - [{doc title}]({path})
