# Handoff — Issue #347 (Nav Pilotage / Placements / Intérim)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés, pas recochés user.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/347
- Parent : PRD #345 · `docs/PRD_FACTURATION_PILOTAGE_V1.md` · ADR `docs/adr/0017`, `0019`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/354 → `dev`
- Branche : `feat/issue-347-facturation-nav-placements` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Pilotage, Placement, Exercice, Ligne de suivi)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_347.md`
- Next : #349 (Pilotage KPIs, blocked by #346+#347) · #352 (Intérim par pharmacie, blocked by #347) · #348 parallèle (Objectifs Admin)

## Livré (produit)

Facturation sub-nav : **Vue d’ensemble | Pilotage | Placements | Intérim**. Suivi retiré.

- `/facturation/suivi` et `/facturation/nouvelle-ligne` → Placements
- Placements / Intérim = **Lignes only** (pas Devis orphelins). JobTitle depuis Candidate
- Filtres (recherche, mois, CDD/CDI, pharmacie, Referent, Actifs par défaut) + totaux filtrés + CSV
- CTA : Nouveau Placement / Nouvelle mission (kind locké). Générer devis depuis la ligne inchangé
- Pilotage : coquille Exercice (courant + suivant + Tous) + Referent, corps vide
- Recruteur / Communication `FORBIDDEN` (`finance.view`). Accueil inchangé. KPI Vue d’ensemble → `/facturation?etat=`

## Décisions (session)

| Sujet | Choix |
|-------|-------|
| Grill | Interdit — spec #345 |
| Listes | Lignes only, pas union Devis |
| Vue pharmacie Intérim | #352 |
| Corps Pilotage | Vide OK — math = #349 |
| KPI hrefs | Vue d’ensemble, plus Suivi |

## Pièges

- `listSuivi` encore là (tests create/cancel/devis). UI utilise `listLines`
- `pnpm test` : ~10 `*.integration.test.ts` KO = Testcontainers / pas de Docker. Unrelated. CI `quality` vert
- Filtre Statut défaut = **Actifs**. `ALL` = Tous. Spread URL : `annulation` vide → garder défaut Actifs (`readFacturationLinesFilters`)
- Contrat CDD/CDI aussi sur onglet Intérim (même config) — map ignore si kind ≠ Placement
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [ ] Direction : 4 onglets ; Suivi absent
- [ ] `/facturation/suivi` → Placements
- [ ] Nouveau Placement / Nouvelle mission
- [ ] CSV liste filtrée
- [ ] Recruteur : pas Facturation (couvert tests caller, pas UI)

## Suite

1. Merge #354 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-347-facturation-nav-placements`
3. Next agent : #349 ou #352 ou #348 depuis `origin/dev`

## Suggested skills

- `/caveman`
- `/tdd`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_349.md` (KPIs) ou `PROMPT_ISSUE_352.md` (Intérim client) ou `PROMPT_ISSUE_348.md` (Objectifs)
