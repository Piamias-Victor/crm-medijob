# PRD V2 — CRM MediJob

> **Statut** : Ready for implementation (`ready-for-agent`)  
> **Sources** : `SPEC_V2.md` · `SPEC_COMPLEMENTAIRE.md` · Interview client 2026-06-24 · `CONTEXT.md` · `docs/audits/ETAT_DES_LIEUX.md`  
> **Remplace** : `docs/PRD.md`  
> **Périmètre nav** : Candidats · Pharmacies · Contacts · Missions · Offres · Tâches · Assistant IA · Admin

---

## Problem Statement

Medijob est une agence de recrutement spécialisée en pharmacie d'officine. Les recruteurs n'ont pas d'outil interne unifié pour piloter le cycle complet d'un besoin de staffing — de l'identification du besoin client jusqu'au suivi opérationnel de la mission pourvue.

Les données sont dispersées : CVthèque, portefeuille pharmacies, contacts, missions, offres Webflow, candidatures entrantes. Les recruteurs perdent du temps en ressaisies, manquent de visibilité tabulaire (filtres, export), ne détectent pas les doublons, et n'ont pas de suivi structuré des missions en cours ni de module tâches.

Le besoin est un **CRM mono-instance, interne, pour quelques recruteurs**, avec tableaux et filtres homogènes, pages `/new` dédiées, emails via `mailto:`, et distinction claire entre besoins à pourvoir et missions en cours d'exécution.

---

## Solution

Construire **CRM MediJob V2 complété** — application Next.js 15 mono-app centralisant :

1. **CVthèque** — table + toggle kanban, import CV, doublons, présentations pharmacie/périmètre
2. **Portefeuille client** — Pharmacies et Contacts en tableaux filtrables avec détection doublons pharmacies
3. **Opérationnel staffing** — Missions à pourvoir / en cours, CA mission et marge saisis manuellement, suivi heures/paie/factures, devis PDF
4. **Vitrine emploi** — JobOffers liées mission ou veille candidats, modèles par métier, Webflow
5. **Candidatures** — webhook, inbox tableau, accept/refuse/fusion
6. **Intelligence** — matching IA configurable, matching inversé, assistant chat
7. **Tâches** — module dédié avec auto-task missions futures
8. **Administration** — référentiels, modèles offres, statistiques financières

Tous les recruteurs voient toutes les données. Le Referent est informatif, réassignable par tout RECRUTEUR.

---

## User Stories

### Transverse

1. As a recruteur, I want to log in with email and password, so that I can access the CRM securely.
2. As an ADMIN, I want to manage user accounts and roles (RECRUTEUR | ADMIN), so that admin configuration is controlled.
3. As a recruteur, I want a consistent Medijob design system, so that the tool feels professional.
4. As a developer, I want all reads via RSC and mutations via tRPC, so that data flow is type-safe.
5. As a recruteur, I want soft-deleted records hidden from all views, so that deleted data does not clutter my work.
6. As a recruteur, I want a confirm modal before soft delete (« Êtes-vous sûr… »), so that deletions are intentional.
7. As a recruteur, I want global search (ILIKE) across Candidates, Pharmacies, Contacts, and Missions, so that I find records quickly.
8. As a recruteur, I want dedicated `/new` pages for root entity creation, so that I have full-screen forms without modals.
9. As a recruteur, I want contextual inline creation (e.g. Contact from Pharmacy fiche), so that I capture data in context.
10. As a recruteur, I want an « Envoyer un email » button on all tabs of Candidate, Pharmacy, Contact, and Mission fiches, so that I can email from anywhere.
11. As a recruteur, I want email to open `mailto:` in my mail client, so that I can edit before sending.
12. As a recruteur, I want to optionally log an ActivityLog EMAIL after sending, so that history is traceable without Resend.
13. As a recruteur, I want CSV export of filtered table data on all list pages, so that I can analyze data externally.
14. As a recruteur, I want shared table/filter/export/delete/email components across main modules, so that UX is consistent.
15. As a recruteur, I want to assign and reassign Referent on Candidate and Mission, so that responsibility is clear.

### Module Candidats

