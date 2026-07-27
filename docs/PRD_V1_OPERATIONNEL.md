# PRD V1 Opérationnel — CRM MediJob

> **Statut** : Ready for implementation (`ready-for-agent`)  
> **Sources** : `docs/Guide_CRM_V1_Operationnel.csv` · `docs/grill/CSV_V1_DECISIONS.md` · `docs/grill/QUESTIONS_CLIENT_V1.md` · `CONTEXT.md` · grill session 2026-07-27  
> **Remplace comme source de backlog** : ancienne backlog SPEC_COMPLEMENTAIRE / issues #153–#190 (fermées)  
> **Base code** : conserver l’existant ; DB repart de zéro (pas de migration de data)

---

## Problem Statement

Medijob n’a pas encore un CRM opérationnel aligné sur le cahier des charges V1 client. Les recruteurs ont besoin d’un outil quotidien unique pour gérer pharmacies, contacts, CVthèque, missions, offres site, matching IA, candidatures entrantes, assistant IA, cartographie, fiche d’entretien, pilotage KPI/alertes et suivi finance/performance — sans ressaisie et avec des droits différenciés (Direction / Recruteur / Communication / RH-Admin).

Une base technique existe déjà (Next.js, tRPC, Prisma, modules ops partiels). Elle doit être **alignée à la lettre** sur le Guide CRM V1 Opérationnel, pas reconstruite from scratch.

---

## Solution

Livrer le **module opérationnel V1** du CRM MediJob en s’appuyant sur le code actuel :

1. **Socle** — auth (reset + idle 30 min), 4 rôles + matrice d’actions, CA/Marge gated, recherche globale, palette Medijob, référent optionnel sur 4 entités, vue rapide, ActivityLog auto, aperçu documents  
2. **Pharmacies / Contacts / Candidats / Missions** — tableaux + filtres CSV, maps, imports CSV + fusion, statuts alignés, timeline historique enrichie  
3. **Offres + candidatures** — génération IA, cycle publish Webflow (hypothèse), inbox accept/refus/dédup  
4. **Matching + Assistant** — critères enrichis (prétentions), contact multi-select (canal à confirmer), CR hebdo data-driven  
5. **Dashboard** — KPI + centre d’alertes  
6. **Ajouts CSV** — fiche d’entretien intégrée ; Finance/perf + Facturation/Devis (inventaire proto client)

Les questions client ouvertes (Q2, Q4–Q13) restent des **hypothèses de travail** documentées ci-dessous jusqu’à confirmation.

---

## User Stories

### Socle & sécurité

1. As a User, I want to sign in with email and password, so that I can access the CRM securely.
2. As a User, I want to reset my password via a one-shot email link, so that I can recover access without an admin.
3. As a User, I want to be logged out after 30 minutes of inactivity, so that idle sessions do not stay open.
4. As Direction or RH-Admin, I want four UserRoles (Direction, Recruteur, Communication, RH-Admin), so that access matches Medijob’s organization.
5. As Communication, I want read-only access to CRM ops entities, so that I can consult without editing staffing data.
6. As Recruteur, I want full CRUD on Pharmacies, Contacts, Candidates, and Missions, so that I can run daily staffing.
7. As Communication, I want to draft and publish JobOffers, so that I can run content without owning matching.
8. As Recruteur, I want to accept or refuse Applications, so that the inbox feeds the CVthèque.
9. As Direction or RH-Admin, I want to manage referentials and users, so that configuration stays controlled.
10. As Direction or RH-Admin only, I want to soft-delete core entities, so that destructive actions are limited.
11. As Direction or RH-Admin, I want to see CA and Marge fields, so that financial steering is restricted.
12. As Recruteur or Communication, I must not see CA or Marge, so that sensitive margins stay confidential.
13. As a User, I want the existing navigation (Accueil, Candidats, Pharmacies, Contacts, Missions, Offres, Assistant, Admin), so that I keep a familiar IA.
14. As a User, I want global search across Pharmacy, Contact, Candidate, and Mission, so that I find records quickly.
15. As a User, I want Medijob brand colors (teal, mint, sky, rose) and logo, so that the product matches brand identity.
16. As a User, I want an optional Referent on Pharmacy, Contact, Candidate, and Mission (defaulting to me), so that ownership is trackable and filterable.
17. As a User, I want a reusable quick-view side panel on list pages, so that I preview a record without leaving the list.
18. As a User, I want automatic ActivityLog entries on create/update (« Fiche créée / modifiée »), so that history is traceable.
19. As a User, I want document upload, download, delete, and in-app preview (PDF/image) on Pharmacy, Contact, Mission, and Candidate, so that files are usable without download-only friction.
20. As Direction or RH-Admin, I want GDPR capabilities as defined after client answers (consent, retention, erasure, register), so that personal data handling is compliant.

