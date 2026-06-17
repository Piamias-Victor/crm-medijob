# SPEC_V1.md — CRM Recrutement Pharma (Module Opérationnel)

> **Statut** : Validé par interview — prêt pour handoff Cursor  
> **Client** : Medijob (agence de recrutement pharmacie)  
> **Périmètre** : Module Opérationnel uniquement (Candidats, Pharmacies, Contacts, Missions)  
> **Modules futurs** : Facturation/Devis, Dashboard, Planning — specs séparées  
> **Usage** : Mono-instance, interne agence, quelques recruteurs

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
│   │   │   ├── page.tsx        # liste + vue kanban
│   │   │   └── [id]/page.tsx   # fiche détail
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
  VACATION
}

enum MissionStatus {
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

  candidates CandidateEvent[]
  referents  Candidate[]      @relation("ReferentCandidates")
  accounts   Account[]
  sessions   Session[]
}

model Candidate {
  id               String    @id @default(cuid())
  firstName        String
  lastName         String
  email            String?
  phone            String?
  address          String?
  city             String?
  postalCode       String?
  jobTitle         JobTitle
  mobilityRadiusKm Int?
  mobilityNotes    String?
  availableFrom    DateTime?
  cvUrl            String?
  cvSummary        String?
  anonymizedProfile String?
  notes            String?
  referentId       String
  deletedAt        DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  referent   User               @relation("ReferentCandidates", fields: [referentId], references: [id])
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

  contacts Contact[]
  missions Mission[]
}

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

  pharmacy Pharmacy  @relation(fields: [pharmacyId], references: [id], onDelete: Cascade)
  missions Mission[]
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
  id           String        @id @default(cuid())
  pharmacyId   String
  contactId    String?
  title        String
  contractType ContractType
  startDate    DateTime
  endDate      DateTime?
  status       MissionStatus @default(EN_COURS)
  notes        String?
  deletedAt    DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  pharmacy   Pharmacy           @relation(fields: [pharmacyId], references: [id])
  contact    Contact?           @relation(fields: [contactId], references: [id])
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
  └── référent de N Candidates (referentId)

Candidate
  ├── N CandidateSoftware → Software (table administrable via admin)
  ├── N CandidateEvent (historique typé, enum fixe)
  └── N MissionCandidate (stageId) → Mission

Pharmacy
  ├── N Contacts (1 isPrimary par pharmacie)
  └── N Missions

Mission
  ├── 1 Pharmacy
  ├── 1? Contact (interlocuteur)
  └── N MissionCandidate → Candidate (avec PipelineStage)

PipelineStage (administrable — position ordonnée)
  └── N MissionCandidate

⚠️  MissionCandidate est la table pivot centrale :
    elle porte stageId et alimente à la fois
    le kanban global Candidats ET le kanban par Mission.
