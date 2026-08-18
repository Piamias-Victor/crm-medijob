# Prompt — Issue #314

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/314  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #313  
**Slug branche** : `feat/issue-314-interview-template-create-archive`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : on peut **créer** un questionnaire pour un métier × type d’entretien (vide, ou copie d’un questionnaire déjà publié). Si le métier n’a pas encore de clé de trame, on lui en donne une. On n’efface jamais pour de bon : on **archive**, et les *nouveaux* entretiens retombent sur le questionnaire générique. Ceux déjà ouverts gardent leur version. Le générique, on n’y touche pas.
2. **Pose 2 à 4 questions** + **reco** :
   - Archive = flag sur le couple vs « pas de latest publiée » ? **Reco : flag `archived` sur le couple métier × mode** (les versions restent).
   - Créer depuis un JobTitle **Autre** (pas de profileKey) : slug auto du nom ? **Reco : slug ASCII du libellé, unique, éditable avant create.**
3. **Attends validation** avant de coder.
4. Lire handoff #313 + ADR 0015.

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
git checkout -b feat/issue-314-interview-template-create-archive origin/dev
```

---

## Périmètre

- Nouvelle trame : JobTitle + mode, vide **ou** copie d’une trame **publiée**
- Un INTERIM et un CDD_CDI max par métier
- Archiver → nouveaux Interviews = générique ; DRAFT pinnés inchangés
- Générique : pas d’archive, pas d’effacement dur des versions publiées

### Acceptance criteria

- [ ] Create vide OK
- [ ] Create par copie d’une trame publiée OK
- [ ] JobTitle sans profileKey → profileKey posé
- [ ] 2e INTERIM même métier → refusé
- [ ] Archive → nouvel entretien générique ; DRAFT existant OK
- [ ] Générique non archivable

Hors slice : dupliquer une *question* (#315).

---

## Contraintes

- Fichiers < 100 lignes, TDD
- Pas de T4S
- Pas de hard-delete des versions publiées

---

## Fin

PR vers `dev` avec `Closes #314`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Nouvelle trame vide pour un métier × INTERIM → apparaît dans la liste, éditable
- [ ] Nouvelle trame en copiant Pharmacien INTERIM → questions présentes, ids nouveaux au publish
- [ ] Archiver cette trame → nouvel entretien sur ce métier = grille générique
- [ ] Un DRAFT ouvert avant archive → encore l’ancienne grille
- [ ] Archiver générique → action absente / refusée
