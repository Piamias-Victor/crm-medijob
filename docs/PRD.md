# PRD — CRM MediJob V2

> **Statut** : Ready for implementation  
> **Sources** : `SPEC_V2.md`, `CONTEXT.md`, `docs/adr/0001`–`0010`  
> **Périmètre nav** : Candidats · Pharmacies · Contacts · Missions · Offres d'emploi · Assistant IA  
> **Périmètre complet** : + Auth · Admin · Pipeline · Applications · IA transverse

---

## Problem Statement

Medijob est une agence de recrutement spécialisée en pharmacie d'officine. Aujourd'hui, les recruteurs n'ont pas d'outil interne unifié pour piloter le cycle complet d'un besoin de staffing — de l'identification du besoin client jusqu'au placement du candidat.

Les données sont dispersées : CVthèque, portefeuille pharmacies, contacts, missions en cours, offres publiques sur le site Webflow, candidatures entrantes. Les recruteurs perdent du temps à ressaisir des informations, manquent de visibilité sur l'avancement des candidats sur les missions, et n'ont pas d'assistance IA intégrée pour l'extraction CV, le matching, ou la rédaction.

Le besoin est un **CRM mono-instance, interne, pour quelques recruteurs**, couvrant l'opérationnel (Mission, Pipeline, MissionCandidate) distinctement de la vitrine publique (JobOffer, Application).

---

## Solution

Construire **CRM MediJob V2** — une application Next.js 15 mono-app qui centralise :

1. **CVthèque** — gestion des Candidates, extraction IA des CV, profils enrichis
2. **Portefeuille client** — Pharmacies, Contacts, enrichissement SIRET
3. **Opérationnel staffing** — Missions avec cycle de vie, Pipeline candidats (MissionCandidate + PipelineStage)
4. **Vitrine emploi** — JobOffers publiées sur Webflow, Applications entrantes traitées dans un inbox dédié
5. **Intelligence** — matching IA déterministe + Gemini, assistant chat contextuel
6. **Administration** — référentiels (métiers, LGO, groupements, pipeline) et utilisateurs

Tous les recruteurs voient toutes les données. Le Referent est une responsabilité de suivi, pas une restriction d'accès.

---

## User Stories

### Fondations transverses

1. As a recruteur, I want to log in with email and password, so that I can access the CRM securely.
2. As an ADMIN, I want to manage user accounts and roles (RECRUTEUR | ADMIN), so that access to admin configuration is controlled.
3. As a recruteur, I want a consistent Medijob design system across all pages, so that the tool feels professional and familiar.
4. As a developer, I want all reads via RSC and all mutations via tRPC, so that data flow is predictable and type-safe.
5. As a recruteur, I want soft-deleted records hidden from all views, so that deleted data does not clutter my work.
6. As a recruteur, I want to assign and reassign a Referent on any Candidate or Mission, so that responsibility is clear without restricting team collaboration.
7. As a recruteur, I want a global search across entities, so that I can quickly find a candidate, pharmacy, or mission.

### Module Candidats

