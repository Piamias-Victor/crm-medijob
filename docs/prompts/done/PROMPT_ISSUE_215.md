# Prompt — Issue #215

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/215  
**Parent** : Epic #210 · CSV V1-007 / V1-013  
**Blocked by** : None

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #215.

Panneau vue rapide générique ; première intégration liste Pharmacies (coords, contacts principaux, besoins, dernière action).

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-215-quick-view-panel origin/dev
```

---

## Contraintes

- Atomic design : organisme/molecule réutilisable
- Zéro logique métier dans le panneau (view-model)
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #215`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] `/pharmacies` — ouvrir vue rapide
- [ ] Contenu CSV présent
- [ ] « Voir la fiche » navigue correctement
