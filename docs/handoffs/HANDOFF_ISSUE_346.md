# Handoff — Issue #346 (Ligne de suivi Referent / NoGo)

## État

**QA user OK (« super ») · `/handoff` + prompt `done` + merge `dev` demandés.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/346
- Parent : PRD #345 · `docs/PRD_FACTURATION_PILOTAGE_V1.md` · ADR `docs/adr/0018`–`0023`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/353 → `dev`
- Branche : `feat/issue-346-ligne-suivi-referent-nogo` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Ligne de suivi, Referent, Encaissé, Placement, NoGo, Annuler ≠ soft delete)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_346.md` (après merge ; plus dans `pending/`)
- Next slice : #347 (`docs/prompts/pending/PROMPT_ISSUE_347.md`) — nav Pilotage / Placements. Blocked by #346.

## Livré (produit)

Facturation → Suivi. Placement : CDD/CDI obligatoire (prérempli Mission). Un Referent Combobox (vide = **Non attribué**). CA ≥ 0. Pastilles Facturé / Encaissé ne bougent ni CA ni date. Annuler / restaurer = statut réversible, ligne visible. Recruteur `FORBIDDEN`.

Tableau : colonnes Dates (Envoyé + Accepté) + HT. **Un bouton Actions** → `GlassModal` (`FinanceLineActionsModal`) : Facturé, Encaissé, Annuler/Restaurer, Générer, Envoyer. Ligne Devis-only : pas de bouton.

Migration Neon déjà appliquée : `20260824120000_finance_line_referent_nogo` (`cancelled`, `invoiced`, `paid`, `referentId`, `placementContractType`).

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Grill | Interdit — décisions #345 |
| Referent | Un User, pas de co-crédit |
| Annuler | Statut, pas soft delete |
| Tableau | Sticky Actions + chips = moche → **un bouton + popup** |
| QA | « super » puis handoff + merge `dev` |

## Pièges

- Neon shared DB had hireflix migration `20260822120000_app_profile_hireflix_invitation` **not on this branch**. `migrate deploy` still applied #346 SQL. **Interdit `prisma migrate reset`.**
- `pnpm test` : ~10 `*.integration.test.ts` KO = Testcontainers / pas de Docker. Unrelated.
- Icon-only + `Button` `px-4` + `size-8` → content width 0 (pas de `tailwind-merge`). Dropdown `<details>` clipé par `overflow-x-auto`. Popup = `GlassModal` portal.
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**
- Hors slice : nav Pilotage/Placements (#347), flag NoGo Pilotage.

## Tests manuels

- [x] Direction : Nouvelle ligne Placement, CA 0, Referent → créée
- [x] Actions popup : Facturé / Encaissé / Annuler (user « super »)
- [ ] Recruteur : pas menu Facturation (non retesté ici)
- [ ] Filtre Statut → Annulés puis Restaurer (non retesté après popup)

## Suite

1. Merge #353 → `dev` (`gh pr merge`, pas de push direct)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-346-ligne-suivi-referent-nogo`
3. Next agent : #347 depuis `origin/dev`

## Suggested skills

- `/caveman`
- `/tdd`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_347.md`