8. As a recruteur, I want to see the CVthèque as a list view, so that I can browse all Candidates.
9. As a recruteur, I want to see the CVthèque as a kanban by PipelineStage, so that I can visualize candidate progression across active Missions.
10. As a recruteur, I want each kanban card to show a Candidate with their active Missions only, so that I see relevant in-progress work without terminal history.
11. As a recruteur, I want to drag a specific Mission row on a kanban card to change its PipelineStage, so that I can update one MissionCandidate without affecting others.
12. As a recruteur, I want to upload a CV PDF and trigger IA extraction, so that Candidate fields are pre-filled automatically.
13. As a recruteur, I want to review and edit extracted fields before confirming, so that IA errors do not pollute the CVthèque.
14. As a recruteur, I want extracted job titles resolved to the JobTitle referential, so that matching uses structured data.
15. As a recruteur, I want to set a Candidate's JobTitle, Software skills, preferred contract types, mobility radius, and availability, so that matching pre-filtering works correctly.
16. As a recruteur, I want an informational profile completeness banner when matching-critical fields are missing, so that I know why a Candidate may be excluded from distance matching.
17. As a recruteur, I want to generate an IA summary of a Candidate profile, so that I have a readable synthesis for internal use.
18. As a recruteur, I want to generate an anonymized profile and export it as PDF, so that I can present candidates to pharmacies without PII.
19. As a recruteur, I want to view a Candidate's ActivityLog timeline filtered by type, so that I can see the full interaction history.
20. As a recruteur, I want to see all Missions a Candidate is positioned on with their PipelineStage, so that I have a complete placement view.
21. As a recruteur, I want to run reverse matching from a Candidate to find compatible Missions, so that I can proactively propose opportunities.
22. As a recruteur, I want to view a Candidate's CV, IA summary, anonymized profile, and attached Documents, so that all candidate assets are in one place.
23. As a recruteur, I want to soft-delete a Candidate, so that removed profiles no longer appear in the CRM.

### Module Applications (onglet Candidatures reçues)

24. As a recruteur, I want to see inbound Applications in a dedicated inbox tab under Candidats, so that website candidacies are separate from the CVthèque.
25. As a recruteur, I want each Application tied to a specific JobOffer, so that I know which posting the person applied to.
26. As a recruteur, I want duplicate detection when an Application matches an existing Candidate (email or name+phone), so that I avoid creating duplicates unknowingly.
27. As a recruteur, I want to choose merge or create-anyway when a duplicate Candidate is detected, so that I control how inbound data is integrated.
28. As a recruteur, I want a diff review screen when merging an Application into an existing Candidate, so that no data is overwritten without my validation.
29. As a recruteur, I want an informative alert (not merge) when a duplicate Application exists, so that I know about repeat submissions without losing separate records.
30. As a recruteur, I want to accept an Application and convert it to a Candidate, so that qualified applicants enter the CVthèque.
31. As a recruteur, I want to refuse an Application without creating a Candidate, so that rejected applicants stay out of the CVthèque but remain for stats.
32. As a recruteur, I want to soft-delete an Application, so that I can clean up the inbox.

### Module Pharmacies

33. As a recruteur, I want to list all Pharmacies with name, city, Groupement, status, primary Contact, and mission count, so that I have a portfolio overview.
34. As a recruteur, I want to create and edit a Pharmacy with SIRET, address, LGO (Software), Groupement affiliation, and commercial status, so that client data is complete.
35. As a recruteur, I want to search pharmacies by name or SIRET via the government API, so that I can auto-fill legal identity fields.
36. As a recruteur, I want TVA intracommunautaire calculated from SIREN, so that billing data is available without manual computation.
37. As a recruteur, I want to see a Pharmacy's Contacts, active Missions, ActivityLog, and Documents on its detail page, so that all client context is centralized.
38. As a recruteur, I want to quickly create a new Mission from a Pharmacy's "Besoins en cours" tab, so that I can capture staffing needs in context.
39. As a recruteur, I want network affiliation expressed via Groupement (not a separate pharmacy type), so that grouping is explicit and administrable.
40. As a recruteur, I want to soft-delete a Pharmacy, so that inactive clients are removed from daily views.

### Module Contacts

41. As a recruteur, I want to list all Contacts with name, role, pharmacy, phone, email, and date added, so that I can find interlocutors quickly.
42. As a recruteur, I want every Contact to belong to exactly one Pharmacy, so that the client hierarchy is always clear.
43. As a recruteur, I want to designate one primary Contact per Pharmacy via `isPrimary`, so that the default interlocutor is obvious.
44. As a recruteur, I want to keep former titulaires active when a new primary Contact is designated, so that mission history is preserved.
45. As a recruteur, I want to see Missions where a Contact is the interlocutor, so that I understand their staffing involvement.
46. As a recruteur, I want ActivityLog and Documents on a Contact detail page, so that commercial follow-up is traceable.
47. As a recruteur, I want to soft-delete a Contact, so that departed interlocutors can be hidden without losing history.