### Pharmacies

21. As a Recruteur, I want the pharmacy table to include postal code, created date, Referent, and quick-view, so that the list matches the CSV columns (keeping useful extras).
22. As a Recruteur, I want filters for city, region, and Referent (plus existing filters), so that I can segment the portfolio.
23. As a Recruteur, I want pharmacy quick-view to show coordinates, primary contacts, open needs, and last action, so that I triage from the list.
24. As a Recruteur, I want SIRENE prefill by name or SIRET (existing flow, UX polish allowed), so that creation is fast.
25. As a Recruteur, I want pharmacy status labels Client / Prospect / Inactif, so that vocabulary matches the CSV.
26. As a Recruteur, I want the Contacts tab on a Pharmacy, so that interlocutors stay attached.
27. As a Recruteur, I want Pharmacy history as a mixed timeline of ActivityLog + terminal Missions (POURVU / ANNULEE), so that past staffing is visible.
28. As a Recruteur, I want Pharmacy documents with categories contrat/devis/facture/convention, so that client files are organized.
29. As a Recruteur, I want Besoins en cours to list non-terminal Missions with visible contract type, so that open needs are clear.
30. As a Recruteur, I want CSV import for pharmacies with column mapping and duplicate merge (SIRET or name+city+postal code), so that I can onboard the existing book.
31. As a Recruteur, I want a map toggle on pharmacies filtered by Client / Prospect / Inactif, so that I see geographic coverage.

### Contacts

32. As a Recruteur, I want contact list columns with separate first/last name and quick-view (keeping primary badge), so that the annuaire matches the CSV.
33. As a Recruteur, I want contact filters for city and Referent (keeping extras), so that I find interlocutors.
34. As a Recruteur, I want Contact fields (identity, role, phone, email, pharmacy, createdAt, optional Referent), so that records are complete.
35. As a Recruteur, I want Contact creation blocked without a Pharmacy, so that every Contact is attached.
36. As RH-Admin or Direction, I want an admin Contact role referential (seed: titulaire, adjoint, préparateur référent, RH, comptabilité, autre), so that functions are configurable without deploy.
37. As a Recruteur, I want Contact history as ActivityLog only (no mission timeline on Contact), so that interaction history stays focused.
38. As a Recruteur, I want Contact documents with preview, so that attached files are usable.

### Candidats

39. As a Recruteur, I want CVthèque table columns including created date and quick-view (keeping extras), so that scanning matches the CSV.
40. As a Recruteur, I want filters for city, mobility, and Candidate status (plus existing filters), so that I segment the CVthèque.
41. As a Recruteur, I want candidate quick-view with coordinates, JobTitle, availability, IA summary, and last action, so that I preview profiles.
42. As a Recruteur, I want Candidate coordinates and professional profile fields (including interview notes), so that matching inputs are complete.
43. As a Recruteur, I want IA profile summary generation/editing, so that I can brief quickly.
44. As a Recruteur, I want CV upload → IA extraction → review → create, so that intake is assisted.
45. As a Recruteur, I want Candidate history as ActivityLog + MissionCandidate positionings, so that past missions and actions are visible.
46. As a Recruteur, I want anonymized PDF export, so that I can share profiles safely.
47. As a Recruteur, I want Candidate documents besides `cvUrl` (ID, diploma, RIB, attestations via Document), so that compliance files live on the fiche.
48. As a Recruteur, I want Candidate status Nouveau / À qualifier / Qualifié / En mission / Inactif / Blacklisté, so that CVthèque lifecycle is explicit.
49. As a Recruteur, I want « En mission » auto when the Candidate has a non-terminal MissionCandidate (while Inactif/Blacklisté remain manual overrides), so that status stays coherent.
50. As a Recruteur, I want CSV import of Candidates with dedup on email/phone and merge UI, so that the existing CVthèque can be loaded.
51. As a Recruteur, I want a map toggle on Candidates by city/department, so that I see geographic density.
52. As a Recruteur, I want salary expectations on Candidate used in matching, so that pay pretensions are a criterion.
53. As a Recruteur, I want an integrated interview form on create/fiche Candidate (fields from medijob-eval inventory), so that qualification updates the profile in-CRM.

