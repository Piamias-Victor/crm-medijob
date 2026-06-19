# Prompt — Issue #108

**Titre** : [FIX] Audit codebase v4 — upload Blob, RSC reads, limites, view-models  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/108 _(à créer)_  
**Parent** : #19 (remédiation audit)  
**Blocked by** : #104, #105 _(si non mergés — sinon ignorer)_ · **Débloque** : —

**Source audit** : audit `/audit-codebase` sur `dev` (2026-06-19) — **19 findings** (4 High · 8 Medium · 7 Low)

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `CLAUDE.md`, `CONTEXT.md` (§ auth / visibilité recruteurs), les fichiers listés dans « Fichiers impactés ».

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. Si #104–#107 mergés : lire les handoffs correspondants dans `docs/handoffs/`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-108 -b fix/issue-108-audit-v4 origin/dev
cd ../crm-medijob-issue-108
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Remédiation complète des findings de l'audit codebase v4. **Pas de nouvelles features backlog** (#66–#80).

> **Note domaine** : tous les recruteurs voient tous les enregistrements (`CONTEXT.md`). Pas d'authz par entité — seulement `protectedProcedure` + admin pour `/admin`.

---

### Phase 1 — High (bloquant qualité / architecture)

| ID | Problème | Solution attendue |
|----|----------|-------------------|
| **H1** | Upload Blob **avant** `document.create` → orphelin si FK/DB échoue | Persister d'abord ou compenser : `try/catch` + `deleteBlob` si `create` échoue ; test router |
| **H2** | `MissionInfoForm` lit `contact.listByPharmacy` via `useQuery` (violation RSC) | Précharger contacts dans la page RSC mission `[id]` ; passer en prop ; invalider via `router.refresh()` au changement pharmacie |
| **H3** | `EntityActivityLogTab` refetch `activityLog.listByEntity` via `useQuery` | Filtrer **côté client** sur `initialLogs` (types déjà en row) ; supprimer `useQuery` |
| **H4** | `pharmacy.repository` `detailInclude.missions` sans `take` | Ajouter `take` (ex. `DEFAULT_LIST_LIMIT` ou constante dédiée `DETAIL_MISSIONS_LIMIT`) ; test integration |

### Phase 2 — Medium (sécurité, scalabilité, règles projet)

| ID | Problème | Solution attendue |
|----|----------|-------------------|
| **M1** | `document-upload.ts` accepte `application/octet-stream` si extension OK | Rejeter `octet-stream` sauf cas testés ; test `evil.pdf` + octet-stream → false |
| **M2** | `AUTH_SECRET` non validé au boot | Schéma Zod env (`src/server/env.ts` ou existant) ; fail-fast si absent en prod |
| **M3** | `contact.repository.listByPharmacy` sans `take` | `take: limit` param default `DEFAULT_LIST_LIMIT` |
| **M4** | `candidateProfileInclude.missions` sans limite | `take` sur relation missions ; test integration si possible |
| **M5** | `DocumentUploadForm` sans RHF + Zod | Schéma `document-upload.schema.ts` ; `useForm` + `zodResolver` ; garder UX actuelle |
| **M6** | `document-list.ts` : `DocumentRecord = Document` (Prisma) | Type domaine explicite ; mapper dans repository ou view-model |
| **M7** | `activity-log.schema.ts` importe enums `@prisma/client` | Déplacer vers `view-models/activity-log.types.ts` ou `lib/constants/activity-types.ts` |
| **M8** | `document.delete` : DB puis Blob — Blob orphelin si `deleteBlob` échoue | Supprimer Blob avant DB, ou log + retry documenté ; test unitaire mock échec Blob |

### Phase 3 — Low (dette, polish)

| ID | Problème | Solution attendue |
|----|----------|-------------------|
| **L1** | `job-offer.repository.list()` et `application.repository.list()` morts, sans `take` | Supprimer ou rediriger vers méthodes bornées ; grep usages |
| **L2** | `entityFilter` / `entityData` dupliqués document + activity-log | Extraire `server/db/repositories/entity-scope.ts` (< 100 lignes) |
| **L3** | `DEFAULT_LIST_LIMIT = 500` élevé | Documenter dans `list-limits.ts` ou abaisser si pagination UI absente — **ne pas casser les listes** sans vérifier |
| **L4** | Pas de `loading.tsx` sur pages liste | Ajouter skeleton sur `pharmacies`, `contacts`, `missions`, `candidats` (réutiliser `EntityDetailSkeleton` ou atom existant) |
| **L5** | `MissionKanban.tsx` importe `MissionStatus` depuis Prisma | Type depuis `view-models/mission-kanban.types.ts` |
| **L6** | `surface-glass.ts` : couleurs hardcodées hors tokens | Migrer vers variables CSS `--color-*` si tokens existants ; sinon ADR court ou commentaire + issue follow-up |

### Exclu — hors scope audit v4

| Sujet | Raison |
|-------|--------|
| Features backlog #66–#80 | Issues dédiées |
| IDOR inter-recruteurs | By design (`CONTEXT.md`) |
| `assistant.searchEntities` / `searchSiret` en client fetch | Recherche interactive — acceptable ; ne pas toucher sauf si trivial |

