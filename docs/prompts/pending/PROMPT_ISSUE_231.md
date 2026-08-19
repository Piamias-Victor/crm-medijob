# Prompt — Issue #231

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/231  
**Parent** : PRD #321 — Job board  
**Blocked by** : #230 · #224  
**Slug branche** : `feat/issue-231-applications-ingest`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : quand quelqu’un postule sur le site, la candidature doit arriver dans **Candidatures reçues**. Un cron + un bouton Actualiser tirent la table site `candidatures`. Chaque postulation = une **Application** (pas un Candidate tant qu’on n’a pas accepté). On ignore les candidatures spontanées sans offre. On ne touche pas au code du site.
2. **Pose 2 à 4 questions** + **reco** :
   - Cadence cron ? **Reco : toutes les 15 min** (Vercel cron).
   - Ouverture de l’inbox = sync auto vs bouton seulement (+ cron) ? **Reco : bouton Actualiser + cron** (pas de pull prod à chaque navigation).
   - CV à l’accept : `Candidate.cvUrl` vs Document ? **Reco : `cvUrl`** (comme un dépôt CV).
3. **Attends validation** avant de coder.
4. Lire handoff #230 + ADR 0016 + CONTEXT.md **Application**. Réutiliser accept/refus/dédup existants (ADR 0006). **Pas** de webhook. **Pas** de publish offres (#230).

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs #230 / #224 s’ils existent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-231-applications-ingest origin/dev
```

---

## Périmètre

- Ingest `candidatures` → Application (id soumission unique)
- Déclencheurs : cron + sync inbox (même fonction)
- Ignorer `offre_id` vide et les listings qui ne sont pas nos JobOffers
- Accept / refus / dédup existants ; CV copié dans le CRM seulement à l’accept
- Re-ingest : pas de doublon, pas de réouverture ACCEPTEE/REFUSEE

### Acceptance criteria

- [ ] Ingest crée une Application si `offre_id` = listing id d’une JobOffer à nous
- [ ] Re-ingest → pas de doublon ; acceptée/refusée pas réouverte
- [ ] Inbox : nom, métier, tél, email, ville, CV, offre, date, message
- [ ] Accept sans doublon → Candidate + copie CV (Candidate même si copie KO)
- [ ] Doublon email/tél/nom → fusion / rattache
- [ ] Refus → plus en attente, trace stats
- [ ] Client mockable ; CI sans prod

Hors slice : publish/unpublish (#230).

---

## Fichiers impactés

- `apps/web/prisma/schema.prisma` — id soumission unique sur Application
- Ingest Application (nouveau, pattern `app-profile/sync`) — lecture `candidatures` seulement
- `apps/web/src/server/application/intake.ts` — copie CV à l’accept
- Router Application + UI inbox (bouton Actualiser)
- Route cron (Vercel) — même ingest
- `apps/web/.env.example` — clés job board déjà documentées en #230

---

## Contraintes

- Prisma uniquement dans repositories
- Fichiers < 100 lignes, TDD, zéro `any`
- Réutiliser duplicate-review, pas fusionner deux Applications
- Pas de T4S, pas de webhook HMAC, pas d’écriture table `offres`

---

## Fin

PR vers `dev` avec `Closes #231`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Après une offre publiée (#230), postuler sur le site → Actualiser / attendre cron → ligne inbox
- [ ] Actualiser une 2ᵉ fois → toujours une seule Application
- [ ] Candidature spontanée (pas d’offre) → absente de l’inbox
- [ ] Accept sans doublon → Candidate en CVthèque, CV présent si copie OK
- [ ] Accept email déjà en CVthèque → écran fusion
- [ ] Refus → plus en attente ; sync suivant ne la rouvre pas
