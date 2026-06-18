# Handoff — Issue #52 (Schéma Prisma V2 + seeds + repositories + Testcontainers)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert.** Schéma V2 complet, migration initiale, seeds idempotents, couche repositories, tests Testcontainers.

- Branche : `feat/issue-52-prisma-schema-seeds-repos`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-52`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/52
- Prompt : `docs/prompts/PROMPT_ISSUE_052.md`
- Spec : `SPEC_V2.md` §3 (modèle) + §10 (seeds/matrice) · ADR 0005, 0007, 0009

## Livré (voir diff PR)

- `apps/web/prisma/schema.prisma` — schéma complet SPEC §3.2 (11 enums, MissionCandidate PK composite, JobOffer 1:1 Mission, `deletedAt` × 7, `@@index` ciblés)
- `apps/web/prisma/migrations/20260618091824_init/` — migration initiale
- `apps/web/prisma/seed.ts` + `seed-data.ts` — idempotent (upsert) : 6 PipelineStage, 8 Software, 5 JobTitle, 10 lignes `JobTitleCompatibility`
- `apps/web/src/server/db/repositories/` — 10 repos (factory `make*(db)` + singleton), filtre `NOT_DELETED` partagé (`soft-delete.ts`)
- `apps/web/src/server/db/repositories/client.ts` — singleton Prisma **déplacé** ici (était `server/db/client.ts`) → zéro import Prisma hors `repositories/`
- `apps/web/test/db.ts` — harness Testcontainers (hors `src` pour ne pas polluer le grep + lint:lines)
- 6 `*.integration.test.ts` (core : Candidate, Pharmacy, Contact, Mission, JobOffer, Application) → create / list / softDelete

## Décisions / pièges (pour la suite)

- **Ryuk désactivé** dans le harness (`TESTCONTAINERS_RYUK_DISABLED ??= 'true'`) — le pull de l'image reaper hangait ; containers stoppés explicitement en `afterAll`.
- `pnpm-workspace.yaml` : `cpu-features` / `protobufjs` / `ssh2` → `false` (deps natives optionnelles de testcontainers ; sinon `pnpm install` exit 1).
- `Candidate` a reçu les relations inverses `documents` / `applications` (absentes du SPEC mais requises par Prisma pour `Document` / `Application`).
- `.env.example` vit dans `apps/web/` (là où Prisma lit `.env`). Scripts `db:migrate` / `db:seed` sur `apps/web` → lancer via `pnpm --filter web …` **sans** `DATABASE_URL` exporté dans le shell (un export override le `.env`).
- Config seed via `package.json#prisma.seed` → **deprecated Prisma 7** ; migrer vers `prisma.config.ts` quand on bumpera.
- Repos = factory injectable `make*(db)` pour la testabilité ; `*Repository` singleton pour l'app (RSC/routers).

## Tests manuels effectués

- `pnpm db:seed` ×2 → counts stables 6/8/5/10 (idempotent) ✓
- migrate + seed appliqués sur Neon (DB du client) ✓
- `grep -r "@prisma/client" apps/web/src` → uniquement `repositories/` ✓
- `pnpm test` (20, dont 12 intégration) · `lint` · `typecheck` · `lint:lines` → vert ✓

## Dette / hors scope

- CI : les tests intégration exigent Docker sur le runner (GitHub Actions le fournit, mais run plus lent).
- `prisma.config.ts` à introduire avant Prisma 7.
- Pas de `directUrl` Neon configuré (migrate passe via l'endpoint pooled fourni ; si souci futur, ajouter `directUrl`).

## Suite

- #53 auth NextAuth v5 (consommera `repositories/client.ts` + modèles Account/Session/User)
- #51 page `/design-system` (conflit git possible — ne pas toucher UI ici, déjà respecté)

## Suggested skills

- `/caveman` + `/tdd` pour toute issue
- Plugin Prisma (skills `prisma-cli-*`, `prisma-client-api-*`) pour le travail DB
