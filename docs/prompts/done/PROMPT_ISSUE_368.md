# Prompt — Issue #368

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/368  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #366  
**Slug branche** : `feat/issue-368-badakan-missions`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. Badakan mission ≠ Mission CRM. SEARCH_APPLIED ≠ Application.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#366`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-368-badakan-missions origin/dev
```

---

## Périmètre

Liste / détail **Badakan missions** dans le module Intérim : officine, périodes, step, postulés `SEARCH_APPLIED` + tél pour contacter. Pas de Mission CRM, pas de MissionCandidate.

### Acceptance criteria

- [ ] Liste Intérim des Badakan missions (nom officine, dates, step)
- [ ] Détail : recipients SEARCH_APPLIED + moyen de contact
- [ ] Aucune ligne dans le kanban Mission CRM
- [ ] Vocabulaire : Badakan mission ≠ Mission ; SEARCH_APPLIED ≠ Application
- [ ] Lecture seule (`missions/search`)
- [ ] Tests client injecté + UI liste/détail

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- View-models ; zéro logique dans les composants
- **Interdit : `git worktree`** · **interdit write Badakan**

Vocabulaire : Badakan mission, SEARCH_APPLIED, Application. ADR 0027.

## Fichiers impactés

- `apps/web/src/server/badakan/client.ts` — `searchMissions` POST `missions/search`
- `apps/web/src/server/badakan/map-mission.ts` — pharmacy, périodes, step, SEARCH_APPLIED
- `apps/web/src/server/db/repositories/badakan-mission.repository.ts` — persist lecture
- `apps/web/src/server/badakan-mission/sync.ts` — même cycle Profils app
- `apps/web/src/lib/navigation.ts` — sous-nav Missions Badakan
- `apps/web/src/view-models/badakan-mission-list.ts` — cartes liste
- `apps/web/src/view-models/badakan-mission-detail.ts` — détail + tél
- `apps/web/src/app/(dashboard)/interim/missions/` — liste / détail RSC

---

## Fin

PR vers `dev` avec `Closes #368`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Intérim → liste missions Badakan (pas le kanban /missions)
- [ ] Ouvrir une mission : postulés SEARCH_APPLIED + tél si présent
- [ ] Kanban Missions CRM inchangé
