# PRD — Module Opérationnel V1 (CRM MediJob)

> Source : `SPEC_V1.md`, `CONTEXT.md`, ADRs 0001–0004  
> Découpage : 6 epics livrables (voir Implementation Decisions)

## Problem Statement

Medijob, agence de recrutement spécialisée en pharmacie, gère aujourd'hui ses Candidats, Pharmacies, Contacts et Missions via des outils dispersés (fichiers, emails, notes). Les recruteurs perdent du temps à ressaisir des informations, n'ont pas de visibilité unifiée sur l'avancement des placements, et peinent à produire rapidement des dossiers anonymisés conformes pour les Pharmacies clientes.

L'équipe a besoin d'un CRM interne, mono-instance, permettant de centraliser le cycle de recrutement — de l'import CV au placement en Mission — avec assistance IA et une charte visuelle Medijob.

## Solution

Construire le **Module Opérationnel V1** : une application web interne (Next.js 15) accessible aux Recruteurs et Admins, couvrant la gestion des Candidats, Pharmacies, Contacts et Missions, avec :

- Pipeline de recrutement partagé (étapes configurables, kanban par Mission et par fiche Candidat)
- Extraction CV par IA avec relecture humaine obligatoire
- Enrichissement SIRET des Pharmacies
- Génération de résumé IA et Dossier anonymisé, export PDF et envoi email
- Tarification des Missions (taux candidat, taux client, heures prévues, marge calculée)
- Action « Placer » orchestrant statuts Candidat, Mission et étape Pipeline

## User Stories

### Accès & authentification

1. As a Recruteur, I want to log in with email and password, so that only authorized agency staff access the CRM.
2. As a Recruteur, I want my session to persist securely, so that I don't have to re-authenticate on every page.
3. As a Recruteur who forgot my password, I want to receive a reset link by email, so that I can regain access without admin intervention.
4. As an unauthenticated visitor, I want to be redirected to login when accessing dashboard routes, so that data remains protected.

### Navigation & interface

5. As a Recruteur, I want a sidebar with sections Candidats, Pharmacies, Contacts, Missions, so that I can navigate the CRM intuitively.
6. As an Admin, I want an additional Admin section in the sidebar, so that I can access configuration pages.
7. As a Recruteur, I want the app to follow the Medijob visual identity (navy, teal, Inter), so that the tool feels like part of the agency brand.
8. As a developer, I want a design system demo page validating all UI tokens and components, so that visual consistency is enforced before building functional pages.

### Candidats — liste & profil

9. As a Recruteur, I want to see a list of all Candidats with name, métier, statut, ville, département, date added, and référent, so that I have an overview of the talent pool.
10. As a Recruteur, I want to search Candidats locally by name, ville, or métier, so that I can quickly find a profile.
11. As a Recruteur, I want to create a Candidat manually with all profile fields, so that I can register candidates without a CV.
12. As a Recruteur, I want to edit a Candidat's profile (coordinates, métier, mobilité, disponibilité, notes), so that information stays current.
13. As a Recruteur, I want to set a Candidat's CandidateStatus (DISPONIBLE, EN_MISSION, SOUS_PREAVIS, INACTIF), so that availability is visible to the team.
14. As a Recruteur, I want to set a future availability date (availableFrom), so that I can track when a Candidat becomes available again.
15. As a Recruteur, I want to assign or reassign the référent of any Candidat, so that responsibility is clear without restricting visibility.
16. As a Recruteur, I want to see which Logiciels a Candidat masters, so that I can match skills to Mission needs.
17. As a Recruteur, I want to attach Logiciels from the admin-managed list only, so that data stays normalized.

### Candidats — historique

18. As a Recruteur, I want to log typed Événements on a Candidat (APPEL, EMAIL, ENTRETIEN, MISSION, NOTE, AUTRE), so that interactions are traceable.
19. As a Recruteur, I want to edit an Événement I authored, so that I can correct mistakes.
20. As a Recruteur, I want to filter the Événement timeline by type, so that I can focus on relevant history.
21. As a Recruteur, I want to manually create MISSION-type Événements, so that I document mission-related interactions on my own terms.

### Candidats — extraction CV

