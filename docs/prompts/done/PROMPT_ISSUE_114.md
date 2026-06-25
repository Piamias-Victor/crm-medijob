# Prompt — Issue #114

**Titre** : [FIX] Audit cohérence 2026-06-20 — remédiation complète (TDD)  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/114 *(à créer si absente)*  
**Parent** : #19 (PRD)  
**Blocked by** : — · **Ne pas chevaucher** : #72, #80, #69–#71, #74–#75, #79 (backlog features)

**Source audit** : `docs/audits/AUDIT_COHERENCE_2026-06-20.md` — **41 findings** à traiter (52 catalogués − 11 backlog planifié)

---

## Skills

```
/caveman
/tdd
```

**Lecture ciblée uniquement** :

1. Ce prompt + `docs/audits/AUDIT_COHERENCE_2026-06-20.md`
2. `docs/design-system-rules.md` (sections layout, tokens, skeletons)
3. `CONTEXT.md` (vocabulaire Candidate, Mission, Pharmacy, Contact)
4. Handoffs récents si présents : `HANDOFF_ISSUE_112.md`, `HANDOFF_ISSUE_107.md`

**TDD — règles impératives** :

- **Vertical slices** : 1 test qui décrit un comportement observable → impl minimal → GREEN → refactor. **Jamais** écrire tous les tests puis tout le code.
- Tester **interfaces publiques** : routers tRPC + repositories + view-models + composants via tests RTL sur comportement utilisateur. Pas de tests couplés à l'implémentation interne.
- Priorité tests : repositories (limites, mapping), routers (contrats tRPC), view-models (builders kanban/list), hooks partagés, composants extraits.
- Après chaque slice : `pnpm test -- <fichier>` puis `pnpm typecheck && pnpm lint && pnpm lint:lines`.

