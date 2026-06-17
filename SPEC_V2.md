# SPEC_V2.md — CRM Medijob (Module Opérationnel Complet)

> **Statut** : Validé par interview complète (20 questions)  
> **Client** : Medijob (agence de recrutement pharmacie)  
> **Périmètre** : Candidats · Pharmacies · Contacts · Missions · Offres d'emploi · Candidatures · Assistant IA  
> **Usage** : Mono-instance, interne agence, quelques recruteurs  
> **Remplace** : SPEC_V1.md

---

## 1. Stack (imposée, non négociable)

| Couche | Choix |
|--------|-------|
| Framework | Next.js 15 App Router |
| API | tRPC v11 — wrappers tRPC uniquement, zéro import direct `@tanstack/react-query` |
| DB | Prisma + Neon PostgreSQL |
| Auth | NextAuth v5 — email/password Argon2id, sessions DB |
| CSS | Tailwind v4 CSS-native (zéro `tailwind.config.ts`) |
| Animation | Framer Motion |
| Tests | Vitest + Testcontainers |
| Déploiement | Vercel |
| Storage | Vercel Blob (CV + documents) |
| Email | Resend (`send.medijob.fr`) |
| PDF export | `@react-pdf/renderer` |
| IA | Gemini Flash-Lite (provider abstrait `EXTRACTION_PROVIDER`) |
| Enrichissement SIRET | `recherche-entreprises.api.gouv.fr` (gratuit, sans clé) |
| Publication offres | Webflow CMS API |
| Icons | `lucide-react` |

---

## 2. Architecture

### Structure projet (single-app)

```
apps/web/src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── candidats/
│   │   │   ├── page.tsx              # liste + onglet candidatures reçues
│   │   │   └── [id]/page.tsx         # fiche détail
│   │   ├── pharmacies/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── contacts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── missions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── offres/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── assistant/
│   │   │   └── page.tsx
│   │   └── admin/
│   │       ├── pipeline/page.tsx
│   │       ├── logiciels/page.tsx
│   │       ├── groupements/page.tsx
│   │       └── utilisateurs/page.tsx
│   ├── api/
│   │   └── webhooks/
│   │       └── webflow/route.ts      # réception candidatures site
│   └── design-system/page.tsx
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── hooks/
├── view-models/
├── stores/                           # Zustand — UI state uniquement
└── server/
    ├── auth/
    ├── db/
    │   └── repositories/             # toutes les queries Prisma ici
    └── routers/                      # tRPC routers
```

### Règles non négociables

- Prisma uniquement dans `server/db/repositories/`
- RSC pour toutes les lectures (`createCaller`, jamais `fetch` interne)
- Mutations via `trpc.useMutation()` dans Client Components
- Atomic design strict : atoms → molecules → organisms
- Fichiers < 100 lignes (bloquant CI)
- Zéro `any` TypeScript
- React Hook Form + Zod pour tous les formulaires
- Zod obligatoire sur toutes les réponses IA (entrées externes)
- Zustand = UI state uniquement (jamais de données serveur)

---

## 3. Modèle de données

### 3.1 Enums

```prisma
enum UserRole {
  RECRUTEUR
  ADMIN
}

enum JobTitle {
  PHARMACIEN
  PREPARATEUR
  ETUDIANT_PHARMA
  RAYONNISTE
  AUTRE
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
  VACATION
}

enum MissionStatus {
  A_POURVOIR
  EN_RECHERCHE
  CANDIDATS_PRESENTES
  ENTRETIEN_EN_COURS
  POURVU
  ANNULEE
}

enum PipelineStageType {
  NOUVEAU
  CONTACTE
  ENTRETIEN
  PROPOSITION
  PLACE
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
```

### 3.2 Schema Prisma complet

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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

  referents    Candidate[]   @relation("ReferentCandidates")
  missionRefs  Mission[]     @relation("ReferentMissions")
  activities   ActivityLog[]
  accounts     Account[]
  sessions     Session[]
}

// ─── Référentiels administrables ─────────────────────────────