### Module Missions

48. As a recruteur, I want to list Missions with title, JobTitle, pharmacy, city, Mission status, Referent, and start date, so that I can monitor all staffing needs.
49. As a recruteur, I want a kanban of Missions by Mission status, so that I can drag Missions through their lifecycle.
50. As a recruteur, I want to create a Mission with JobTitle, contract type, dates, salary, planning, Pharmacy, optional Contact, and Referent, so that operational needs are fully described.
51. As a recruteur, I want a Mission detail page with info, pipeline, matching, JobOffer, history, and documents tabs, so that all mission work is in one place.
52. As a recruteur, I want to position Candidates on a Mission via MissionCandidate, so that I track who is being considered.
53. As a recruteur, I want a pipeline kanban on the Mission showing Candidates by PipelineStage, so that I manage progression per mission.
54. As a recruteur, I want to drag Candidates between PipelineStages on a Mission, so that I update MissionCandidate stages visually.
55. As a recruteur, I want to run IA matching on a Mission to score compatible Candidates, so that I find the best fits efficiently.
56. As a recruteur, I want matching pre-filtering by JobTitle compatibility matrix, mobility (default 30 km), geo (requires city+postalCode), availability (null = immediate), and preferred contract types, so that IA only scores relevant Candidates.
57. As a recruteur, I want to contact a matched Candidate by email (Resend), phone, or WhatsApp, so that I can reach out without leaving the CRM.
58. As a recruteur, I want an email to a Candidate from matching to create two ActivityLogs (Candidate + Mission), so that both timelines reflect the interaction.
59. As a recruteur, I want to mark a Mission as POURVU and designate the placed Candidate, so that successful placements are recorded.
60. As a recruteur, I want non-placed MissionCandidates to move to "Pas retenu" when a Mission is POURVU, so that terminal states are clear.
61. As a recruteur, I want all MissionCandidates to move to "Pas retenu" when a Mission is ANNULEE, so that cancelled needs don't leave candidates in active stages.
62. As a recruteur, I want POURVU/ANNULEE Missions removed from active kanbans, so that my views show only in-progress work.
63. As a recruteur, I want to attach Documents and ActivityLog to a Mission, so that contracts and follow-up are tracked.
64. As a recruteur, I want to soft-delete a Mission, so that abandoned needs are hidden from daily views.

### Module Offres d'emploi

65. As a recruteur, I want to generate a JobOffer from a Mission using IA, so that public posting content is drafted automatically.
66. As a recruteur, I want to edit JobOffer content before publication, so that I control what appears on the website.
67. As a recruteur, I want a JobOffer to be an optional child of a Mission, so that not every staffing need requires a public posting.
68. As a recruteur, I want to publish a JobOffer to Webflow CMS, so that it appears on the Medijob website.
69. As a recruteur, I want to unpublish a JobOffer from Webflow, so that filled or cancelled postings are removed from the site.
70. As a recruteur, I want to list JobOffers with title, linked Mission, status, publication date, and application count, so that I monitor public postings.
71. As a recruteur, I want to see all Applications received on a JobOffer detail page, so that I can process candidacies per posting.
72. As a recruteur, I want Webflow to send candidacies via webhook with HMAC validation, so that only legitimate submissions are accepted.
73. As a recruteur, I want to soft-delete a JobOffer, so that obsolete postings are hidden.

### Module Assistant IA

74. As a recruteur, I want a dedicated Assistant IA page with a chat interface, so that I can ask questions in natural language.
75. As a recruteur, I want to load context from a Candidate, Pharmacy, or Mission into the assistant, so that responses are grounded in CRM data.
76. As a recruteur, I want predefined shortcuts (summarize candidate, summarize pharmacy, draft candidate email, draft pharmacy email, generate offer, weekly report), so that common tasks are one click away.
77. As a recruteur, I want all IA responses validated by Zod before use, so that malformed AI output never reaches the database.