**Avant d'implémenter** : sur `origin/dev` à jour, **re-vérifier** chaque finding (issues #104–#112 peuvent avoir déjà clos une partie). Ne pas re-faire ce qui est déjà vert.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Lire handoffs #112 / #107 si existants
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-114 -b fix/issue-114-audit-coherence-2026-06-20 origin/dev
cd ../crm-medijob-issue-114
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm install
```

4. Baseline :

```bash
pnpm typecheck && pnpm lint && pnpm lint:lines && pnpm test
```

Noter les échecs préexistants (intégration Docker) — ne pas les confondre avec régressions.

---

## Périmètre global

Remédier **tous les findings §6 de l'audit 2026-06-20** sauf ceux explicitement **HORS SCOPE** (déjà planifiés ailleurs).

### Hors scope — ne pas implémenter ici

| ID audit | Sujet | Issue GitHub |
|----------|-------|--------------|
| H4 (UI soft delete) | Boutons supprimer entités | **#80** |
| H5 | Inbox accept/refuse/merge | **#72** |
| — | Module `/offres`, Webflow | **#69**, **#70**, **#68** |
| — | Webhook Webflow | **#71** |
| — | Matching IA | **#74**, **#75** |
| — | Recherche globale | **#79** |
| C1 (partiel) | Onglets mission pipeline / matching / offre | Stubs **intentionnels** jusqu'aux issues mission — **sauf** historique + documents (voir Phase A) |
| H2 | Pagination cursor/offset complète | Slice minimal en Phase B (limites + allègement) ; UI « charger plus » = follow-up séparé si trop large |

### Critères d'acceptation globaux

- [ ] `pnpm typecheck` — 0 erreur
- [ ] `pnpm lint` — 0 erreur
- [ ] `pnpm lint:lines` — tous fichiers < 100 lignes
- [ ] `pnpm test` — au moins autant de tests verts qu'en baseline ; **nouveaux** tests pour chaque slice
- [ ] Parité fonctionnelle Candidats / Pharmacies / Contacts / Missions sur patterns partagés (listes, fiches, historique, documents où applicable)
- [ ] Aucun `prisma.` hors repositories (sauf seeds/tests)
- [ ] Aucun `fetch('/api/...')` interne vers nos routes
- [ ] Tokens design system — plus de `bg-white/*` dans les fichiers touchés du diff

---

## Plan TDD — 4 phases (ordre strict)

Exécuter **Phase A → B → C → D**. Une phase = plusieurs vertical slices. Commit logique par slice recommandé ; **une PR** `Closes #114` en fin de session (ou 4 PRs `#114a`–`#114d` si l'utilisateur préfère decouper).

---

### Phase A — Critical + quick wins (C1, H1, M9, M10, L7)

#### Slice A1 — Mission fiche : historique + documents (C1)

**Finding** : RSC prefetch `activities` + `documents` mais onglets stub avec badges count.

**RED** :

- Test router/view-model : `missions/[id]/page` passe tableaux complets (pas seulement counts) — test composant `MissionDetailTabPanel` rend `EntityActivityLogTab` + `EntityDocumentsTab` quand tab = historique / documents.

**GREEN** :

- `app/(dashboard)/missions/[id]/page.tsx` — passer `activities`, `documents` à `MissionDetailPage`
- `MissionDetailPage.tsx` — props enrichies
- `MissionDetailTabPanel.tsx` — brancher :
  - `historique` → `EntityActivityLogTab` scope `{ entityType: 'MISSION', entityId }`
  - `documents` → `EntityDocumentsTab` entityType `MISSION`
- Garder stubs **pipeline / matching / offre** avec `EmptyState` + `Construction` (backlog)

**Fichiers** :

- `app/(dashboard)/missions/[id]/page.tsx`
- `components/organisms/MissionDetailPage.tsx`
- `components/molecules/MissionDetailTabPanel.tsx`

#### Slice A2 — Limite `listByPharmacy` (H1)

**RED** : test intégration ou unitaire repository — `listByPharmacy` respecte `DEFAULT_LIST_LIMIT` (ou constante dédiée `PICKER_LIST_LIMIT`).

**GREEN** :

- `contact.repository.ts` — ajouter `take` sur `listByPharmacy`
- Test dans `contact.repository.integration.test.ts` ou test unitaire mock prisma

#### Slice A3 — Empty states & confirm (M10, L7)

**RED** :

- `EntityDocumentsList` — test RTL : liste vide → `EmptyState` (pas `<p>`)
- `MissionStatusActions` — test : clic annuler → `ConfirmDialog` avant mutation

**GREEN** :

- `EntityDocumentsList.tsx`
- `MissionStatusActions.tsx`

#### Slice A4 — Mission kanban empty actif (M9)

**RED** : test view-model ou composant — si toutes missions terminal, afficher `EmptyState` (comme `CandidateMissionsKanban`).

**GREEN** : `MissionKanban.tsx` — filtrer missions actives avant rendu colonnes ; empty state explicite.

**Tests manuels Phase A** :

- [ ] `/missions/{id}` → onglet Historique : timeline + création entrée (comme pharmacie)
- [ ] `/missions/{id}` → onglet Documents : upload / liste / delete
- [ ] Badges count historique/documents cohérents avec contenu
- [ ] Mission fiche → Annuler → dialog confirmation
- [ ] `/missions` kanban : si toutes POURVU/ANNULEE → empty state clair

---

### Phase B — High scalabilité + DRY listes (H3, H6, H7, M1, M4, M12, M13, L6)

#### Slice B1 — Alléger `pharmacy.list` (H3)

**RED** : test repository — `list()` n'inclut pas contacts nested (ou include minimal : primary contact only / `_count`).

**GREEN** :

- `pharmacy.repository.ts` — réduire `listInclude` pour la liste portefeuille
- Adapter `toPharmacyListRow` / `PharmacyListCard` si champs manquants (fetch primary contact via select ciblé)

#### Slice B2 — Hook kanban optimistic (H7)

**RED** : test hook `useKanbanOptimisticMutation` — rollback state on error + toast.

**GREEN** :

- Créer `lib/hooks/use-kanban-optimistic-mutation.ts` (< 100 lignes)
- Refactor : `CvthequeKanban.tsx`, `MissionKanban.tsx`, `CandidateMissionsKanban.tsx`

#### Slice B3 — `EntityGridList` (H6)

**RED** : test composant générique — empty state + grid + render prop.

**GREEN** :

- Créer `components/organisms/EntityGridList.tsx`
- Migrer `PharmacyList`, `ContactList`, `MissionList`, `CvthequeList` (supprimer ou déléguer)
- Extraire helper `formatSubtitle(parts: (string|undefined)[])` dans `lib/format-subtitle.ts` ou view-model

#### Slice B4 — Shells liste unifiés (M1)

**RED** : snapshot/test structure — `CandidatsPage` / `MissionsPage` utilisent patterns alignés (au minimum `EntityListPageShell` ou molecule `ListViewShell` pour toggle kanban).

**GREEN** :

- Extraire `ListKanbanShell` (ViewToggle + AnimatePresence + SectionCard) depuis duplication `CvthequeSection` / `MissionsPage`
- Migrer `CandidatsPage`, `MissionsPage` ; garder pills Candidats dans header si métier

#### Slice B5 — Navigation missions pharmacie (M4)

**RED** : test RTL `PharmacyBesoinsTab` — clic ligne → navigation `/missions/[id]`.

**GREEN** : `PharmacyBesoinsTab.tsx` — réutiliser pattern row de `ContactMissionsTab` (extraire `EntityLinkedMissionRow` molecule)

#### Slice B6 — tRPC naming (M12, M13)

**RED** : tests router — `candidate.list` existe ; `cvtheque` alias deprecated ou supprimé avec migration callers.

**GREEN** :

- `candidate.ts` — documenter / deprecate `cvtheque` ; migrer pages vers `list`
- `contact.ts` — renommer `pharmacyOptions` → `referentials` **ou** ajouter alias + deprecate (choisir une convention, tests de non-régression)

#### Slice B7 — Deduplicate pharmacy picker (L6)

**GREEN** : read-model partagé `listPharmacyPickerOptions()` consommé par `contact.ts` et `mission-referentials.adapter.ts`.

**Tests manuels Phase B** :

- [ ] `/pharmacies` — liste charge vite ; colonnes primary contact / missions count OK
- [ ] `/candidats` + `/missions` — toggle liste/kanban identique UX
- [ ] Drag kanban candidats + missions — rollback visuel si erreur simulée
- [ ] Pharmacie fiche → Besoins → clic mission → fiche mission

---

### Phase C — Medium architecture & design (M2, M3, M5, M6, M7, M8, M11, M14, M15, M16, M8 repo)

#### Slice C1 — Tab panels unifiés (M2)

**RED** : tests structure — `CandidateDetailTabPanel` existe ; contenu identique à avant refactor.

**GREEN** :

- Créer `CandidateDetailTabPanel.tsx` — extraire inline de `CandidateDetailPage.tsx`
- Aligner `MissionDetailTabPanel` signature props avec Contact/Pharmacy (passer data, pas counts seuls pour tabs wired)

#### Slice C2 — View-model utilities (M15)

**GREEN** (tests unitaires purs) :

- `view-models/person-name.ts` — `formatPersonName(first, last)`
- `view-models/format-date-fr.ts` — remplace locals dans cards/tabs
- `view-models/to-null.ts` — fusionner doublons pharmacy/mission update
- Remplacer `type Ref = ...` par import `RefItem` depuis `view-models/referential.ts`

#### Slice C3 — Router mapping cohérent (M3)

**RED** : tests routers — `mission.list` et `candidate.list` retournent rows view-model typées (comme pharmacy/contact).

**GREEN** :

- `mission.ts`, `candidate.ts` — mapper via `toMissionListRow`, `toCandidateListRow` (view-models)
- Ajuster composants pour ne plus mapper côté client

#### Slice C4 — Hooks mutations (M11, M14)

**GREEN** :

- `use-contact-detail-mutations.ts`, `use-mission-detail-mutations.ts`
- Extraire `useCreateJobTitleMutation(successMessage?)` — toast « Métier ajouté »
- Refactor `ContactDetailPage`, `MissionDetailPage`, forms mission

#### Slice C5 — Loading listes + skeletons (M5, M6)

**RED** : smoke — routes existent.

**GREEN** :

- `app/(dashboard)/candidats/loading.tsx` → `CandidatsPageSkeleton`
- `app/(dashboard)/pharmacies/loading.tsx` → `EntityListPageSkeleton`
- `app/(dashboard)/contacts/loading.tsx` → idem
- `app/(dashboard)/missions/loading.tsx` → `MissionsPageSkeleton`
- Supprimer skeletons **non utilisés** restants OU documenter dans handoff ceux gardés pour admin

#### Slice C6 — Tokens surface (M7)

**GREEN** : remplacer `bg-white`, `bg-white/88`, etc. par classes token (`bg-surface`, `bg-surface/90` ou constante `SURFACE_GLASS_PANEL`) dans **fichiers touchés par ce diff** — pas de big-bang 55 fichiers si hors scope PR ; viser composants CRM 4 entités + atoms Input/Card/Modal.

#### Slice C7 — Repository ↔ view-model inversion (M8)

**RED** : repository n'importe plus view-models.

**GREEN** :

- Déplacer types update vers `server/db/repositories/types/` ou mapper dans router
- `candidate-profile.repository.ts`, `user.repository.ts`

#### Slice C8 — ActivityLog schema DRY (L9)

**GREEN** : `ACTIVITY_TYPES` export unique depuis `activity-log.schema.ts` ; form schema importe depuis là.

**Tests manuels Phase C** :

- [ ] 4 listes dashboard → skeleton bref au chargement
- [ ] Fiche candidat — onglets identiques UX contact/pharmacie
- [ ] Tokens : pas de régression visuelle évidente sur cards glass

---

### Phase D — Low polish (L1–L5, L8, L10, M16 doc)

#### Slice D1 — Cycles IA (L1)

**GREEN** : `server/ai/provider.types.ts` — types extraits ; `provider.ts`, `mock-provider.ts`, `openrouter-provider.ts` importent types sans cycle.

#### Slice D2 — Gradients & motion tokens (L2, L3)

**GREEN** : `PageHeader`, `DetailPageHeader` — `via-surface` / `to-surface` ; `surface-glass.ts` + `motion/variants.ts` — commentaire exception ou tokens CSS vars.

#### Slice D3 — Contact search + dead methods (L4, L5)

**RED** : test repo `contact.search(term)` si assistant en a besoin ; ou test que méthodes mortes supprimées.

**GREEN** :

- `contact.repository.ts` — `search` aligné candidate/pharmacy
- Supprimer ou `@deprecated` + commentaire : `application.list()`, `jobOffer.list()` non exposés

#### Slice D4 — Badge statut header (L10)

**GREEN** : aligner placement badge candidat/contact si métier validé (documenter choix dans handoff).

#### Slice D5 — Docker tests doc (M16)

**GREEN** : paragraphe dans `apps/web/README.md` ou `docs/agents/testing.md` — intégration requiert Docker ; commande `pnpm test` attendue en CI.

**Tests manuels Phase D** :

- [ ] Assistant — recherche contact par nom si search ajouté
- [ ] `npx madge --circular src/server/ai` — 0 cycle

---

## Fichiers impactés (index)

### Phase A

- `app/(dashboard)/missions/[id]/page.tsx`
- `components/organisms/MissionDetailPage.tsx`
- `components/molecules/MissionDetailTabPanel.tsx`
- `components/molecules/MissionStatusActions.tsx`
- `components/molecules/EntityDocumentsList.tsx`
- `components/organisms/MissionKanban.tsx`
- `server/db/repositories/contact.repository.ts`

### Phase B

- `server/db/repositories/pharmacy.repository.ts`
- `lib/hooks/use-kanban-optimistic-mutation.ts` (nouveau)
- `components/organisms/EntityGridList.tsx` (nouveau)
- `components/organisms/{Pharmacy,Contact,Mission,Cvtheque}List.tsx`
- `components/organisms/CandidatsPage.tsx`, `MissionsPage.tsx`, `CvthequeSection.tsx`
- `components/molecules/PharmacyBesoinsTab.tsx`, `ContactMissionsTab.tsx`
- `components/molecules/EntityLinkedMissionRow.tsx` (nouveau)
- `server/routers/candidate.ts`, `contact.ts`
- `server/read-models/pharmacy-picker.ts` (nouveau)

### Phase C

- `components/organisms/CandidateDetailPage.tsx`
- `components/molecules/CandidateDetailTabPanel.tsx` (nouveau)
- `view-models/{person-name,format-date-fr,to-null}.ts` (nouveaux)
- `server/routers/mission.ts`, `candidate.ts`
- `lib/hooks/use-contact-detail-mutations.ts`, `use-mission-detail-mutations.ts`, `use-create-job-title-mutation.ts` (nouveaux)
- `app/(dashboard)/{candidats,pharmacies,contacts,missions}/loading.tsx` (nouveaux)
- `components/molecules/skeletons/*` — câblage
- `server/db/repositories/candidate-profile.repository.ts`, `user.repository.ts`
- `view-models/activity-log-form.schema.ts`, `activity-log.schema.ts`

### Phase D

- `server/ai/provider.types.ts` (nouveau), `provider.ts`, `mock-provider.ts`, `openrouter-provider.ts`
- `components/molecules/PageHeader.tsx`, `DetailPageHeader.tsx`
- `lib/constants/surface-glass.ts`, `lib/motion/variants.ts`
- `server/db/repositories/contact.repository.ts`, `application.repository.ts`, `job-offer.repository.ts`
- `docs/agents/testing.md` ou `apps/web/README.md`

---

## Contraintes techniques

- Prisma **uniquement** dans `src/server/db/repositories/`
- Lectures RSC via `createServerCaller` — jamais `fetch` interne
- Mutations via `trpc.useMutation()` en Client Components
- Fichiers **< 100 lignes** — splitter immédiatement
- Zéro `any` ; React Hook Form + Zod pour formulaires
- Atomic design : atoms → molecules → organisms ; logique dans hooks/view-models
- Zustand = UI state uniquement
- Vocabulaire `CONTEXT.md` — pas de termes `_Avoid_`

---

## Fin de session

**Uniquement sur instruction explicite** de l'utilisateur :

1. Rédiger `docs/handoffs/HANDOFF_ISSUE_114.md` — findings clos vs restants, dette follow-up (pagination UI, soft delete #80, inbox #72)
2. Push branche `fix/issue-114-audit-coherence-2026-06-20`
3. PR vers `dev` avec body `Closes #114` + checklist tests manuels
4. Après merge : `git mv docs/prompts/pending/PROMPT_ISSUE_114.md docs/prompts/done/`

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-114
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm typecheck && pnpm lint && pnpm lint:lines && pnpm test
pnpm dev
```

URLs : `/candidats` · `/pharmacies` · `/contacts` · `/missions` · `/missions/{id}` · `/pharmacies/{id}` · `/contacts/{id}` · `/candidats/{id}`

---

## Tests manuels — checklist finale

### Candidats

- [ ] Liste + kanban : toggle fluide, drag stage rollback si erreur
- [ ] Fiche → Historique : filtre types + ajout entrée
- [ ] Inbox : affichage seul (actions = issue #72, ne pas tester ici)

### Pharmacies

- [ ] Liste portefeuille : perf acceptable, primary contact visible
- [ ] Fiche → Contacts cliquables ; Besoins → navigation mission
- [ ] Historique + Documents inchangés fonctionnels

### Contacts

- [ ] Création modal liste + depuis onglet pharmacie
- [ ] Fiche → Missions liées cliquables ; Historique + Documents OK

### Missions

- [ ] Fiche → Historique + Documents ** fonctionnels** (plus stub)
- [ ] Pipeline / Matching / Offre : stub « Bientôt disponible » acceptable
- [ ] Annuler mission : ConfirmDialog
- [ ] Kanban : empty state si tout terminal

### Transverse

- [ ] Skeleton bref sur 4 listes dashboard
- [ ] Toasts erreur sur mutations échouées (kanban + formulaires)
- [ ] `pnpm typecheck && pnpm lint && pnpm lint:lines && pnpm test` verts

---

## Matrice findings → phase

| ID | Phase | Statut attendu |
|----|-------|----------------|
| C1 | A | Historique + docs mission wired |
| H1 | A | `listByPharmacy` borné |
| H3 | B | `pharmacy.list` allégé |
| H6 | B | `EntityGridList` |
| H7 | B | Hook kanban |
| H4, H5 | — | **#80**, **#72** |
| H2 | partiel B | Limites repos ; UI pagination = follow-up |
| M1 | B | Shells liste |
| M2 | C | Tab panels |
| M3 | C | Router mapping |
| M4 | B | PharmacyBesoins links |
| M5 | C | loading.tsx listes |
| M6 | C | Skeletons câblés |
| M7 | C | Tokens surface (diff) |
| M8 | C | Repo/view-model |
| M9 | A | Mission kanban empty |
| M10 | A | EntityDocumentsList EmptyState |
| M11 | C | Hooks mutations |
| M12 | B | candidate.list |
| M13 | B | referentials naming |
| M14 | C | createJobTitle toast |
| M15 | C | VM utilities |
| M16 | D | Doc Docker |
| L1 | D | provider.types |
| L2–L3 | D | Gradients/motion |
| L4–L5 | D | search + dead methods |
| L6 | B | pharmacy picker DRY |
| L7 | A | Mission confirm |
| L8 | D | Kanban columns (optionnel si temps — sinon handoff) |
| L9 | C | ActivityLog schema |
| L10 | D | Badge header |

---

*Prompt généré le 2026-06-20 — source `docs/audits/AUDIT_COHERENCE_2026-06-20.md`*
