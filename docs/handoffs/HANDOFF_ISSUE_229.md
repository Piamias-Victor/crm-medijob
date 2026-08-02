# Handoff — Issue #229 (JobOffer IA + cycle UI + `/offres`)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-229-job-offers-module`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/229
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/253
- Parent : Epic #210 · CSV V1-048 / V1-049 / V1-051 / V1-052
- Prompt : `docs/prompts/done/PROMPT_ISSUE_229.md` (après ce handoff)
- Bloqué par : #227 (mergé)
- Suite CMS sync : #230

## Livré

- `jobOffer.generate` depuis Mission (IA Zod `title`/`content.min(100)`), 1:1 `missionId`
- Régénération si `BROUILLON`/`DEPUBLIEE` ; refuse si `PUBLIEE`
- `update` / `publish` / `unpublish` (statut UI + `publishedAt`, **pas** Webflow)
- `softDelete` via `permissionProcedure('softDelete')` (Direction / RH-Admin)
- Onglet Mission `offre` + page `/offres` (tableau + actions)
- Deep-link `?tab=offre` sur fiche mission

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| « Valider » | Pas de statut `VALIDEE` — edit puis publier |
| Entrée génération | CTA onglet Mission Offre seulement |
| Régénération | OK si brouillon/dépubliée |
| Publish sans CMS | Flip statut seulement (#230 = sync) |
| Édition | Onglet mission + actions liste |
| Soft delete | Matrice existante (admin only) |
| Perms write | `protectedProcedure` — pas de `jobOffer.write` |

## Hors scope (confirmé)

- Sync CMS Webflow → #230
- Inbox Applications
- ActivityLog JobOffer
- Fiche `/offres/[id]`

## Suite

- #230 — publish/unpublish CMS (Webflow hypo, Q9)
- Lot candidatures site (après offres)

## Suggested skills

- `/caveman`
- `/tdd`
- Relire `server/routers/job-offer*.ts` + `server/ai/job-offer-generate.ts` si #230
