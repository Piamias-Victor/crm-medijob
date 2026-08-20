# Handoff — Issue #326 (Devis DRAFT on Mission)

## État

**Code livré · merge `dev` demandé par l’user.** QA UI : Type combobox + heures/taux/HT liés + save toast. Tests manuels initiaux (Calculer INTERIM) **obsolètes** — le bouton Calculer a été retiré.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/326
- Parent : PRD #325 · `docs/PRD_FINANCE_DEVIS_V1.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_326.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/332
- Branche : `feat/issue-326-devis-draft-engine` — **repo `medijob` only, jamais `git worktree`**
- Règles : `docs/prompt-rules.md`, `docs/github-rules.md`, `CLAUDE.md`

## Livré

Onglet Mission **Devis** (après Offre) : brouillon SQL `Devis` (colonnes, pas de JSON blob). Save `devis.save`. Marge sur `Mission.marge` (tous les rôles). Recruteur : HT/TTC + Marge, **pas de CA**.

Moteur : `hours × rate` + TVA 20% (`apps/web/src/lib/finance/calculate-interim-libre.ts`). Fixture historique : `151.67 h × 28 €` → HT `4246.76`, TTC `5096.11`.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Snapshot | Colonnes SQL (`kind`, `status`, heures, taux, HT/TTC, `htSource`) — **pas** JSON `inputs` |
| UI | Nouvel onglet Mission **Devis**, pas une carte Infos |
| Engine | Simple `hours × rate` + TVA 20% — **pas** WeTransfer `engine.js` |
| Marge | **Tous les rôles** voient et éditent (y compris Recruteur). CA toujours masqué. Facturation globale plus tard (#329–#330, `finance.view`) |
| Type | Combobox custom (`DevisKindField`) — pas `<select>` |
| Calcul | Live : heures+taux → HT ; heures+HT → taux. Plus de bouton Calculer. Tous kinds (CDI/CDD/INTERIM) |
| Git | **Interdit `git worktree`.** Une branche à la fois dans `/Users/victorpiamias/Desktop/Dev/ia/medijob` |

## Pièges

- **Neon / migrate** : la base a `20260819140000_application_board_submission_id` (#231) absente de cette branche. `prisma migrate dev` propose un **reset** → **ne pas reset** (13 missions). Devis + `Mission.marge` appliqués via `prisma db execute` + `migrate resolve --applied`. Pour tester : `pnpm dev` seulement.
- Save silencieux : HT `NaN` → Zod bloquait sans toast. Fix : `parseAmount` (`NaN`/`''` → `null`). Toast succès = `Devis enregistré`.
- Prisma uniquement dans `apps/web/src/server/db/repositories/devis.repository.ts`. Router : `makeDevisRouter`.
- Glossaire : Devis ≠ Document ≠ ActivityLog DEVIS.
- Fichiers < 100 lignes. **Jamais** `git worktree`.
- WIP #231 stashé dans `medijob` : `wip issue-231 before checkout feat/issue-326`. Restaurer seulement après checkout de la branche 231.

## Tests manuels (post-QA)

- [ ] Mission → Devis : Type = combobox. Heures 35 + taux 10 → HT 350 / TTC 420
- [ ] Heures 35 + HT 200 → taux 5,71 / TTC 240. Enregistrer → toast, reload OK
- [ ] Recruteur : Marge éditable ; pas de CA
- [ ] Ne pas lancer `migrate reset`

## Suite

- **#327** Send PDF + Gmail. Prompt : `docs/prompts/pending/PROMPT_ISSUE_327.md`. Briefing obligatoire avant code.
- Puis #328 Accept/CA, #329–#330 Facturation.
- Phase 5 : checkout `dev`, supprimer branche locale. Pas de worktree.

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` au briefing #327 (PDF React-PDF vs jsPDF, Document Mission vs Pharmacy)
