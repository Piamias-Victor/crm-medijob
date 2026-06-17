# SPEC_V1.md — CRM Recrutement Pharma (Module Opérationnel)

> **Statut** : Validé par interview + `/grill-with-docs` (2026-06-17) — prêt pour handoff Cursor  
> **Client** : Medijob (agence de recrutement pharmacie)  
> **Périmètre** : Module Opérationnel uniquement (Candidats, Pharmacies, Contacts, Missions)  
> **Modules futurs** : Facturation/Devis, Dashboard, Planning — specs séparées  
> **Usage** : Mono-instance, interne agence, quelques recruteurs  
> **Glossaire domaine** : `CONTEXT.md` — **ADRs** : `docs/adr/0001` à `0004`

### Changements `/grill-with-docs` (2026-06-17)

| Sujet | Avant | Après |
|-------|-------|-------|
| Contact ↔ Pharmacie | 1-N (`pharmacyId`) | N-N via `ContactPharmacy` (ADR 0001) |
| `ContractType` | CDI, CDD, REMPLACEMENT, VACATION | CDI, CDD, REMPLACEMENT (ADR 0002) |
| Disponibilité candidat | `availableFrom` seul | + `CandidateStatus` enum (ADR 0003) |
| Kanban candidats | Global sur `/candidats` | Supprimé — kanban par mission et par fiche candidat |
| Mission tarification | Absente | `candidateRate`, `clientRate`, `plannedHours`, marge calculée |
| Mission référent | Absent | `referentId` obligatoire |
| `MissionStatus` | `EN_COURS` par défaut | `OUVERTE` par défaut, `EN_COURS` au placement (ADR 0004) |
| Resend | Optionnel | Obligatoire (dossier anonymisé + reset password) |
| Recherche | Globale | Filtre local par liste |
| Soft delete | Non précisé | Irréversible UI, cascade missions si pharmacie supprimée |

---

## 1. Stack (imposée, non négociable)

| Couche | Choix |
|--------|-------|
| Framework | Next.js 15 App Router |
| API | tRPC v11 + TanStack Query (wrappers tRPC uniquement, zéro import direct `@tanstack/react-query`) |
| DB | Prisma + Neon PostgreSQL |
| Auth | NextAuth v5 — email/password Argon2id, sessions DB |
| CSS | Tailwind v4 CSS-native (zéro `tailwind.config.ts`) |
| Animation | Framer Motion |
| Tests | Vitest + Testcontainers |
| Déploiement | Vercel |
| PDF export | `@react-pdf/renderer` |
| IA extraction | Gemini Flash-Lite (provider abstrait `EXTRACTION_PROVIDER`) |
| Enrichissement SIRET | `recherche-entreprises.api.gouv.fr` (gratuit, sans clé) |
| Emails transactionnels | Resend (obligatoire V1) |
| Icons | `lucide-react` |

---

## 2. Architecture

### Structure projet (single-app)
```
apps/web/src/
├── app/                        # Pages Next.js App Router
│   ├── (auth)/                 # login
│   ├── (dashboard)/
│   │   ├── candidats/
│   │   │   ├── page.tsx        # liste uniquement (pas de kanban global)
│   │   │   └── [id]/page.tsx   # fiche détail + kanban missions
│   │   ├── pharmacies/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── contacts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── missions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── admin/
│   │       ├── pipeline/page.tsx
│   │       ├── logiciels/page.tsx
│   │       └── utilisateurs/page.tsx
│   └── design-system/page.tsx  # issue #2 — validation visuelle
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── hooks/                      # wrappers tRPC/TanStack Query
├── view-models/                # transformations DB → UI
├── stores/                     # Zustand (UI state uniquement)
└── server/
    ├── auth/
    ├── db/
    │   └── repositories/       # toutes les queries Prisma ici
    └── routers/                # tRPC routers
```

### Règles non négociables
- Prisma uniquement dans `server/db/repositories/`
- RSC pour toutes les lectures (`createCaller`, jamais `fetch` interne)
- Mutations via `trpc.useMutation()` dans Client Components
- Atomic design strict : atoms → molecules → organisms
- Fichiers < 100 lignes (bloquant CI)
- Zéro `any` TypeScript
- React Hook Form + Zod pour tous les formulaires
- Zod obligatoire sur toutes les réponses IA (entrées externes non fiables)
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

