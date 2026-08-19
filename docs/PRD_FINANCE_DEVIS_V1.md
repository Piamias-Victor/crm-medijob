## Problem Statement

Medijob still prices and tracks deals in a separate Netlify prototype (op-medijob) plus a static WeTransfer calculator (medijob-devis). Recruiters leave the CRM to quote a Pharmacy, Direction cannot see CA / Marge next to Missions, and the CSV V1 line (Facturation → Devis + performance follow-up) is unimplemented. Q13 asked whether to port the whole proto: the answer is a **CRM-native subset**, not an iframe and not a second staffing app.

## Solution

Add a first-class **Devis** on each **Mission**. Recruteurs (and anyone with Mission write, including Communication) create a free-price quote from the Mission — hours + rate with engine HT, or a typed HT total; CDD/CDI is a typed forfait. Sending marks the current Devis, stores a PDF as a Mission **Document** (category DEVIS, also listed on the Pharmacy), and opens Gmail compose to the Pharmacy Contact. Accepting books **CA** (amount once, dated on accept). Direction / RH-Admin type **Marge** on the Mission, mark **Facturé** (date only, no invoice entity), and open a **Facturation** module (global stats + Devis list) that Recruteur / Communication never see. **Commercial status** (Sans devis → Envoyé → Accepté → Facturé) stays independent from **Mission status**. Annulée clears CA / Marge. Accueil KPIs stay operational; finance graphs live only in Facturation.

## User Stories

1. As a Recruteur, I want to create a Devis from a Mission, so that I quote the Pharmacy without leaving staffing.
2. As a Recruteur, I want to choose intérim or CDD/CDI on the Devis, so that the quote matches the Mission contract type by default but can still be set explicitly.
3. As a Recruteur, I want to enter hours and an hourly rate then calculate, so that HT is computed from the Medijob engine (IFM/ICC, charges, TVA when relevant) without packaged “tarif Medijob” profiles.
4. As a Recruteur, I want to type the HT total directly, so that a negotiated lump sum does not require the engine.
5. As a Recruteur, I want to change hours at any time, so that volume stays editable after a lump HT.
6. As a Recruteur, I want changing hours not to overwrite a typed HT until I click Calculate again, so that a forfait stays stable.
7. As a Recruteur, I want a CDD/CDI Devis to be a typed HT forfait (hours optional on the PDF), so that I am not forced into “one month of gross salary”.
8. As a Recruteur, I want to save a DRAFT Devis with full inputs and amounts, so that I can reopen the detail later.
9. As a Recruteur, I want several Devis on one Mission, so that a renegotiation is a new quote, not an edit of history.
10. As a Recruteur, I want a DRAFT never to replace a sent or accepted Devis as current, so that a work-in-progress cannot zero CA.
11. As a Recruteur, I want Send to make this Devis current and retire the previous current one, so that only one live offer exists.
12. As a Recruteur, I want Send to download/generate a PDF with Pharmacy as destinataire, so that I can attach it for the client.
13. As a Recruteur, I want Send to open Gmail compose prefilled with the Pharmacy Contact email, so that I mail like the rest of the CRM (I attach the PDF myself).
14. As a Recruteur, I want the PDF stored as a Document on the Mission (category DEVIS), so that the file lives with the staffing need.
15. As a Recruteur, I want that same PDF listed on the Pharmacy Documents tab, so that the client file shows quotes without a second blob.
16. As a Recruteur, I want Accept on the current sent Devis, so that the deal is marked won.
17. As a Recruteur, I want Communication to create, send, and accept a Devis if they can write the Mission, so that rights match existing `crm.write`.
18. As Direction or RH-Admin, I want to create, send, and accept as well, so that I can close a deal for a Referent.
19. As Recruteur or Communication, I must not see CA or Marge on the Mission or anywhere else, so that margin stays confidential.
20. As a Recruteur, I still want to see the client HT/TTC of the Devis I am editing, so that I can negotiate the Pharmacy price.
21. As Direction or RH-Admin, I want CA of the Mission to be 0 until the current Devis is accepted, so that pipeline quotes do not inflate revenue.
22. As Direction or RH-Admin, I want CA to equal the accepted HT once (never × mission duration), so that a monthly intérim quote is not silently annualized.
23. As Direction or RH-Admin, I want CA dated on the accept day, so that monthly follow-up buckets the deal when it was won.
24. As Direction or RH-Admin, I want to type Marge on the Mission, so that follow-up uses the real figure, not the engine hint.
25. As Direction or RH-Admin, I want the engine margin to remain indicative only, so that it never writes the follow-up Marge.
26. As Direction or RH-Admin, I want to mark the current accepted Devis Facturé with a date, so that I track invoicing without a legal invoice entity.
27. As Direction or RH-Admin, I want Commercial status derived (Sans devis → Envoyé → Accepté → Facturé) beside Mission status, so that I see money progress without replacing À pourvoir / En recherche / Pourvu.
28. As a Recruteur, I want Commercial status visible on the Mission (without CA/Marge), so that I know whether a quote was sent or accepted.
29. As Direction or RH-Admin, I want CA and Marge to return to 0 when the Mission is ANNULEE, so that cancelled staffing does not stay in revenue.
30. As Direction or RH-Admin, I want a Facturation item in the nav that Recruteur and Communication do not see, so that finance has a home without cluttering ops.
31. As Direction or RH-Admin, I want a Facturation Devis list (filters: dates, Referent, Pharmacy, contract type, commercial status), so that I can find quotes without opening every Mission.
32. As Direction or RH-Admin, I want Facturation global stats: CA, Marge, counts by commercial status, sliced by Referent, Pharmacy, contract type, and dates, so that I steer the agency.
33. As Direction or RH-Admin, I want those stats as fluid charts (Recharts), so that monthly steering is visual, not only a table.
34. As Direction or RH-Admin, I want stats attributed to the Mission Referent, so that changing Referent moves the figures with the portfolio.
35. As Direction or RH-Admin, I want Missions without Referent in a Sans référent bucket, so that unassigned CA is not dropped.
36. As Direction or RH-Admin, I do not want a slice by Candidate, so that one deal stays one number on the Mission.
37. As a Recruteur, I want Accueil KPIs unchanged (missions to fill, urgent, Applications, fill rate), so that finance does not land on the home dashboard.
38. As a Recruteur, I want ActivityLog when a Devis is sent or accepted (existing type DEVIS), so that Mission history shows commercial events.
39. As a Recruteur, I want the PDF destinataire filled from Pharmacy (and Contact when present), so that I do not send “[Nom du client]”.
40. As Direction or RH-Admin, I want to reopen a past Devis and see stored inputs, so that I can explain how HT was born.
41. As a Recruteur, I want to regenerate the PDF from stored inputs, so that a lost download is recoverable.
42. As Direction or RH-Admin, I want counts of Sans devis / Envoyé / Accepté / Facturé in Facturation, so that I see commercial pipeline, not only won CA.
43. As a Recruteur, I want default hours from the Mission when present (heures / temps plein), so that I start from the need, not a blank form.
44. As a Recruteur, I want not to use packaged 6-profile Medijob tarifs, so that every price stays free.
45. As Direction, I want no admin tarifs screen in this PRD, so that V1 is not blocked on rate-card CMS.
46. As a Recruteur, I want no candidate salary estimator in this PRD, so that Candidate pretensions stay on the Candidate fiche.
47. As a Recruteur, I want no intérim-vs-recrutement comparatif in this PRD, so that two free prices are not fake-compared.
48. As Direction, I want Netlify op-medijob and the static WeTransfer app not to remain systems of record, so that the CRM replaces them for quoting and follow-up.
49. As a Recruteur, I want Zod validation on Devis inputs, so that bad numbers never book CA.
50. As Direction or RH-Admin, I want soft-delete of a DRAFT Devis aligned with CRM norms, so that abandoned drafts do not clutter; sent/accepted Devis are not casually deleted.
51. As a Recruteur, I want TTC shown as HT × TVA (20% from engine constants) when calculating or displaying, so that the PDF matches today’s quotes.
52. As Direction or RH-Admin, I want Facturé not to move the CA month (accept date still wins), so that invoicing is a status, not a re-booking.
53. As a developer/agent, I want a Finance bounded context (Devis + derived commercial status + Mission CA/Marge rules), so that staffing Mission status stays untouched.
54. As a Recruteur, I want the current Devis highlighted on the Mission, so that I never send from an old draft by mistake.

