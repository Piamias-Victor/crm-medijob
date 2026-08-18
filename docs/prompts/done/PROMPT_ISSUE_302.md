# Prompt — Issue #302

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/302  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #301  
**Slug branche** : `feat/issue-302-interview-pdf`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : après (ou à) la clôture, on génère un PDF du compte-rendu d’entretien, on peut le télécharger, et il est rangé dans les documents du candidat ; les sections vides ne s’affichent pas.
2. **Pose 2 à 4 questions** + **reco** (déclencher auto à la clôture vs bouton « Générer PDF »).
3. **Attends validation** avant de coder.
4. Lire handoff #301. S’inspirer du PDF profil anonymisé (comportement, pas copier-coller aveugle).

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
git checkout -b feat/issue-302-interview-pdf origin/dev
```

---

## Périmètre

- Génération PDF compte-rendu
- Download
- Stockage Document sur Candidate (et/ou lien Interview)
- Omettre sections vides

### Acceptance criteria

- [ ] PDF téléchargeable après clôture
- [ ] Document visible sur le candidat
- [ ] Sections vides omises

Parallel OK avec #303 après #301.

---

## Contraintes

- Fichiers < 100 lignes ; tests seam PDF / download
- Pas d’IA dans cette issue

---

## Fin

PR vers `dev` avec `Closes #302`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Entretien clôturé → télécharger PDF → contenu cohérent (identité, scores, décision)
- [ ] Document apparaît dans l’onglet Documents du candidat
- [ ] Section non remplie absente du PDF