16. As a recruteur, I want the CVthèque as a **table** (Nom, Prénom, Métier, Ville, Département, Référent, Disponibilité, Actions), so that I scan candidates efficiently.
17. As a recruteur, I want a **toggle to kanban** on `/candidats`, so that I can switch to pipeline view when needed.
18. As a recruteur, I want **multi-filters** (métier, dispo, département, ville, référent, LGO, contrat préféré, profil incomplet, mission active), so that I narrow the CVthèque precisely.
19. As a recruteur, I want to create a Candidate via `/candidats/new`, so that creation is a dedicated page.
20. As a recruteur, I want « Importer un CV » on `/candidats` → `/candidats/new?source=cv`, so that PDF import uses the full-page extraction flow.
21. As a recruteur, I want duplicate detection on create, CV import, application accept, and edit (email or name+phone conflict), so that duplicates are caught everywhere.
22. As a recruteur, I want a side-by-side merge page with field-by-field choice, so that I control what is kept.
23. As a recruteur, I want merged Candidate to receive all MissionCandidate, ActivityLog, Document, and Application relations, so that history is preserved.
24. As a recruteur, I want upload CV → IA extraction → review → confirm, so that fields are pre-filled safely.
25. As a recruteur, I want profile completeness banner when matching fields are missing, so that I know why matching may exclude a Candidate.
26. As a recruteur, I want IA summary and anonymized profile with PDF export, so that I can present candidates internally.
27. As a recruteur, I want ActivityLog timeline and Documents on the Candidate fiche, so that all assets are centralized.
28. As a recruteur, I want kanban of positioned Missions on the Missions tab, so that I track pipeline per candidate.
29. As a recruteur, I want « Présenter à une pharmacie » with contact picker (default primary) and IA draft → `mailto:`, so that I present a candidate to one client.
30. As a recruteur, I want « Présenter dans un périmètre » with radius + pharmacy list (deselectable) → one grouped `mailto:` (CCI/To), so that I reach multiple pharmacies in one email.
31. As a recruteur, I want to soft-delete a Candidate, so that removed profiles disappear from the CRM.
32. As a recruteur, I want CSV export of filtered Candidates, so that I can work offline.

### Module Candidatures (Applications)

33. As a recruteur, I want inbox as **table** on `/candidats?tab=inbox` with nav badge count, so that new applications are visible.
34. As a recruteur, I want to see Applications per JobOffer on `/offres/[id]`, so that I process candidacies per posting.
35. As a recruteur, I want duplicate Candidate alert on Application with merge or direct accept, so that inbox integrates with CVthèque rules.
36. As a recruteur, I want duplicate Application alert only (no merge), so that repeat submissions stay distinct.
37. As a recruteur, I want to accept Application → Candidate (merge if duplicate, else direct create), so that qualified applicants enter CVthèque.
38. As a recruteur, I want to refuse Application (REFUSEE, kept for stats, filter Refusées), so that rejects are tracked without CVthèque pollution.
39. As a recruteur, I want to soft-delete an Application, so that I clean the inbox.
40. As a system, I want Webflow webhook with HMAC to create EN_ATTENTE Applications, so that website forms feed the CRM.

### Module Pharmacies

41. As a recruteur, I want Pharmacies as a **table only** (Nom, Ville, Groupement, Statut, Contact principal, Nb missions, LGO, Actions), so that the portfolio is scannable.
42. As a recruteur, I want filters (statut, type, groupement, logiciel, ville, département, missions actives), so that I segment clients.
43. As a recruteur, I want `/pharmacies/new` for creation, so that there is no creation modal on the list.
44. As a recruteur, I want SIRET search and TVA auto-calculation, so that legal identity is accurate.
45. As a recruteur, I want duplicate detection on all create/edit/quick-create flows (SIRET or name+ville+CP), so that client duplicates are caught.
46. As a recruteur, I want pharmacy merge with field-by-field choice, relation transfer, and homonym Contact merge proposal, so that fusion is safe.
47. As a recruteur, I want Pharmacy fiche tabs (Infos, Contacts, Besoins, Historique, Documents), so that client context is complete.
48. As a recruteur, I want to soft-delete a Pharmacy, so that inactive clients are hidden.
49. As a recruteur, I want CSV export of filtered Pharmacies, so that I can report on the portfolio.

### Module Contacts

50. As a recruteur, I want Contacts as a **table** (Nom, Rôle, Pharmacie, Téléphone, Email, Date ajout, Badge principal, Ville, Département, Actions).
51. As a recruteur, I want filters (rôle, pharmacie, ville, département, statut pharmacie, contact principal oui/non).
52. As a recruteur, I want `/contacts/new` for root creation and inline create from Pharmacy tab, so that workflow matches context.
53. As a recruteur, I want duplicate alert on create/edit with optional merge on demand, so that I am warned without blocking.
54. As a recruteur, I want one `isPrimary` Contact per Pharmacy with former titulaires kept, so that history is preserved.
55. As a recruteur, I want Contact fiche tabs (Infos, Historique, Missions, Documents).
56. As a recruteur, I want to soft-delete a Contact, so that departed interlocutors are hidden.
57. As a recruteur, I want CSV export of filtered Contacts.

### Module Missions

