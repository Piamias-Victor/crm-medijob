# Handoff — Issue #349 (Pilotage KPIs / Exercice / union CA)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés, pas recochés user.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/349
- Parent : PRD #345 · `docs/PRD_FACTURATION_PILOTAGE_V1.md` · ADR `docs/adr/0019`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/356 → `dev`
- Branche : `feat/issue-349-pilotage-kpis-exercice` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Pilotage, Exercice, CA / Marge, Ligne de suivi)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_349.md`
- Next : #350 (jauge NoGo + pôles, blocked by **#348 + #349**) · #351 (Go/NoGo + mensuel) · #352 (Intérim client)

## Livré (produit)

Pilotage rempli : filtres Exercice (oct→sept, défaut courant, + Tous) et Referent déjà #347. Corps :

- 4 KPIs : CA cumulé split CDD/CDI · intérim, Marge brute + % CA, placements actifs, pharmacies actives
- Bandeau rouge lignes annulées : nb + CA + Marge
- Union CA : Lignes + Devis Mission **sans** Ligne liée. Mission liée → lignes only. Ligne sans Mission ne masque pas un Devis
- Recruteur / Communication `FORBIDDEN` (`finance.view`)

Seam : `buildPilotage` (pur). Recharts hors slice.

## Décisions (session)

| Sujet | Choix |
|-------|-------|
| Grill | Interdit — spec #345 |
| Tests | Builder pur + `createCaller`. Pas Recharts |
| Exercice omis | Fenêtre année courante. Tests date-agnostiques passent `{ exercice: 'all' }` |
| Placements actifs | Count Lignes Placement non annulées (pas Devis orphelins) |

## Pièges

- `pnpm test` : ~10 `*.integration.test.ts` KO = Testcontainers / pas de Docker. Unrelated. CI `quality` à vérifier avant merge
- `listSuivi` encore là (tests create/cancel/devis). UI listes = `listLines`. Pilotage = union
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [ ] Direction : Pilotage, Exercice 25/26 → 4 tuiles + split CA
- [ ] Annuler une ligne → KPI actifs baissent, bandeau rouge +1
- [ ] Devis accepté sans Ligne : CA dans Pilotage, pas dans Placements
- [ ] Recruteur : pas Facturation (couvert tests caller, pas UI)

## Suite

1. Merge #356 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-349-pilotage-kpis-exercice`
3. Next agent : #350 depuis `origin/dev` (besoin #348+#349)

## Suggested skills

- `/caveman`
- `/tdd`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_350.md`