enum CandidateStatus {
  DISPONIBLE
  EN_MISSION
  SOUS_PREAVIS
  INACTIF
}

enum PharmacyType {
  INDEPENDANTE
  GROUPE
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
  RESPONSABLE_RH
  AUTRE
}

enum ContractType {
  CDI
  CDD
  REMPLACEMENT
}

enum MissionStatus {
  OUVERTE
  EN_COURS
  TERMINEE
  ANNULEE
}

enum EventType {
  APPEL
  EMAIL
  ENTRETIEN
  MISSION
  NOTE
  AUTRE
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

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  name      String
  role      UserRole  @default(RECRUTEUR)
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  candidateEvents  CandidateEvent[]
  referentCandidates Candidate[] @relation("ReferentCandidates")
  referentMissions   Mission[]   @relation("ReferentMissions")
  accounts   Account[]
  sessions   Session[]
}

model Candidate {
  id                String          @id @default(cuid())
  firstName         String
  lastName          String
  email             String?
  phone             String?
  address           String?
  city              String?
  postalCode        String?
  jobTitle          JobTitle
  status            CandidateStatus @default(DISPONIBLE)
  mobilityRadiusKm  Int?
  mobilityNotes     String?
  availableFrom     DateTime?
  cvUrl             String?
  cvSummary         String?
  anonymizedProfile String?
  notes             String?
  referentId        String
  deletedAt         DateTime?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  referent   User                @relation("ReferentCandidates", fields: [referentId], references: [id])
  softwares  CandidateSoftware[]
  events     CandidateEvent[]
  missions   MissionCandidate[]
}

model Software {
  id        String @id @default(cuid())
  name      String @unique
  createdAt DateTime @default(now())

  candidates CandidateSoftware[]
}

model CandidateSoftware {
  candidateId String
  softwareId  String

  candidate Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  software  Software  @relation(fields: [softwareId], references: [id])

  @@id([candidateId, softwareId])
}

model CandidateEvent {
  id          String    @id @default(cuid())
  candidateId String
  authorId    String
  type        EventType
  content     String?
  date        DateTime  @default(now())
  createdAt   DateTime  @default(now())

  candidate Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  author    User      @relation(fields: [authorId], references: [id])
}

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
  paymentConditions String?
  notes             String?
  deletedAt         DateTime?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  contacts ContactPharmacy[]
  missions Mission[]
}

model Contact {
  id        String      @id @default(cuid())
  firstName String
  lastName  String
  email     String?
  phone     String?
  role      ContactRole @default(AUTRE)
  notes     String?
  deletedAt DateTime?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  pharmacies ContactPharmacy[]
  missions   Mission[]
}

model ContactPharmacy {
  contactId  String
  pharmacyId String
  isPrimary  Boolean @default(false)

  contact  Contact  @relation(fields: [contactId], references: [id], onDelete: Cascade)
  pharmacy Pharmacy @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)

  @@id([contactId, pharmacyId])
}

model PipelineStage {
  id        String   @id @default(cuid())
  name      String
  position  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  missionCandidates MissionCandidate[]
}

model Mission {
  id            String        @id @default(cuid())
  pharmacyId    String
  contactId     String?
  referentId    String
  title         String
  contractType  ContractType
  candidateRate Decimal?
  clientRate    Decimal?
  plannedHours  Int?
  startDate     DateTime
  endDate       DateTime?
  status        MissionStatus @default(OUVERTE)
  notes         String?
  deletedAt     DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  pharmacy   Pharmacy           @relation(fields: [pharmacyId], references: [id])
  contact    Contact?           @relation(fields: [contactId], references: [id])
  referent   User               @relation("ReferentMissions", fields: [referentId], references: [id])
  candidates MissionCandidate[]
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

// NextAuth v5
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
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime
  @@unique([identifier, token])
}
```

---

## 4. Relations entre entités

```
User (RECRUTEUR | ADMIN)
  ├── référent de N Candidates (referentId)
  └── référent de N Missions (referentId)