22. As a Recruteur, I want to upload a CV PDF and trigger IA extraction, so that I avoid manual data entry.
23. As a Recruteur, I want to review and edit all extracted fields before the Candidat is created, so that IA errors don't pollute the database.
24. As a Recruteur, I want to be warned if the extracted email matches an existing Candidat, so that I can avoid duplicates.
25. As a Recruteur, I want IA-suggested Logiciels presented during CV review for confirmation, so that only validated software is linked.
26. As a Recruteur, I want to preview and download the stored CV from the Documents tab, so that I can consult the original file.

### Candidats — documents IA

27. As a Recruteur, I want to generate an IA résumé (cvSummary) from notes, experience, métier, and logiciels, so that I have a structured profile summary.
28. As a Recruteur, I want to edit the generated cvSummary manually, so that I can refine the content.
29. As a Recruteur, I want to generate a Dossier anonymisé from cvSummary and non-PII fields, so that I can share candidates with Pharmacies safely.
30. As a Recruteur, I want to preview the Dossier anonymisé in a modal, so that I can verify content before sending.
31. As a Recruteur, I want to export the Dossier anonymisé as a branded PDF, so that I can share it offline if needed.
32. As a Recruteur, I want to email the Dossier anonymisé directly to a Pharmacie from the app, so that transmission is fast and traceable.
33. As a Recruteur, I want to manually re-generate the Dossier anonymisé when the profile changes, so that outdated versions aren't auto-overwritten.

### Candidats — missions (kanban)

34. As a Recruteur, I want to see a kanban of Missions on a Candidat's Missions tab (columns = Pipeline stages, cards = Missions), so that I see where this Candidat stands on each opportunity.
35. As a Recruteur, I want to drag a Mission card to a different Pipeline stage on the Candidat kanban, so that I can update progress quickly.

### Pharmacies

36. As a Recruteur, I want to see a list of Pharmacies with name, ville, type, statut, contact principal, and mission count, so that I manage the client portfolio.
37. As a Recruteur, I want to search Pharmacies locally by name, ville, or SIRET, so that I find clients quickly.
38. As a Recruteur, I want to create and edit a Pharmacie with all business fields, so that client data is complete.
39. As a Recruteur, I want to set a Pharmacie's statut manually (PROSPECT, ACTIF, INACTIF), so that relationship status reflects reality.
40. As a Recruteur, I want to lookup a Pharmacie by name or SIRET via the government API at any time, so that I enrich data without re-entering from scratch.
41. As a Recruteur, I want SIRET lookup to propose field updates one by one when data already exists, so that I don't accidentally overwrite correct information.
42. As a Recruteur, I want the TVA number auto-calculated from SIREN, so that fiscal data is accurate.
43. As a Recruteur, I want to see Contacts linked to a Pharmacie, so that I know who to call.
44. As a Recruteur, I want to see Missions linked to a Pharmacie, so that I track active needs.
45. As a Recruteur, I want to add free-form notes on a Pharmacie, so that I capture relationship context.

### Contacts

46. As a Recruteur, I want to see a list of Contacts with name, associated Pharmacie(s), rôle, phone, and email, so that I manage interlocutors.
47. As a Recruteur, I want to search Contacts locally by name or Pharmacie, so that I find people quickly.
48. As a Recruteur, I want to create a Contact and link them to one or more Pharmacies, so that group managers are modeled correctly.
49. As a Recruteur, I want to mark a Contact as primary (isPrimary) for a given Pharmacie, so that the preferred interlocutor is clear.
50. As a Recruteur, I want to see Missions where a Contact is the interlocuteur, so that I understand their involvement.

### Missions — gestion