### Module Admin

78. As an ADMIN, I want to CRUD PipelineStages with drag-and-drop ordering, so that pipeline steps match our recruitment process.
79. As an ADMIN, I want default PipelineStages (Nouveau, Contacté, Entretien, Proposition, Placé, Pas retenu), so that the system is usable on day one.
80. As an ADMIN, I want to CRUD Software (LGO) entries, so that pharmacy and candidate software skills are normalized.
81. As an ADMIN, I want to CRUD Groupement entries, so that pharmacy network affiliations are standardized.
82. As an ADMIN, I want to CRUD JobTitle entries, so that job roles are administrable.
83. As an ADMIN, I want to configure a JobTitle compatibility matrix (mission JobTitle → accepted candidate JobTitles), so that matching pre-filtering reflects business rules.
84. As an ADMIN, I want default JobTitle seeds and compatibility matrix, so that the system works out of the box for pharmacy staffing.

### Module Pipeline (transverse)

85. As a recruteur, I want PipelineStage names to be free-form and administrable, so that our process can evolve without code changes.
86. As a recruteur, I want Mission status (A_POURVOIR → POURVU/ANNULEE) independent from PipelineStage, so that mission lifecycle and candidate progression are not conflated.
87. As a recruteur, I want a Candidate positionable on multiple Missions simultaneously, so that parallel opportunities are tracked independently.

---

## Implementation Decisions

### Stack (non négociable)

| Couche | Choix |
|--------|-------|
| Framework | Next.js 15 App Router |
| API | tRPC v11 — wrappers tRPC uniquement |
| DB | Prisma + Neon PostgreSQL |
| Auth | NextAuth v5 — email/password Argon2id, sessions DB |
| CSS | Tailwind v4 CSS-native |
| Animation | Framer Motion |
| Tests | Vitest + Testcontainers |
| Déploiement | Vercel |
| Storage | Vercel Blob (CV + Documents) |
| Email | Resend |
| PDF | `@react-pdf/renderer` |
| IA | Gemini Flash-Lite via `EXTRACTION_PROVIDER` abstraction |
| SIRET | `recherche-entreprises.api.gouv.fr` |
| Publication | Webflow CMS API |
| Icons | `lucide-react` |

### Architecture

- **Single-app monolith** — logical bounded contexts (Candidates, Pharmacies, Contacts, Missions, Pipeline, JobOffers, Applications, AI, Auth) without separate deployables.
- **Prisma uniquement dans les repositories** — routers tRPC appellent les repositories, jamais Prisma directement.
- **RSC pour lectures** — `createCaller` côté serveur, jamais de `fetch` interne vers nos propres routes.
- **Mutations via `trpc.useMutation()`** — uniquement dans les Client Components.
- **Atomic design strict** — atoms → molecules → organisms ; zéro logique métier dans les composants.
- **View-models** — pont entre schéma DB et UI.
- **Zustand** — UI state uniquement (sidebar, modales, thème).
- **Fichiers < 100 lignes** — bloquant CI.
- **React Hook Form + Zod** — tous les formulaires et toutes les entrées externes (y compris réponses IA).

### Navigation (6 sections + Admin)

| Section | Route racine | Contenu clé |
|---------|-------------|------------|
| Candidats | `/candidats` | CVthèque (liste + kanban) + onglet Applications |
| Pharmacies | `/pharmacies` | Portefeuille client |
| Contacts | `/contacts` | Interlocuteurs pharmacies |
| Missions | `/missions` | Besoins staffing (liste + kanban statuts) |
| Offres | `/offres` | JobOffers + publication Webflow |
| Assistant IA | `/assistant` | Chat + raccourcis |
| Admin | `/admin/*` | Pipeline, LGO, Groupements, Métiers, Utilisateurs |