---

### Critères d'acceptation

- [ ] `pnpm typecheck` — 0 erreur
- [ ] `pnpm lint` — 0 erreur
- [ ] `pnpm lint:lines` — tous fichiers < 100 lignes
- [ ] `pnpm test` — verts (unit) ; integration Docker : skip gracieux **ou** job CI séparé documenté
- [ ] Upload document : échec DB simulé → pas de Blob orphelin (test mock)
- [ ] `MissionInfoForm` : plus de `trpc.*.useQuery` pour contacts
- [ ] `EntityActivityLogTab` : filtre type sans refetch réseau
- [ ] Fiche pharmacie : missions nested bornées
- [ ] `DocumentUploadForm` : RHF + Zod
- [ ] Plus d'import runtime `@prisma/client` dans view-models/schemas UI ciblés (M6, M7, L5)
- [ ] `listByPharmacy` et `candidateProfileInclude.missions` bornés

---

## Fichiers impactés

### Phase 1 — High

- `server/routers/document.ts` — ordre upload/create + rollback Blob (H1, M8)
- `server/routers/document.test.ts` — test échec create après upload (H1)
- `components/molecules/MissionInfoForm.tsx` — retirer `useQuery` (H2)
- `app/(dashboard)/missions/[id]/page.tsx` — précharger contacts par pharmacie (H2)
- `components/organisms/MissionDetailPage.tsx` — passer contacts en prop (H2)
- `components/molecules/EntityActivityLogTab.tsx` — filtre client (H3)
- `server/db/repositories/pharmacy.repository.ts` — `take` sur missions (H4)

### Phase 2 — Medium

- `lib/document-upload.ts` + `lib/document-upload.test.ts` — M1
- `server/auth/config.ts` + `server/env.ts` (ou équivalent) — M2
- `server/db/repositories/contact.repository.ts` — M3
- `server/db/repositories/candidate-profile.repository.ts` — M4
- `components/molecules/DocumentUploadForm.tsx` — M5
- `view-models/document-upload.schema.ts` _(nouveau)_ — M5
- `view-models/document-list.ts` — M6
- `view-models/activity-log.schema.ts` + `view-models/activity-log.types.ts` — M7

### Phase 3 — Low

- `server/db/repositories/job-offer.repository.ts` — L1
- `server/db/repositories/application.repository.ts` — L1
- `server/db/repositories/entity-scope.ts` _(nouveau)_ — L2
- `server/db/repositories/document.repository.ts` — L2
- `server/db/repositories/activity-log.repository.ts` — L2
- `lib/list-limits.ts` — L3
- `app/(dashboard)/pharmacies/loading.tsx` _(nouveau)_ — L4
- `app/(dashboard)/contacts/loading.tsx` _(nouveau)_ — L4
- `app/(dashboard)/missions/loading.tsx` _(nouveau)_ — L4
- `app/(dashboard)/candidats/loading.tsx` _(nouveau)_ — L4
- `components/organisms/MissionKanban.tsx` — L5
- `lib/constants/surface-glass.ts` — L6

### Tests integration Docker (M9 — optionnel dans cette issue)

- `test/db.ts` — détecter Docker ; `describe.skipIf(!hasDocker)` sur suites integration
- `package.json` — scripts `test:unit` / `test:integration` si split utile

---

## Contraintes

- Prisma **uniquement** dans `server/db/repositories/`
- RSC + `createCaller` pour lectures initiales ; mutations `trpc.useMutation()` en Client Components
- Fichiers **< 100 lignes** — splitter immédiatement si dépassement
- Zéro `any` ; React Hook Form + Zod pour **tous** les formulaires
- View-models = pont DB → UI ; pas de types Prisma exportés tels quels
- TDD : tests routers/repos **avant** implémentation sur H1, M1, M3, M4, M8

---

## Ordre d'exécution recommandé

1. **H1 + M8** — saga document (tests d'abord)
2. **H3** — filtre ActivityLog client (rapide, débloque règle RSC)
3. **H2** — contacts mission via RSC
4. **H4, M3, M4** — limites repositories
5. **M1, M5, M6, M7** — upload + view-models
6. **M2** — env validation
7. **L1–L6** — polish

---

## Fin de session

Sur demande : `docs/handoffs/HANDOFF_ISSUE_108.md` + push + PR `Closes #108`.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-108
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm typecheck && pnpm lint && pnpm lint:lines && pnpm test
pnpm dev
```

---

## Tests manuels

- [ ] Login → `/missions/{id}` → modifier pharmacie → liste contacts mise à jour sans erreur console
- [ ] `/pharmacies/{id}` → onglet Historique → cocher filtre type → timeline filtrée **sans** spinner réseau visible
- [ ] `/pharmacies/{id}` → onglet Documents → upload PDF valide → liste → suppression → confirm
- [ ] Upload fichier `.exe` renommé `.pdf` avec mime octet-stream → rejet côté UI et API
- [ ] `/pharmacies`, `/contacts`, `/missions`, `/candidats` → navigation → skeleton `loading.tsx` visible brièvement
- [ ] `pnpm typecheck && pnpm test` exit 0