## Implementation Decisions

- Recreate in CRM. Do not iframe or deep-link op-medijob.netlify.app or the WeTransfer HTML app as the daily tool.
- Domain: first-class **Devis** belonging to a **Mission** (and thus a **Pharmacy**). Not only a Document and not only ActivityLog type DEVIS.
- **Commercial status** is derived from the current Devis; do not extend `MissionStatus` with Sans devis / Envoyé / Accepté / Facturé.
- Current Devis = last Devis with status SENT or ACCEPTED (by sent time). DRAFT never becomes current.
- Sending a new Devis retires the previous current one. CA stays 0 until the new current Devis is ACCEPTED.
- CA is not stored as a redundant source of truth: it is derived (0 if Mission ANNULEE or current Devis not ACCEPTED; else accepted HT once). Follow-up date = acceptedAt.
- Marge is stored on the Mission, written only by roles with `finance.view` (Direction / RH-Admin). Engine margin is display-only for those roles.
- Facturé = `invoicedAt` on the current ACCEPTED Devis, not an Invoice model.
- Price is free. Port engine formulas only for “hours × rate → HT” (WeTransfer `calculInterimLibre` / Excel DEVIS Rapide). Drop `tarifsPredefined` packs and drop recrutement “1 mois de brut”.
- Persist full Devis snapshot (kind, hours, rate, HT, TTC, primes/coefs if used, status dates).
- PDF: use existing CRM PDF stack (React-PDF style of Interview / anonymized dossier), not the zip’s jsPDF. Attach via existing Document upload/create. Pharmacy Documents tab aggregates Mission DEVIS documents for that Pharmacy.
- Send: status transition + PDF + `buildComposeUrl` / EmailButton Gmail web (ADR 0012). No server-side email send. Recruiter attaches PDF manually.
- Nav: new Facturation item visible only if `finance.view`. Two areas: Suivi (charts + slices) and Devis list. Recruteur / Communication: Mission UI only.
- Accueil / dashboard overview: no CA/Marge widgets.
- Permissions: create/send/accept = `crm.write` (all four roles). Marge, Facturé, Facturation module, CA/Marge widgets = `finance.view`. Recruteur sees Devis HT/TTC on the Mission form.
- Attribution: Mission Referent (optional → Sans référent). Slices: Referent, Pharmacy, contract type, dates, commercial-status counts. Not Candidate.
- ActivityLog: reuse type DEVIS on send/accept.
- Architecture constraints unchanged: Prisma only in repositories; tRPC; view-models; RHF+Zod; files under 100 lines; RSC reads / client mutations; CA/Marge never in Zustand.
- Glossary already updated in `CONTEXT.md` (Devis, Commercial status, CA / Marge, Finance context, Document, Referent).

