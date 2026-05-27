---
description: Produce a Confluence-ready explainer document (English + Vietnamese parallel files) for a feature, ticket, or domain — readable by non-technical stakeholders.
---

Read and follow the skill at `skills/write-confluence-docs/SKILL.md` in this repository.

Accepted inputs (any combination): feature name, Jira ticket URL or key (e.g. `LHP-2126`), existing PRD path, or code area. The skill auto-fetches the Jira ticket via the Atlassian MCP when a URL or key is provided.

Default output is bilingual — `docs/confluence/<slug>.md` (English, canonical) plus `docs/confluence/<slug>-vi.md` (Vietnamese, parallel). The user may opt for EN only or VI only in step 1.

Always apply the rules in `skills/write-confluence-docs/style-guide.md` (including the Vietnamese version rules section) and pass the checks in `skills/write-confluence-docs/checklist.md` — including the bilingual sync section when both files are produced — before reporting the draft as done. Stop at the human gate; do not publish to Confluence without an explicit go-ahead in the same turn.
