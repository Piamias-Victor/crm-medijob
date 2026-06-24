# Audit de cohérence transversal — CRM MediJob

> **Date** : 2026-06-20  
> **Branche analysée** : `dev` (commit local `67975d6`) — **14 commits derrière `origin/dev`** (`f6808cf`) ; `git pull` non appliqué (worktree local avec changements non commités)  
> **Périmètre** : `apps/web/src` (497 fichiers `.ts`/`.tsx`) + scripts CI racine  
> **Références lues** : `CLAUDE.md`, `CONTEXT.md`, `docs/PRD.md`, `docs/design-system-rules.md`  
> **Mode** : analyse uniquement — aucune correction appliquée  
> **Précédent** : `docs/audits/AUDIT_COHERENCE_2026-06-19.md`

---

## Méthodologie

| Vérification | Résultat |
|--------------|----------|
| `pnpm typecheck` | ✅ OK |
| `pnpm lint` | ✅ OK |
| `pnpm lint:lines` | ✅ OK — tous les fichiers < 100 lignes |
| `pnpm test` | ⚠️ 295 tests pass / 27 skipped / **8 suites intégration échouent** (Docker/testcontainers indisponible) |
| Merge markers `<<<<<<<` | ✅ Aucun |
| Scan `any` explicite | ✅ Aucun dans `apps/web/src` |
| `fetch('/api/...')` interne | ✅ Aucun — lectures RSC via `createServerCaller` |
| `prisma.` hors repositories/tests/seeds | ✅ Conforme |
| Imports circulaires (madge) | ⚠️ 2 cycles dans la couche IA |
| `loading.tsx` dashboard | ⚠️ 4 fichiers (détail `[id]` uniquement) |
| `window.alert` / `window.confirm` | ✅ Aucun |
| Couleurs Tailwind palette (`bg-gray-*`, hex inline) | ✅ Aucune dans les modules CRM |
| Exploration manuelle + agents | composants UI, hooks, view-models, routers tRPC, repositories, pages App Router |

---

## Résumé exécutif

Depuis l'audit du **2026-06-19**, les **blocages build/runtime Critical** (Combobox cassé, router ActivityLog dupliqué, merge conflicts, erreurs TS sur pharmacies) sont **résolus**. Le projet compile et passe ESLint.

Les incohérences restantes proviennent surtout du **développement parallèle par module** : les 4 entités CRM (Candidats, Pharmacies, Contacts, Missions) partagent des primitives (`EntityDetailShell`, `EntityActivityLogTab`, `EntityDocumentsTab`, `useEntityMutation`) mais **ne les adoptent pas uniformément**. Mission et Candidats restent les plus en retrait côté fiche détail ; Pharmacies/Contacts sont les plus avancés côté liste.

| Métrique | Valeur |
|----------|--------|
| Findings catalogués | **52** |
| Retirés (issues GitHub ouvertes planifiées) | **11** |
| **À traiter (remédiation cohérence)** | **41** |
| Build bloquant | **0** (vs 7 erreurs TS le 19/06) |

### Évolution vs audit 2026-06-19

