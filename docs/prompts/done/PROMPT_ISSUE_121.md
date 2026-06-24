# Prompt — Issue #121

**Titre** : [FIX] Architecture — modules profonds (revue 2026-06-20)  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/121  
**Parent** : #19 (PRD)  
**Blocked by** : — · **Ne pas chevaucher** : #72 (inbox accept/merge), #114 (audit cohérence — findings séparés)

**Source** : revue `/improve-codebase-architecture` du 20 juin 2026

---

## Skills

```
/caveman
/tdd
```

**Lecture ciblée uniquement** :

1. Ce prompt + `CONTEXT.md` (Candidate, Application, Mission, MissionCandidate, PipelineStage)
2. ADR 0004, 0006, 0008, 0010
3. Fichiers listés dans **Fichiers impactés** par slice — pas le repo entier

**TDD — règles impératives** :

- **Vertical slices** : 1 test comportement observable → impl minimal → GREEN → refactor. **Jamais** tous les tests puis tout le code.
- Tester **interfaces publiques** : fonctions exportées, routers tRPC (deps injectées), view-models. Pas de tests sur détails internes.
- Après **chaque** slice : `pnpm test -- <fichier>` puis `pnpm typecheck && pnpm lint && pnpm lint:lines`.
- **Fichiers < 100 lignes** : si un fichier dépasse 99 lignes en cours de slice, splitter **avant** le commit de la slice.
- **Zéro `any`**, Prisma **uniquement** dans repositories.

**Déjà livré — ne pas toucher** :

- `useKanbanOptimisticMutation` + test — hook Kanban OK, hors scope.