51. As a Recruteur, I want to create a Mission for a Pharmacie with title, contract type, dates, tarification, and référent, so that recruitment needs are formalized.
52. As a Recruteur, I want to set candidateRate, clientRate, and plannedHours on a Mission, so that financial terms are recorded.
53. As a Recruteur, I want to see the agency margin (clientRate − candidateRate) calculated automatically, so that profitability is visible without manual math.
54. As a Recruteur, I want to designate an optional Contact as interlocuteur on a Mission, so that communication is directed.
55. As a Recruteur, I want to assign a référent Recruteur to a Mission, so that ownership is clear.
56. As a Recruteur, I want to see Mission statut (OUVERTE, EN_COURS, TERMINEE, ANNULEE), so that I know the lifecycle stage.
57. As a Recruteur, I want to manually close a Mission as TERMINEE when it's truly finished, so that the status reflects reality.
58. As a Recruteur, I want to cancel a Mission as ANNULEE when it didn't succeed, so that failed opportunities are distinguished from completed ones.
59. As a Recruteur, I want to search Missions locally by title or Pharmacie, so that I find opportunities quickly.

### Missions — kanban statut

60. As a Recruteur, I want a kanban view of Missions grouped by MissionStatus, so that I see the portfolio at a glance.
61. As a Recruteur, I want to drag Missions between statut columns, so that I update lifecycle quickly.

### Missions — pipeline candidats

62. As a Recruteur, I want to position Candidats on a Mission, so that I track who is being considered.
63. As a Recruteur, I want a kanban on the Mission detail showing Candidats by Pipeline stage, so that I see recruitment progress.
64. As a Recruteur, I want to drag Candidats between Pipeline stages on a Mission, so that I update their progress.
65. As a Recruteur, I want the same Candidat on multiple Missions at different Pipeline stages simultaneously, so that parallel opportunities are supported.
66. As a Recruteur, I want suggested Candidats on a Mission based on mobilité radius covering the Pharmacie, so that I find geographically compatible talent faster.

### Placement

67. As a Recruteur, I want a « Placer » action on a Mission, so that confirming a placement updates all related statuses in one step.
68. As a Recruteur, I want « Placer » to move the Candidat to the Placé Pipeline stage, set CandidateStatus to EN_MISSION, and Mission statut to EN_COURS, so that the system reflects an active placement.

### Admin — pipeline

69. As an Admin, I want to create, edit, and delete PipelineStage entries, so that the recruitment funnel matches our process.
70. As an Admin, I want to reorder Pipeline stages via drag-and-drop, so that column order reflects our workflow.
71. As an Admin, I want default stages seeded (Nouveau, Contacté, Entretien, Proposition, Placé), so that the app is usable on first deploy.

### Admin — logiciels

72. As an Admin, I want to CRUD the Software catalog, so that Candidat skills stay normalized.
73. As an Admin, I want only catalog Software linkable to Candidats, so that free-text pollution is prevented.

### Admin — utilisateurs

74. As an Admin, I want to create and manage User accounts with roles (RECRUTEUR, ADMIN), so that access is controlled.
75. As an Admin, I want to soft-delete Users, so that departed staff lose access without data loss.
76. As an Admin, I want to see orphaned Candidats when their référent is deleted, so that I can reassign them manually.

### Soft delete & données

77. As a Recruteur, I want to soft-delete Candidats, Pharmacies, Contacts, and Missions, so that mistakes are recoverable at DB level.
78. As a Recruteur, I want soft-deleted records to disappear from all lists and views, so that the UI stays clean.
79. As a Recruteur, I want soft-delete to be irreversible from the UI, so that accidental restoration doesn't create confusion.
80. As a Recruteur, I want deleting a Pharmacie to cascade soft-delete its Missions, so that orphaned missions don't linger.

### Visibilité & collaboration

81. As a Recruteur, I want to see all Candidats regardless of who is référent, so that the team collaborates without data silos.
82. As a Recruteur, I want to see all Missions regardless of who is référent, so that coverage is shared across the agency.
83. As an Admin who is also a Recruteur, I want to be assignable as référent on Candidats and Missions, so that I can manage placements directly.

## Implementation Decisions

### Découpage en 6 epics (ordre de livraison)

