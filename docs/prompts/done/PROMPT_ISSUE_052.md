# Prompt — Issue #52

**Titre** : [FONDATIONS] Schéma Prisma V2 + seeds + repositories + Testcontainers  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/52  
**Parent** : #19  
**Blocked by** : #50 · **Débloque** : #53, #73 (matrice)

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_050.md`, `SPEC_V2.md` §3 + §10, `docs/PRD.md` (schéma), issue #52, ADR 0005, 0007, 0009.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_050.md` (stub Prisma actuel, scripts pnpm)
3. Créer le worktree (travailler **exclusivement** dedans) :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-52 -b feat/issue-52-prisma-schema-seeds-repos origin/dev
cd ../crm-medijob-issue-52
```

---

## Périmètre

Schéma Prisma V2 complet, migration initiale, seeds, couche `server/db/repositories/`, tests Testcontainers. **Prisma jamais hors repositories.**

**Seeds obligatoires** :

- PipelineStage × 6 : Nouveau, Contacté, Entretien, Proposition, Placé, Pas retenu
- Software × 8 (LGO courants)
- JobTitle × 5 + matrice compatibilité (SPEC_V2 §10.843–851)

`deletedAt` sur User, Candidate, Pharmacy, Contact, Mission, JobOffer, Application.

**Hors périmètre** : auth (#53), UI métier, page design-system (#51).

**US** : #4, #79, #84 · **ADR** : 0005 (PipelineStage libres), 0007 (soft delete), 0009 (JobTitle + matrice)

### Critères d'acceptation

- [ ] Schéma = SPEC_V2 §3.2 (MissionCandidate PK composite, JobOffer 1:1 Mission, Contact → 1 Pharmacy…)
- [ ] `prisma migrate dev` + seed idempotent (`pnpm db:seed`)
- [ ] Repository par agrégat ; filtres `deletedAt` sur toutes les lectures
- [ ] Testcontainers : ≥1 test intégration par repo core (create, list, softDelete)
- [ ] Zéro import Prisma hors `repositories/`
- [ ] Enums complets (MissionStatus × 6, ApplicationStatus, JobOfferStatus, ContractType…)

---

## Fichiers impactés

Remplacer/étendre le stub #50 :

- `apps/web/prisma/schema.prisma` — schéma complet
- `apps/web/prisma/migrations/*` — migration initiale
- `apps/web/prisma/seed.ts` — seeds référentiels
- `apps/web/src/server/db/repositories/*` — un fichier par agrégat
- `apps/web/src/server/db/repositories/*.integration.test.ts` — Testcontainers
- `apps/web/package.json` — scripts `db:migrate`, `db:seed`, deps testcontainers
- `.env.example` — `DATABASE_URL`

**Conflit git possible avec #51** — ne pas toucher `app/design-system/` ni composants UI.

---

## Contraintes

Voir `CLAUDE.md` : repositories seuls accèdent à Prisma, fichiers < 100 lignes, zéro `any`.

Handoff #50 : `pnpm-workspace.yaml` → `allowBuilds:` pour scripts natifs ; pinnings Next 15.5.19.

---

## Fin de session

**Uniquement quand l'utilisateur le demande** :

1. Si `/handoff` : `docs/handoffs/HANDOFF_ISSUE_052.md` commité **avec le code**
2. Push : `git push -u origin feat/issue-52-prisma-schema-seeds-repos`
3. PR vers `dev` avec `Closes #52`

**En fin de message** (prêt à tester) : donner le bloc « Commande de test » copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-52
pnpm install   # première fois uniquement
cp .env.example .env   # renseigner DATABASE_URL (Neon local ou docker)
pnpm db:migrate
pnpm db:seed
pnpm exec prisma studio   # optionnel — vérifier seeds
```

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] `pnpm db:seed` → 6 PipelineStages, 8 Software, 5 JobTitles, lignes matrice
- [ ] Prisma Studio : relations MissionCandidate, JobOffer↔Mission OK
- [ ] Test intégration : create Candidate → list → softDelete → absent des listes
- [ ] `grep -r "@prisma/client" apps/web/src` → uniquement dans `repositories/`
- [ ] `pnpm test && pnpm lint && pnpm typecheck` → vert
