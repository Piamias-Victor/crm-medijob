# Handoff — Issue #350 (Pilotage jauge NoGo + pôles + graphes)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés, pas recochés user. Vercel vert. CI `quality` à confirmer au merge.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/350
- Parent : PRD #345 · `docs/PRD_FACTURATION_PILOTAGE_V1.md` · ADR `docs/adr/0020`, `docs/adr/0023`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/357 → `dev`
- Branche : `feat/issue-350-pilotage-nogo-poles-charts` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (NoGo, Objectif, Placement, Pilotage)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_350.md`
- Next : #351 (Go/NoGo + mensuel + matrice, blocked by **#350**) · #352 (Intérim par pharmacie)

## Livré (produit)

Pilotage enrichi (KPIs #349 inchangés) :

- Jauge CDD/CDI vs cap annuel Placement = `annualFromMonthly(objectif.monthlyCaPlacement)` (défaut 20k×12 = 240k)
- Réalisé = CA Placement non-NoGo ; Potentiel = Réalisé + CA perdu projeté ; Reste à faire = cap − Réalisé
- NoGo = Placement **annulé** ou **CA 0 et Marge 0**. Intérim **jamais** NoGo
- CA perdu = nb NoGo × moyenne CA facturé **du même type** (CDI vs CDD). Type sans facturé → perdu 0
- Cards pôles Placement / Intérim : toggle Mois / Annuel + select mois (défaut mois courant si dans l’Exercice)
- Graphes ComposedChart : CA empilé CDD/CDI+Intérim + Objectif mensuel agence + cumul ; Marge vs seuil + cumul vs 12×. 12 mois Oct→Sep, zéros inclus

Seam : `buildPilotage(lines, missions, filters, now, objectif)`. Adapter charge `objectifRepository.get()`. Tests = chiffres view-model, pas pixels Recharts.

## Décisions (session)

| Sujet | Choix |
|-------|-------|
| Grill | Interdit — spec #345 |
| Signature | `now` reste 4e arg ; `objectif` = 5e (défaut `DEFAULT_OBJECTIF`) |
| Charts | Dérivés des buckets pôles (DRY), pas un 2e scan |
| Mois UI | `useState` local ; remount via `key={pilotage.months.join(',')}` |
| Exercice Tous | `months=[]` → graphes vides ; annuel pôles encore OK |

## Pièges

- `pnpm test` : ~10 `*.integration.test.ts` KO = Testcontainers / pas de Docker. Unrelated
- `EMPTY_PILOTAGE` a maintenant `gauge` / `poles` / `charts` — mocks caller OK via spread
- Cap **pas** hardcodé 240k : Admin Objectifs. Preview = seed/migrate Objectif déjà #348
- Jauge n’a pas été cliquée (pas de browser tool). Manuels à recocher
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [ ] Jauge : Réalisé % = CA Placement facturé / (20k×12)
- [ ] Une ligne CDI 0 € → NoGo, potentiel monte
- [ ] Card Intérim mois courant vs 30 000 € CA
- [ ] Graphes : 12 mois Oct→Sep

## Suite

1. Merge #357 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-350-pilotage-nogo-poles-charts`
3. Next agent : #351 depuis `origin/dev`

## Suggested skills

- `/caveman`
- `/tdd`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_351.md`