```

---

## 5. Authentification & Rôles

- Stratégie : email/password (Argon2id), sessions DB
- `RECRUTEUR` — CRUD candidats/pharmacies/contacts/missions + visibilité globale
- `ADMIN` — tout RECRUTEUR + gestion utilisateurs + config pipeline + config logiciels
- Soft delete : `deletedAt: DateTime?` sur `User`, `Candidate`, `Pharmacy`, `Contact`, `Mission`
- Visibilité : tous les recruteurs voient tous les candidats — `referentId` = responsabilité, pas restriction

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
- Onglet **Liste** (icon: List) — colonnes : nom, métier, ville, dpt, date ajout, référent, actions
- Onglet **Kanban** (icon: LayoutGrid) — colonnes = PipelineStage ordonnés, drag-and-drop

#### `/candidats/[id]`
1. **Profil** — coordonnées, métier, logiciels, mobilité, disponibilité
2. **Historique** — timeline CandidateEvent filtrables par EventType
3. **Missions** — missions sur lesquelles le candidat est positionné + étape par mission
4. **Documents** — CV (aperçu/dl) · résumé IA · dossier anonymisé (aperçu + export PDF)

#### `/pharmacies`
- Vue liste — colonnes : nom, ville, type, statut, contact principal, nb missions

#### `/pharmacies/[id]`
1. **Infos** — tous les champs + lookup SIRET
2. **Contacts** — liste des contacts de cette pharmacie
3. **Missions** — missions liées
4. **Notes** — notes libres

#### `/contacts`
- Vue liste — colonnes : nom, pharmacie, rôle, téléphone, email

#### `/contacts/[id]`
1. **Infos** — tous les champs
2. **Missions** — missions où ce contact est l'interlocuteur

#### `/missions`
- Onglet **Liste** — colonnes : titre, pharmacie, contrat, dates, statut, nb candidats
- Onglet **Kanban** — colonnes = MissionStatus

#### `/missions/[id]`
1. **Infos** — tous les champs
2. **Pipeline** — kanban des candidats positionnés sur cette mission (colonnes = PipelineStage)
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
→ écran de revue humaine (champs pré-remplis éditables)
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
- Validation : `z.object({ summary: z.string().min(1) })`
- Modèle : Gemini Flash-Lite

### 7.3 Dossier anonymisé

- Déclencheur : bouton "Générer le dossier" — onglet Documents
- Input : cvSummary + métier + logiciels + mobilité + disponibilité (zéro PII)
- Output : markdown sauvegardé dans `candidate.anonymizedProfile`
- Aperçu : modale dans l'UI
- Export : PDF via `@react-pdf/renderer` (logo Medijob + mise en page sobre)
- Modèle : Gemini Flash-Lite

---

## 8. Enrichissement SIRET

API : `https://recherche-entreprises.api.gouv.fr/search` — gratuite, sans clé, données publiques

```
Recruteur saisit nom OU SIRET
→ tRPC query server-side → API Sirene
→ liste de suggestions
→ sélection → pré-remplissage : nom, adresse, ville, CP, forme juridique
→ TVA calculée : clé = (12 + 3 × (SIREN % 97)) % 97
→ validation recruteur → sauvegarde
```

---

## 9. Pipeline Kanban

### Config admin (`/admin/pipeline`)
- CRUD PipelineStage avec drag-and-drop (`position: Int`)
- Étapes par défaut à l'init : `Nouveau | Contacté | Entretien | Proposition | Placé`

### Kanban global (`/candidats` onglet Kanban)
- Colonnes = PipelineStage ordonnés par `position`
- Carte = candidat + mission active courante
- Drag = mutation `MissionCandidate.stageId`

### Kanban mission (`/missions/[id]` onglet Pipeline)
- Colonnes = PipelineStage ordonnés
- Cartes = candidats positionnés sur cette mission
- Drag = mutation `MissionCandidate.stageId`

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
Disponible    → bg-(--color-accent-muted)  text-[#00503f]
En cours      → bg-(--color-primary-muted) text-(--color-primary)
Placé         → bg-green-100               text-green-800
Inactif       → bg-red-100                 text-red-800
Sous préavis  → bg-amber-100               text-amber-800
PROSPECT      → bg-(--color-surface)       text-(--color-fg-muted) border border-(--color-border)
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
3. Auth — NextAuth v5 email/password + middleware protection routes
4. Schema Prisma complet + migrations + seeds (PipelineStage par défaut × 5)
5. Module Candidats — liste + fiche + CRUD
6. Upload CV + pipeline extraction IA (provider Gemini + écran revue)
7. Module Pharmacies — liste + fiche + enrichissement SIRET
8. Module Contacts — liste + fiche
9. Module Missions — liste + fiche + MissionCandidate
10. Kanban Pipeline (Candidats + Mission) + drag-and-drop
11. Fonctions IA résumé + dossier anonymisé + export PDF
12. Admin — pipeline config + logiciels + utilisateurs
13. Soft delete UI + recherche globale

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

# Email (optionnel V1)
RESEND_API_KEY=
```

---

*SPEC_V1.md — interview 20 questions validées + charte Medijob (couleurs inspectées).*  
*Prêt pour : `/caveman` → `/grill-with-docs` → `/to-prd` → `/triage` → `/to-issues`*