| Epic | Contenu | Dépendances |
|------|---------|-------------|
| **0 — Fondations UI** | Tokens Medijob, atoms/molecules/organisms, page design-system, app shell (sidebar, layout) | Aucune |
| **1 — Plateforme** | Bootstrap app, Prisma schema + migrations + seeds, tRPC, NextAuth, middleware, reset password Resend, repositories pattern | Epic 0 |
| **2 — Candidats** | Liste, fiche (Profil, Historique, Documents), CRUD, CandidateStatus, référent, upload CV + extraction IA | Epic 1 |
| **3 — Pharmacies & Contacts** | CRUD Pharmacies, enrichissement SIRET, CRUD Contacts, ContactPharmacy N-N | Epic 1 (parallélisable avec Epic 2) |
| **4 — Missions & Pipeline** | CRUD Missions, tarification, MissionCandidate, kanban mission + kanban candidat, action Placer, suggestion mobilité | Epic 2 + 3 |
| **5 — IA Documents** | Résumé IA, Dossier anonymisé, export PDF, envoi email Resend | Epic 2 + 4 |
| **6 — Admin & Polish** | Config pipeline, logiciels, utilisateurs, réassignation orphelins, soft delete UI, recherche locale | Epic 1 + modules métier |

### Stack (non négociable)

- Next.js 15 App Router, tRPC v11, Prisma + Neon PostgreSQL, NextAuth v5 (Argon2id, sessions DB)
- Tailwind v4 CSS-native, Framer Motion, Vitest + Testcontainers, Vercel
- Gemini Flash-Lite (provider abstrait EXTRACTION_PROVIDER), Resend (obligatoire), Vercel Blob (CV upload)
- `@react-pdf/renderer` pour export PDF, `lucide-react` pour icônes

### Architecture

- Single-app, atomic design strict (atoms → molecules → organisms), fichiers < 100 lignes
- Prisma uniquement dans repositories — jamais dans routers ni pages
- RSC pour lectures (createCaller), mutations via trpc.useMutation() dans Client Components
- View-models comme seul pont DB → UI ; Zustand pour UI state uniquement
- React Hook Form + Zod pour tous formulaires et réponses IA

### Schéma — décisions domaine (ADRs)

**ADR 0001 — ContactPharmacy (N-N)** : Contact plus PharmacyId direct. Pivot `ContactPharmacy { contactId, pharmacyId, isPrimary }`. Un Contact peut être principal pour une Pharmacie et secondaire pour une autre.

**ADR 0002 — ContractType** : `CDI | CDD | REMPLACEMENT` uniquement. VACATION supprimé.

**ADR 0003 — CandidateStatus** : enum `DISPONIBLE | EN_MISSION | SOUS_PREAVIS | INACTIF` sur Candidate, géré manuellement. `availableFrom` conservé pour date future.

**ADR 0004 — MissionStatus** : `OUVERTE | EN_COURS | TERMINEE | ANNULEE`. Défaut `OUVERTE`. `EN_COURS` uniquement via action Placer.

### Schéma — champs clés

```
Candidate: status (CandidateStatus), referentId, mobilityRadiusKm, mobilityNotes, availableFrom, cvSummary, anonymizedProfile
Mission: referentId, candidateRate, clientRate, plannedHours, status (MissionStatus), pharmacyId, contactId?
MissionCandidate: { missionId, candidateId } PK, stageId → PipelineStage
ContactPharmacy: { contactId, pharmacyId } PK, isPrimary
PipelineStage: name, position (ordonné, partagé entre toutes Missions)
```

Marge agence : calculée `clientRate − candidateRate` dans view-model, jamais stockée.

### Pipeline & kanban

- Pas de kanban global sur `/candidats` (liste uniquement)
- Kanban Pipeline sur `/missions/[id]` : colonnes = PipelineStage, cartes = Candidats positionnés
- Kanban sur `/candidats/[id]` onglet Missions : colonnes = PipelineStage, cartes = Missions du Candidat
- Drag-and-drop met à jour `MissionCandidate.stageId`
- Un Candidat peut être sur N Missions à des étapes différentes

### Action Placer

Mutation orchestrée déclenchée manuellement :
1. `MissionCandidate.stageId` → étape « Placé »
2. `Candidate.status` → `EN_MISSION`
3. `Mission.status` → `EN_COURS`

### Extraction CV

```
Upload PDF → Vercel Blob → tRPC mutation → ExtractionProvider (gemini|mock)
→ Zod CvExtractionSchema → écran relecture obligatoire
→ alerte doublon si email existant → confirmation → création Candidate
```

Logiciels suggérés liés uniquement depuis catalogue admin.

