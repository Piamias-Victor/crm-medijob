# Handoff — Issue #348 (Admin Objectifs Facturation)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés, pas recochés user. CI `quality` + Vercel verts.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/348
- Parent : PRD #345 · `docs/PRD_FACTURATION_PILOTAGE_V1.md` · ADR `docs/adr/0023`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/355 → `dev`
- Branche : `feat/issue-348-admin-objectifs-facturation` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Objectif, Pilotage, Placement)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_348.md`
- Next : #350 (jauge NoGo + pôles, blocked by **#348 + #349**). #349 encore pending.

## Livré (produit)

Admin → **Objectifs**. Cinq montants mensuels : CA/Marge Placement, CA/Marge Intérim, seuil de rentabilité.

- Seed : 20 000 / 20 000 / 30 000 / 10 000 / 15 000 (`DEFAULT_OBJECTIF`, `OBJECTIF_SINGLETON_ID = 'default'`)
- Annuel = ×12 : `annualFromMonthly` dans `apps/web/src/view-models/objectif.ts` (consommé par #350)
- Direction / RH-Admin : `adminProcedure`. Recruteur FORBIDDEN get/save. Layout Admin redirige déjà.
- tRPC `admin.objectif.get` / `save`. Repo Prisma. Form RHF + Zod.

Migration Neon déjà appliquée : `20260824160000_objectif`. Row seedée sur Neon partagée.

## Décisions (session)

| Sujet | Choix |
|-------|-------|
| Grill | Interdit — spec #345 |
| Singleton | `id = 'default'`, pas table parametres |
| Get sans row | Retourne defaults, **pas** d’écriture |
| Seed re-run | `update: {}` — ne reset pas les montants édités |
| Annuel | Helper only, pas de champs DB |

## Pièges

- `pnpm test` : ~10 `*.integration.test.ts` KO = Testcontainers / pas de Docker. Unrelated. CI `quality` vert
- `get()` sans table → Prisma throw. Table + seed Neon OK. Preview = `migrate deploy`
- Recruteur : pas d’item Admin du tout (`can(role, 'admin')`), pas seulement Objectifs
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [ ] Direction : Admin → Objectifs : 20 000 / 20 000 / 30 000 / 10 000 / 15 000
- [ ] Modifier le CA Placement mensuel → enregistrement OK
- [ ] Recruteur : pas d’Admin Objectifs

## Suite

1. Merge #355 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-348-admin-objectifs-facturation`
3. Next agent : #349 (KPIs, blocked by #346+#347) puis #350 (besoin #348+#349)

## Suggested skills

- `/caveman`
- `/tdd`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_349.md` puis `PROMPT_ISSUE_350.md`
