# Handoff — Issue #362 (QA Pilotage Objectifs par pôle)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** QA locale recochée par l’user (doublon + mois). CI à confirmer au merge.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/362
- Parent : PRD #345 · `docs/PRD_FACTURATION_PILOTAGE_V1.md` · ADR `docs/adr/0020`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/363 → `dev`
- Branche : `fix/issue-362-pilotage-poles-ui` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Exercice, Objectif, Placement, Pilotage)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_362.md`
- Next : reste #345 ouverte (PRD parent). Pas de slice enfant pending Facturation.

## Livré

`/facturation/pilotage` :

- Tiles KPI Pilotage empilées (`PilotageStatTile`) — titres complets
- Contrôles pôles dans le body (plus le header `overflow-hidden`) : PillTabs + **Combobox**
- Caption carte = « Août 2026 » ou « Annuel »
- Exercice **Tous** : `uniqueFacturationMonthKeys` sur les `occurredAt` filtrés — mode Mois a des buckets
- Clés React `poles-…` / `monthly-…` — plus de doublon Objectifs par pôle

Seam inchangé : `buildPilotage(lines, missions, filters, now, objectif)`.

## Décisions

| Sujet | Choix |
|-------|--------|
| Titres KPI | Tiles Pilotage dédiées — ne pas casser Accueil `HomeStatTile` |
| Sélecteur mois | Combobox portail, pas `<select>` |
| Exercice Tous | mois = clés uniques triées des lignes (plus `months=[]`) |
| Doublon UI | collision `key={pilotage.months.join(',')}` Poles + Monthly |

**Invalide** la note handoff #350 / #351 « Tous → `months=[]` graphes/pôles vides ». Tous a maintenant des mois.

## Pièges

- `pnpm test` : ~10 `*.integration.test.ts` KO = Testcontainers / pas de Docker. Unrelated
- Prisma Client `objectif` : `pnpm exec prisma generate` + restart `pnpm dev` si `findUnique` undefined
- Mode Mois 0 € avec Annuel OK = buckets vides (était Tous) **ou** mois sans lignes
- Fichiers < 100 lignes. **Jamais `git worktree`.**

## Tests manuels

- [x] Une seule section Objectifs par pôle (user)
- [x] Pastilles Mois / Annuel (user — Annuel OK ; Mois fixé via buckets Tous)
- [ ] Combobox mois + Exercice 25/26 vs Tous à revoir sur preview après merge
- [ ] Titres KPI CA cumulé / Marge brute

## Suite

1. Merge PR → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d fix/issue-362-pilotage-poles-ui`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next : issues non-Facturation (#315, #321, #226…) ou clôturer #345 si le port Pilotage est complet

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)