### Décisions domaine (ADRs)

| ADR | Décision |
|-----|----------|
| 0001 | Kanban CVthèque : missions actives uniquement ; drag par mission |
| 0002 | Affiliation réseau via Groupement, pas `PharmacyType.GROUPE` |
| 0003 | Email matching → double ActivityLog (Candidate + Mission) |
| 0004 | Pipeline = contexte autonome (PipelineStage + MissionCandidate) |
| 0005 | PipelineStage noms libres, pas d'enum sémantique |
| 0006 | Fusion Application → Candidate avec écran diff |
| 0007 | Soft delete seul en V2 ; purge physique hors produit |
| 0008 | POURVU/ANNULEE → transitions pipeline (Placé / Pas retenu) |
| 0009 | JobTitle référentiel admin + matrice compatibilité |
| 0010 | Géolocalisation requise pour matching ; bandeau profil incomplet |

### Schéma Prisma complet

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole { RECRUTEUR ADMIN }

enum PharmacyType { INDEPENDANTE CLINIQUE }

enum PharmacyStatus { PROSPECT ACTIF INACTIF }

enum ContactRole { TITULAIRE ADJOINT PREPARATEUR_REFERENT RESPONSABLE_RH AUTRE }

enum ContractType { CDI CDD INTERIM VACATION }

enum MissionStatus {
  A_POURVOIR EN_RECHERCHE CANDIDATS_PRESENTES
  ENTRETIEN_EN_COURS POURVU ANNULEE
}

enum ActivityType {
  APPEL EMAIL ENTRETIEN MISSION NOTE
  ACTION_COMMERCIALE DEVIS AUTRE
}

enum DocumentCategory { CONTRAT DEVIS FACTURE CONVENTION AUTRE }

enum DocumentEntityType { PHARMACY CONTACT MISSION CANDIDATE }

enum ApplicationStatus { EN_ATTENTE ACCEPTEE REFUSEE }

enum JobOfferStatus { BROUILLON PUBLIEE DEPUBLIEE }

// Auth (NextAuth v5)
model Account { /* userId, provider, tokens… */ }
model Session { /* sessionToken, userId, expires */ }
model VerificationToken { /* identifier, token, expires */ }

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String
  role      UserRole  @default(RECRUTEUR)
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// Référentiels administrables
model Software { id String @id name String @unique createdAt DateTime }
model Groupement { id String @id name String @unique createdAt DateTime }
model PipelineStage { id String @id name String position Int createdAt updatedAt }
model JobTitle { id String @id name String @unique createdAt DateTime }
model JobTitleCompatibility {
  missionJobTitleId   String
  candidateJobTitleId String
  @@id([missionJobTitleId, candidateJobTitleId])
}

// Candidates
model Candidate {
  id, firstName, lastName, email?, phone?, address?, city?, postalCode?
  jobTitleId, mobilityRadiusKm?, mobilityNotes?, availableFrom?
  cvUrl?, cvSummary?, anonymizedProfile?, notes?
  referentId, deletedAt?, createdAt, updatedAt
}

model CandidateContractPreference {
  candidateId, contractType
  @@id([candidateId, contractType])
}

model CandidateSoftware {
  candidateId, softwareId
  @@id([candidateId, softwareId])
}

// Pharmacies
model Pharmacy {
  id, name, siret? @unique, numeroTVA?, address?, city?, postalCode?
  phone?, email?, website?, type?, status, groupementId?, softwareId?
  paymentConditions?, notes?, deletedAt?, createdAt, updatedAt
}

// Contacts
model Contact {
  id, pharmacyId, firstName, lastName, email?, phone?
  role, isPrimary, notes?, deletedAt?, createdAt, updatedAt
}