58. As a recruteur, I want `/missions?tab=a-pourvoir` and `/missions?tab=en-cours` as URL tabs, so that I separate recruiting from operational follow-up.
59. As a recruteur, I want missions table (titre, métier, pharmacie, ville, statut, type contrat, CA mission, marge, référent, date début, actions) with toggle kanban statuts.
60. As a recruteur, I want mission filters (statut, type contrat, pharmacie, référent, ville, département, CA/marge min/max, métier, plages dates début/fin).
61. As a recruteur, I want `/missions/new` with full fields and contract types **CDI · CDD · INTERIM** only.
62. As a recruteur, I want to **manually enter CA mission and marge** on create/edit (no automatic calculation), so that financial data reflects reality.
63. As a recruteur, I want optional candidateRate, clientRate, plannedHours as reference fields, so that I can note rates/hours without formula dependency.
64. As a recruteur, I want POURVU to move mission to « En cours » tab with 3 checkboxes (heures, fiches de paie, factures), so that I track operational completion.
65. As a recruteur, I want Suivi tab on en-cours missions: weekly hours grid, payslip uploads, invoice uploads with status émise/payée, so that execution is tracked.
66. As a recruteur, I want pipeline kanban, matching IA with configurable radius (Zustand session), and matching contact via mailto/tel/WhatsApp on mission fiche.
67. As a recruteur, I want « Générer un devis » producing PDF from code template (not IA) + `mailto:`, so that I send commercial quotes.
68. As a recruteur, I want auto-Task when startDate > today+30d with dueDate = startDate-30d assigned to referent, so that future missions are not forgotten.
69. As a recruteur, I want POURVU/ANNULEE transitions per ADR-0008, so that pipeline stages update correctly.
70. As a recruteur, I want to soft-delete a Mission, so that abandoned needs are hidden.
71. As a recruteur, I want CSV export of filtered Missions.

### Module Offres d'emploi

72. As a recruteur, I want to generate JobOffer from Mission → redirect `/offres/[id]`, so that editing happens on the offer fiche.
73. As a recruteur, I want `/offres/new` with choice mission-linked vs **veille** (jobTitleId required, no mission), so that I publish scouting offers.
74. As an ADMIN, I want `/admin/modeles-offres` CRUD per JobTitle (JSON sections + editorial tone), so that IA generation is consistent.
75. As a recruteur, I want offres table with filters (statut, métier, date publication, mission/veille, ville, pharmacie) and export CSV.
76. As a recruteur, I want to publish to Webflow only when required fields are complete, so that the public site stays quality.
77. As a recruteur, I want to unpublish JobOffers, so that filled postings leave the website.
78. As a recruteur, I want to soft-delete a JobOffer, so that obsolete postings are hidden.

### Module Matching IA

79. As a recruteur, I want configurable mission matching radius (Zustand `matchingRadiusMission`, default 30 km).
80. As a recruteur, I want dedicated **Matching** tab on Candidate fiche with separate radius (`matchingRadiusCandidate`).
81. As a recruteur, I want pre-filter + Gemini scoring per SPEC_V2 rules with ContractType CDI/CDD/INTERIM.
82. As a recruteur, I want mailto/tel/WhatsApp from matching results with optional manual ActivityLog.

### Module Assistant IA

83. As a recruteur, I want Assistant page with ephemeral chat (no DB persistence).
84. As a recruteur, I want context from Candidate, Pharmacy, or Mission.
85. As a recruteur, I want shortcuts: Résumer candidat, Résumer pharmacie, Rédiger mail candidat, Rédiger mail pharmacie, Rapport semaine (no « Générer offre »).
86. As a recruteur, I want Rapport semaine with weekly counters + recent ActivityLog + overdue Tasks.
87. As a recruteur, I want all RECRUTEUR and ADMIN to use the assistant with global data visibility.
88. As a developer, I want Zod validation on all IA responses.

### Module Tâches

89. As a recruteur, I want `/taches` in nav showing only my assigned tasks.
90. As an ADMIN, I want to see all tasks with filter by recruteur.
91. As a recruteur, I want `/taches/new` and « Créer une tâche » on entity fiches with pre-filled links.
92. As a recruteur, I want tasks with title, description, assignee, dueDate, multiple optional entity links.
93. As a recruteur, I want status A_FAIRE ↔ VALIDEE reversible via checkbox.
94. As a recruteur, I want filters (statut, assigné, date, entité, en retard) and CSV export.
95. As an ADMIN, I want task done/pending report over a period in statistics context.

### Module Statistiques admin

96. As an ADMIN, I want `/admin/statistiques` with CA/marge summed from manual fields on missions en cours (POURVU) plus sub-table by mission status.
97. As an ADMIN, I want KPIs: missions par statut, missions par recruteur, CA par recruteur, candidats ajoutés, candidatures reçues, offres publiées.
98. As an ADMIN, I want period filters: aujourd'hui, semaine, mois, trimestre, personnalisé + filtre recruteur.