### Missions

54. As a Recruteur, I want Missions as a table with CSV columns + quick-view (kanban optional toggle), so that list scanning matches the V1 guide.
55. As a Recruteur, I want full CSV filters (contract type, status, JobTitle, city, department, Pharmacy, Referent, period), so that I find needs quickly.
56. As a Recruteur, I want Mission descriptive fields including dedicated `profilRecherche`, so that the sought profile is structured.
57. As a Recruteur, I want salary, hours/week, planning, dates, and full/part-time fields, so that conditions are captured.
58. As a Recruteur, I want Mission links to Pharmacy, optional Contact, Referent, and contract type (including Vacation), so that staffing context is complete.
59. As a Recruteur, I want Mission statuses À pourvoir → Annulée, so that besoin lifecycle feeds Pharmacy needs.
60. As a Recruteur, I want MissionCandidate pipeline on the Mission fiche, so that process stages are tracked.
61. As a Recruteur, I want a map of Missions by Pharmacy location filtered by contract type/status, so that open needs are geographic.

### Offres d’emploi

62. As a Recruteur or Communication, I want IA generation of a JobOffer draft from a Mission, so that I avoid rewriting ads.
63. As a Recruteur or Communication, I want JobOffer lifecycle draft → validate → publish → unpublish, tied 1:1 to a Mission, so that publication is controlled.
64. As a Recruteur or Communication, I want publish/unpublish to sync to the Medijob website CMS (Webflow pending Q9), so that there is no double entry.
65. As a Recruteur or Communication, I want a central `/offres` table (status, Mission, application count), so that I manage all ads.
66. As a Recruteur or Communication, I want list actions edit / publish / unpublish / soft-delete, so that I operate from the list.

### Matching IA

67. As a Recruteur, I want scored Candidate suggestions for a Mission, so that I shortlist faster.
68. As a Recruteur, I want matching criteria including JobTitle, city, mobility, distance, availability, preferred contracts, Software, experience signals, salary expectations, and notes, so that ranking reflects ops reality.
69. As a Recruteur, I want multi-select Candidates from matching and contact them via the channel(s) chosen in Q10, so that outreach is batchable.
70. As a Recruteur, I want to attach selected Candidates to the Mission pipeline, so that shortlist becomes process.

### Candidatures site

71. As a Recruteur, I want Applications inbox as a table with CSV columns (including CV and message), so that inbound candidacies are actionable.
72. As a Recruteur, I want to accept an Application by creating or attaching a Candidate and keeping the CV, so that the CVthèque grows cleanly.
73. As a Recruteur, I want to refuse an Application with REFUSEE/soft-delete while keeping stats, so that noise is cleared without losing metrics.
74. As a Recruteur, I want duplicate detection (email/phone/name) before create-on-accept, so that I merge instead of duplicating.
75. As a system, I want Webflow (or confirmed CMS) webhook intake for Applications, so that site forms reach the inbox.

### Assistant IA

76. As a User, I want to summarize a Candidate or Pharmacy fiche on demand, so that I prepare calls faster.
77. As a User, I want IA email drafts for Candidate or Pharmacy context, so that outreach is faster.
78. As a Recruteur, I want IA candidate presentation for a client (existing present flows + assistant), so that I send polished briefs.
79. As a Recruteur, I want a P2 assistant shortcut for best profiles on a Mission backed by matching, so that chat can trigger shortlist.
80. As a Recruteur, I want a weekly report grounded in CRM data filtered by Referent, so that the CR reflects real activity.