// Missions
model Mission {
  id, pharmacyId, contactId?, referentId, jobTitleId
  title, description?, contractType, startDate, endDate?
  status, salaireMin?, salaireMax?, salaireNotes?
  heuresParSemaine?, planning?, tempsPlein, notes?
  deletedAt?, createdAt, updatedAt
}

model MissionCandidate {
  missionId, candidateId, stageId, createdAt, updatedAt
  @@id([missionId, candidateId])
}

// JobOffers
model JobOffer {
  id, missionId @unique, title, content, status
  webflowItemId?, publishedAt?, deletedAt?, createdAt, updatedAt
}

// Applications
model Application {
  id, jobOfferId, firstName, lastName, email, phone?, city?
  jobTitleId?, cvUrl?, message?, status, candidateId?
  deletedAt?, createdAt, updatedAt
}

// Polymorphes
model ActivityLog {
  id, entityType, authorId, type, content?, date, createdAt
  candidateId?, pharmacyId?, contactId?, missionId?
}

model Document {
  id, entityType, category, name, url, size?, mimeType?, createdAt
  pharmacyId?, contactId?, missionId?, candidateId?
}
```

> Schéma détaillé avec relations complètes : voir `SPEC_V2.md` section 3.2.

### Seeds initiaux

| Référentiel | Quantité défaut | Valeurs |
|-------------|----------------|---------|
| PipelineStage | 6 | Nouveau, Contacté, Entretien, Proposition, Placé, Pas retenu |
| Software | 8 | LGO courants (Winpharma, Pharmagest, etc.) |
| JobTitle | 5 | Pharmacien, Préparateur, Étudiant pharma, Rayoniste, Autre |
| JobTitleCompatibility | matrice | Voir SPEC_V2 section 10 |

### Contrats API clés (tRPC)

| Router | Procédures principales |
|--------|----------------------|
| `candidate` | list, getById, create, update, softDelete, extractCv, generateSummary, generateAnonymized, exportPdf |
| `application` | listInbox, accept, refuse, merge, softDelete |
| `pharmacy` | list, getById, create, update, softDelete, searchSiret |
| `contact` | list, getById, create, update, softDelete |
| `mission` | list, getById, create, update, softDelete, updateStatus, matchCandidates |
| `missionCandidate` | position, updateStage, remove |
| `jobOffer` | list, getById, generate, update, publish, unpublish, softDelete |
| `activityLog` | listByEntity, create |
| `document` | listByEntity, upload, delete |
| `matching` | scoreForMission, scoreForCandidate, sendEmail |
| `assistant` | chat |
| `admin.pipeline` | CRUD + reorder |
| `admin.software` | CRUD |
| `admin.groupement` | CRUD |
| `admin.jobTitle` | CRUD + updateCompatibilityMatrix |
| `admin.user` | CRUD + role |

### Webhook

- `POST /api/webhooks/webflow` — validation HMAC, création Application, dédoublonnage.

### Matching — règles Phase 1

```
jobTitle : JobTitleCompatibility (mission.jobTitleId → candidate.jobTitleId)
mobility : distance ≤ mobilityRadiusKm (null → 30 km)
geo      : city + postalCode requis des deux côtés, sinon paire exclue
availability : availableFrom ≤ mission.startDate (null → immédiat)
contract : mission.contractType ∈ preferredContractTypes (vide → pas de filtre)
```

### Transitions Mission status

```
POURVU  → placé = « Placé », autres = « Pas retenu »
ANNULEE → tous = « Pas retenu »
→ mission sort des kanbans actifs
```

### IA — validation Zod obligatoire

| Fonction | Schéma sortie |
|----------|--------------|
| Extraction CV | `CvExtractionSchema` |
| Résumé candidat | `{ summary: string.min(1) }` |
| Offre emploi | `{ title, content.min(100) }` |
| Matching | `[{ candidateId, score, justification }]` |

### Environnement

`DATABASE_URL`, `NEXTAUTH_SECRET`, `EXTRACTION_PROVIDER`, `GEMINI_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `RESEND_FROM`, `WEBFLOW_API_TOKEN`, `WEBFLOW_COLLECTION_ID`, `WEBFLOW_WEBHOOK_SECRET`

