# Prompt — Issue #390

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/390  
**Parent** : audit Intérim post-#377 (PRD #365 déjà mergé)  
**Blocked by** : #377  
**Slug branche** : `fix/issue-390-interim-audit-dry`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Dettes qualité / DRY. Pas de nouvelle feature Intérim.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#377`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b fix/issue-390-interim-audit-dry origin/dev
```

---

## Périmètre

Quatre dettes audit Intérim (règles projet) :

1. `prisma.jobTitle.findFirst` hors repositories → `jobTitleRepository.findIdByNameInsensitive`
2. Stub `cycleDeps` recopié 7 fois → `stubCycleDeps`
3. Assertions `as` sur accept Profils app → `CandidateProfileUpdate`
4. Boucle search → upsert dupliquée missions/contrats → `syncPagedRead`

### Acceptance criteria

- [x] Prisma JobTitle uniquement dans repositories
- [x] Un helper de stub cycle
- [x] Accept Profils app sans `as never` / `as CandidateCreateInput`
- [x] Missions et contrats partagent `syncPagedRead`
- [x] Fichiers < 100 lignes, zéro `any`

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- **Interdit : `git worktree`**
- Pas de login Badakan cache, pas de parallélisation GET (hors slice)

Vocabulaire : Badakan contract ≠ Ligne de suivi. ADR 0030.

## Fichiers impactés

- `apps/web/src/server/db/repositories/job-title.repository.ts`
- `apps/web/src/server/routers/app-profile.deps.ts`
- `apps/web/src/server/app-profile/run-cycle.test-deps.ts`
- `apps/web/src/server/app-profile/accept.ts`
- `apps/web/src/server/badakan/sync-paged-read.ts`
- `apps/web/src/server/badakan-mission/sync.ts`
- `apps/web/src/server/badakan-contract/sync.ts`

---

## Fin

PR vers `dev` avec `Closes #390`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm --filter web exec tsc --noEmit
pnpm lint:lines
pnpm dev
```

## Tests manuels

- [ ] Intérim : listes missions / contrats / officines inchangées
- [ ] Profils app : accept d’un pending → candidat créé (job title match)
- [ ] Cron Profils app : cycle sans erreur Prisma hors repo