model Software {
  id        String   @id @default(cuid())
  name      String   @unique
  createdAt DateTime @default(now())

  candidates  CandidateSoftware[]
  pharmacies  Pharmacy[]
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
  jobTitle          JobTitle
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

  referent   User               @relation("ReferentCandidates", fields: [referentId], references: [id])
  softwares  CandidateSoftware[]
  missions   MissionCandidate[]
  activities ActivityLog[]      @relation("CandidateActivities")
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

  groupement Groupement?  @relation(fields: [groupementId], references: [id])
  software   Software?    @relation(fields: [softwareId], references: [id])
  contacts   Contact[]
  missions   Mission[]
  activities ActivityLog[] @relation("PharmacyActivities")
  documents  Document[]    @relation("PharmacyDocuments")
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
}

// ─── Missions ─────────────────────────────────────────────────

model Mission {
  id               String        @id @default(cuid())
  pharmacyId       String
  contactId        String?
  referentId       String
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
  notes            String?
  deletedAt        DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  pharmacy   Pharmacy           @relation(fields: [pharmacyId], references: [id])
  contact    Contact?           @relation(fields: [contactId], references: [id])
  referent   User               @relation("ReferentMissions", fields: [referentId], references: [id])
  candidates MissionCandidate[]
  jobOffer   JobOffer?
  activities ActivityLog[]      @relation("MissionActivities")
  documents  Document[]         @relation("MissionDocuments")
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
}

// ─── Offres d'emploi ──────────────────────────────────────────

model JobOffer {
  id              String        @id @default(cuid())
  missionId       String        @unique
  title           String
  content         String        // markdown généré par IA
  status          JobOfferStatus @default(BROUILLON)
  webflowItemId   String?       // ID item Webflow CMS après publication
  publishedAt     DateTime?
  deletedAt       DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  mission      Mission       @relation(fields: [missionId], references: [id])
  applications Application[]
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
  jobTitle    JobTitle?
  cvUrl       String?
  message     String?
  status      ApplicationStatus @default(EN_ATTENTE)
  candidateId String?           // lié si acceptée et converti
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  jobOffer  JobOffer   @relation(fields: [jobOfferId], references: [id])
  candidate Candidate? @relation(fields: [candidateId], references: [id])
}

// ─── Historique polymorphe ────────────────────────────────────

model ActivityLog {
  id         String             @id @default(cuid())
  entityType DocumentEntityType // réutilise l'enum — PHARMACY | CONTACT | MISSION | CANDIDATE
  authorId   String
  type       ActivityType
  content    String?
  date       DateTime           @default(now())
  createdAt  DateTime           @default(now())

  // Relations polymorphes optionnelles
  candidateId String?
  pharmacyId  String?
  contactId   String?
  missionId   String?

  author    User       @relation(fields: [authorId], references: [id])
  candidate Candidate? @relation("CandidateActivities", fields: [candidateId], references: [id])
  pharmacy  Pharmacy?  @relation("PharmacyActivities", fields: [pharmacyId], references: [id])
  contact   Contact?   @relation("ContactActivities", fields: [contactId], references: [id])
  mission   Mission?   @relation("MissionActivities", fields: [missionId], references: [id])
}

// ─── Documents polymorphes ────────────────────────────────────

model Document {
  id         String             @id @default(cuid())
  entityType DocumentEntityType
  category   DocumentCategory   @default(AUTRE)
  name       String
  url        String             // Vercel Blob URL
  size       Int?               // bytes
  mimeType   String?
  createdAt  DateTime           @default(now())

  // Relations polymorphes optionnelles
  pharmacyId  String?
  contactId   String?
  missionId   String?
  candidateId String?

  pharmacy  Pharmacy?  @relation("PharmacyDocuments", fields: [pharmacyId], references: [id])
  contact   Contact?   @relation("ContactDocuments", fields: [contactId], references: [id])
  mission   Mission?   @relation("MissionDocuments", fields: [missionId], references: [id])
  candidate Candidate? @relation("CandidateDocuments", fields: [candidateId], references: [id])
}
```

---

## 4. Relations entre entités

```
User (RECRUTEUR | ADMIN)
  ├── référent de N Candidates
  ├── référent de N Missions
  └── auteur de N ActivityLog

Candidate
  ├── N CandidateSoftware → Software
  ├── N MissionCandidate (stageId) → Mission
  ├── N ActivityLog (historique)
  ├── N Document
  └── 1? Application (si converti depuis candidature site)