Candidate
  ├── status: CandidateStatus (géré manuellement)
  ├── N CandidateSoftware → Software (liste admin uniquement)
  ├── N CandidateEvent (historique typé, éditable par l'auteur)
  └── N MissionCandidate (stageId) → Mission

Pharmacy
  ├── N ContactPharmacy → Contact (isPrimary par pharmacie)
  └── N Missions

Contact
  ├── N ContactPharmacy → Pharmacy (many-to-many — ADR 0001)
  └── N Missions (en tant qu'interlocuteur)

Mission
  ├── 1 Pharmacy
  ├── 1? Contact (interlocuteur)
  ├── 1 User (referentId — responsabilité, pas restriction)
  ├── tarification : candidateRate, clientRate, plannedHours
  │   └── marge agence = clientRate − candidateRate (calculée, non stockée)
  └── N MissionCandidate → Candidate (avec PipelineStage)

PipelineStage (administrable — position ordonnée)
  └── N MissionCandidate

⚠️  MissionCandidate est la table pivot centrale :
    elle porte stageId. Un candidat peut être sur plusieurs missions
    simultanément, à des étapes différentes.

⚠️  Pas de kanban global des candidats (/candidats).
    Pipeline visible sur /missions/[id] et /candidats/[id] onglet Missions.
```

### Sémantique des statuts

**PharmacyStatus** — géré manuellement par le recruteur, jamais calculé depuis les missions.

**CandidateStatus** — géré manuellement :
- `DISPONIBLE` — candidat disponible pour placement
- `EN_MISSION` — candidat actuellement en poste
- `SOUS_PREAVIS` — en fin de mission, date future dans `availableFrom`
- `INACTIF` — hors circuit actif

**MissionStatus** — géré manuellement :
- `OUVERTE` — mission en cours de recrutement (défaut à la création)
- `EN_COURS` — candidat activement en poste (passage manuel lors du placement)
- `TERMINEE` — mission réellement terminée (clôture manuelle)
- `ANNULEE` — mission n'a pas abouti

### Action « Placer »

Déclenchée manuellement par le recruteur sur une mission. Effets simultanés :
1. `MissionCandidate.stageId` → étape « Placé » du pipeline
2. `Candidate.status` → `EN_MISSION`
3. `Mission.status` → `EN_COURS`

---

## 5. Authentification & Rôles

- Stratégie : email/password (Argon2id), sessions DB
- `RECRUTEUR` — CRUD candidats/pharmacies/contacts/missions + visibilité globale
- `ADMIN` — tout RECRUTEUR + gestion utilisateurs + config pipeline + config logiciels. Plusieurs admins possibles. Un admin peut aussi être référent d'un candidat ou d'une mission.
- Soft delete : `deletedAt: DateTime?` sur `User`, `Candidate`, `Pharmacy`, `Contact`, `Mission`
  - Irréversible depuis l'interface (pas de restauration UI)
  - Supprimer une `Pharmacy` → soft-delete en cascade de ses `Mission`s associées
  - Supprimer un `User` référent → ses candidats deviennent orphelins ; un admin doit les réassigner manuellement
- Visibilité : tous les recruteurs voient toutes les données — `referentId` = responsabilité, pas restriction
- Référent candidat : tout recruteur peut réassigner `referentId` après création
- Emails transactionnels (Resend, obligatoire) : réinitialisation mot de passe

---

## 6. Navigation & Structure des pages

### Nav latérale — 4 sections
```
Candidats    (icon: Users)
Pharmacies   (icon: Building2)
Contacts     (icon: User)
Missions     (icon: Briefcase)
─────────────
Admin        (icon: Settings)  — ADMIN uniquement
```

### Pages & onglets

#### `/candidats`
- Vue **Liste** uniquement — colonnes : nom, métier, statut (`CandidateStatus`), ville, dpt, date ajout, référent, actions
- Barre de recherche locale : nom, ville, métier (filtrage temps réel côté client)
- Pas d'onglet Kanban global

#### `/candidats/[id]`
1. **Profil** — coordonnées, métier, statut, logiciels, mobilité, disponibilité (`availableFrom`)
2. **Historique** — timeline `CandidateEvent` filtrable par `EventType` (éditable par l'auteur)
3. **Missions** — kanban des missions du candidat (colonnes = `PipelineStage`, cartes = missions) + drag-and-drop `stageId`
4. **Documents** — CV (aperçu/dl) · résumé IA (éditable) · dossier anonymisé (aperçu + export PDF + envoi email)

#### `/pharmacies`
- Vue liste — colonnes : nom, ville, type, statut, contact principal, nb missions
- Barre de recherche locale : nom, ville, SIRET

#### `/pharmacies/[id]`
1. **Infos** — tous les champs + lookup SIRET (disponible à tout moment, confirmation champ par champ)
2. **Contacts** — contacts rattachés via `ContactPharmacy` (gestion `isPrimary`)
3. **Missions** — missions liées
4. **Notes** — notes libres

#### `/contacts`
- Vue liste — colonnes : nom, pharmacie(s), rôle, téléphone, email
- Barre de recherche locale : nom, pharmacie associée

#### `/contacts/[id]`
1. **Infos** — tous les champs + pharmacies rattachées (many-to-many)
2. **Missions** — missions où ce contact est l'interlocuteur

#### `/missions`
- Onglet **Liste** — colonnes : titre, pharmacie, contrat, taux client, heures prévues, statut, nb candidats, référent
- Onglet **Kanban** — colonnes = `MissionStatus` (`OUVERTE` / `EN_COURS` / `TERMINEE` / `ANNULEE`)
- Barre de recherche locale : titre, pharmacie

#### `/missions/[id]`
1. **Infos** — tous les champs + tarification (`candidateRate`, `clientRate`, `plannedHours`, marge calculée)
2. **Pipeline** — kanban des candidats positionnés sur cette mission (colonnes = `PipelineStage`) + suggestion candidats par mobilité
3. **Historique** — log des actions

### Pages Admin (`/admin/*`) — ADMIN uniquement
- `/admin/pipeline` — CRUD PipelineStage + drag-and-drop réordonner
- `/admin/logiciels` — CRUD Software
- `/admin/utilisateurs` — CRUD User + assign rôles

---

## 7. Fonctions IA

### 7.1 Extraction CV (pipeline Perimeo SPEC_V3 réutilisé à ~80%)

```
Upload PDF → Vercel Blob (temporaire)
→ tRPC mutation → provider abstrait (EXTRACTION_PROVIDER=gemini|mock)
→ Gemini Flash-Lite → JSON brut
→ validation Zod stricte (CvExtractionSchema)
→ écran de relecture humaine obligatoire (champs pré-remplis éditables)
→ si email existant en base : avertissement doublon, le recruteur choisit
→ logiciels suggérés par l'IA : confirmés depuis la liste admin uniquement
→ confirmation recruteur → création Candidate en base
```

```typescript
const CvExtractionSchema = z.object({
  firstName:        z.string(),
  lastName:         z.string(),
  email:            z.string().email().optional(),
  phone:            z.string().optional(),
  city:             z.string().optional(),
  jobTitle:         z.nativeEnum(JobTitle).optional(),
  softwares:        z.array(z.string()).optional(),
  availableFrom:    z.string().datetime().optional(),
  mobilityNotes:    z.string().optional(),
  experienceNotes:  z.string().optional(), // texte brut, non structuré
})
```

Provider abstrait :
```typescript
// src/server/extraction/extraction.provider.ts
interface ExtractionProvider {
  extractFromPdf(base64: string): Promise<CvExtractionResult>
}
// Implémentations : GeminiProvider | MockProvider
// Sélection : env EXTRACTION_PROVIDER=gemini|mock
```

### 7.2 Résumé IA du profil

- Déclencheur : bouton "Générer le résumé" — onglet Documents
- Input : notes + expérience brute CV + métier + logiciels
- Output : markdown sauvegardé dans `candidate.cvSummary`
- Éditable manuellement par le recruteur après génération
- Prérequis obligatoire avant génération du dossier anonymisé
- Validation : `z.object({ summary: z.string().min(1) })`
- Modèle : Gemini Flash-Lite

### 7.3 Dossier anonymisé

- Déclencheur : bouton "Générer le dossier" — onglet Documents (requiert `cvSummary` existant)
- Input : cvSummary + métier + logiciels + mobilité + disponibilité (zéro PII)
- Output : markdown sauvegardé dans `candidate.anonymizedProfile`
- Re-génération manuelle si le profil change après génération (pas d'auto-update)
- Aperçu : modale dans l'UI
- Export : PDF via `@react-pdf/renderer` (logo Medijob + mise en page sobre)
- Envoi : email direct à la pharmacie via Resend (depuis l'app)
- Modèle : Gemini Flash-Lite

---

## 8. Enrichissement SIRET

API : `https://recherche-entreprises.api.gouv.fr/search` — gratuite, sans clé, données publiques

Disponible à tout moment depuis la fiche pharmacie (création et édition).

```
Recruteur saisit nom OU SIRET
→ tRPC query server-side → API Sirene
→ liste de suggestions
→ sélection → pré-remplissage proposé : nom, adresse, ville, CP, forme juridique
→ TVA calculée : clé = (12 + 3 × (SIREN % 97)) % 97
→ si champs déjà remplis : confirmation champ par champ avant écrasement
→ validation recruteur → sauvegarde
```

---

## 9. Pipeline Kanban

### Config admin (`/admin/pipeline`)
- CRUD `PipelineStage` avec drag-and-drop (`position: Int`)
- Étapes par défaut à l'init : `Nouveau | Contacté | Entretien | Proposition | Placé`

### Kanban mission (`/missions/[id]` onglet Pipeline)
- Colonnes = `PipelineStage` ordonnés par `position`
- Cartes = candidats positionnés sur cette mission
- Drag = mutation `MissionCandidate.stageId`
- Suggestion candidats : filtrage par mobilité (`mobilityRadiusKm` couvre la pharmacie)

### Kanban candidat (`/candidats/[id]` onglet Missions)
- Colonnes = `PipelineStage` ordonnés par `position`
- Cartes = missions sur lesquelles le candidat est positionné
- Drag = mutation `MissionCandidate.stageId`

### Règles
- Un candidat peut être sur plusieurs missions simultanément, à des étapes différentes
- Les événements `CandidateEvent` de type `MISSION` sont créés manuellement (pas auto-générés au positionnement)
- Pas de kanban global sur `/candidats`

---

## 10. Design System — Charte Medijob

### Identité visuelle
- **Logo white** : `https://cdn.prod.website-files.com/65a98a7828ff832f425b9a3c/675b03f47a4fd952139c21fe_Group%2063-p-500.png`
- **Wordmark** : "MEDIJOB" — `font-weight: 700`, `letter-spacing: -0.5px`, couleur `#000000` sur clair / `#ffffff` sur sombre
- **Croix médicale** : SVG inline, `fill: #00a89d`
- **Police** : Inter via `next/font/google`

### Palette exacte (valeurs inspectées sur medijob.fr)

```css
/* packages/ui/src/styles/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* ─── Brand Medijob (couleurs inspectées) ─── */
  --color-primary:        oklch(0.26 0.10 255);   /* #003366 navy */
  --color-primary-hover:  oklch(0.32 0.12 255);   /* #004080 */
  --color-primary-muted:  oklch(0.93 0.02 255);   /* #e6edf5 */
  --color-primary-fg:     oklch(0.99 0.00 0);     /* white */

  --color-accent:         oklch(0.64 0.10 185);   /* #00a89d teal */
  --color-accent-hover:   oklch(0.52 0.09 185);   /* #007a72 */
  --color-accent-muted:   oklch(0.95 0.03 185);   /* #d9f2f0 */
  --color-accent-fg:      oklch(0.99 0.00 0);     /* white */

  /* ─── Surfaces ─── */
  --color-surface:        oklch(0.974 0.005 255); /* #f4f6f8 sections alt */
  --color-border:         oklch(0.880 0.010 255); /* #d5dce6 */
  --color-fg:             oklch(0.13 0.00 0);     /* #000000 wordmark */
  --color-fg-muted:       oklch(0.44 0.00 0);     /* #6b7280 */

  /* ─── Semantic ─── */
  --color-success:        oklch(0.57 0.17 145);   /* #16a34a */
  --color-warning:        oklch(0.64 0.16 72);    /* #d97706 */
  --color-error:          oklch(0.52 0.22 25);    /* #dc2626 */
  --color-info:           oklch(0.60 0.12 235);   /* #2563eb */

  /* ─── Typography ─── */
  --font-sans: 'Inter', ui-sans-serif, system-ui;

  /* ─── Radius ─── */
  --radius-sm: 0.375rem;  /* 6px  — badges, chips */
  --radius-md: 0.5rem;    /* 8px  — boutons, inputs */
  --radius-lg: 0.875rem;  /* 14px — cards, panels */
  --radius-xl: 1.25rem;   /* 20px — modales */

  /* ─── Motion ─── */
  --motion-fast: 120ms;
  --motion-base: 200ms;
  --motion-slow: 320ms;
  --motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark mode */
[data-theme='dark'] {
  --color-primary:  oklch(0.55 0.10 255);
  --color-surface:  oklch(0.10 0.00 0);
  --color-fg:       oklch(0.96 0.00 0);
  --color-border:   oklch(0.22 0.00 0);
  --color-fg-muted: oklch(0.55 0.00 0);
}
```

### Composants — règles visuelles

**Boutons** :
```tsx
// Primary (actions principales)
className="bg-(--color-primary) text-(--color-primary-fg) hover:bg-(--color-primary-hover) rounded-(--radius-md) px-4 py-2 text-sm font-medium transition-(--motion-fast)"

// Secondary (actions secondaires)
className="border border-(--color-primary) text-(--color-primary) bg-transparent hover:bg-(--color-primary-muted) rounded-(--radius-md) px-4 py-2 text-sm font-medium"

// Accent (actions IA — Générer résumé, Dossier anonymisé)
className="bg-(--color-accent) text-(--color-accent-fg) hover:bg-(--color-accent-hover) rounded-(--radius-md) px-4 py-2 text-sm font-medium"

// Ghost (actions tertiaires)
className="bg-(--color-surface) text-(--color-fg) border border-(--color-border) hover:border-(--color-primary) rounded-(--radius-md) px-4 py-2 text-sm"
```

**Badges statuts** :
```tsx
// CandidateStatus
DISPONIBLE    → bg-(--color-accent-muted)  text-[#00503f]
EN_MISSION    → bg-(--color-primary-muted) text-(--color-primary)
SOUS_PREAVIS  → bg-amber-100               text-amber-800
INACTIF       → bg-red-100                 text-red-800

// MissionStatus / PharmacyStatus
OUVERTE       → bg-(--color-surface)       text-(--color-fg-muted) border border-(--color-border)
EN_COURS      → bg-(--color-primary-muted) text-(--color-primary)
TERMINEE      → bg-green-100               text-green-800
ANNULEE       → bg-red-100                 text-red-800
PROSPECT      → bg-(--color-surface)       text-(--color-fg-muted) border border-(--color-border)
ACTIF         → bg-(--color-accent-muted)  text-[#00503f]
INACTIF       → bg-red-100                 text-red-800
```

**Cards** :
```tsx
className="bg-white border border-(--color-border) rounded-(--radius-lg) p-4"
```

**Sidebar** :
```tsx
// Container
className="bg-(--color-surface) border-r border-(--color-border) w-56 h-screen flex flex-col"
// Nav item actif
className="bg-(--color-primary-muted) text-(--color-primary) font-medium rounded-(--radius-md)"
// Nav item inactif
className="text-(--color-fg-muted) hover:bg-(--color-surface) rounded-(--radius-md)"
```

**Kanban cards** — border-left 3px par étape :
```
Nouveau    → border-l-(--color-border)
Contacté   → border-l-(--color-accent)
Entretien  → border-l-(--color-primary)
Proposition→ border-l-amber-400
Placé      → border-l-green-500
```

### Lucide Icons — mapping complet

```typescript
import {
  // Navigation
  Users,          // Candidats
  Building2,      // Pharmacies
  User,           // Contacts
  Briefcase,      // Missions
  Settings,       // Admin
  // Vues
  LayoutGrid,     // Kanban
  List,           // Liste tabulaire
  // Actions candidat
  Upload,         // Import CV
  Sparkles,       // Actions IA (résumé, dossier)
  FileText,       // Documents
  Download,       // Export PDF
  Eye,            // Vue rapide
  // Actions génériques
  Plus,           // Ajouter
  Pencil,         // Éditer
  Trash2,         // Supprimer (soft delete)
  MoreHorizontal, // Menu contextuel (...)
  Search,         // Recherche
  Filter,         // Filtres
  ChevronRight,   // Navigation breadcrumb
  ArrowLeft,      // Retour
  // Données candidat
  MapPin,         // Ville / mobilité
  Phone,          // Téléphone
  Mail,           // Email
  Clock,          // Disponibilité / historique
  GraduationCap,  // Métier / formation
  Monitor,        // Logiciels maîtrisés
  // Statuts
  CheckCircle2,   // Placé / succès
  XCircle,        // Inactif / annulé
  AlertCircle,    // Warning
  // Pipeline
  KanbanSquare,   // Pipeline stage
  MoveHorizontal, // Drag indicator
} from 'lucide-react'
```

### Page `/design-system` — contenu requis (issue #2)

Doit afficher dans l'ordre, sur fond `--color-surface` :
1. Logo (version dark bg + version light bg)
2. Palette complète avec tokens et hex
3. Typographie (H1 → caption, tous niveaux)
4. Boutons (Primary / Secondary / Accent / Ghost + états disabled)
5. Badges (tous les statuts)
6. Inputs (text, select, textarea + états focus/error)
7. Sidebar mockup
8. Kanban card (toutes les couleurs border-left)
9. Candidate card (fiche résumé)
10. Empty state (icône + texte + CTA)
11. Loading skeleton (3 lignes)
12. Toast notifications (success / error / info)

---

## 11. RGPD

- Base légale retenue : intérêt légitime (candidats ayant fourni volontairement leurs coordonnées)
- **⚠️ Relecture juridique obligatoire avant mise en production**
- Soft delete : `deletedAt` sur toutes les entités sensibles
- Purge physique : scriptable séparément si juriste l'exige
- Zéro champ consentement en V1 — à réévaluer avec juriste

---

## 12. Ordre de développement (issues)

### Issues 1 & 2 — toujours en premier
1. **Design System** — `globals.css` tokens + tous les atoms/molecules Medijob
2. **Page `/design-system`** — démo visuelle complète (12 sections) avant toute page fonctionnelle

### Issues suivantes (ordre suggéré)
3. Auth — NextAuth v5 email/password + middleware protection routes + reset password (Resend)
4. Schema Prisma complet + migrations + seeds (`PipelineStage` par défaut × 5)
5. Module Candidats — liste + fiche + CRUD + `CandidateStatus`
6. Upload CV + pipeline extraction IA (provider Gemini + écran relecture obligatoire + détection doublon)
7. Module Pharmacies — liste + fiche + enrichissement SIRET (lookup à tout moment)
8. Module Contacts — liste + fiche + `ContactPharmacy` (many-to-many)
9. Module Missions — liste + fiche + `MissionCandidate` + tarification + `referentId`
10. Kanban Pipeline (mission + fiche candidat) + drag-and-drop + suggestion mobilité
11. Fonctions IA résumé + dossier anonymisé + export PDF + envoi email Resend
12. Admin — pipeline config + logiciels + utilisateurs + réassignation candidats orphelins
13. Soft delete UI + recherche locale par liste

---

## 13. Variables d'environnement

```env
# DB
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=

# IA
EXTRACTION_PROVIDER=gemini
GEMINI_API_KEY=

# Storage (CV upload)
BLOB_READ_WRITE_TOKEN=

# Email (obligatoire V1)
RESEND_API_KEY=
```

---

*SPEC_V1.md — interview initiale + `/grill-with-docs` (2026-06-17) + charte Medijob.*  
*Glossaire : `CONTEXT.md` — ADRs : `docs/adr/0001` à `0004`*  
*Prêt pour : `/caveman` → `/to-prd` → `/triage` → `/to-issues`*