**Avant d'implémenter** : sur `origin/dev` à jour, vérifier l'état actuel (issue #112+ peut avoir partiellement avancé). Ne pas re-faire ce qui est déjà vert.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-121 -b fix/issue-121-architecture-deep-modules origin/dev
cd ../crm-medijob-issue-121
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm install
```

3. Baseline :

```bash
pnpm typecheck && pnpm lint && pnpm lint:lines && pnpm test
```

---

## Périmètre global

Approfondir 5 modules identifiés par la revue d'architecture. Ordre **strict** A → E.

### Critères d'acceptation globaux

- [ ] `pnpm typecheck` — 0 erreur
- [ ] `pnpm lint` — 0 erreur
- [ ] `pnpm lint:lines` — tous fichiers touchés < 100 lignes
- [ ] `pnpm test` — nouveaux tests par slice ; baseline non régressée
- [ ] Aucun `prisma.` hors repositories
- [ ] Aucun import view-model → repository ni repository → view-model (types serveur dans `server/` ou `repositories/types/`)

---

## Plan TDD — 5 phases

Exécuter **Phase A → B → C → D → E**. Commit logique par slice. **Une PR** `Closes #121` en fin de session.

---

### Phase A — Doublons Application (priorité 1)

**Problème** : `detectApplicationDuplicate` (adapter) réimplémente les règles déjà dans `detectDuplicateCandidate` (pur, testé mais non appelé en prod). Test de suppression négatif.

**Fichiers impactés** :

- `apps/web/src/server/application/intake.ts` — `detectDuplicateCandidate` (existant)
- `apps/web/src/server/application/intake.adapter.ts` — refactor délégation
- `apps/web/src/server/application/intake.adapter.test.ts` — mock I/O uniquement
- `apps/web/src/server/application/intake.test.ts` — règles email / name_phone (existant, compléter si besoin)

#### Slice A1 — Adapter délègue au pur

**RED** :

```typescript
// intake.adapter.test.ts — nouveau cas
it('délègue email match à detectDuplicateCandidate après fetch identities', async () => {
  // mock findApplication + findIdentityByEmail → vérifie reason: 'email'
})
```

**GREEN** :

- `detectApplicationDuplicate` : fetch Application + liste `CandidateIdentity[]` (via repos), appeler `detectDuplicateCandidate(application, candidates)`.
- Supprimer la logique inline email / name_phone dupliquée dans l'adapter.
- Garder l'interface async + deps injectables pour tests.

**Refactor** : si l'adapter dépasse 45 lignes, extraire `fetchCandidateIdentitiesForDuplicate(application, deps)` dans `intake.adapter.fetch.ts` (< 40 lignes).

**ADR** : 0006 — alerte informative, pas de merge auto.

---

### Phase B — Module Pipeline MissionCandidate (priorité 2)

**Problème** : écritures MissionCandidate éclatées — kanban via `mission-candidate.router` + transitions POURVU/ANNULEE via `mission.repository.terminalTransition`. ADR 0004 non respecté en profondeur.

**Fichiers impactés** :

- `apps/web/src/server/pipeline/mission-candidate.service.ts` *(nouveau)*
- `apps/web/src/server/pipeline/mission-candidate.service.test.ts` *(nouveau)*
- `apps/web/src/server/mission/transition-status.ts` — deps pointent vers service
- `apps/web/src/server/mission/transition-status.adapter.ts` — wiring
- `apps/web/src/server/db/repositories/mission-candidate.repository.ts` — CRUD seul
- `apps/web/src/server/db/repositories/mission.repository.ts` — retirer `terminalTransition`
- `apps/web/src/server/routers/mission-candidate.ts` — délègue au service
- `apps/web/src/server/routers/mission.ts` — inchangé côté router, adapter seulement

#### Slice B1 — `updateStage` centralisé

**RED** :

```typescript
// mission-candidate.service.test.ts
it('updateStage appelle repository avec missionId, candidateId, stageId', async () => {
  // deps mockées
})
```

**GREEN** :

- `updateStage(input, deps)` dans `mission-candidate.service.ts`.
- `mission-candidate.router` : `updateStage` → service (router reste < 30 lignes).

#### Slice B2 — `applyTerminalTransition` déplacé depuis mission.repository

**RED** :

```typescript
// mission-candidate.service.test.ts
it('applyTerminalTransition met à jour statut mission + stages candidats en transaction', ...)
// transition-status.test.ts — adapter mock applyTerminalTransition sur service
```

**GREEN** :

- Déplacer logique `terminalTransition` de `mission.repository.ts` vers `applyTerminalTransition` dans le service.
- `transition-status.adapter.ts` : `applyTerminalTransition` → service, plus mission repo.
- `mission.repository` : `updateStatus` uniquement.

**ADR** : 0008 — POURVU exige `placedCandidateId` valide ; ANNULEE → tous « Pas retenu ».

**Contrainte lignes** : service > 80 lignes → splitter `mission-candidate.terminal.ts` (< 60 lignes) + barrel `index.ts`.

---

### Phase C — Module profil Candidate (priorité 3)

**Problème** : 7 fichiers pour un profil ; `candidate-profile-payload.ts` redéfinit un `ProfileRecord` Prisma inline (77 lignes, limite CI). Include dupliqué.

**Fichiers impactés** :

- `apps/web/src/server/db/repositories/candidate-profile.repository.ts` — export type `CandidateProfileRecord` depuis include existant
- `apps/web/src/server/db/repositories/types/candidate-profile.types.ts` — déjà partiellement OK
- `apps/web/src/view-models/candidate-profile-payload.ts` — importer type serveur, pas Prisma inline
- `apps/web/src/view-models/candidate-profile-map.ts`
- `apps/web/src/view-models/candidate-profile.ts`
- `apps/web/src/view-models/candidate-profile.schema.ts`
- `apps/web/src/view-models/candidate-profile.test.ts`

#### Slice C1 — Type record serveur unique

**RED** :

```typescript
// candidate-profile.test.ts ou payload test
it('toCandidateProfilePayload expose missingMatchingFields quand city absente', ...)
```

**GREEN** :

- Exporter `CandidateProfileRecord` depuis repository (basé sur `candidateProfileInclude`).
- `toCandidateProfilePayload(candidate: CandidateProfileRecord)` — supprimer type Prisma inline.
- Vérifier `candidate-profile-payload.ts` < 100 lignes (splitter `candidate-profile-form.ts` si besoin).

#### Slice C2 — Barrel view-model (optionnel si C1 suffit)

**RED** : test import unique `@/view-models/candidate-profile` exporte payload + map + schema re-exports.

**GREEN** :

- `candidate-profile/index.ts` barrel si ça réduit les imports router sans gonfler les fichiers.
- **Ne pas** fusionner agressivement si ça dépasse 100 lignes — locality > nombre de fichiers.

**ADR** : 0010 — `getMissingMatchingFields` / bannière complétude inchangés fonctionnellement.

---

### Phase D — Read-models sans pass-through (priorité 4)

**Problème** : `*.adapter.ts` = 4 lignes de `Promise.all` wrapper. Interface ≈ implémentation.

**Fichiers impactés** :

- `apps/web/src/server/read-models/candidate-referentials.ts` — garder
- `apps/web/src/server/read-models/candidate-referentials.adapter.ts` — **supprimer**
- `apps/web/src/server/read-models/mission-referentials.ts` + `.adapter.ts`
- `apps/web/src/server/read-models/contact-missions.ts` + `.adapter.ts`
- `apps/web/src/server/routers/candidate.ts` — wiring inline deps
- `apps/web/src/server/routers/mission.ts`
- `apps/web/src/server/routers/contact.ts`

#### Slice D1 — Candidate referentials

**RED** :

```typescript
// candidate-referentials.test.ts (existant ou nouveau)
it('loadCandidateReferentials agrège jobTitles, softwares, recruiters, stages', ...)
```

**GREEN** :

- Supprimer `candidate-referentials.adapter.ts`.
- `makeCandidateRouter` : `referentials: () => loadCandidateReferentials({ listJobTitles: ..., ... })` directement.
- Mettre à jour imports + tests router mock.

#### Slice D2 — Mission + Contact referentials

**RED/GREEN** : même pattern pour `mission-referentials` et `contact-missions` ; supprimer `makeContactMissionReader` si pass-through pur.

---

### Phase E — Contrats tRPC list + filtre actif partagé (priorité 5)

**Problème** : alias `list` / `cvtheque` identiques ; filtrage terminal dupliqué entre `activeMissions` et `toCandidateMissionRows`.

**Fichiers impactés** :

- `apps/web/src/lib/kanban-active-positionings.ts` *(nouveau)* — `filterActivePositionings<T>(...)`
- `apps/web/src/lib/kanban-active-positionings.test.ts` *(nouveau)*
- `apps/web/src/view-models/candidate-kanban.ts` — utilise helper partagé
- `apps/web/src/view-models/candidate-missions.ts` — idem
- `apps/web/src/server/routers/candidate.ts` — supprimer alias `cvtheque`
- `apps/web/src/server/routers/mission.ts` — list retourne view-model rows
- Composants consommateurs : grep `cvtheque` → migrer vers `list`

#### Slice E1 — Filtre positionnements actifs

**RED** :

```typescript
// kanban-active-positionings.test.ts
it('exclut mission POURVU et stage terminal Placé', ...)
```

**GREEN** :

- Extraire logique commune de `activeMissions` + `toCandidateMissionRows` vers `filterActivePositionings`.
- Tests existants `candidate-kanban.test.ts` + `candidate-missions` restent verts.

#### Slice E2 — Router candidate : un seul list + payload typé

**RED** :

```typescript
// candidate router test ou integration
it('list retourne rows typées CandidateListRow[], pas RawCandidate[]', ...)
```

**GREEN** :

- Supprimer procédure `cvtheque` ; mettre à jour appels client (`CvthequeList`, pages RSC).
- `list` retourne `{ rows, candidates, stages }` avec `rows` déjà mappées (existant partiellement via `toCandidateListRows`).

#### Slice E3 — Router mission list (si temps)

**RED/GREEN** : `mission.list` retourne `MissionListRow[]` via view-model ; retirer mapping des organisms.

---

## Contraintes techniques

- Prisma uniquement dans `src/server/db/repositories/`
- RSC lectures (`createCaller`), mutations `trpc.useMutation()` en Client Components
- Atomic design — zéro logique métier dans organisms (déjà le cas kanban)
- View-models = pont DB → UI ; types mutation dans `repositories/types/` ou `server/pipeline/`
- Splitter **immédiatement** tout fichier ≥ 100 lignes dans le diff

---

## Fin de session

Sur demande explicite (`/handoff`, « push », « ouvre la PR ») :

1. Rédiger `docs/handoffs/HANDOFF_ISSUE_121.md`
2. Push branche `fix/issue-121-architecture-deep-modules`
3. PR vers `dev` avec `Closes #121`
4. Après merge : `git mv docs/prompts/pending/PROMPT_ISSUE_121.md docs/prompts/done/`

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-121
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm test && pnpm lint && pnpm lint:lines && pnpm typecheck
pnpm dev
```

---

## Tests manuels

- [ ] **Phase A** : seed Application doublon email (ex. Camille) → inbox affiche alerte doublon Candidate — même comportement qu'avant
- [ ] **Phase B** : fiche Mission → statut POURVU avec candidat placé → autres candidats passent « Pas retenu » ; kanban CVthèque drag stage → persiste après refresh
- [ ] **Phase C** : fiche Candidate Camille → bannière complétude si champs matching manquants ; édition profil → sauvegarde OK
- [ ] **Phase D** : fiche Candidate → selects métiers/LGO/référent/stages chargés (referentials)
- [ ] **Phase E** : liste CVthèque + kanban fonctionnent sans procédure `cvtheque` ; cartes n'affichent pas missions POURVU/ANNULEE
- [ ] CI locale : `pnpm test && pnpm lint && pnpm lint:lines && pnpm typecheck` — vert