### Module Admin (référentiels)

99. As an ADMIN, I want CRUD PipelineStage, Software, Groupement, JobTitle + compatibility matrix, Users.
100. As a recruteur, I want default seeds for pipeline, LGO, métiers, and compatibility matrix.

### Module Pipeline (transverse)

101. As a recruteur, I want kanban CVthèque drag per Mission on active missions only (ADR-0001).
102. As a recruteur, I want Mission status independent from PipelineStage (ADR-0004).
103. As a recruteur, I want parallel MissionCandidate positioning on multiple Missions.

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
| Storage | Vercel Blob |
| Email V2 | `mailto:` natif — **pas de Resend en V2** |
| PDF | `@react-pdf/renderer` |
| IA | Gemini Flash-Lite via `EXTRACTION_PROVIDER` |
| SIRET | `recherche-entreprises.api.gouv.fr` |
| Publication | Webflow CMS API |
| Icons | `lucide-react` |

### Architecture

- Single-app monolith — bounded contexts logiques (`CONTEXT.md`)
- **Prisma uniquement dans `src/server/db/repositories/`**
- **RSC pour lectures** — `createCaller`, jamais `fetch` interne
- **Mutations via `trpc.useMutation()`** — Client Components uniquement
- **Atomic design** — atoms → molecules → organisms, zéro logique métier dans composants
- **View-models** — pont DB → UI ; marge % calculée en view-model si affichée (`(marge/caMission)×100`), jamais stockée
- **Zustand** — UI state : sidebar, modales, thème, `matchingRadiusMission`, `matchingRadiusCandidate`
- **Fichiers < 100 lignes** — bloquant CI
- **Zéro `any` TypeScript**
- **React Hook Form + Zod** — formulaires et entrées externes (IA, webhooks)
- **Pages `/new` dédiées** — zéro modale de création racine ; inline contextuel autorisé (Contact depuis Pharmacie)
- **Soft delete UI** — `<SoftDeleteModal>` sur toutes entités concernées

### Navigation (7 sections + Admin)

| Section | Route | Notes |
|---------|-------|-------|
| Candidats | `/candidats` | Table + toggle kanban ; `?tab=inbox` |
| Pharmacies | `/pharmacies` | Table seule |
| Contacts | `/contacts` | Table seule |
| Missions | `/missions` | `?tab=a-pourvoir` · `?tab=en-cours` ; toggle kanban statuts |
| Offres | `/offres` | Table ; `/offres/new` mission ou veille |
| Tâches | `/taches` | Table |
| Assistant IA | `/assistant` | Chat éphémère |
| Admin | `/admin/*` | + `/admin/modeles-offres` · `/admin/statistiques` |

### Décisions interview (delta SPEC)

| Sujet | Décision |
|-------|----------|
| Email | `mailto:` + ActivityLog manuel optionnel |
| ContractType | `CDI` · `CDD` · `INTERIM` uniquement (suppression `VACATION`) |
| CA / marge mission | Champs `caMission` et `marge` saisis manuellement — **aucun calcul auto** |
| Missions liste | Onglets URL à pourvoir / en cours ; `POURVU` → en cours |
| Suivi mission | 3 checks : heures · fiches de paie · factures |
| Devis | Template code → PDF → `mailto:` — pas YouSign V2 |
| JobOffer veille | `missionId` optionnel ; `jobTitleId` obligatoire |
| Présentation candidat | `mailto:` ; périmètre = liste désélectionnable + un mail groupé |
| Candidats liste | Table par défaut + toggle kanban |
| Pharmacies/Contacts | Table seule |

### Schéma Prisma complet

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  RECRUTEUR
  ADMIN
}

enum PharmacyType {
  INDEPENDANTE
  CLINIQUE
}

enum PharmacyStatus {
  PROSPECT
  ACTIF
  INACTIF
}

enum ContactRole {
  TITULAIRE
  ADJOINT
  PREPARATEUR_REFERENT
  RESPONSABLE_RH
  AUTRE
}

enum ContractType {
  CDI
  CDD
  INTERIM
}

enum MissionStatus {
  A_POURVOIR
  EN_RECHERCHE
  CANDIDATS_PRESENTES
  ENTRETIEN_EN_COURS
  POURVU
  ANNULEE
}

enum ActivityType {
  APPEL
  EMAIL
  ENTRETIEN
  MISSION
  NOTE
  ACTION_COMMERCIALE
  DEVIS
  AUTRE
}

enum DocumentCategory {
  CONTRAT
  DEVIS
  FACTURE
  CONVENTION
  AUTRE
}

enum DocumentEntityType {
  PHARMACY
  CONTACT
  MISSION
  CANDIDATE
}

