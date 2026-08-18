## Problem Statement

Medijob recruiters still run candidate interviews in a separate Netlify tool (medijob-eval). That tool does not create CRM Candidates, duplicates interim/CDI flows, and will be replaced by the CRM. Recruiters need one in-CRM Interview journey that can start before a Candidate exists, creates or attaches the Candidate, scores the conversation, updates the profile safely, and produces a PDF — without Tool4Staffing or the “qualification projet” client flow.

## Solution

Replace medijob-eval inside CRM MediJob with a first-class **Interview** on Candidates: unified trame-driven flow for interim and CDI/CDD, create-Candidate-at-start (with duplicate attach), hybrid scoring plus optional OpenRouter AI, structured write-back to Candidate fields without silent overwrite, status change proposals with confirmation, multi-Interview history (one draft max), and PDF storage/download. Templates ship as versioned seeds in V1 (admin template editor later). Interview profile keys map to JobTitles with identical labels.

## User Stories

1. As a Recruteur, I want to start a new Interview from Accueil or Candidats without an existing Candidate, so that I can qualify someone during a live call.
2. As a Recruteur, I want to enter minimal identity (name, phone/email, profile/JobTitle, mode) at Interview start, so that a Candidate is created immediately as Nouveau.
3. As a Recruteur, I want duplicate detection on email/phone at Interview start, so that I attach the Interview to an existing Candidate instead of creating a double.
4. As a Recruteur, I want to merge or attach via the existing duplicate-review UX, so that CVthèque integrity stays consistent with other create paths.
5. As a Recruteur, I want to start an Interview from an existing Candidate fiche, so that I can re-qualify someone already in the CVthèque.
6. As a Recruteur, I want exactly one DRAFT Interview per Candidate at a time, so that I never lose track of an in-progress call.
7. As a Recruteur, I want to resume a DRAFT Interview from the Candidate Entretiens tab, so that interrupted calls continue cleanly.
8. As a Recruteur, I want to choose mode INTERIM or CDD_CDI, so that the right trame and expectations apply.
9. As a Recruteur, I want Interview profiles Pharmacien, Préparateur, Étudiant en pharmacie, Conseiller parapharmacie, Rayonniste, so that all eval profiles are covered.
10. As a Recruteur, I want those profile labels to match JobTitle names exactly, so that matching and trames stay aligned.
11. As a Recruteur, I want a single unified Interview UX (sections → answers → close), so that I am not forced into the old dual interim/guide/scored apps.
12. As a Recruteur, I want suggested scored answers and free notes during the call, so that I can move quickly without losing nuance.
13. As a Recruteur, I want eliminatory questions to surface clearly, so that non-eligibility is visible before close.
14. As a Recruteur, I want a B/C criteria grid at close, prefilled from answers and editable, so that final scoring stays under my control.
15. As a Recruteur, I want optional OpenRouter AI to suggest scores or a short summary, so that IA accelerates without blocking close.
16. As a Recruteur, I want to close an Interview without calling AI, so that offline or fast closes still work.
17. As a Recruteur, I want close to map clear answers into Candidate fields (availability, mobility, contracts, salary expectations, softwares, JobTitle if missing, notes/summary), so that qualification updates the profile in-CRM.
18. As a Recruteur, I want a confirmation when mapped fields would overwrite existing Candidate values, so that nothing is silently replaced.
19. As a Recruteur, I want close to propose Candidate status changes (e.g. toward Qualifié / À qualifier / Inactif / Blacklisté) with confirmation, so that sensitive status stays intentional.
20. As a Recruteur, I want Interview decision (eligible / non-eligible / review) stored on the Interview, so that history remains auditable.
21. As a Recruteur, I want multiple CLOSED Interviews on one Candidate, so that re-contacts and mode changes are retained.
22. As a Recruteur, I want an Entretiens tab on the Candidate fiche listing drafts and closed Interviews, so that history is visible in context.
23. As a Recruteur, I want a CTA “Nouvel entretien” from list/home flows, so that Interview-first intake is discoverable without a dedicated nav module in V1.
24. As a Recruteur, I want PDF generation of the Interview compte-rendu at close, so that I can archive or share the evaluation.
25. As a Recruteur, I want the PDF downloadable and stored as a Document linked to the Candidate (and/or Interview), so that it lives with the dossier.
26. As Direction or RH-Admin, I want Referent recorded on the Interview, so that ownership is filterable like other entities.
27. As Communication, I want read access consistent with role matrix on Candidate/Interview data, so that I can consult without owning staffing edits (follow existing permissions patterns).
28. As a Recruteur, I want ActivityLog entries when an Interview is created or closed, so that Candidate history shows qualification events.
29. As a Recruteur, I want dossier document checklist items from interim trames (e.g. CV, ID, Vitale, diplôme) captured on the Interview, so that B8-style completeness is not lost.
30. As a developer/agent, I want trames seeded from the medijob-eval source of truth, so that V1 ships complete question banks without admin UI yet.
31. As RH-Admin, I want a future admin to edit trames without deploy (follow-up), so that V1 is not blocked on CMS for questions.
32. As a Recruteur, I want autosave of DRAFT answers, so that a dropped call does not lose progress.
33. As a Recruteur, I want cancel/abandon rules for DRAFT Interviews that do not delete the Candidate created at start, so that intake remains recoverable.
34. As a Recruteur, I want JobTitle on the Candidate set from the Interview profile when missing, so that matching can use the profile immediately.
35. As a Recruteur, I want Interview scores visible on the closed Interview detail, so that I can justify ranking later.
36. As Direction, I want no Tool4Staffing dependency in this feature, so that the CRM fully replaces eval/T4S for this workflow.
37. As a Recruteur, I want no “qualification projet” client/mission form in this feature, so that Pharmacy/Mission flows stay the place for client needs.
38. As a Recruteur, I want soft-delete behavior for Interviews aligned with CRM norms and roles, so that destructive actions stay gated.
39. As a Recruteur, I want validation (Zod) on all Interview inputs and AI outputs, so that bad payloads never corrupt Candidate data.
40. As a Recruteur, I want empty optional sections omitted from PDF when unused, so that comptes-rendus stay readable.

