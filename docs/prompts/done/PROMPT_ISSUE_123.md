# Prompt — Issue #123

**Titre** : [FIX] Audit codebase 2026-06-20 — remédiation maximale (TDD)  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/123  
**Parent** : #19 (PRD)  
**Blocked by** : — · **Ne pas chevaucher** : #79 (recherche globale SQL), #74–#75 (matching inversé / contact IA), #72 (inbox), #121 (architecture — déjà mergé)

**Source** : audit codebase `dev` du 20 juin 2026 (session agent — 35 findings vérifiés)

---

## Skills

```
/caveman
/tdd
```

**Lecture ciblée uniquement** :

1. Ce prompt + `CONTEXT.md` (Mission, Candidate, Contact, Pharmacy, matching)
2. ADR 0004 (pipeline), 0006 (candidatures), 0008 (documents blob)
3. Fichiers listés par slice — **pas** le repo entier

**TDD — règles impératives** :

- **Vertical slices** : 1 test comportement observable → impl minimal → GREEN → refactor. **Jamais** tous les tests puis tout le code.
- Tester **interfaces publiques** : fonctions exportées, routers tRPC (deps injectées), repositories, view-models. Pas de détails internes.
- Après **chaque** slice : `pnpm test -- <fichier>` puis `pnpm typecheck && pnpm lint && pnpm lint:lines`.
- **Fichiers < 100 lignes** : splitter avant commit si > 99 lignes.
- **Zéro `any`**, Prisma **uniquement** dans repositories.

**Avant d'implémenter** : `git fetch origin && git rebase origin/dev`. Re-vérifier chaque finding — ne pas re-faire ce qui est déjà vert sur `dev`.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-123 -b fix/issue-123-audit-codebase-2026-06-20 origin/dev
cd ../crm-medijob-issue-123
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm install
```

3. Baseline :

```bash
pnpm typecheck && pnpm lint && pnpm lint:lines && pnpm test
```

---

## Périmètre global

Remédier **le maximum de findings** de l'audit codebase 2026-06-20 en **6 phases** (A → F). Ordre strict — chaque phase débloque la suivante.

### Findings couverts (32 / 35)

| Phase | Findings audit | Count |
|-------|----------------|-------|
| A | Critical N+1 mission · upload base64 DoS · dernier admin · cvUrl allowlist | 4 |
| B | OpenRouter matching JSON · prefilter geo · cap 20 silencieux · non-null map | 4 |
| C | Search in-memory · kanban nested missions · payloads dupliqués · referentials double · contact endpoint dup · terminal N updates | 6 |
| D | Kanban stale state (×3) · race upload CV · geo cache · FileReader · blob log · router-errors | 8 |
| E | JobTitle authz · error.tsx dashboard · limites nested mission/pharmacy detail | 3 |
| F (stretch) | Rate limit login · Prisma enums UI (3 composants kanban) | 2 |

### Hors scope — follow-up séparé

| Sujet | Raison |
|-------|--------|
| Pagination cursor/offset + UI « charger plus » | Slice trop large — issue dédiée |
| Déplacer toute la logique des 11 composants vers view-models | Chevauche #121 restant — 3 enums kanban seulement en Phase F |
| Recherche SQL full-text (#79) | Backlog feature |
| Matching inversé / contact depuis matching (#74–#75) | Backlog feature |
| Inbox accept/refuse (#72) | Backlog feature |
| Security headers CSP/HSTS | Infra Vercel — hors app |

### Critères d'acceptation globaux

- [ ] `pnpm typecheck` — 0 erreur
- [ ] `pnpm lint` — 0 erreur
- [ ] `pnpm lint:lines` — tous fichiers touchés < 100 lignes
- [ ] `pnpm test` — nouveaux tests par slice ; baseline non régressée
- [ ] Matching IA fonctionne avec `OPENROUTER_API_KEY` (format JSON object)
- [ ] Page mission detail : **1** requête contacts batch (pas N+1)
- [ ] Upload document/CV : rejet si base64 décodé > `size` déclaré
- [ ] Impossible de rétrograder le dernier ADMIN via `update`

---

## Plan TDD — 6 phases

Exécuter **Phase A → B → C → D → E → (F si temps)**. Commit logique par slice. **Une PR** `Closes #123` en fin de session.