enum ApplicationStatus {
  EN_ATTENTE
  ACCEPTEE
  REFUSEE
}

enum JobOfferStatus {
  BROUILLON
  PUBLIEE
  DEPUBLIEE
}

enum TaskStatus {
  A_FAIRE
  VALIDEE
}

enum QuoteStatus {
  BROUILLON
  ENVOYE
  SIGNE
  REFUSE
}

enum InvoiceStatus {
  EMISE
  PAYEE
}

// ─── Auth (NextAuth v5) ───────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Users ───────────────────────────────────────────────────

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String
  role      UserRole  @default(RECRUTEUR)
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  referents     Candidate[]   @relation("ReferentCandidates")
  missionRefs   Mission[]     @relation("ReferentMissions")
  activities    ActivityLog[]
  accounts      Account[]
  sessions      Session[]
  assignedTasks Task[]        @relation("AssigneeTasks")
  createdTasks  Task[]        @relation("CreatedTasks")

  @@index([deletedAt])
}

// ─── Référentiels administrables ─────────────────────────────

model Software {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())

  candidates CandidateSoftware[]
  pharmacies Pharmacy[]
}

model Groupement {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())

  pharmacies Pharmacy[]
}

model PipelineStage {
  id        String   @id @default(cuid())
  name      String
  position  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  missionCandidates MissionCandidate[]

  @@index([position])
}

model JobTitle {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())

  candidates                Candidate[]
  missions                  Mission[]
  applications              Application[]
  jobOffers                 JobOffer[]
  offerTemplates            JobOfferTemplate[]
  missionCompatibilities    JobTitleCompatibility[] @relation("MissionJobTitle")
  acceptedInCompatibilities JobTitleCompatibility[] @relation("AcceptedCandidateJobTitle")
}

model JobTitleCompatibility {
  missionJobTitleId   String
  candidateJobTitleId String
  score               Int      @default(100)

  missionJobTitle   JobTitle @relation("MissionJobTitle", fields: [missionJobTitleId], references: [id], onDelete: Cascade)
  candidateJobTitle JobTitle @relation("AcceptedCandidateJobTitle", fields: [candidateJobTitleId], references: [id], onDelete: Cascade)

  @@id([missionJobTitleId, candidateJobTitleId])
}

model JobOfferTemplate {
  id          String   @id @default(cuid())
  jobTitleId  String   @unique
  sections    Json     // [{ key, title, required }]
  tone        String   // ton éditorial
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  jobTitle JobTitle @relation(fields: [jobTitleId], references: [id], onDelete: Cascade)
}

// ─── Candidates ───────────────────────────────────────────────

model Candidate {
  id                String    @id @default(cuid())
  firstName         String
  lastName          String
  email             String?
  phone             String?
  address           String?
  city              String?
  postalCode        String?
  jobTitleId        String
  mobilityRadiusKm  Int?
  mobilityNotes     String?
  availableFrom     DateTime?
  cvUrl             String?
  cvSummary         String?
  anonymizedProfile String?
  notes             String?
  referentId        String
  deletedAt         DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  referent            User                          @relation("ReferentCandidates", fields: [referentId], references: [id])
  jobTitle            JobTitle                      @relation(fields: [jobTitleId], references: [id])
  softwares           CandidateSoftware[]
  contractPreferences CandidateContractPreference[]
  missions            MissionCandidate[]
  activities          ActivityLog[]                 @relation("CandidateActivities")
  documents           Document[]                    @relation("CandidateDocuments")
  applications        Application[]
  tasks               Task[]

  @@index([deletedAt])
  @@index([jobTitleId])
  @@index([referentId])
}

model CandidateContractPreference {
  candidateId  String
  contractType ContractType

  candidate Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)

  @@id([candidateId, contractType])
}

model CandidateSoftware {
  candidateId String
  softwareId  String

  candidate Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  software  Software  @relation(fields: [softwareId], references: [id])

  @@id([candidateId, softwareId])
}

// ─── Pharmacies ───────────────────────────────────────────────

model Pharmacy {
  id                String         @id @default(cuid())
  name              String
  siret             String?        @unique
  numeroTVA         String?
  address           String?
  city              String?
  postalCode        String?
  phone             String?
  email             String?
  website           String?
  type              PharmacyType?
  status            PharmacyStatus @default(PROSPECT)
  groupementId      String?
  softwareId        String?
  paymentConditions String?
  notes             String?
  deletedAt         DateTime?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  groupement Groupement?   @relation(fields: [groupementId], references: [id])
  software   Software?     @relation(fields: [softwareId], references: [id])
  contacts   Contact[]
  missions   Mission[]
  activities ActivityLog[] @relation("PharmacyActivities")
  documents  Document[]    @relation("PharmacyDocuments")
  tasks      Task[]

  @@index([deletedAt])
  @@index([groupementId])
}

