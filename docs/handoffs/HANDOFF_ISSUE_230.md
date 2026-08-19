# Handoff — Issue #230 (JobOffer → board `offres`)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-230-job-offer-board-sync` (pas de worktree)

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/230
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/323
- Parent : PRD #321 · ADR 0016
- Prompt : `docs/prompts/done/PROMPT_ISSUE_230.md`
- Bloqué par : #229 (mergé)
- Suite ingest : #231

## Livré

- `webflowItemId` → `boardListingId` (migration `20260819120000_job_offer_board_listing_id`)
- Publish : upsert table site `offres` via port mockable (fetch Supabase REST), `PUBLIEE` seulement si écriture OK
- Unpublish : `publiee = false`, jamais DELETE ; republish = même UUID
- Mission POURVU / ANNULEE → unpublish avant close
- Mapping : titre/texte JobOffer ; métier/contrat/horaires/salaire/début Mission ; ville/geo Pharmacy ; `entreprise` = nom pharmacie ; `contact_email` = `JOBS_CONTACT_EMAIL` ; `mise_en_avant = false` ; pas de `source_crm_id`
- BAN KO → publier sans lat/lng ; coords pharmacie réutilisées si déjà là
- CTA `/offres` **Créer une offre** → picker missions ouvertes → `?tab=offre`

Détail spec : `docs/PRD_JOB_BOARD_V1.md` · `docs/adr/0016-job-board-supabase-not-http.md`

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Champ listing | Renommer `webflowItemId` → `boardListingId` |
| BAN KO | Publier sans GPS |
| Mise en avant | Toujours `false` V1 |
| Republish | Même UUID |
| Entrée `/offres` | Bouton créer + picker mission (extra hors AC) |

## Tests manuels

- [x] Générer offre IA (après `prisma migrate deploy` local/Neon)
- [x] CTA `/offres` → mission → onglet Offre
- [ ] Publier → visible sur https://medijob-offres.netlify.app/offres + UUID stocké
- [ ] Dépublier → disparue, ligne `offres` encore là
- [ ] Erreur site → toast, CRM pas PUBLIEE
- [ ] Mission Pourvu → offre dépubliée

Migrate déjà appliquée sur Neon de dev (`boardListingId`). CI quality + Vercel verts.

## Env (pas de secrets dans git)

`apps/web/.env.example` : `JOBS_SUPABASE_URL`, `JOBS_SUPABASE_SECRET_KEY`, `JOBS_CONTACT_EMAIL` (publishable key listée, writes = secret).

## Dette / suite

- #231 ingest `candidatures` (cron + sync inbox). Filtrer `offre_id` = listing ids CRM. Pas de webhook, pas d’écriture `offres`.
- Relire `src/server/job-board/` + `job-offer-lifecycle.ts` + `unpublish-on-close.ts`
- Prod : `migrate deploy` + remplir `JOBS_*` sur Vercel avant 1er publish réel
- Tests manuels site (checklist ci-dessus) pas tous faits en session

## Suggested skills

- `/caveman`
- `/tdd`
- Relire handoff #230 + ADR 0016 + CONTEXT.md **Application**
- Prior art ingest : `src/server/app-profile/sync.ts`
