# Handoff — Issue #352 (Intérim vue par client)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés, pas recochés user. CI `quality` + Vercel verts.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/352
- Parent : PRD #345 · `docs/PRD_FACTURATION_PILOTAGE_V1.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/359 → `dev`
- Branche : `feat/issue-352-interim-vue-client` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Ligne de suivi, Intérim, Pharmacy)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_352.md`
- Next : enfants #346–#352 du PRD #345 livrés. Parent #345 reste doc. Autres prompts `pending/` hors epic.

## Livré (produit)

Onglet `/facturation/interim` :

- Toggle **Vue par client** (défaut) / **Toutes les missions** — mêmes filtres mois / Referent / liste
- Agrégats Pharmacy : missions, heures, CA, Marge, CA/h, Marge/h, dernière date. Tri CA desc. Heures 0 → taux 0
- Liste missions inchangée (CSV + création + actions ligne)
- Recruteur / Communication `FORBIDDEN` sur `listLines` (Placement **et** Intérim)

Seam : `buildInterimPharmacyAggregates(rows)` — tests view-model, pas pixels.

## Décisions (session)

| Sujet | Choix |
|-------|-------|
| Grill | Interdit — spec #345 |
| Heures | déjà sur Ligne ; mappées `toFinanceLineSuiviRow` → `FacturationSuiviRow.hours` |
| Agrégat | client-side sur lignes déjà filtrées. Pas de query tRPC neuve |
| Vue défaut | `client` |
| CSV | toujours les lignes filtrées, pas les agrégats Pharmacy |

## Pièges

- `pnpm test` : ~10 `*.integration.test.ts` KO = Testcontainers / pas de Docker. Unrelated
- Filtre contrat CDD/CDI visible Intérim — map ignore si `kind !== PLACEMENT` (dette #347)
- Pas de browser tool. Manuels à recocher
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [ ] Intérim → Vue par client : pharmacies triées, totaux heures/CA
- [ ] Toggle Toutes les missions → liste lignes
- [ ] Filtre mois → les deux vues se recoupent

## Suite

1. Merge #359 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-352-interim-vue-client`
3. Next agent : hors epic Facturation Pilotage, ou clôturer #345 doc

## Suggested skills

- `/caveman`
- `/tdd`