### Dashboard

81. As a User, I want KPI bar: missions to fill, urgent (&lt;48h), Applications to process, fill rate, so that I see daily pressure.
82. As a User, I want an alerts center for uncovered Missions, untreated Applications, and overdue follow-ups (rule pending Q11), so that I know what to do next.

### Finance (CSV add — in scope)

83. As Direction or RH-Admin, I want performance tracking screens from the op-medijob inventory (Q13), so that steering matches the client prototype.
84. As Direction or RH-Admin, I want Facturation with a Devis sub-area as specified after Q13, so that quotes/invoices live in the CRM.
85. As Recruteur or Communication, I must not see CA/Marge widgets inside finance views, so that financial visibility stays role-gated.

### Admin & transverse leftover

86. As RH-Admin or Direction, I want admin CRUD for Contact roles like JobTitle admin, so that functions stay configurable.
87. As a User, I want soft-delete confirmation modals where deletion is allowed by role, so that deletes are intentional.
88. As a developer, I want a fresh DB seed with the four roles and referential defaults, so that V1 starts clean.

---

## Implementation Decisions

### Product / scope
- Source of truth: `docs/Guide_CRM_V1_Operationnel.csv` + `docs/grill/CSV_V1_DECISIONS.md`.
- Keep existing codebase; do not greenfield rewrite.
- Fresh database (no production data migration).
- Open client questions Q2, Q4–Q13: implement with documented working assumptions; adjust when answers arrive.
- Working assumptions until client confirms:
  - **Q2**: action matrix in decisions doc stands.
  - **Q9**: Webflow CMS for JobOffer sync.
  - **Q10**: prefer native deep links (`mailto:` / `sms:` / `wa.me`) unless client picks B/C.
  - **Q8**: map filters use Client / Prospect / Inactif only.
  - **Q11**: overdue follow-up = no ActivityLog for N days on open Mission (N configurable constant, default 7) until client sets rule.
  - **Q12/Q13**: integrate field inventories from linked prototypes; ship incremental screens once inventory is listed.

### Auth & permissions
- Replace legacy `ADMIN` | `RECRUTEUR` with Direction | Recruteur | Communication | RH-Admin.
- Central permission helper used by tRPC procedures and UI gates.
- CA/Marge view rights: Direction + RH-Admin only.
- Idle session timeout 30 minutes; password reset via email one-shot token.

### Domain / schema (deltas on existing Prisma base)
- Optional `referentId` on Pharmacy and Contact; relax required referent on Candidate/Mission to optional with UX default = current user.
- Pharmacy status user-facing label **Client** (replace Actif).
- Candidate status enum per CSV; derive En mission from non-terminal MissionCandidate.
- Candidate salary expectations field(s) for matching.
- Mission `profilRecherche` dedicated field.
- ContactRole becomes administrable referential (replace fixed enum) with CSV seeds including Comptabilité.
- lat/lng on Pharmacy and Candidate for maps; Mission map uses Pharmacy coordinates.
- Finance entities/screens per Q13 inventory (Quote/Invoice/performance metrics as needed).
- Interview structured fields on Candidate per Q12 inventory.
- Auto ActivityLog on entity create/update (system type or NOTE/AUTRE convention — pick one and keep consistent).

### Modules / interfaces
- Reuse atomic design + view-models + repositories + tRPC routers.
- Global search service across four entities.
- Quick-view panel component shared by list pages.
- Document preview modal/panel for PDF/image.
- Pharmacy/Candidate CSV import pipelines with mapping + merge review screens (mirror Candidate duplicate-merge UX).
- Missions list: table primary; kanban optional toggle.
- JobOffer module: generate, CRUD lifecycle, Webflow client seam, `/offres` UI.
- Application inbox table + accept/refuse/merge wired to intake services + webhook.
- Matching: enrich criteria; multi-select contact actions behind Q10 assumption.
- Assistant: week-report shortcut loads Referent-scoped metrics then asks model to narrate.
- Dashboard overview extended for KPI + alerts.
- Maps: list/map toggle; provider choice Mapbox or Leaflet+OSM left to implementer ADR if needed.