## Implementation Decisions

- Domain: introduce first-class **Interview** entity related to Candidate (not only JSON on Candidate). ADR recommended.
- Glossary: extend Candidate creation paths to include Interview start; Interview ≠ PipelineStage named Entretien; Interview ≠ Application.
- Unify proto kinds (interim v2, scored interview, CDI guide) into one Interview UX with modes INTERIM | CDD_CDI.
- Persist answers + scores + decision on Interview; Candidate updated only via explicit mapping rules at close.
- Duplicate handling reuses existing Candidate duplicate detection / merge review at start.
- One DRAFT Interview per Candidate enforced server-side.
- Trames: versioned seed data ported from medijob-eval configs; admin CRUD deferred.
- JobTitle seed labels identical to Interview profile labels; mapping table profileKey ↔ jobTitleId.
- AI: optional suggestions through existing OpenRouter abstraction + mock provider in tests; close never requires AI.
- PDF: generate compte-rendu and attach via existing Document patterns / download route style used for anonymized PDF.
- UI entry: CTA Nouvel entretien + Candidate Entretiens tab; no dedicated `/entretiens` nav in V1.
- Permissions: follow existing UserRole matrix for Candidate mutations; status changes remain confirm-gated.
- No T4S client, no qualification-projet module, no Netlify Blobs auth from eval.
- Architecture constraints unchanged: Prisma only in repositories; tRPC routers; view-models; RHF+Zod; files under line limit; RSC reads / client mutations.

Prototype-shaped Interview state (decision-rich, not a demo):

```
InterviewStatus: DRAFT | CLOSED
InterviewMode: INTERIM | CDD_CDI
InterviewDecision: ELIGIBLE | NON_ELIGIBLE | REVIEW
// answers: Record<questionId, { choiceId?: string; note?: string; asked?: boolean }>
// scores: Record<criteriaId, number> // B1–B8 / C1–C5 as applicable
```

## Testing Decisions

- Prefer highest external seams; assert behavior not React internals.
- Primary seam: Interview tRPC/service via createCallerFactory (start, save, close, list, draft invariant, mapping outcomes).
- Reuse Candidate duplicate-detection seam at Interview start.
- Pure scoring functions unit-tested (answers → suggested B/C grid).
- Pure/service mapping Interview → Candidate field patches (no silent overwrite).
- AI behind provider seam with mock OpenRouter; Zod-validate AI payloads.
- PDF generation/download seam analogous to anonymized PDF tests.
- Repository tests for Interview persistence where Testcontainers/repo patterns already exist.
- Good tests: observable contracts (status codes, returned view-models, DB-visible state through repos); avoid coupling to trame file layout churn beyond fixtures.

## Out of Scope

- Tool4Staffing push/search/link
- Qualification projet (client/mission INSEE flow)
- Admin UI to edit trames in V1
- Dedicated global `/entretiens` dashboard/nav in V1
- Finance / devis / op-medijob
- Porting medijob-jobs site
- Keeping medijob-eval Netlify as system of record
- Automatic Blacklist without confirmation
- Silent overwrite of filled Candidate fields

## Further Notes

- Source of trame content: WeTransfer “Grille evaluation Interim” (medijob-evaluation) + prior scrape inventory under docs/grill/inventories.
- Q12 answered: CRM replaces Netlify eval; all profiles in scope.
- Issue #226 was the HITL placeholder; this PRD is the implementation spec (ready-for-agent).
- Follow-ups: admin trames; optional global Interview list.