// ─── Contacts ─────────────────────────────────────────────────

model Contact {
  id         String      @id @default(cuid())
  pharmacyId String
  firstName  String
  lastName   String
  email      String?
  phone      String?
  role       ContactRole @default(AUTRE)
  isPrimary  Boolean     @default(false)
  notes      String?
  deletedAt  DateTime?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  pharmacy   Pharmacy      @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)
  missions   Mission[]
  activities ActivityLog[] @relation("ContactActivities")
  documents  Document[]    @relation("ContactDocuments")
  tasks      Task[]

  @@index([deletedAt])
  @@index([pharmacyId])
}

// ─── Missions ─────────────────────────────────────────────────

model Mission {
  id               String        @id @default(cuid())
  pharmacyId       String
  contactId        String?
  referentId       String
  jobTitleId       String
  title            String
  description      String?
  contractType     ContractType
  startDate        DateTime
  endDate          DateTime?
  status           MissionStatus @default(A_POURVOIR)
  salaireMin       Int?
  salaireMax       Int?
  salaireNotes     String?
  heuresParSemaine Float?
  planning         String?
  tempsPlein       Boolean       @default(true)
  caMission        Float?
  marge            Float?
  candidateRate    Float?
  clientRate       Float?
  plannedHours     Float?
  followUpHoursOk     Boolean @default(false)
  followUpPayslipOk   Boolean @default(false)
  followUpInvoiceOk   Boolean @default(false)
  notes            String?
  deletedAt        DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  pharmacy     Pharmacy           @relation(fields: [pharmacyId], references: [id])
  contact      Contact?           @relation(fields: [contactId], references: [id])
  referent     User               @relation("ReferentMissions", fields: [referentId], references: [id])
  jobTitle     JobTitle           @relation(fields: [jobTitleId], references: [id])
  candidates   MissionCandidate[]
  jobOffer     JobOffer?
  activities   ActivityLog[]      @relation("MissionActivities")
  documents    Document[]         @relation("MissionDocuments")
  tasks        Task[]
  weeklyHours  MissionWeeklyHours[]
  quotes       MissionQuote[]
  invoices     MissionInvoice[]

  @@index([deletedAt])
  @@index([pharmacyId])
  @@index([referentId])
  @@index([status])
}

model MissionCandidate {
  missionId   String
  candidateId String
  stageId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  mission   Mission       @relation(fields: [missionId], references: [id], onDelete: Cascade)
  candidate Candidate     @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  stage     PipelineStage @relation(fields: [stageId], references: [id])

  @@id([missionId, candidateId])
  @@index([stageId])
}

model MissionWeeklyHours {
  id         String   @id @default(cuid())
  missionId  String
  weekStart  DateTime
  monday     Boolean  @default(false)
  tuesday    Boolean  @default(false)
  wednesday  Boolean  @default(false)
  thursday   Boolean  @default(false)
  friday     Boolean  @default(false)
  saturday   Boolean  @default(false)
  sunday     Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  mission Mission @relation(fields: [missionId], references: [id], onDelete: Cascade)

  @@unique([missionId, weekStart])
}

model MissionQuote {
  id        String      @id @default(cuid())
  missionId String
  status    QuoteStatus @default(BROUILLON)
  pdfUrl    String?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  mission Mission @relation(fields: [missionId], references: [id], onDelete: Cascade)

  @@index([missionId])
}

model MissionInvoice {
  id        String        @id @default(cuid())
  missionId String
  status    InvoiceStatus @default(EMISE)
  pdfUrl    String
  name      String
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  mission Mission @relation(fields: [missionId], references: [id], onDelete: Cascade)

  @@index([missionId])
}

// ─── Offres d'emploi ──────────────────────────────────────────

model JobOffer {
  id            String         @id @default(cuid())
  missionId     String?        @unique
  jobTitleId    String
  city          String?
  title         String
  content       String
  status        JobOfferStatus @default(BROUILLON)
  webflowItemId String?
  publishedAt   DateTime?
  deletedAt     DateTime?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  mission      Mission?      @relation(fields: [missionId], references: [id])
  jobTitle     JobTitle      @relation(fields: [jobTitleId], references: [id])
  applications Application[]

  @@index([deletedAt])
  @@index([status])
  @@index([jobTitleId])
}

// ─── Candidatures site internet ───────────────────────────────

model Application {
  id          String            @id @default(cuid())
  jobOfferId  String
  firstName   String
  lastName    String
  email       String
  phone       String?
  city        String?
  jobTitleId  String?
  cvUrl       String?
  message     String?
  status      ApplicationStatus @default(EN_ATTENTE)
  candidateId String?
  deletedAt   DateTime?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  jobOffer  JobOffer   @relation(fields: [jobOfferId], references: [id])
  jobTitle  JobTitle?  @relation(fields: [jobTitleId], references: [id])
  candidate Candidate? @relation(fields: [candidateId], references: [id])

  @@index([deletedAt])
  @@index([jobOfferId])
  @@index([status])
}

