# Prompt — Issue #366

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/366  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : none  
**Slug branche** : `feat/issue-366-interim-foundations`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. Lecture seule Badakan. Nav ≠ `/facturation/interim`.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-366-interim-foundations origin/dev
```

Lire `docs/handoffs/HANDOFF_ISSUE_366.md` s’il existe (sinon continuer).

---

## Périmètre

Socle module Intérim opérationnel : client Badakan lecture (searchEmployees + GET recipient, `fetchFn` injecté), schéma Candidate origine App + `badakanId`, cycle sync = même cron Profils app (pas de bouton Rafraîchir), nav Intérim distincte de Facturation Intérim (pages vides OK). Commiter CONTEXT + ADR 0024–0030 + `docs/PRD_INTERIM_V1.md`.

### Acceptance criteria

- [ ] Client Badakan injecté : lecture `searchEmployees` + GET recipient, tests sans réseau live
- [ ] Aucun POST/PUT/DELETE métier Badakan dans le code livré
- [ ] Cycle périodique existant étendu (même cron / `isCronAuthorized`) — pas de bouton Rafraîchir
- [ ] Nav Intérim visible, distincte de `/facturation/interim`
- [ ] Schéma : Candidate origine App + `badakanId` unique nullable
- [ ] CONTEXT.md + ADR 0024–0030 + `docs/PRD_INTERIM_V1.md` dans la PR
- [ ] Fichiers < 100 lignes, TDD, Prisma seulement dans les repositories

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- RSC lectures / `trpc.useMutation()` client
- RHF + Zod ; atomic design ; view-models
- Zustand = UI seulement
- **Interdit : `git worktree`**

Vocabulaire : App-validated, Candidate origin, Badakan mission ≠ Mission, Ligne de suivi ≠ ce module. ADR 0024.

## Fichiers impactés

- `apps/web/src/server/badakan/client.ts` — lectures v3 injectées
- `apps/web/src/server/app-profile/run-cycle.ts` — même cycle
- `apps/web/src/app/api/cron/app-profiles/route.ts` — cron existant
- `apps/web/src/lib/navigation.ts` — nav Intérim
- `apps/web/prisma/schema.prisma` — origin / badakanId
- `CONTEXT.md` · `docs/adr/0024`–`0030` · `docs/PRD_INTERIM_V1.md`

---

## Fin

PR vers `dev` avec `Closes #366`. Phase 3 : poster commande de test + tests manuels. Handoff seulement si demandé. Phase 5 : supprimer la branche locale après merge.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Recruteur : un item de nav Intérim s’ouvre, distinct de Facturation → Intérim
- [ ] Facturation → Intérim (Lignes de suivi) inchangé
- [ ] `pnpm test` vert ; aucun appel réseau Badakan dans les tests unitaires
