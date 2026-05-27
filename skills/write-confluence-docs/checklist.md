# Self-Review Checklist — Confluence Docs

Run through every item before reporting the draft as done. Mark each `✓` or `✗`. Fix every `✗` before the human gate.

When the user asked for bilingual output (the default), run sections 1–8 on **both** the English and Vietnamese file, then run the bilingual sync section (9) once.

## 1. Structure

- [ ] One H1 (the title) and a populated header block (Status, Audience, Source, Last updated, Owner)
- [ ] Sections follow the outline approved in step 3 of the skill process
- [ ] Headings are sentence case, no trailing punctuation, no emoji
- [ ] H2 sections are ordered logically (Summary → Why → Who → How → Rules → Edges → Glossary → References)

## 2. Audience fit

- [ ] The Summary is understandable by a non-technical reader on first read
- [ ] Every technical term, internal name, or acronym is defined on first use OR in the Glossary
- [ ] No assumed knowledge of the codebase beyond what is documented in `docs/lh-knowledge-base/`
- [ ] Where a concept exists only in code, the doc explains it in business terms before showing code

## 3. Sourcing

- [ ] Every business rule cites a source (`file:line`, Jira key, or canonical doc link)
- [ ] No claim is made from memory or speculation
- [ ] If the input includes a Jira ticket, the ticket is linked in the header and in References
- [ ] If a PRD exists, it is referenced rather than duplicated

## 4. Style

- [ ] No emoji anywhere in the document, except `✓` / `✗` inside tables or checklists
- [ ] No banned marketing words (powerful, seamless, delightful, leverage, unlock, robust, simply, just, easily)
- [ ] No filler intros ("This document describes…", "In this section…")
- [ ] Active voice throughout
- [ ] Present tense for current behaviour; planned work clearly marked

## 5. Formatting

- [ ] Bullets are ≤ 2 lines each
- [ ] Tables are used for structured comparison, not free narrative
- [ ] Mermaid diagrams are used for flows; no image attachments
- [ ] Code references use markdown link form: `[file.ts:42](path/to/file.ts#L42)`
- [ ] Code blocks have correct language tags

## 6. Confluence compatibility

- [ ] Renders cleanly when pasted into Confluence (test by previewing if possible)
- [ ] No HTML tags except the allowed `<span style="color:red">✗</span>` pattern
- [ ] No relative links that would break on Confluence — external resources use full URLs
- [ ] File is between 200 and 800 lines

## 7. Completeness

- [ ] Every acceptance criterion from the source PRD/ticket is reflected (rewritten in plain English, not pasted)
- [ ] Edge cases section lists known limits, error states, and idempotency behaviour
- [ ] Glossary covers every term that appears in the doc and is not obvious to the stated audience
- [ ] References section links Jira tickets, PRs, related docs, source files

## 8. Decision log (when applicable)

- [ ] If you made interpretive choices (e.g. which behaviour is "primary"), state them in the doc
- [ ] If the source material is ambiguous, flag the gap in the human-gate report — do not paper over it

## 9. Bilingual sync (only when both EN and VI files exist)

- [ ] Both files have the same set of H2 sections in the same order
- [ ] Every business rule in EN appears in VI, and vice versa
- [ ] Every Jira key, file path, line number, and external link is identical in both files
- [ ] Every Mermaid diagram is identical in both files (diagram code unchanged; labels may be translated for non-technical nodes)
- [ ] Every table has the same rows and columns in both files
- [ ] LH product terms (booking, partner, tour, dropzone, etc.) stay in English in the VI file, with a first-use Vietnamese gloss per [style-guide.md](style-guide.md#terms-kept-in-english)
- [ ] VI section headings use the standard translations from [style-guide.md](style-guide.md#section-heading-translations)
- [ ] VI header block uses the translated keys (Trạng thái, Đối tượng, Nguồn, Cập nhật lần cuối, Phụ trách)
- [ ] No banned Vietnamese marketing words (mạnh mẽ, tuyệt vời, đỉnh cao, vượt trội, dễ dàng, đơn giản chỉ với, chỉ cần)
- [ ] No casual/conversational tone in VI (nhé, ạ, mình, tớ)

## Reporting

After the checklist, write a one-line summary per file plus a sync line. Example:

> Checklist EN: 32/32 pass. Checklist VI: 31/32 pass — §4 has one undefined term ("dropzone" gloss missing on first use). Sync: 10/10 pass. Will fix VI §4 before publishing.

If everything passes:

> Checklist EN: 32/32 pass. Checklist VI: 32/32 pass. Sync: 10/10 pass. Ready for human review.