| Zone | 19/06 | 20/06 |
|------|-------|-------|
| Build TS/lint | ❌ Cassé | ✅ Vert |
| Combobox runtime | ❌ Crash global | ✅ Corrigé |
| ActivityLog API | ❌ 3 shapes, router dupliqué | ✅ Unifié (`listByEntity` + `EntityActivityLogTab`) |
| DatePicker `clearLabel` | ❌ Non propagé | ✅ Propagé à `DatePickerPanel` |
| Onglets mission | Stub | Stub (**données déjà fetchées côté RSC**) |
| Soft delete UI | Absent | Absent (issue **#80** ouverte) |

---

## 1. Incohérences de build

### 1.1 Erreurs TypeScript / build actuels

**Aucune erreur** — `tsc --noEmit` et ESLint passent.

### 1.2 Imports circulaires

| Sévérité | Cycle | Fichiers | Effort |
|----------|-------|----------|--------|
| Low | Provider IA ↔ mock | `server/ai/provider.ts` ↔ `mock-provider.ts` | S |
| Low | Provider IA ↔ OpenRouter | `server/ai/provider.ts` ↔ `openrouter-provider.ts` | S |

Les implémentations importent le type `AssistantProvider` depuis `provider.ts`, qui importe les implémentations pour la factory. Risque bundler faible ; correction : extraire les types vers `provider.types.ts`.

### 1.3 Couche repository → view-model (violation d'architecture)

| Sévérité | Fichier | Problème | Effort |
|----------|---------|----------|--------|
| Medium | `server/db/repositories/candidate-profile.repository.ts` | Importe `@/view-models/candidate-profile-update` | M |
| Medium | `server/db/repositories/user.repository.ts` | Importe `@/view-models/user-admin` | S |

Contre la règle CLAUDE.md : view-models = pont DB → UI uniquement.

### 1.4 Tests CI

| Sévérité | Problème | Fichiers | Effort |
|----------|----------|----------|--------|
| Medium | 8 suites intégration échouent sans Docker | `*.repository.integration.test.ts` (candidate, contact, mission, pharmacy, application, job-offer, mission-candidate, user) | M |

295 tests unitaires passent ; l'échec est environnemental, pas régression fonctionnelle détectée.

### 1.5 Dépendances

Monorepo à 2 `package.json` (racine scripts + `apps/web`). **Aucun conflit de version** détecté dans `pnpm-lock.yaml` (React 19.2.7, Next 15.5.19, tRPC 11.18.0, Prisma 6.19.3, Zod 4.4.3 alignés).

---

## 2. Répétitions (DRY)

### 2.1 List organisms — quasi copy-paste

Quatre fichiers identiques structurellement (`EmptyState` + `AnimatedEntityGrid` + card) :

| Fichier | Spécificité |
|---------|-------------|
| `components/organisms/CvthequeList.tsx` | `toListItems()` kanban |
| `components/organisms/PharmacyList.tsx` | — |
| `components/organisms/ContactList.tsx` | — |
| `components/organisms/MissionList.tsx` | `toMissionListItems()` |

**Cible** : `EntityGridList` générique avec prop `renderCard` / `mapItems`. **Effort : M**

### 2.2 List cards — composition répétée

`PharmacyListCard.tsx`, `ContactListCard.tsx`, `MissionListCard.tsx`, `CvthequeListCard.tsx` — tous sur `ListCardShell` / `ListCardHeader` / `ListCardMeta`.

Pattern répété : ``const subtitle = [jobTitle, city].filter(Boolean).join(' · ')`` dans Mission/Cvtheque/Kanban cards.

**Effort : M**

### 2.3 Pages liste — deux patterns de shell

| Pattern | Entités | Fichiers |
|---------|---------|----------|
| `EntityListPageShell` | Pharmacies, Contacts | `PharmaciesPage.tsx`, `ContactsPage.tsx` |
| `DashboardPage` + `SectionCard` manuel | Candidats, Missions | `CandidatsPage.tsx`, `MissionsPage.tsx`, `CvthequeSection.tsx` |

`PharmaciesPage.tsx` et `ContactsPage.tsx` sont quasi identiques (état modal, `useEntityMutation`, `router.refresh`). **Effort : M**

### 2.4 Toggle liste/kanban dupliqué

`CvthequeSection.tsx` et `MissionsPage.tsx` : même pattern `ViewToggle` + `AnimatePresence` + `tabPanelMotion`. **Effort : S**

### 2.5 Kanban — triple implémentation

| Couche | Fichiers |
|--------|----------|
| Colonnes | `KanbanColumn.tsx`, `MissionKanbanColumn.tsx`, `CandidateMissionKanbanColumn.tsx` |
| Conteneurs + optimistic update | `CvthequeKanban.tsx`, `MissionKanban.tsx`, `CandidateMissionsKanban.tsx` |

Logique optimistic identique : snapshot → `setState` → mutate → rollback `onError` + toast via second `useEntityMutation()`. **Effort : M**

### 2.6 Detail tab panels — architecture divergente

| Entité | Pattern | Fichiers |
|--------|---------|----------|
| Pharmacy | 2 couches : `PharmacyDetailTabPanel` → `PharmacyDetailTabContent` | |
| Contact | `ContactDetailTabPanel` (monolithique) | |
| Mission | `MissionDetailTabPanel` (stubs sauf infos) | |
| Candidate | **Inline** dans `CandidateDetailPage.tsx` — pas de `CandidateDetailTabPanel` | |

Quatre paires `*-tabs.ts` + `*-tab-meta.ts` dupliquent la même structure. **Effort : L**

### 2.7 Routes RSC `[id]/page.tsx` — même boilerplate × 4

`candidats/[id]/page.tsx`, `pharmacies/[id]/page.tsx`, `contacts/[id]/page.tsx`, `missions/[id]/page.tsx` : `createServerCaller` → `Promise.all` → `notFound()` → props.

**Incohérence** : Mission ne passe que `activityCount` / `documentCount` au client ; les autres passent les tableaux complets. **Effort : S**

### 2.8 Listes liées — markup dupliqué

| Composant | Comportement |
|-----------|--------------|
| `PharmacyContactsList.tsx` | Lignes cliquables → fiche contact |
| `ContactMissionsTab.tsx` | Lignes cliquables → fiche mission |
| `PharmacyBesoinsTab.tsx` | Lignes **statiques** (pas de navigation) |

**Effort : S**

### 2.9 Hooks mutations — centralisation inégale

| Hook dédié | Entité |
|------------|--------|
| `use-pharmacy-detail-mutations.ts` | Pharmacy |
| `use-candidate-profile-mutations.ts` | Candidate |
| Inline dans page | Contact, Mission, list pages |

`createJobTitle` wrapper dupliqué dans `MissionQuickCreateForm.tsx`, `MissionInfoForm.tsx`, plus wiring dans 3 detail pages. **Effort : M**

### 2.10 Repositories — requêtes similaires non factorisées

| Pattern | Fichiers |
|---------|----------|
| `list()` + `NOT_DELETED` + `take: DEFAULT_LIST_LIMIT` | `candidate`, `pharmacy`, `contact`, `mission` repositories |
| `search(term, limit=8)` | candidate (nom), pharmacy (nom), mission (titre) — **contact sans search** |
| `findForContext(id)` | 4 repos, selects différents, pas d'abstraction |
| `softDelete` | Identique × 4 repos |
| Double chargement pharmacies `{ id, name }` | `contact.ts` router + `mission-referentials.adapter.ts` |

**Effort : M**

### 2.11 View-models — duplication transversale

| Pattern | Occurrences |
|---------|-------------|
| `type Ref = { id: string; name: string }` | Redéclaré dans 20+ fichiers ; `RefItem` existe dans `view-models/referential.ts` |
| `` `${firstName} ${lastName}` `` | ~10 endroits |
| `toNull()` | Dupliqué dans `pharmacy-update.ts` et `mission-update.ts` |
| Format date FR | `contact-list.ts` (module) vs local dans `MissionListCard.tsx`, `PharmacyBesoinsTab.tsx` |
| Rows mission affichage | `PharmacyMissionRow`, `ContactMissionRow`, `MissionListItem`, `CandidateMissionRow` — champs légèrement différents |
| Kanban builders | 3 systèmes parallèles : `candidate-kanban.ts`, `mission-kanban.ts`, `candidate-missions.ts` |

**Effort : L**

### 2.12 Mapping router ↔ UI incohérent

| Entité | Mapping liste |
|--------|---------------|
| Pharmacy, Contact | View-model row **dans le router** (`toPharmacyListRow`, `toContactListRow`) |
| Mission, Candidate | Shape repository brut ; mapping **dans composants/view-models** |

**Effort : M**

### 2.13 ActivityLog — résidu de duplication

Unification réussie via `EntityActivityLogTab` + `activityLog.listByEntity`, mais **deux schémas Zod** coexistent :

- `view-models/activity-log.schema.ts` — API tRPC (`entityType` + `entityId`)
- `view-models/activity-log-form.schema.ts` — formulaire (`type`, `content`, `date`)

Alignés fonctionnellement ; pourraient fusionner les constantes `ACTIVITY_TYPES`. **Effort : S**

### 2.14 Skeletons morts

22 fichiers dans `components/molecules/skeletons/` — **aucun import** dans l'app (grep vide). Seul `EntityDetailSkeleton.tsx` est câblé dans les 4 `loading.tsx` détail. **Effort : S** (câbler ou supprimer)

---

## 3. Incohérences de scalabilité

### 3.1 Pagination — absente partout

Constante `DEFAULT_LIST_LIMIT = 500` (`lib/list-limits.ts`). Aucun `skip`, `cursor`, ni UI « charger plus ».

| Sévérité | Endpoint / méthode | Exposé UI ? | Effort |
|----------|---------------------|-------------|--------|
| Medium | `candidate.list` / `cvtheque` | Oui — `/candidats` | L |
| Medium | `pharmacy.list` (500 + contacts nested) | Oui — `/pharmacies` | L |
| Medium | `contact.list` | Oui — `/contacts` | L |
| Medium | `mission.list` | Oui — `/missions` | L |
| **High** | `contact.listByPharmacy(pharmacyId)` — **sans `take`** | Oui — `MissionInfoForm.tsx` | S |
| Medium | `pharmacy.findDetailById()` — contacts/missions nested sans limite | Fiche pharmacie | M |
| Low | Admin referentials (`software`, `groupement`, `jobTitle`, `pipelineStage`, `user.list`) | Admin — commentaire accepte unbounded | S |

### 3.2 Requêtes lourdes (pas N+1, mais payload)

| Sévérité | Requête | Risque | Effort |
|----------|---------|--------|--------|
| Medium | `pharmacy.list()` — 500 rows × `listInclude` (contacts + `_count.missions`) | Réponse JSON volumineuse | M |
| Medium | `candidate.listForKanban()` — 500 × missions nested + stage | Idem | M |
| Low | `mission.repository.terminalTransition` — boucle `await tx.missionCandidate.update` | O(n) écritures à la clôture mission | S |

Aucun N+1 classique (list → loop query) détecté dans les repositories.

### 3.3 Patterns pagination/filtre/recherche — comparaison 4 entités

| Capability | Candidats | Pharmacies | Contacts | Missions |
|------------|-----------|------------|----------|----------|
| Pagination serveur | ❌ (500) | ❌ | ❌ | ❌ |
| Recherche liste UI | ❌ | ❌ | ❌ | ❌ |
| Filtres liste UI | ❌ | ❌ | ❌ | ❌ |
| Tri serveur | `createdAt desc` | `name asc` | `createdAt desc` | `createdAt desc` |
| Vues multiples | Liste + Kanban | Grille | Grille | Liste + Kanban |
| Recherche hors-liste | Assistant IA | SIRET API | ❌ | Assistant IA |

`EntitySearch.tsx` existe mais n'est utilisé que par l'Assistant (`ContextPicker.tsx`).

---

## 4. Incohérences de design

Référence : `docs/design-system-rules.md` (Admin = modèle cible).

### 4.1 Layout & PageHeader

| Sévérité | Écart | Fichiers | Effort |
|----------|-------|----------|--------|
| Medium | Candidats/Missions n'utilisent pas `EntityListPageShell` | `CandidatsPage.tsx`, `MissionsPage.tsx` | S |
| Medium | Onglets page : pills dans header (Candidats) vs toggle dans SectionCard (Missions) vs CTA modal (Pharma/Contact) | Multiples | M |
| Low | Badge statut : `EntityDetailShell.meta` (Pharma/Mission) vs chips header (Contact) vs absent (Candidate) | Detail pages | S |
| Low | `pageEntrance` Framer Motion — partiellement appliqué ; pas uniforme sur les 4 modules | | M |

### 4.2 Tokens CSS

Pas de palette Tailwind brute (`bg-gray-*`, hex) dans les modules CRM ✅.

| Sévérité | Écart | Fichiers (exemples) | Effort |
|----------|-------|---------------------|--------|
| Medium | `bg-white/*` au lieu de token surface (~55 fichiers) | `Combobox.tsx`, `Input.tsx`, `ContactMissionsTab.tsx`, `PharmacyBesoinsTab.tsx`, `MissionStatusActions.tsx` | M |
| Low | `via-white` / `to-white` dans gradients header | `PageHeader.tsx`, `DetailPageHeader.tsx` | S |
| Low | Ombres avec `rgb()` literals | `lib/constants/surface-glass.ts`, `lib/motion/variants.ts` | S |

### 4.3 EmptyState & loading

| Sévérité | Écart | Fichiers | Effort |
|----------|-------|----------|--------|
| Medium | Listes sans `loading.tsx` | `/candidats`, `/pharmacies`, `/contacts`, `/missions` | M |
| Medium | 20 skeletons spécialisés jamais importés | `components/molecules/skeletons/*` | S |
| Low | `EntityDocumentsList` — paragraphe brut au lieu de `EmptyState` | `EntityDocumentsList.tsx` | S |
| **High** | Mission onglets stub « Bientôt disponible » **avec badges counts** | `MissionDetailTabPanel.tsx`, `MissionDetailTabs.tsx`, `missions/[id]/page.tsx` | M |

### 4.4 Composants design system existants non réutilisés

| Composant | Utilisé | Manque |
|-----------|---------|--------|
| `EntityListPageShell` | Pharma, Contact | Candidats, Missions |
| `EntitySearch` | Assistant | Filtres listes CRM |
| `ConfirmDialog` | Documents, Admin | Mission cancel, soft delete |
| `EntityDocumentsTab` | Contact, Pharmacy | Candidate (pas d'onglet), Mission (stub) |
| `EntityActivityLogTab` | Candidate, Contact, Pharmacy | Mission (stub malgré fetch RSC) |
| `PagePlaceholder` | `/offres` | Mission stubs utilisent `EmptyState` + `Construction` |
| Atoms `Toast`, `Skeleton`, `Alert` | Créés | Adoption partielle |

### 4.5 Matrice parité visuelle fiche détail

| Feature | Candidate | Contact | Pharmacy | Mission |
|---------|-----------|---------|----------|---------|
| Historique fonctionnel | ✅ | ✅ | ✅ | ❌ stub |
| Documents | ❌ absent | ✅ | ✅ | ❌ stub (prefetch) |
| Tab panel extrait | ❌ inline | ✅ | ✅ (2 fichiers) | ✅ |
| Status badge zone | — | chips | meta | meta |
| Loading skeleton | ✅ | ✅ | ✅ | ✅ |

---

## 5. Incohérences fonctionnelles

### 5.1 Soft delete

| Entité | Repo | tRPC | UI |
|--------|------|------|-----|
| Pharmacy | ✅ | `pharmacy.softDelete` | ❌ |
| Contact | ✅ | `contact.softDelete` | ❌ |
| Candidate | ✅ | ❌ non exposé | ❌ |
| Mission | ✅ | ❌ ; `markAnnulee` / transitions status | Cancel 1-clic sans confirm |

Issue **#80** couvre l'UI soft delete — **retiré de la dette immédiate** mais l'écart backend/UI reste un finding fonctionnel.

### 5.2 Création / édition

| Sévérité | Écart | Fichiers | Effort |
|----------|-------|----------|--------|
| Medium | Mission : pas de création depuis liste ; quick-create pharmacie uniquement | `PharmacyBesoinsTab.tsx`, `MissionQuickCreateForm.tsx` | — (ADR métier) |
| Medium | Candidat : pas de création depuis liste | `CandidatsPage.tsx` | — (PRD : CV upload) |
| Medium | Contact créable depuis 2 chemins (liste + onglet pharmacie) | `ContactsPage.tsx`, `PharmacyContactsTab.tsx` | S |
| Medium | Missions liées : navigation Contact ✅ vs statique Pharmacy | `ContactMissionsTab.tsx`, `PharmacyBesoinsTab.tsx` | S |
| Low | `createJobTitle` : succès silencieux (pas de toast) | `PharmaciesPage.tsx`, `MissionDetailPage.tsx`, hooks candidat | S |

### 5.3 Application inbox

| Sévérité | Écart | Fichiers | Effort |
|----------|-------|----------|--------|
| **High** | Inbox **lecture seule** — `application.refuse` existe, **aucun usage client** | `ApplicationInbox.tsx`, `ApplicationInboxCard.tsx`, `application.ts` router | — (**#72**) |

Retiré de la remédiation cohérence (issue **#72** ouverte) mais documenté comme écart PRD/UI.

### 5.4 Recherche & filtres

Aucune recherche/filtre sur les 4 listes. Filtre ActivityLog par type : cohérent via `EntityActivityLogTab` + `CheckboxGroup` (serveur refetch).

### 5.5 Gestion d'erreurs mutations

`useEntityMutation` centralise toast erreur ✅ — adopté par la majorité des flows.

| Sévérité | Écart | Fichiers | Effort |
|----------|-------|----------|--------|
| Low | Kanban : pattern split (hook `onSettled` + `onError` inline rollback) | `MissionKanban.tsx`, `CvthequeKanban.tsx`, `CandidateMissionsKanban.tsx` | S |
| Medium | `MissionStatusActions` : pas de `ConfirmDialog` avant annulation | `MissionStatusActions.tsx` | S |

### 5.6 Conventions nommage tRPC

| Sévérité | Écart | Fichiers | Effort |
|----------|-------|----------|--------|
| Medium | `candidate.list` ≡ `candidate.cvtheque` (doublon) | `candidate.ts` router | S |
| Medium | Référentiels : `contact.pharmacyOptions` vs `*.referentials` ailleurs | `contact.ts`, `pharmacy.ts`, `mission.ts` | S |
| Medium | `mission.create` = quick-create scoped ; ≠ `pharmacy.create` / `contact.create` | `mission.ts` | S |
| Low | `missionCandidate.updateStage` router séparé vs status sur `mission` | `mission-candidate.ts` | — (ADR pipeline) |
| Low | Admin CRUD sur router domaine : `pharmacy.createGroupement`, `createSoftware` | `pharmacy.ts` | S |

### 5.7 Modules adjacents — écarts PRD (planifiés)

| Module | État | Issue |
|--------|------|-------|
| `/offres` | `PagePlaceholder` | **#69**, **#70**, **#68** |
| Matching IA | Absent | **#74**, **#75** |
| Webhook Webflow | Absent | **#71** |
| Recherche globale | Absente | **#79** |
| Documents candidat | Pas d'onglet | PRD #22 — pas d'issue ouverte dédiée |
| Documents contact | ✅ via `EntityDocumentsTab` | — |

---

## 6. Synthèse priorisée

Effort : **S** < 1 j · **M** 1–3 j · **L** > 3 j

### Critical

| ID | Finding | Fichiers | Effort |
|----|---------|----------|--------|
| C1 | Onglets mission (pipeline, matching, offre, historique, documents) affichent stub « Bientôt disponible » alors que RSC prefetch `activities` + `documents` et tabs montrent des **badges count** — UX trompeuse | `missions/[id]/page.tsx`, `MissionDetailPage.tsx`, `MissionDetailTabPanel.tsx`, `MissionDetailTabs.tsx` | M |

### High

| ID | Finding | Fichiers | Effort |
|----|---------|----------|--------|
| H1 | `contact.listByPharmacy` sans limite `take` — risque unbounded sur pharmacies nombreuses | `contact.repository.ts`, `MissionInfoForm.tsx` | S |
| H2 | Aucune pagination (cap 500 fixe) sur les 4 listes CRM — scalabilité et perf dégradées à volume | `list-limits.ts`, 4 repositories, 4 pages liste | L |
| H3 | `pharmacy.list()` — 500 pharmacies avec contacts nested : payloads JSON lourds | `pharmacy.repository.ts`, `PharmaciesPage.tsx` | M |
| H4 | Soft delete exposé tRPC (pharma/contact) sans UI ; candidate/mission sans procédure — comportement incohérent | Routers + detail pages | M — **#80** planifié |
| H5 | Application inbox sans actions (refuse/accept) malgré router partiel | `ApplicationInbox*.tsx`, `application.ts` | — **#72** |
| H6 | 4 list organisms + 4 list cards — duplication structurelle | `*List.tsx`, `*ListCard.tsx` | M |
| H7 | Kanban optimistic-update logic × 3 | `CvthequeKanban.tsx`, `MissionKanban.tsx`, `CandidateMissionsKanban.tsx` | M |

### Medium

| ID | Finding | Fichiers | Effort |
|----|---------|----------|--------|
| M1 | Shell liste : `EntityListPageShell` vs `DashboardPage` manuel | `PharmaciesPage`, `ContactsPage`, `CandidatsPage`, `MissionsPage` | S |
| M2 | Detail tabs : Candidate inline ; Pharmacy 2 fichiers ; Mission stubs | Detail pages + tab panels | M |
| M3 | Mapping router : pharmacy/contact mappent en VM ; mission/candidate non | Routers + view-models | M |
| M4 | Listes liées missions : navigation Contact vs statique Pharmacy | `ContactMissionsTab.tsx`, `PharmacyBesoinsTab.tsx` | S |
| M5 | Pas de `loading.tsx` sur 4 routes liste | `app/(dashboard)/*/page.tsx` | M |
| M6 | 20 skeletons spécialisés jamais importés | `components/molecules/skeletons/*` | S |
| M7 | `bg-white/*` (~55 fichiers) vs tokens surface | Composants multiples | M |
| M8 | Repository importe view-models (couche inversée) | `candidate-profile.repository.ts`, `user.repository.ts` | M |
| M9 | Mission kanban : empty check sur `missions.length` pas missions actives — colonnes vides si tout terminal | `MissionKanban.tsx` | S |
| M10 | `EntityDocumentsList` empty = `<p>` pas `EmptyState` | `EntityDocumentsList.tsx` | S |
| M11 | Hooks mutations : pas de `use-contact-detail-mutations` / `use-mission-detail-mutations` | Detail pages | S |
| M12 | `candidate.list` / `cvtheque` doublon router | `candidate.ts` | S |
| M13 | Nommage référentiels tRPC incohérent (`pharmacyOptions` vs `referentials`) | `contact.ts`, autres routers | S |
| M14 | `createJobTitle` dupliqué + succès silencieux | Forms + detail pages | S |
| M15 | View-models : `Ref` type, `fullName`, `toNull`, date format — duplication | `view-models/*`, composants | M |
| M16 | Tests intégration bloqués sans Docker en CI locale | `*.integration.test.ts` | M |

### Low

| ID | Finding | Fichiers | Effort |
|----|---------|----------|--------|
| L1 | 2 imports circulaires couche IA | `provider.ts`, `mock-provider.ts`, `openrouter-provider.ts` | S |
| L2 | Gradients `via-white` / `to-white` | `PageHeader.tsx`, `DetailPageHeader.tsx` | S |
| L3 | Ombres rgb/oklch literals dans constants/motion | `surface-glass.ts`, `motion/variants.ts` | S |
| L4 | `contact.repository.search` absent (autres entités l'ont pour assistant) | `contact.repository.ts` | S |
| L5 | Dead repo methods unbounded : `application.list()`, `jobOffer.list()` | repositories | S |
| L6 | Double fetch pharmacies picker | `contact.ts`, `mission-referentials.adapter.ts` | S |
| L7 | `MissionStatusActions` sans confirmation destructive | `MissionStatusActions.tsx` | S |
| L8 | Kanban colonnes × 3 implémentations parallèles | `KanbanColumn*.tsx` | M |
| L9 | ActivityLog : 2 fichiers schema Zod (form vs API) | `activity-log*.schema.ts` | S |
| L10 | Badge statut header placement incohérent entre entités | Detail pages | S |

---

## 7. Findings retirés — backlog GitHub planifié

Ne pas traiter comme dette de cohérence immédiate ; déjà couverts par issues ouvertes :

| ID audit | Finding | Issue |
|----------|---------|-------|
| H4 (UI) | Soft delete UI transverse | **#80** |
| H5 | Application inbox complète | **#72** |
| — | Module `/offres` | **#69**, **#70**, **#68** |
| — | Webhook Webflow | **#71** |
| — | Matching IA + contact | **#74**, **#75** |
| — | Recherche globale | **#79** |
| C1 (partiel) | Pipeline/matching/offre mission | Issues fermées ou lot Missions — stubs intentionnels en attendant merge |

---

## 8. Ordre de remédiation recommandé

1. **C1** — Brancher `EntityActivityLogTab` + `EntityDocumentsTab` sur mission detail (données déjà en RSC) ; retirer stubs.
2. **H1, H3** — Limiter `listByPharmacy` ; alléger `pharmacy.list` include.
3. **H6, H7, M1** — Factoriser list organisms + kanban hook + unifier shells liste.
4. **M2, M3, M15** — Aligner tab panels + router mapping + utilitaires view-model.
5. **M5, M6** — `loading.tsx` listes + câbler ou supprimer skeletons morts.
6. **M7** — Migration `bg-white/*` → tokens surface.
7. **H2** — Pagination (issue transverse ou #105 si existante).

---

*Audit généré le 2026-06-20 — analyse uniquement, aucun fichier source modifié.*
