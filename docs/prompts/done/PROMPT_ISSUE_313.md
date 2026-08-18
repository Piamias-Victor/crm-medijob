# Prompt — Issue #313

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/313  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #312  
**Slug branche** : `feat/issue-313-interview-template-admin`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : Direction / RH-Admin éditent les questionnaires (métier × intérim ou CDD/CDI) dans l’admin, sans attendre un déploiement. Ils bossent sur une **copie de travail**, puis **Publier**. Les entretiens déjà ouverts ne bougent pas. Recruteur n’a pas le droit. Chaque question dit explicitement si elle alimente la fiche (dispo, logiciels, etc.) — plus de magie sur le texte.
2. **Pose 2 à 4 questions** + **reco** :
   - Copie de travail = champ JSON dédié vs version « 0 » non publiée ? **Reco : working copy dédiée par couple métier × mode**, publish = nouvelle `version` InterviewTemplate.
   - Placement nav admin : item **Trames** à côté de Métiers ? **Reco : oui** `/admin/trames`.
3. **Attends validation** avant de coder.
4. Lire handoff #312 + ADR 0015. Lire pattern `/admin/metiers`.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-313-interview-template-admin origin/dev
```

---

## Périmètre

- `/admin/trames` : liste profileKey × INTERIM | CDD_CDI
- Copie de travail + **Publier** → version N+1
- Éditeur : sections, intitulé, réponses, éliminatoire, critère B/C, points, **mapping explicite** (availability | software | mobility | salary | contracts | none)
- Publier refusé si 2 questions même mapping
- Close utilise le mapping explicite (plus `interviewQuestionKind` sur le libellé)
- Direction + RH-Admin only

### Acceptance criteria

- [ ] Recruteur → 403 sur `/admin/trames`
- [ ] Sauver copie de travail ≠ changer les Interviews live
- [ ] Publier → nouvel entretien = nouvelle grille ; DRAFT pinné inchangé
- [ ] Mapping explicite → write-back fiche
- [ ] Doublon mapping → publish KO

Hors slice : créer/archiver trame (#314), insert depuis une autre trame (#315).

---

## Contraintes

- Fichiers < 100 lignes, TDD
- Pas de T4S
- **brouillon** = Interview DRAFT uniquement

---

## Fin

PR vers `dev` avec `Closes #313`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Recruteur : pas d’accès Trames
- [ ] RH-Admin : modifier une question, sauver sans publier → un DRAFT ouvert inchangé
- [ ] Publier → nouvel entretien voit la question ; l’ancien DRAFT non
- [ ] Deux questions « disponibilité » → Publier refusé
- [ ] Une question mapping dispo → clôture préremplit la fiche