Pharmacy
  ├── 1? Groupement (administrable) — présence de `groupementId` = affiliation réseau (remplace PharmacyType.GROUPE)
  ├── 1? Software (LGO utilisé)
  ├── N Contacts
  ├── N Missions
  ├── N ActivityLog
  └── N Document

Contact
  ├── 1 Pharmacy (obligatoire)
  ├── N Missions (interlocuteur)
  ├── N ActivityLog
  └── N Document

Mission
  ├── 1 Pharmacy
  ├── 1? Contact (interlocuteur)
  ├── 1 User (référent)
  ├── N MissionCandidate → Candidate (avec PipelineStage)
  ├── 1? JobOffer
  ├── N ActivityLog
  └── N Document

JobOffer
  ├── 1 Mission (@unique)
  └── N Application

Application (candidature site)
  ├── 1 JobOffer
  └── 1? Candidate (si acceptée)

PipelineStage (administrable)
  └── N MissionCandidate

ActivityLog (polymorphe)
  └── lié à 1 entité parmi : Candidate | Pharmacy | Contact | Mission

Document (polymorphe)
  └── lié à 1 entité parmi : Pharmacy | Contact | Mission | Candidate
```

---

## 5. Authentification & Rôles

- Stratégie : email/password (Argon2id), sessions DB
- `RECRUTEUR` — CRUD candidats/pharmacies/contacts/missions + visibilité globale
- `ADMIN` — tout RECRUTEUR + gestion utilisateurs + config pipeline + config logiciels + config groupements
- Soft delete : `deletedAt` sur `User`, `Candidate`, `Pharmacy`, `Contact`, `Mission`, `JobOffer`
- Visibilité : tous les recruteurs voient tout — `referentId` = responsabilité, pas restriction

---

## 6. Navigation & Structure des pages

### Nav latérale — 6 sections

```
Candidats      (icon: Users)        ← onglet "Candidatures reçues" intégré
Pharmacies     (icon: Building2)
Contacts       (icon: User)
Missions       (icon: Briefcase)
Offres         (icon: Megaphone)
Assistant IA   (icon: Sparkles)
───────────────
Admin          (icon: Settings)     — ADMIN uniquement
```

### Pages & onglets détaillés

#### `/candidats`
- Onglet **CVthèque** (icon: List / LayoutGrid) — liste + kanban pipeline
- Onglet **Candidatures reçues** (icon: Inbox) — candidatures webhook Webflow en attente

#### `/candidats/[id]`
1. **Profil** — coordonnées, métier, logiciels, mobilité, disponibilité
2. **Historique** — timeline ActivityLog filtrables par ActivityType
3. **Missions** — missions sur lesquelles le candidat est positionné + étape + matching inversé
4. **Documents** — CV · résumé IA · dossier anonymisé · documents divers

#### `/pharmacies`
- Vue liste — colonnes : nom, ville, groupement, statut, contact principal, nb missions

#### `/pharmacies/[id]`
1. **Infos** — tous les champs + lookup SIRET + LGO + groupement
2. **Contacts** — liste contacts rattachés ; un seul `isPrimary` par pharmacie ; en cas de changement de titulaire, l'ancien Contact reste actif (historique missions préservé), `isPrimary` bascule sur le nouveau
3. **Besoins en cours** — missions actives (création rapide depuis cet onglet)
4. **Historique** — ActivityLog de la pharmacie
5. **Documents** — contrats, devis, factures, conventions

#### `/contacts`
- Vue liste — colonnes : nom, fonction, pharmacie, téléphone, email, date ajout

#### `/contacts/[id]`
1. **Infos** — tous les champs
2. **Historique** — ActivityLog du contact
3. **Missions** — missions où ce contact est l'interlocuteur
4. **Documents** — documents liés

#### `/missions`
- Onglet **Liste** — colonnes : titre, métier, pharmacie, ville, statut, référent, date
- Onglet **Kanban** — colonnes = MissionStatus

#### `/missions/[id]`
1. **Infos** — tous les champs mission
2. **Pipeline** — kanban candidats positionnés sur cette mission
3. **Matching IA** — scoring Gemini des candidats compatibles
4. **Offre d'emploi** — génération IA + statut publication Webflow
5. **Historique** — ActivityLog de la mission
6. **Documents** — documents liés

#### `/offres`
- Vue liste — colonnes : titre, mission liée, statut, date publication, nb candidatures

#### `/offres/[id]`
1. **Infos** — contenu offre (éditable) + statut Webflow + boutons Publier/Dépublier
2. **Candidatures** — liste des candidatures reçues sur cette offre

#### `/assistant`
- Page unique : chat Gemini + sidebar raccourcis prédéfinis
- Raccourcis : Résumer candidat · Résumer pharmacie · Rédiger mail candidat · Rédiger mail pharmacie · Générer offre · Rapport semaine

#### `/admin/*`
- `/admin/pipeline` — CRUD PipelineStage + drag-and-drop
- `/admin/logiciels` — CRUD Software
- `/admin/groupements` — CRUD Groupement
- `/admin/utilisateurs` — CRUD User + rôles

---

## 7. Fonctions IA

### 7.1 Extraction CV (pipeline Perimeo SPEC_V3 réutilisé ~80%)

```
Upload PDF → Vercel Blob (temporaire)
→ tRPC mutation → provider abstrait (EXTRACTION_PROVIDER=gemini|mock)
→ Gemini Flash-Lite → JSON brut
→ validation Zod stricte (CvExtractionSchema)
→ écran de revue humaine (champs pré-remplis éditables)
→ confirmation → création Candidate en base
```

```typescript
const CvExtractionSchema = z.object({
  firstName:       z.string(),
  lastName:        z.string(),
  email:           z.string().email().optional(),
  phone:           z.string().optional(),
  city:            z.string().optional(),
  jobTitle:        z.nativeEnum(JobTitle).optional(),
  softwares:       z.array(z.string()).optional(),
  availableFrom:   z.string().datetime().optional(),
  mobilityNotes:   z.string().optional(),
  experienceNotes: z.string().optional(),
})
```

### 7.2 Résumé IA profil candidat
- Input : notes + expérience brute + métier + logiciels
- Output : markdown → `candidate.cvSummary`
- Validation : `z.object({ summary: z.string().min(1) })`

### 7.3 Dossier anonymisé
- Input : cvSummary + métier + logiciels + mobilité + disponibilité (zéro PII)
- Output : markdown → `candidate.anonymizedProfile`
- Export : PDF via `@react-pdf/renderer` (logo Medijob)

### 7.4 Génération offre d'emploi
- Déclencheur : bouton "Générer l'offre" depuis `/missions/[id]` onglet Offre
- Input : titre, description, contractType, ville, planning, salaireMin/Max, logiciel pharmacie, notes mission
- Output : markdown → `JobOffer.content`
- Validation : `z.object({ title: z.string(), content: z.string().min(100) })`

### 7.5 Matching IA candidats ↔ mission

```
Phase 1 — Pré-filtrage déterministe (zéro IA) :
  - jobTitle compatible
  - mobilityRadiusKm couvre la distance Candidate ↔ Pharmacy
  - availableFrom ≤ mission.startDate
  - contractType dans les préférences candidat

Phase 2 — Scoring Gemini Flash-Lite :
  - Input : fiche mission + liste candidats pré-filtrés (max 20)
  - Output : ranking avec score 0-100 + justification par candidat
  - Validation Zod : z.array(z.object({ candidateId, score, justification }))
```

Matching inversé depuis `/candidats/[id]` : même moteur, contexte inversé (candidat → missions compatibles).

### 7.6 Assistant IA

```
Endpoint unique : tRPC mutation assistantChat
Input : { message: string, context?: AssistantContext }

AssistantContext = {
  entityType?: 'candidate' | 'pharmacy' | 'mission'
  entityId?: string       // charge la fiche depuis DB
  globalStats?: boolean   // injecte stats agrégées semaine
}

Raccourcis prédéfinis = prompts pré-remplis dans l'UI
→ même mutation, context pré-chargé
```

---

## 8. Enrichissement SIRET

API : `https://recherche-entreprises.api.gouv.fr/search`

```
Saisie nom OU SIRET
→ tRPC query server-side → API Sirene
→ suggestions → sélection recruteur
→ pré-remplissage : nom, adresse, ville, CP
→ TVA calculée : clé = (12 + 3 × (SIREN % 97)) % 97
→ sauvegarde
```

---

## 9. Offres d'emploi & Webflow

### Publication

```
Recruteur génère offre IA → révise → valide
→ bouton "Publier sur le site"
→ tRPC mutation → POST /collections/{WEBFLOW_COLLECTION_ID}/items
→ webflowItemId sauvegardé dans JobOffer
→ status = PUBLIÉE, publishedAt = now()

Dépublication :
→ PATCH /collections/{id}/items/{webflowItemId} (archived: true)
→ status = DÉPUBLIÉE
```

### Candidatures (webhook Webflow)

```
Candidat soumet formulaire site Webflow
→ Webflow envoie webhook POST /api/webhooks/webflow
→ validation signature Webflow (HMAC)
→ création Application { status: EN_ATTENTE }
→ dédoublonnage : matching email OU (prénom + nom + téléphone)
  → si match trouvé : alerte recruteur "Candidat existant détecté"
    → recruteur choisit : fusionner | créer quand même
  → si pas de match : Application créée sans candidateId

Acceptation :
→ création Candidate depuis Application (ou fusion)
→ Application.candidateId = candidate.id
→ Application.status = ACCEPTEE

Refus :
→ Application.status = REFUSEE (soft, gardé pour stats)
```

---

## 10. Pipeline Kanban

### Config admin (`/admin/pipeline`)
- CRUD PipelineStage + drag-and-drop (`position: Int`)
- Étapes par défaut : `Nouveau | Contacté | Entretien | Proposition | Placé`

### Kanban CVthèque (`/candidats` onglet CVthèque vue Kanban)
- Colonnes = PipelineStage ordonnés
- Carte = candidat + **toutes les missions actives** (liste des MissionCandidate en cours, sans notion de « mission courante »)
- Drag = mutation `MissionCandidate.stageId` (si plusieurs missions actives : sélecteur de mission dans la carte avant drag, ou drag contextuel par mission affichée)

### Kanban Mission (`/missions/[id]` onglet Pipeline)
- Colonnes = PipelineStage ordonnés
- Cartes = candidats positionnés sur cette mission
- Drag = mutation `MissionCandidate.stageId`

### Kanban Missions (`/missions` onglet Kanban)
- Colonnes = MissionStatus (6 colonnes fixes)
- Drag = mutation `Mission.status`

---

## 11. Contact candidat (depuis Matching)

- **Email** : envoi via Resend depuis le CRM → crée automatiquement **deux** `ActivityLog { type: EMAIL }` : un sur le **Candidate** (interaction personne) et un sur la **Mission** (contexte placement)
- **Téléphone** : lien `tel:` natif
- **WhatsApp** : lien `https://wa.me/{phone}` natif

---

## 12. Design System — Charte Medijob

### Identité visuelle
- **Logo white** : `https://cdn.prod.website-files.com/65a98a7828ff832f425b9a3c/675b03f47a4fd952139c21fe_Group%2063-p-500.png`
- **Wordmark** : "MEDIJOB" — `font-weight: 700`, `letter-spacing: -0.5px`
- **Croix médicale** : SVG inline, `fill: #00a89d`
- **Police** : Inter via `next/font/google`

### Palette exacte (inspectée sur medijob.fr)

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-primary:        oklch(0.26 0.10 255);   /* #003366 navy */
  --color-primary-hover:  oklch(0.32 0.12 255);   /* #004080 */
  --color-primary-muted:  oklch(0.93 0.02 255);   /* #e6edf5 */
  --color-primary-fg:     oklch(0.99 0.00 0);
  --color-accent:         oklch(0.64 0.10 185);   /* #00a89d teal */
  --color-accent-hover:   oklch(0.52 0.09 185);   /* #007a72 */
  --color-accent-muted:   oklch(0.95 0.03 185);   /* #d9f2f0 */
  --color-accent-fg:      oklch(0.99 0.00 0);
  --color-surface:        oklch(0.974 0.005 255); /* #f4f6f8 */
  --color-border:         oklch(0.880 0.010 255); /* #d5dce6 */
  --color-fg:             oklch(0.13 0.00 0);
  --color-fg-muted:       oklch(0.44 0.00 0);     /* #6b7280 */
  --color-success:        oklch(0.57 0.17 145);   /* #16a34a */
  --color-warning:        oklch(0.64 0.16 72);    /* #d97706 */
  --color-error:          oklch(0.52 0.22 25);    /* #dc2626 */
  --font-sans: 'Inter', ui-sans-serif, system-ui;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.875rem;
  --radius-xl: 1.25rem;
  --motion-fast: 120ms;
  --motion-base: 200ms;
  --motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Lucide Icons — mapping complet