// ─── Tâches ───────────────────────────────────────────────────

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(A_FAIRE)
  dueDate     DateTime?
  assigneeId  String
  createdById String
  candidateId String?
  pharmacyId  String?
  contactId   String?
  missionId   String?
  deletedAt   DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  assignee  User       @relation("AssigneeTasks", fields: [assigneeId], references: [id])
  createdBy User       @relation("CreatedTasks", fields: [createdById], references: [id])
  candidate Candidate? @relation(fields: [candidateId], references: [id])
  pharmacy  Pharmacy?  @relation(fields: [pharmacyId], references: [id])
  contact   Contact?   @relation(fields: [contactId], references: [id])
  mission   Mission?   @relation(fields: [missionId], references: [id])

  @@index([deletedAt])
  @@index([assigneeId])
  @@index([status])
  @@index([dueDate])
}

// ─── Historique polymorphe ────────────────────────────────────

model ActivityLog {
  id         String             @id @default(cuid())
  entityType DocumentEntityType
  authorId   String
  type       ActivityType
  content    String?
  date       DateTime           @default(now())
  createdAt  DateTime           @default(now())

  candidateId String?
  pharmacyId  String?
  contactId   String?
  missionId   String?

  author    User       @relation(fields: [authorId], references: [id])
  candidate Candidate? @relation("CandidateActivities", fields: [candidateId], references: [id])
  pharmacy  Pharmacy?  @relation("PharmacyActivities", fields: [pharmacyId], references: [id])
  contact   Contact?   @relation("ContactActivities", fields: [contactId], references: [id])
  mission   Mission?   @relation("MissionActivities", fields: [missionId], references: [id])

  @@index([candidateId])
  @@index([pharmacyId])
  @@index([contactId])
  @@index([missionId])
}

// ─── Documents polymorphes ────────────────────────────────────

