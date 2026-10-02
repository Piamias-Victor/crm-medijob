# PRD — Public apply page V1

Parent milestone: [Public apply page V1](https://github.com/Piamias-Victor/crm-medijob/milestone/22)  
Glossary: `CONTEXT.md` (Application, Application source, Applicant postal code, Public apply page, JobOffer, Weekly availability). ADR 0038, ADR 0016 (board ingest unchanged in code).

## Problem Statement

« Postuler » on the public job board still sends candidates to T4S. Recruiters want candidacies (CV + identity + offer id + optional message) in the CRM Applications inbox, on a public page styled like Weekly availability.

## Solution

Public CRM page `/postuler/[boardListingId]` writes an Application directly. Matthieu redirects job-board buttons after QA. Board ingest code stays; ops cutover is human-gated.

## Done when

a) Valid submit → 1 Application with all fields, offer métier, source public-apply, linked offer, visible in inbox with postal code  
b) Invalid matrix rejected server-side (missing fields, bad email/phone/CP, no consent, bad/missing/oversized/spoofed CV, closed offer, unknown listing id)  
c) Honeypot filled → 0 writes; 6th submit/hour same IP → refuse  
d) Rendered HTML exposes only title / métier / ville / contrat from the offer  
e) Board ingest, legacy Applications, and `/dispo` unchanged (existing tests green; dispo screenshots before/after identical)  
f) Prod build fails without privacy URL / retention env  
g) Design: side-by-side dispo | postuler at 390 & 1440; no horizontal scroll at 390; ≥44px targets; email/tel/numeric CP inputs

## User Stories

1. As a candidate, I want to open a postuler link with the board listing id, so that I apply to the right offer.
2. As a candidate, I want to see titre, métier, ville, contrat only, so that I am not shown pharmacy or internal data.
3. As a candidate, I want a closed offer to show unavailable without a form, so that I do not waste time.
4. As a candidate, I want unknown listing ids to 404, so that broken links fail clearly.
5. As a candidate, I must enter first name, last name, email, phone, city, postal code, CV, and consent, so that recruiters can contact me.
6. As a candidate, I may add an optional message, so that I can add context.
7. As a candidate, I want field-level French errors, so that I can fix my form.
8. As a candidate, I want a thank-you screen after submit, so that I know it worked (no email in V1).
9. As a Recruteur, I want the Application in Candidatures reçues with CP and source, so that I can process it like today.
10. As a Recruteur, I want accept/refuse unchanged, so that my workflow stays stable.
11. As Direction, I want honeypot + IP rate limit, so that spam is reduced without captcha.
12. As Direction, I want prod to refuse boot without privacy URL/retention, so that legal copy is never silently empty.
13. As a developer, I want `/postuler` public like `/dispo`, so that auth middleware does not block candidates.
14. As a developer, I want shared Zod validation, so that client and server agree.
15. As Matthieu, I want a stable URL pattern to wire buttons later, so that the site change is a href swap.

## Implementation Decisions

- Route `/postuler/[boardListingId]`; publicProcedure / public POST; middleware + access allow.
- Schema: `postalCode String?`; `ApplicationSource` enum default `BOARD_INGEST`; public writes `PUBLIC_APPLY`.
- Consent via existing `consentGivenAt` + `ConsentSource.SITE`; unchecked required.
- CV module distinct from candidate image/PDF 10 Mo rules: PDF/DOC/DOCX, 5 Mo, magic bytes, sanitize filename, private blob path under application/.
- Rate limit: Prisma bucket table keyed by IP + hour window (ADR 0038).
- Env: `PUBLIC_APPLY_PRIVACY_URL`, `PUBLIC_APPLY_RETENTION_LABEL` (names finalized in impl); validate in `validateServerEnv` for production.
- UI: reuse dispo shell tokens; extract shared public page shell only if needed without visual change to dispo.
- Inbox columns + detail fields: postalCode + source label.
- noindex metadata; not in sitemap.

## Testing Decisions

- Pure Zod / upload / rate-limit / honeypot unit tests (TDD).
- Integration: submit creates Application; closed offer rejected.
- HTML assertion: offer payload limited to 4 fields.
- Existing application ingest + dispo tests remain green.
- E2E mobile 390 happy path + closed + errors + honeypot; dispo visual non-regression screenshots.

## Out of Scope

RDV/calendar, confirmation email, captcha, Medijob site button edits, matching, applicant dedup, stopping board ingest in code, staging/prod DB migrations from agent.

## Further Notes

Reference design: `/dispo/[token]`. Ticket order: ADR → schema → validation → CV upload → anti-spam → submit endpoint → public page → e2e.