```typescript
import {
  Users, Building2, User, Briefcase,    // Nav sections
  Megaphone, Sparkles, Settings,         // Offres, Assistant, Admin
  LayoutGrid, List, Inbox,               // Vues
  Upload, FileText, Download, Eye,       // Documents
  Plus, Pencil, Trash2, MoreHorizontal, // Actions CRUD
  Search, Filter, ChevronRight, ArrowLeft,
  MapPin, Phone, Mail, Clock,            // Données candidat
  GraduationCap, Monitor, Wallet,        // Métier, logiciel, salaire
  CheckCircle2, XCircle, AlertCircle,   // Statuts
  KanbanSquare, MoveHorizontal,          // Pipeline
  Globe, ExternalLink,                   // Publication Webflow
  MessageSquare, Send,                   // Assistant IA / email
  Zap,                                   // Matching IA
} from 'lucide-react'
```

### Page `/design-system` (issue #2) — 12 sections
Logo · Palette · Typographie · Boutons · Badges · Inputs · Sidebar · Kanban card · Candidate card · Empty state · Skeleton · Toast

---

## 13. RGPD

- Base légale : intérêt légitime (candidats ayant fourni volontairement leurs données)
- **⚠️ Relecture juridique obligatoire avant mise en production**
- Soft delete sur toutes les entités sensibles
- Purge physique scriptable séparément si juriste l'exige