---

## Testing Decisions

### Principe

Tester le **comportement externe observable** — entrées/sorties des routers tRPC, repositories, et webhooks — pas les détails d'implémentation UI. Les composants React sont testés via les contrats de données (view-models) et les mutations tRPC mockées si nécessaire.

### Seams de test (du plus haut au plus bas)

| Priorité | Seam | Quoi tester | Outil |
|----------|------|-------------|-------|
| 1 | **tRPC routers + repositories** | CRUD, soft delete, transitions POURVU/ANNULEE, matching pre-filter, dédoublonnage Application | Vitest + Testcontainers (Postgres réel) |
| 2 | **Webhook Webflow** | Validation HMAC, création Application, rejet signature invalide | Vitest + mock Request |
| 3 | **Provider IA (`EXTRACTION_PROVIDER=mock`)** | Extraction CV, matching, génération offre — Zod rejette sorties invalides | Vitest, mock injecté |
| 4 | **Services externes mockés** | Resend (email), Webflow CMS (publish/unpublish), SIRET API, Vercel Blob | Vitest, interfaces mock |
| 5 | **View-models** | Mapping DB → UI (kanban cards, profile completeness, active missions filter) | Vitest unitaire pur |

### Modules testés en priorité

1. **Matching pre-filter** — matrice JobTitle, mobilité 30 km défaut, geo exclusion, contract preferences
2. **Application workflow** — accept/refuse/merge/dedup
3. **Mission transitions** — POURVU/ANNULEE → pipeline stages
4. **MissionCandidate** — positionnement parallèle, updateStage
5. **Soft delete** — entités masquées des listes
6. **ActivityLog** — double entrée email

### Prior art

Repo vert — pas de tests existants. Les conventions Vitest + Testcontainers de la stack imposée servent de base. Chaque repository a son fichier de test miroir.

---

## Out of Scope

- **Multi-tenant / multi-agence** — mono-instance Medijob uniquement
- **Purge physique / droit à l'oubli en UI** — soft delete seul ; purge via script CLI hors produit (ADR-0007)
- **Restauration soft-deleted en UI** — masqués pour tous ; restauration script CLI uniquement
- **Application mobile** — desktop web uniquement
- **Portail candidat / pharmacie** — pas d'accès externe au CRM
- **Facturation / comptabilité** — hors périmètre V2
- **Notifications push / temps réel** — pas de WebSocket
- **Intégrations ATS tierces** — hors Webflow + Resend + Gemini
- **Relecture juridique RGPD** — à faire avant production, hors scope dev
- **Dark mode** — tokens préparés, activation non prioritaire
- **Recherche globale avancée** — issue #29, finitions V2

---

## Further Notes

### Ordre de développement recommandé

1. **Bloc 0** — Design system, auth, schema Prisma + seeds
2. **Bloc 1** — Candidats (CVthèque, extraction IA, profils)
3. **Bloc 2** — Pharmacies & Contacts (SIRET, documents)
4. **Bloc 3** — Missions (pipeline, matching)
5. **Bloc 4** — Offres (IA, Webflow, webhook Applications)
6. **Bloc 5** — IA avancée (matching inversé, assistant)
7. **Bloc 6** — Admin référentiels + finitions

### Risques identifiés

- **Dépendance Gemini** — mitigée par `EXTRACTION_PROVIDER=mock` en dev/test
- **Webflow API** — publication manuelle testable en staging
- **RGPD** — relecture juridique bloquante avant prod
- **Fichiers < 100 lignes** — pression architecturale dès le départ ; splitter systématiquement

### Glossaire

Vocabulaire canonique : `CONTEXT.md`. Ne pas utiliser les termes listés sous `_Avoid_` dans le code, les issues, ou les tests.