model Document {
  id         String             @id @default(cuid())
  entityType DocumentEntityType
  category   DocumentCategory   @default(AUTRE)
  name       String
  url        String
  size       Int?
  mimeType   String?
  createdAt  DateTime           @default(now())

  pharmacyId  String?
  contactId   String?
  missionId   String?
  candidateId String?

  pharmacy  Pharmacy?  @relation("PharmacyDocuments", fields: [pharmacyId], references: [id])
  contact   Contact?   @relation("ContactDocuments", fields: [contactId], references: [id])
  mission   Mission?   @relation("MissionDocuments", fields: [missionId], references: [id])
  candidate Candidate? @relation("CandidateDocuments", fields: [candidateId], references: [id])

  @@index([pharmacyId])
  @@index([contactId])
  @@index([missionId])
  @@index([candidateId])
}
```

### Contrats API clés (tRPC)

| Router | Procédures principales |
|--------|----------------------|
| `candidate` | list (filtered), getById, create, update, softDelete, detectDuplicate, merge, extractCv, confirmExtraction, generateSummary, generateAnonymized, presentToPharmacy, presentInRadius, exportCsv |
| `application` | listInbox, listByJobOffer, detectDuplicate, accept, refuse, merge, softDelete |
| `pharmacy` | list, getById, create, update, softDelete, searchSiret, detectDuplicate, merge, exportCsv |
| `contact` | list, getById, create, update, softDelete, detectDuplicate, merge, exportCsv |
| `mission` | list (tab filter), getById, create, update, softDelete, updateStatus, markPourvu, generateQuote, exportCsv |
| `missionCandidate` | position, updateStage, remove |
| `matching` | scoreForMission, scoreForCandidate, buildMailto |
| `jobOffer` | list, getById, create, generate, update, publish, unpublish, softDelete, exportCsv |
| `task` | list, getById, create, update, toggleStatus, softDelete, exportCsv |
| `activityLog` | listByEntity, create |
| `document` | listByEntity, upload, delete |
| `assistant` | chat, weeklyReport |
| `search` | global |
| `admin.*` | pipeline, software, groupement, jobTitle, jobOfferTemplate, user, statistics |

### Auto-task mission

```
SI mission.startDate > today + 30 jours
ALORS créer Task {
  title: "Suivi mission [titre]",
  dueDate: startDate - 30 jours,
  missionId,
  assigneeId: mission.referentId,
  createdById: session.user.id
}
AU create ET update mission
```

### Webhook

`POST /api/webhooks/webflow` — HMAC, création Application, hint doublon Candidate.

---

## DRY Rules

### Composants partagés obligatoires

| Composant | Responsabilité |
|-----------|----------------|
| `<EntityTable>` | Colonnes configurables, tri, pagination |
| `<FilterBar>` | Multi-filtres cumulatifs (ET logique) par entité |
| `<ExportCsvButton>` | Export des lignes filtrées courantes |
| `<SoftDeleteModal>` | Confirmation générique suppression |
| `<EmailButton>` | `mailto:` + proposition ActivityLog manuel |
| `<DuplicateDetectionPage>` | Comparaison côte-à-côte + fusion champ par champ |
| `<DocumentUpload>` | Upload polymorphe Vercel Blob |
| `<ActivityLogTab>` | Timeline filtrable par ActivityType |
| `<ViewToggle>` | Table ↔ kanban (Candidats, Missions uniquement) |

### Interdictions strictes

- Zéro copier-coller logique entre Candidats / Pharmacies / Contacts / Missions
- Zéro inline Prisma hors repositories
- Zéro composant > 100 lignes
- Zéro `any` TypeScript
- Logique métier dupliquée 2+ fois → hook ou util immédiat
- Zéro modale de création racine
- Zéro valeur hardcodée — tokens `--color-*`, constantes dédiées

---

## Testing Decisions

### Principe

Tester le **comportement externe observable** — routers tRPC, repositories, webhooks, view-models. Pas les détails d'implémentation React.

### Seams de test

| Priorité | Seam | Quoi tester |
|----------|------|-------------|
| 1 | tRPC + repositories | CRUD, soft delete, fusion doublons, transitions POURVU, auto-task |
| 2 | Webhook Webflow | HMAC, création Application |
| 3 | Provider IA mock | Extraction, matching, offre — Zod rejette invalides |
| 4 | Services mockés | Webflow CMS, SIRET API, Vercel Blob |
| 5 | View-models | Filtres, CA/marge affichage, profil incomplet, onglets mission |
| 6 | `<EntityTable>` / `<FilterBar>` | Contrats props, export CSV payload |

### Modules testés en priorité

1. Matching pre-filter (ContractType 3 valeurs, rayons configurables)
2. Application accept/refuse/merge/dedup
3. Duplicate merge Candidate + Pharmacy (+ contacts homonymes)
4. Mission transitions + onglets à pourvoir/en cours
5. Task auto-création + visibilité RECRUTEUR
6. JobOffer veille (sans mission) + publication guard
7. Soft delete masquage listes/recherche
8. Global search ILIKE

### Prior art

Tests Vitest + Testcontainers existants sur `dev`. Chaque repository → fichier test miroir.

---

## Out of Scope (V2)

- **Resend / envoi email serveur** — `mailto:` uniquement
- **YouSign** — devis PDF + mailto seulement
- **Multi-tenant**
- **Purge physique / restauration UI** — ADR-0007
- **Portail candidat / pharmacie externe**
- **Facturation/comptabilité complète**
- **Notifications push / WebSocket**
- **Intégrations ATS tierces** (hors Webflow + Gemini)
- **Relecture juridique RGPD** — avant prod
- **Dark mode**
- **PostgreSQL full-text search** — ILIKE suffit V2
- **Persistance conversations assistant**
- **Issues détaillées modules tableaux/tâches/stats** — documentées ici ; issues via `/to-issues`

---

## Further Notes

### Issues GitHub mises à jour (interview 2026-06-24)

#68 · #69 · #70 · #72 · #74 · #75 · #79 · #80 alignées sur ce PRD.  
Issues à créer via `/to-issues` : modèles offres admin, tâches, statistiques, tableaux transverses, doublons, présentations, missions en cours.

### Ordre de développement recommandé

1. **Composants DRY** — EntityTable, FilterBar, ExportCsv, SoftDeleteModal, EmailButton
2. **Migrations Prisma** — Task, JobOfferTemplate, champs Mission, ContractType, JobOffer optionnel
3. **Tableaux + filtres + export** — 4 modules principaux
4. **Pages `/new` + suppression modales racine**
5. **Doublons** — Candidate, Pharmacy, Contact
6. **Missions** — onglets à pourvoir/en cours, CA/marge, suivi
7. **Offres** — veille, modèles, Webflow (#68–71)
8. **Candidatures inbox** (#72)
9. **Matching** (#74–75)
10. **Tâches + auto-task**
11. **Statistiques admin**
12. **Finitions** — soft delete UI (#80), recherche (#79), présentations candidat

### Glossaire

Vocabulaire canonique : `CONTEXT.md`. **CA mission** = chiffre d'affaires saisi manuellement sur la mission (pas « CA client »).

---

*PRD V2 généré le 2026-06-24 — interview client + SPEC_V2 + SPEC_COMPLEMENTAIRE.*