### Enrichissement SIRET

API `recherche-entreprises.api.gouv.fr`, disponible à tout moment sur fiche Pharmacie. Confirmation champ par champ si données existantes. TVA : `(12 + 3 × (SIREN % 97)) % 97`.

### IA Documents

- cvSummary : prérequis pour Dossier anonymisé, éditable post-génération
- Dossier anonymisé : zéro PII, re-génération manuelle, envoi email Resend + export PDF

### Soft delete

`deletedAt` sur User, Candidate, Pharmacy, Contact, Mission. Irréversible UI. Cascade : Pharmacie supprimée → Missions associées soft-deleted. User référent supprimé → Candidats orphelins, réassignation admin manuelle.

### Recherche

Filtre local par liste, temps réel côté client. Pas de barre globale.

### Rôles

- RECRUTEUR : CRUD métier, visibilité globale
- ADMIN : + pipeline config, logiciels, utilisateurs. Plusieurs admins possibles.

## Testing Decisions

### Principe

Tester le **comportement externe** observable (ce que fait/voit le Recruteur), pas les détails d'implémentation. Privilégier les seams les plus hauts possibles.

### Seams prioritaires

| Seam | Quoi | Outil |
|------|------|-------|
| **View-models** | Marge calculée, mapping statuts, transforms DB→UI | Vitest unit |
| **Repositories** | CRUD, soft delete cascade, ContactPharmacy, placement orchestration, MissionCandidate stage updates | Vitest + Testcontainers (PostgreSQL) |
| **Services externes** | CvExtractionSchema validation, SIRET enrichment (mock API), Resend email (mock), ExtractionProvider mock | Vitest unit/integration |
| **tRPC routers** | Auth guards, Zod input validation, contrats mutation/query | Vitest integration |
| **Composants UI** | Atoms design system, formulaires RHF+Zod (validation messages) | Vitest + Testing Library |

### Prior art

Greenfield — pas de tests existants. Établir les conventions dès Epic 1 :
- Testcontainers pour repositories (pattern à définir comme référence projet)
- Mock provider pour EXTRACTION_PROVIDER=mock en CI
- Pas d'E2E Playwright en V1 sauf 1-2 flows critiques (login, placement) si temps disponible

### Cas de test métier critiques

1. Placement : vérifie stageId Placé + CandidateStatus EN_MISSION + MissionStatus EN_COURS
2. Soft delete Pharmacie : vérifie cascade Missions
3. ContactPharmacy : un Contact sur 2 Pharmacies avec isPrimary différent par Pharmacie
4. Extraction CV : Zod rejette réponse IA invalide ; doublon email déclenche alerte
5. Marge : view-model retourne clientRate − candidateRate, null si taux manquant
6. Mobilité : suggestion filtre Candidats dont rayon couvre Pharmacie
7. SIRET : lookup ne écrase pas sans confirmation champ par champ

## Out of Scope

- Facturation / Devis
- Dashboard analytics
- Planning / calendrier
- Kanban global sur `/candidats`
- Multi-tenant / multi-agence
- Champ consentement RGPD (réévaluation juridique requise avant prod)
- Purge physique automatisée des données
- Email de bienvenue à la création de compte
- E2E exhaustif
- Module mobile natif
- Intégration ATS externe
- ContractType VACATION (fusionné dans REMPLACEMENT)

## Further Notes

- **Documents de référence** : `SPEC_V1.md` (spec technique complète), `CONTEXT.md` (glossaire), `docs/adr/0001` à `0004`
- **RGPD** : base légale intérêt légitime retenue — relecture juridique obligatoire avant mise en production
- **Variables d'environnement requises** : DATABASE_URL, NEXTAUTH_SECRET, EXTRACTION_PROVIDER, GEMINI_API_KEY, BLOB_READ_WRITE_TOKEN, RESEND_API_KEY
- **Workflow agent** : chaque epic/issue suit `/caveman` → `/tdd`, branche `feat/issue-{N}-{slug}`, PR vers `dev`, handoff dans `docs/handoffs/`
- **Prochaine étape** : `/triage` → `/to-issues` pour découper ce PRD en issues GitHub par epic
