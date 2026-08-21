# Prompt — Issue #230

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/230  
**Parent** : PRD #321 — Job board  
**Blocked by** : #229  
**Slug branche** : `feat/issue-230-job-offer-board-sync`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : le bouton **Publier** du CRM doit créer (ou mettre à jour) l’annonce sur le site public. **Dépublier** la cache, sans l’effacer. Si la Mission passe à Pourvu ou Annulée, l’annonce se cache toute seule. « Publiée » dans le CRM = vraiment en ligne. On ne touche pas au code du site.
2. **Pose 2 à 4 questions** + **reco** :
   - Champ actuel `webflowItemId` : le renommer `boardListingId` vs le réutiliser tel quel ? **Reco : renommer** (plus de Webflow).
   - Géocode BAN KO : publier sans lat/lng, ou bloquer ? **Reco : publier sans coords.**
   - Offre « mise en avant » sur le site ? **Reco : toujours `false` en V1.**
3. **Attends validation** avant de coder.
4. Lire handoff #229 + ADR 0016 + CONTEXT.md **JobOffer**. **Pas** d’ingest candidatures (#231). **Pas** de `source_crm_id`. **Pas** de DELETE.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff #229 s’il existe.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-230-job-offer-board-sync origin/dev
```

---

## Périmètre

- Publier / republier une JobOffer → upsert table site `offres`, stocker l’UUID listing
- Dépublier → `publiee = false` (jamais DELETE)
- `PUBLIEE` seulement si l’écriture site a réussi
- Mission POURVU / ANNULEE → dépublish auto
- Mapping : titre/texte JobOffer ; métier/contrat/horaires/salaire/début Mission ; ville Pharmacy ; entreprise = nom pharmacie ; `contact_email` = env
- Client site mockable ; CI sans prod

### Acceptance criteria

- [ ] Publish écrit/maj `offres` + listing id sur la JobOffer
- [ ] Unpublish `publiee = false` (jamais DELETE)
- [ ] Erreur site → CRM pas PUBLIEE + message UI
- [ ] Mission POURVU / ANNULEE → offre dépubliée
- [ ] `entreprise` = Pharmacy ; `contact_email` depuis env
- [ ] Pas de `source_crm_id` ; pas d’écriture `offres_emploi` / `missions` / `candidats`

Hors slice : ingest `candidatures` (#231).

---

## Fichiers impactés

- `apps/web/prisma/schema.prisma` — listing id sur JobOffer
- `apps/web/src/server/routers/job-offer-lifecycle.ts` — publish/unpublish + port
- `apps/web/src/server/routers/mission.ts` — Pourvu/Annulée → unpublish
- Client job board (nouveau, seam mockable) — upsert `offres` seulement
- `apps/web/.env.example` — `JOBS_SUPABASE_*` / `JOBS_CONTACT_EMAIL` (pas de secrets)

---

## Contraintes

- Prisma uniquement dans repositories
- Fichiers < 100 lignes, TDD, zéro `any`
- Secrets en env uniquement
- Pas de T4S, pas de Webflow, pas de HTTP `POST /api/offres`

---

## Fin

PR vers `dev` avec `Closes #230`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Publier une JobOffer brouillon → visible sur https://medijob-offres.netlify.app/offres, UUID stocké
- [ ] Dépublier → disparue du site, ligne `offres` encore là
- [ ] Simuler erreur site (clé invalide / mock) → toast, statut CRM **pas** PUBLIEE
- [ ] Mission Pourvu → offre dépubliée sur le site