---

### Phase A — Critical + sécurité haute (priorité 1)

#### Slice A1 — Validation base64 upload (documents + CV)

**Finding** : `dataBase64` sans limite ; buffer jamais comparé à `size` → DoS mémoire.

**RED** :

```typescript
// lib/upload-base64.test.ts (nouveau)
it('rejette si taille décodée dépasse size déclaré', () => {
  const huge = Buffer.alloc(11 * 1024 * 1024).toString('base64')
  expect(validateDecodedBase64Size(huge, 10 * 1024 * 1024)).toMatchObject({ ok: false })
})
it('accepte si taille décodée <= size', () => { ... })
```

```typescript
// document.schema.test.ts — compléter
it('rejette upload si base64 décodé > size', () => {
  expect(uploadDocumentSchema.safeParse({ ...valid, size: 100, dataBase64: bigBase64 }).success).toBe(false)
})
```

**GREEN** :

- Créer `apps/web/src/lib/upload-base64.ts` (< 40 lignes) :
  - `MAX_UPLOAD_BYTES = 10 * 1024 * 1024`
  - `maxBase64LengthForSize(size)` — borne longueur string
  - `validateDecodedBase64Size(dataBase64, size)` — compare `Buffer.from(..., 'base64').length`
- Réutiliser dans `document.schema.ts` + `candidate-cv.schema.ts` via `.superRefine`
- Routers `document.ts` + `candidate-cv.ts` : early return / throw si validation échoue avant `Buffer.from`

**Fichiers** :

- `lib/upload-base64.ts` (nouveau)
- `lib/upload-base64.test.ts` (nouveau)
- `server/routers/document.schema.ts`
- `server/routers/candidate-cv.schema.ts`
- `server/routers/document.schema.test.ts`
- `server/routers/candidate-cv.test.ts` (compléter)

---

#### Slice A2 — Garde-fou dernier administrateur sur `update`

**Finding** : `remove` bloque suppression dernier ADMIN ; `update` permet rétrogradation.

**RED** :

```typescript
// admin/user.test.ts
it('refuse de rétrograder le dernier ADMIN', async () => {
  deps.findById.mockResolvedValue({ id: 'a1', role: 'ADMIN' })
  deps.countAdmins.mockResolvedValue(1)
  await expect(caller.admin.user.update({ id: 'a1', role: 'RECRUTEUR', ... })).rejects.toMatchObject({ code: 'CONFLICT' })
})
```

**GREEN** :

- `admin/user.ts` : avant `deps.update`, si `input.role === 'RECRUTEUR'` (ou !== ADMIN) et user courant ADMIN et `countAdmins() <= 1` → `TRPCError CONFLICT` message cohérent avec `remove`

**Fichiers** :

- `server/routers/admin/user.ts`
- `server/routers/admin/user.test.ts`

---

#### Slice A3 — Mission detail : batch contacts (fix N+1)