### Architecture constraints (repo)
- Prisma only in repositories.
- RSC reads via createCaller; mutations via `trpc.useMutation` in client components.
- Files &lt; 100 lines; no `any`; Zod on forms and AI outputs.
- Soft delete only in UI (hard erase only if Q6 requires it later).

---

## Testing Decisions

### What makes a good test
- Assert external behavior at the highest seam (caller/router, pure service, view-model), not internal private helpers.
- Prefer existing Vitest patterns (`createCaller`, repository unit/integration, RTL for critical UI).
- No browser E2E required for this PRD.

### Seams (confirmed)
1. **tRPC routers** — permissions, CRUD, matching, offers, applications, imports, dashboard KPIs/alerts, CA/Marge gating.
2. **View-models + Zod** — columns/filters, statuses, CSV mapping DTOs, permission matrix helpers.
3. **Pure services** — matching criteria, application intake accept/refuse/dedup, SIRENE, geocode, Webflow/CMS client, weekly report data assembly.
4. **Repositories (+ Testcontainers integration when DB behavior matters)** — soft delete, merge, optional referent, auto ActivityLog writes.
5. **UI RTL (targeted)** — quick-view, inbox actions, table/filter bars, map wrapper with mocked map SDK.
6. **New high seams** — permission matrix module; geocode/map markers; CMS publish client; finance read-model (after Q13).

### Prior art
- Router tests under `apps/web/src/server/routers/**/*.test.ts`
- Matching/prefilter tests under `apps/web/src/server/matching/`
- Application intake tests under `apps/web/src/server/application/`
- Integration tests `*.integration.test.ts` with Testcontainers
- View-model tests beside `src/view-models/`

### Deferred automated coverage until client answers
- Final GDPR erasure semantics (Q4–Q7)
- Exact overdue-alert rule if client rejects default (Q11)
- Full finance prototype parity (Q13)
- Paid SMS/WhatsApp provider flows if client picks Q10-C

---

## Out of Scope

- Greenfield rewrite of the existing CRM
- Migrating legacy production data (fresh DB)
- Native Excel `.xlsx` import (CSV only)
- Global search on JobOffer / Application in V1
- Documents on JobOffer / User
- Field-level audit diffs (create/update summary lines only)
- Twilio/WhatsApp Business unless client selects Q10-C
- Keeping Netlify interview/finance apps as systems of record once fields are in CRM (unless Q12/Q13 say otherwise)
- Dark mode, realtime websockets, restore UI for soft-deleted rows (unless GDPR Q6 forces a different erase path)
- Old closed backlog items that are not in the V1 CSV (e.g. standalone Tasks module from SPEC_COMPLEMENTAIRE) unless reintroduced by client answers

---

## Further Notes

### Open client questions (blockers for fine-tuning, not for starting core ops)
See `docs/grill/QUESTIONS_CLIENT_V1.md`:
- Q2 action matrix confirmation
- Q4–Q7 GDPR
- Q8 map status vocabulary
- Q9 CMS confirmation
- Q10 contact channels
- Q11 overdue follow-ups
- Q12 interview field inventory
- Q13 finance/perf inventory

### Glossary
Use `CONTEXT.md` terms: Candidate, Application, Mission, JobOffer, MissionCandidate, PipelineStage, Pharmacy, Contact, Referent, UserRole, Candidate status, Pharmacy status, Salary expectations, Contact role, CA/Marge, ActivityLog, Document, Soft delete.

### Delivery suggestion
Slice implementation by CSV poles: Socle → Pharmacies/Contacts → Candidats → Missions/Maps → Offres/Candidatures → Matching/Assistant → Dashboard → Entretien → Finance.

### References
- CSV: `docs/Guide_CRM_V1_Operationnel.csv`
- Decisions: `docs/grill/CSV_V1_DECISIONS.md`
- Client Qs: `docs/grill/QUESTIONS_CLIENT_V1.md`
- Grill index: `docs/grill/README.md`