---

## 14. Ordre de développement (issues)

### Bloc 0 — Fondations (issues 1-4)
1. **Design System** — tokens Tailwind v4 + atoms/molecules Medijob
2. **Page `/design-system`** — validation visuelle 12 sections
3. **Auth** — NextAuth v5 email/password + middleware
4. **Schema Prisma** — migrations + seeds (PipelineStage × 5, Software × 8)

### Bloc 1 — Module Candidats (issues 5-9)
5. Candidats — liste + kanban
6. Candidat — fiche détail + onglets
7. Upload CV + extraction IA + écran revue
8. Résumé IA + dossier anonymisé + export PDF
9. ActivityLog candidat (historique)

### Bloc 2 — Module Pharmacies & Contacts (issues 10-14)
10. Pharmacies — liste + fiche + enrichissement SIRET
11. Pharmacie — onglets Contacts + Besoins en cours
12. Pharmacie — Documents (Vercel Blob)
13. Contacts — liste + fiche
14. ActivityLog Pharmacie + Contact

### Bloc 3 — Module Missions (issues 15-18)
15. Missions — liste + kanban statuts
16. Mission — fiche détail + pipeline candidats
17. MissionCandidate — drag-and-drop pipeline
18. ActivityLog + Documents mission

### Bloc 4 — Offres d'emploi (issues 19-22)
19. Génération offre IA depuis mission
20. Gestion offres — liste + fiche
21. Publication Webflow CMS API
22. Webhook candidatures + dédoublonnage

### Bloc 5 — IA avancée (issues 23-26)
23. Matching IA mission → candidats (pré-filtrage + Gemini)
24. Matching inversé candidat → missions
25. Contact candidat depuis matching (email Resend)
26. Assistant IA — chat + raccourcis

### Bloc 6 — Admin & finitions (issues 27-30)
27. Admin pipeline + logiciels + groupements
28. Admin utilisateurs
29. Recherche globale
30. Soft delete UI + rapports assistant

---

## 15. Variables d'environnement

```env
# DB
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=

# IA
EXTRACTION_PROVIDER=gemini
GEMINI_API_KEY=

# Storage
BLOB_READ_WRITE_TOKEN=

# Email
RESEND_API_KEY=
RESEND_FROM=recrutement@send.medijob.fr

# Webflow
WEBFLOW_API_TOKEN=
WEBFLOW_COLLECTION_ID=
WEBFLOW_WEBHOOK_SECRET=
```

---

*SPEC_V2.md — 20 questions validées + CDC client intégré.*  
*Remplace SPEC_V1.md. Prêt pour : `/grill-with-docs` → `/to-prd` → `/triage` → `/to-issues`*