**Finding** : `missions/[id]/page.tsx` appelle `listByPharmacy` en boucle (jusqu'à 500 requêtes).

**RED** :

```typescript
// contact.repository.test.ts ou integration
it('listByPharmacyIds retourne contacts groupés par pharmacyId', async () => { ... })

// view-model ou helper test
it('groupContactsByPharmacy indexe par pharmacyId', () => { ... })
```

**GREEN** :

- `contact.repository.ts` : ajouter `listByPharmacyIds(pharmacyIds: string[])` — une requête `where: { pharmacyId: { in: ids }, ...NOT_DELETED }`, `take` global raisonnable ou par pharmacy via raw group (préférer une query + group JS si < 100 lignes)
- `view-models/contact-by-pharmacy.ts` (nouveau, < 30 lignes) : `groupContactsByPharmacy(rows): Record<string, ContactRef[]>`
- Router `contact.ts` : procédure `listByPharmacyIds` **ou** exposer via deps internes page RSC uniquement (préférer procédure tRPC testable avec input `z.array(z.string())`)
- `missions/[id]/page.tsx` : remplacer `Promise.all(refs.pharmacies.map(...))` par un seul appel batch

**Fichiers** :

- `server/db/repositories/contact.repository.ts`
- `server/db/repositories/contact.repository.test.ts` (nouveau ou compléter)
- `view-models/contact-by-pharmacy.ts` (nouveau)
- `view-models/contact-by-pharmacy.test.ts` (nouveau)
- `server/routers/contact.ts`
- `app/(dashboard)/missions/[id]/page.tsx`

---

#### Slice A4 — Allowlist `cvUrl` Vercel Blob

**Finding** : `confirmCvExtraction` accepte toute URL.

**RED** :

```typescript
// candidate-cv.schema.test.ts
it('rejette cvUrl hors domaine blob autorisé', () => { ... })
```

**GREEN** :

- Extraire constante `BLOB_URL_PREFIX` depuis env ou `server/services/blob.ts`
- `confirmCvExtractionSchema` : `.refine(url => url.startsWith(prefix) || isAllowedBlobHost(url))`
- Test router confirm avec URL externe → BAD_REQUEST

**Fichiers** :

- `server/routers/candidate-cv.schema.ts`
- `server/routers/candidate-cv.test.ts`
- `server/services/blob.ts` (export helper `isAllowedBlobUrl`)

---

### Phase B — Matching IA prod (priorité 2)

#### Slice B1 — OpenRouter + format JSON object

**Finding** : `openrouter-provider.ts` force `json_object` ; parser attend un **array** → matching cassé en prod.

**RED** :

```typescript
// matching.schema.test.ts
it('parse un wrapper { scores: [...] }', () => {
  const raw = JSON.stringify({ scores: [{ candidateId: 'c1', score: 80, justification: 'ok' }] })
  expect(parseMatchingScoreResponse(raw)).toHaveLength(1)
})
it('parse encore un array direct (mock compat)', () => { ... })
```

**GREEN** :

- `matching.schema.ts` : `parseMatchingScoreResponse` accepte array **ou** `{ scores: array }` (et éventuellement `{ candidates: array }` si prompt l'exige)
- `matching-prompt.ts` : demander explicitement `{ "scores": [{ candidateId, score, justification }] }` (compatible `json_object`)
- `openrouter-provider.test.ts` : test que matching kind utilise le provider (si kind branché plus tard, sinon documenter)

**Fichiers** :

- `server/ai/matching.schema.ts`
- `server/ai/matching.schema.test.ts`
- `server/ai/matching-prompt.ts`
- `server/ai/matching-prompt.test.ts` (nouveau, vérifie présence `scores` dans consigne)

---

#### Slice B2 — Prefilter : échec geo pharmacie

**Finding** : si `pharmacyCoords === null`, candidats passent sans contrôle distance.

**RED** :

```typescript
// prefilter.test.ts — nouveau cas
it('exclut candidats geo si lookup pharmacie échoue', async () => {
  const lookupGeo = vi.fn()
    .mockResolvedValueOnce(null) // pharmacy lookup fails
  const result = await prefilterCandidates(missionWithGeo, [candidateWithGeo], scores, lookupGeo)
  expect(result.eligible).toHaveLength(0)
  expect(result.excluded[0].reasons).toContain('geo')
})
```

**GREEN** :

- `prefilter.ts` : si `pharmacyGeoOk && !pharmacyCoords` → traiter comme exclusion geo pour candidats qui auraient passé la branche distance (refactor branche l.44-55 en `else if (!pharmacyCoords) { reasons.push('geo') } else { ... distance ... }`)

**Fichiers** :

- `server/matching/prefilter.ts`
- `server/matching/prefilter.test.ts`

---

#### Slice B3 — Cap 20 candidats : transparence dans le payload

**Finding** : `matching-score.ts` slice(0, 20) silencieux ; candidats absents des deux listes.

**RED** :

```typescript
// matching-score.test.ts (nouveau)
it('retourne uniquement les candidats scorés par l\'IA', () => { ... })

// run-mission-matching.test.ts ou mission-matching-map.test.ts
it('ajoute les éligibles non scorés dans excluded avec reason not_scored', () => { ... })
```

**GREEN** :

- `exclusion-reasons.ts` : ajouter code `'not_scored'` + label FR
- `run-mission-matching.ts` ou `mission-matching-map.ts` : après scoring, candidats éligibles dont id ∉ scores → `excluded` avec `reasons: ['not_scored']`
- UI `MissionMatchingTab` : afficher label si présent (vérif RTL optionnelle)

**Fichiers** :

- `server/matching/exclusion-reasons.ts`
- `server/ai/matching-score.test.ts` (nouveau)
- `view-models/mission-matching-map.ts`
- `view-models/mission-matching-map.test.ts` (nouveau)
- `components/organisms/MissionMatchingTab.tsx` (label seulement si trivial)

---

#### Slice B4 — Guards défensifs `mission-matching-map`

**Finding** : `candidatesById.get(...)!` crash si divergence IDs.

**RED** :

```typescript
// mission-matching-map.test.ts
it('ignore un score IA pour un id inconnu', () => { ... })
it('ignore une exclusion sans row repository', () => { ... })
```

**GREEN** :

- Remplacer `!` par early continue / filter : `const row = candidatesById.get(id); if (!row) continue`

**Fichiers** :

- `view-models/mission-matching-map.ts`
- `view-models/mission-matching-map.test.ts`

---

### Phase C — Scalabilité + DRY (priorité 3)

#### Slice C1 — Helper search partagé

**Finding** : `candidate-search.repo.ts` et `contact-search.repo.ts` quasi-identiques ; filtre en JS sur 500 lignes.

**RED** :

```typescript
// lib/search-pool.test.ts (nouveau)
it('filterPool applique matcher puis slice limit', () => { ... })
```

**GREEN** :

- `lib/search-pool.ts` (< 50 lignes) : `filterSearchPool<T>(rows, term, matches, limit)`
- Refactor `candidate-search.repo.ts` + `contact-search.repo.ts` pour utiliser helper
- **Ne pas** migrer vers SQL full-text (hors scope #79) — documenter limite 500 dans commentaire

**Fichiers** :

- `lib/search-pool.ts` (nouveau)
- `lib/search-pool.test.ts` (nouveau)
- `server/db/repositories/candidate-search.repo.ts`
- `server/db/repositories/contact-search.repo.ts`

---

#### Slice C2 — Limite nested `missions` dans kanban candidats

**Finding** : `listForKanban` inclut toutes les missions sans `take`.

**RED** :

```typescript
// candidate.repository.test.ts ou integration
it('listForKanban limite missions nested par candidat', () => { ... })
```

**GREEN** :

- `candidate.repository.ts` : `missions: { take: KANBAN_MISSIONS_LIMIT, ... }` — constante dans `lib/list-limits.ts` ou `lib/kanban-limits.ts`
- Valeur proposée : `20` (aligné cap matching) ou `DEFAULT_LIST_LIMIT` si cohérent UX

**Fichiers** :

- `lib/kanban-limits.ts` (nouveau, < 15 lignes)
- `server/db/repositories/candidate.repository.ts`

---

#### Slice C3 — Payloads list dupliqués

**Finding** : `candidate.list` renvoie `{ rows, candidates, stages }` ; `mission.list` `{ rows, kanban }`.

**RED** :

```typescript
// candidate.test.ts — adapter assertions
it('list retourne rows + stages sans dupliquer candidates bruts', () => { ... })
```

**GREEN** :

- `candidate.ts` : retourner `{ rows, stages }` — supprimer clé `candidates` du retour
- `mission.ts` : retourner `{ rows }` ou `{ rows, stages }` selon besoin — supprimer `kanban` dupliqué
- Mettre à jour **tous** consommateurs : pages RSC + composants kanban (`CvthequeKanban`, `MissionKanban`) — utiliser `rows` uniquement
- Vérifier `pnpm typecheck` propage les breaks

**Fichiers** :

- `server/routers/candidate.ts`
- `server/routers/mission.ts`
- `server/routers/candidate.test.ts`
- `server/routers/mission.test.ts`
- `app/(dashboard)/candidats/page.tsx`
- `app/(dashboard)/missions/page.tsx`
- Composants kanban impactés

---

#### Slice C4 — Referentials mission detail (dedup fetch)

**Finding** : `mission.referentials()` + `candidate.referentials()` rechargent jobTitles/recruiters.

**RED** :

```typescript
// mission-referentials.test.ts ou page test
it('loadMissionDetailReferentials fusionne pipelineStages candidat sans double jobTitles', () => { ... })
```

**GREEN** :

- Créer `server/mission/mission-detail-referentials.ts` (< 60 lignes) : une fonction `loadMissionDetailReferentials(deps)` retournant `{ jobTitles, recruiters, pharmacies, pipelineStages }`
- `missions/[id]/page.tsx` : un seul appel
- Réutiliser `loadMissionReferentials` + `pipelineStageRepository.list()` — pas de double `jobTitleRepository.list()`

**Fichiers** :

- `server/mission/mission-detail-referentials.ts` (nouveau)
- `server/mission/mission-detail-referentials.test.ts` (nouveau)
- `app/(dashboard)/missions/[id]/page.tsx`

---

#### Slice C5 — Supprimer doublon `contact.pharmacyOptions`

**Finding** : `pharmacyOptions` === `referentials` dans `contact.ts`.

**RED** :

```typescript
// contact.test.ts — s'assurer referentials utilisé
```

**GREEN** :

- Supprimer procédure `pharmacyOptions` du router
- Migrer `contact/[id]/page.tsx` et tout appel restant vers `referentials` ou `pharmacy.referentials()`
- Grep `pharmacyOptions` → 0 résultats

**Fichiers** :

- `server/routers/contact.ts`
- `app/(dashboard)/contacts/[id]/page.tsx`
- Grep codebase

---

#### Slice C6 — Terminal transition : updates batch

**Finding** : boucle `await update()` séquentielle dans `mission-candidate.repository.ts`.

**RED** :

```typescript
// mission-candidate.repository.test.ts
it('applyTerminalStageUpdates utilise updateMany ou transaction batch', () => { ... })
```

**GREEN** :

- Remplacer boucle par `Promise.all` de updates **ou** `updateMany` groupé par `stageId` si possible (< 100 lignes)
- Garder comportement identique (tests integration existants verts)

**Fichiers** :

- `server/db/repositories/mission-candidate.repository.ts`
- `server/db/repositories/mission-candidate.repository.test.ts` (si absent, test unitaire mock tx)

---

### Phase D — Bugs client + observabilité (priorité 4)

#### Slice D1 — Kanban sync props après `router.refresh()`

**Finding** : `CvthequeKanban`, `MissionKanban`, `CandidateMissionsKanban` — `useState(initial)` sans sync.

**RED** :

```typescript
// CvthequeKanban.test.tsx (nouveau ou compléter)
it('met à jour les rows quand la prop candidates change', () => {
  const { rerender } = render(<CvthequeKanban candidates={a} stages={s} />)
  rerender(<CvthequeKanban candidates={b} stages={s} />)
  // assert colonnes reflètent b
})
```

**GREEN** :

- Extraire hook `useSyncedRows<T>(prop: T)` dans `lib/hooks/use-synced-rows.ts` (< 25 lignes) — pattern `MissionPipelineSection`
- Appliquer aux 3 kanbans

**Fichiers** :

- `lib/hooks/use-synced-rows.ts` (nouveau)
- `lib/hooks/use-synced-rows.test.ts` (nouveau)
- `components/organisms/CvthequeKanban.tsx`
- `components/organisms/MissionKanban.tsx`
- `components/organisms/CandidateMissionsKanban.tsx`

---

#### Slice D2 — Race upload CV

**Finding** : double upload rapide → review écrasée.

**RED** :

```typescript
// use-candidate-cv-review-state.test.ts
it('ignore réponse extraction si un upload plus récent est en cours', async () => { ... })
```

**GREEN** :

- `use-candidate-cv-review-state.ts` : `uploadSeqRef` increment ; ignorer `setReview` si seq !== current

**Fichiers** :

- `lib/hooks/use-candidate-cv-review-state.ts`
- `lib/hooks/use-candidate-cv-review-state.test.ts` (nouveau)

---

#### Slice D3 — Cache geo : ne pas persister les échecs

**Finding** : `distance.ts` cache `null` permanent sur HTTP error.

**RED** :

```typescript
// distance.test.ts
it('retente lookup après échec HTTP précédent', async () => { ... })
```

**GREEN** :

- Ne pas `cache.set(key, null)` sur `!res.ok` — seulement cacher les succès
- Option : TTL court sur null si nécessaire anti-spam

**Fichiers** :

- `server/matching/distance.ts`
- `server/matching/distance.test.ts` (compléter)

---

#### Slice D4 — FileReader `onerror` documents

**Finding** : `DocumentUploadForm.tsx` sans handler erreur.

**RED** : test RTL — simuler erreur lecture → toast ou message erreur visible.

**GREEN** :

- Aligner sur `cv-upload-file.ts` : `reader.onerror` + feedback UI (`toast` ou `setError`)

**Fichiers** :

- `components/molecules/DocumentUploadForm.tsx`
- Test RTL associé

---

#### Slice D5 — Log blob cleanup échoué

**Finding** : `.catch(() => undefined)` silencieux.

**GREEN** :

- Remplacer par `.catch((err) => { console.error('[blob-cleanup]', err) })` — pas de logger infra nouveau
- Test optionnel : spy console en test saga

**Fichiers** :

- `server/routers/document.ts`
- `server/routers/candidate-cv.ts`

---

#### Slice D6 — Erreurs non-IA dans matching router

**Finding** : `mapAssistantChatError` masque Prisma/network.

**RED** :

```typescript
// router-errors.test.ts
it('propage message générique interne seulement pour erreurs IA inconnues', () => { ... })
it('laisse remonter TRPCError existant', () => { ... })
```

**GREEN** :

- `router-errors.ts` : si `error` a message Prisma connu ou `Error` non mappé **non-Zod** → rethrow ou TRPC INTERNAL avec message original en dev / générique prod
- `matching.ts` : catch seulement autour appel provider, pas autour repos (préférable : catch narrow dans `runMissionMatching`)

**Fichiers** :

- `server/ai/router-errors.ts`
- `server/ai/router-errors.test.ts` (nouveau)
- `server/routers/matching.ts`

---

### Phase E — Limites + error boundary (priorité 5)

#### Slice E1 — JobTitle create : aligner authz admin

**Finding** : RECRUTEUR crée JobTitle via `mission.createJobTitle` ; admin restreint.

**GREEN** (choix produit — **option A recommandée**) :

- **Option A** : supprimer `mission.createJobTitle` ; UI mission utilise liste admin existante + Combobox create via admin seulement
- **Option B** : documenter dans CONTEXT.md + garder (hors scope fix)

**RED** :

```typescript
// mission.test.ts
it('n expose plus createJobTitle aux RECRUTEUR', () => { ... })
```

**Fichiers** :

- `server/routers/mission.ts`
- Composants mission form si appel direct
- `CONTEXT.md` (une ligne si Option B)

---

#### Slice E2 — `error.tsx` dashboard

**Finding** : aucune error boundary App Router.

**GREEN** :

- `app/(dashboard)/error.tsx` (< 50 lignes) : message FR + bouton « Réessayer » (`reset()`)
- Test snapshot RTL optionnel

**Fichiers** :

- `app/(dashboard)/error.tsx` (nouveau)

---

#### Slice E3 — Limites nested detail mission / pharmacy

**Finding** : `missionDetailSelect.candidates` et `pharmacy detail contacts` sans `take`.

**GREEN** :

- `mission.repository.selects.ts` : `candidates: { take: DETAIL_PIPELINE_LIMIT, ... }`
- `pharmacy.repository.ts` : `contacts: { take: DETAIL_CONTACTS_LIMIT, ... }`
- Constantes dans `lib/list-limits.ts`
- Tests repository ou integration

**Fichiers** :

- `lib/list-limits.ts`
- `server/db/repositories/mission.repository.selects.ts`
- `server/db/repositories/pharmacy.repository.ts`

---

### Phase F — Stretch (si temps restant)

#### Slice F1 — Rate limit login basique

**Finding** : pas de throttling credentials.

**GREEN minimal** :

- Middleware ou wrapper `authorizeCredentials` : Map email → `{ count, resetAt }` in-memory, max 5/min
- Test unitaire sur helper `checkLoginRateLimit`
- Documenter limitation serverless (reset par instance)

**Fichiers** :

- `server/auth/login-rate-limit.ts` (nouveau)
- `server/auth/authorize-credentials.ts` (brancher)

---

#### Slice F2 — Enums Prisma → view-models (3 kanban)

**Finding** : composants importent `@prisma/client` directement.

**GREEN** :

- Réexporter `MissionStatus`, etc. depuis `view-models/mission-kanban.types.ts` (déjà partiel)
- Migrer : `MissionKanbanColumn.tsx`, `MissionPipelineKanban.tsx`, `MissionMatchingTab.tsx`

---

## Fin de session

**Uniquement sur instruction explicite** (`push`, `ouvre la PR`, `/handoff`) :

1. `/handoff` → `docs/handoffs/HANDOFF_ISSUE_123.md` (commit avec le code)
2. Push branche `fix/issue-123-audit-codebase-2026-06-20`
3. PR vers `dev` avec `Closes #123`
4. Après merge : `git mv docs/prompts/pending/PROMPT_ISSUE_123.md docs/prompts/done/`

---

## Tests manuels

- [ ] **Upload document** : fichier < 10 Mo OK ; manipuler base64 oversized via devtools → rejet serveur
- [ ] **Upload CV** : idem ; confirm avec URL blob valide OK ; URL externe rejetée
- [ ] **Admin users** : un seul ADMIN → tentative rétrogradation → message conflit
- [ ] **Mission detail** : ouvrir fiche mission avec plusieurs pharmacies → Network tab : **1** requête contacts batch (pas N)
- [ ] **Matching IA** : mission avec candidats → lancer scoring (mock ou OpenRouter) → résultats affichés ; éligibles > 20 → section « non scorés » visible
- [ ] **Matching geo** : mission + pharmacie CP valide ; simuler échec geo (mock) → aucun candidat eligible par distance seule
- [ ] **Kanban candidats** : drag → refresh page → état cohérent avec serveur
- [ ] **CV double upload** : deux fichiers rapides → review correspond au dernier fichier
- [ ] **Error boundary** : provoquer erreur React sur page dashboard → UI recovery affichée

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-123
pnpm install   # première fois uniquement
pnpm typecheck && pnpm lint && pnpm lint:lines && pnpm test
pnpm dev
# Ouvrir http://localhost:3000/missions — fiche détail + onglet matching
```

---

## Fichiers impactés (index)

| Domaine | Fichiers |
|---------|----------|
| Upload / sécurité | `lib/upload-base64.ts`, `document.schema.ts`, `candidate-cv.schema.ts`, routers document/cv |
| Admin | `admin/user.ts`, `admin/user.test.ts` |
| Contacts batch | `contact.repository.ts`, `contact.ts`, `contact-by-pharmacy.ts`, `missions/[id]/page.tsx` |
| Matching IA | `matching.schema.ts`, `matching-prompt.ts`, `prefilter.ts`, `matching-score.ts`, `mission-matching-map.ts`, `exclusion-reasons.ts` |
| Scalabilité | `search-pool.ts`, `candidate-search.repo.ts`, `contact-search.repo.ts`, `candidate.repository.ts`, `mission-candidate.repository.ts` |
| DRY listes | `candidate.ts`, `mission.ts`, pages kanban, `mission-detail-referentials.ts`, `contact.ts` |
| Client | `use-synced-rows.ts`, 3 kanbans, `use-candidate-cv-review-state.ts`, `DocumentUploadForm.tsx` |
| Infra | `distance.ts`, `router-errors.ts`, `error.tsx`, `list-limits.ts`, selects mission/pharmacy |

---

## Ordre d'exécution recommandé (résumé)

```
A1 → A2 → A3 → A4   (sécurité + critical)
B1 → B2 → B3 → B4   (matching prod)
C1 → C2 → C3 → C4 → C5 → C6   (perf + DRY)
D1 → D2 → D3 → D4 → D5 → D6   (bugs client)
E1 → E2 → E3        (polish)
F1 → F2             (stretch)
```

**Estimation** : Phases A–E = 1–2 sessions agent ; Phase F optionnelle.