Prototype-shaped state (decision-rich, not a demo):

```
DevisKind: INTERIM | CDD | CDI
DevisStatus: DRAFT | SENT | ACCEPTED

// current = latest SENT|ACCEPTED by sentAt
// CommercialStatus (Mission, derived):
//   none current → SANS_DEVIS
//   current SENT → ENVOYE
//   current ACCEPTED && !invoicedAt → ACCEPTE
//   current ACCEPTED && invoicedAt → FACTURE

// CA = mission.status === ANNULEE ? 0
//    : current?.status === ACCEPTED ? current.amountHt
//    : 0
// CA bucket date = current.acceptedAt
// Marge follow-up = mission.marge (manual); 0/hidden when CA is 0 or ANNULEE
```

## Testing Decisions

Good tests assert external behavior (caller results, derived CA, commercial status, permission denials), not React chart internals or Excel cell labels.

Existing seams (prefer these):

1. **tRPC + createCaller** — primary seam for Devis create/save/send/accept/invoice-mark and Facturation list/stats, same pattern as `missionRouter` / `dashboardRouter`.
2. **`can(role, action)`** — `crm.write` vs `finance.view` (Facturation nav, Marge, CA in stats). Prior art: `permissions.test.ts`, `permissions.caller.test.ts`.
3. **Mission lifecycle** — ANNULEE must yield CA 0; prior art: `mission-lifecycle.test.ts` / mission status tests.
4. **Document create** — send attaches DEVIS Document on Mission; prior art: document router/schema tests.
5. **Gmail compose URL** — send returns/opens compose to Contact email; prior art: `build-compose-url.test.ts`, EmailButton tests. Do not assert a server mail send.
6. **PDF generation** — snapshot/contract tests like Interview / anonymized dossier PDFs (destinataire filled, HT/TTC present).
7. **ActivityLog** — type DEVIS on send/accept; fixtures already use `devisEntity`.

New seams (keep high):

8. **Pure `MedijobEngine` port** — hours+rate → HT/TTC (and indicative margin). Fixture numbers from WeTransfer `engine.js` / Excel mapping; no DOM.
9. **Pure commercial-status + CA derivation** — given Mission + Devis[], assert current Devis, Commercial status, CA, date. This is the follow-up read-model; charts consume it, they are not the test.
10. **Pharmacy document aggregation** — list includes Mission DEVIS files for that Pharmacy (view-model or list query), one blob.

Do not test Recharts layout. Do not test Netlify/Supabase proto. Repository/Testcontainers only where persistence rules (current Devis, snapshot JSON, ANNULEE) cannot be proven at caller/pure seams.

## Out of Scope

- Full op-medijob proto: `/candidats`, `/clients`, `/interim` tracking, `/placements`, `/mensuel` objectives, `/tarifs` admin, groupements RFA, partenaires
- Candidate salary estimator (WeTransfer onglet Candidats)
- Intérim vs recrutement comparatif block
- Packaged 6-profile Medijob tarifs and tarifs admin CMS
- Legal Invoice entity, invoice PDF, payments, Pennylane, having/credit notes
- CA × duration or monthly unrolling of one intérim Devis
- Follow-up slice by Candidate
- Facturation nav for Recruteur / Communication
- CA/Marge on Accueil
- Server-sent email with PDF attached
- Duplicate Document on Pharmacy
- Keeping Netlify / WeTransfer as systems of record
- YouSign, e-signature
- Changing the four-role `crm.write` matrix beyond Devis (Q2 stays as code today)

## Further Notes

- CSV source: `docs/Guide_CRM_V1_Operationnel.csv` (performance table + Facturation / sous-onglet Devis, link op-medijob).
- Formula source: WeTransfer `medijob-devis` (`data.js`, `engine.js`) for the calculate path only.
- Q13 answer (2026-08-19, grill): subset — Mission Devis + Facturation follow-up; not full proto.
- Parent epic: #210. GitHub: [#325](https://github.com/Piamias-Victor/crm-medijob/issues/325). Supersedes HITL #234. Split implementation with `/to-issues`.
- Follow-ups (not this PRD): admin tarifs if prices stop being free; candidate estimator; real invoicing; placement hours → CA.
