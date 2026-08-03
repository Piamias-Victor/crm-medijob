# Prompt — Issue #220

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/220  
**Parent** : Epic #210 · CSV V1-011 / V1-012 / V1-016  
**Blocked by** : #219 · #215

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #220. Handoffs #215 / #219 si présents.

Colonnes/filtres CSV pharmacies + label statut Client + vue rapide.

Glossaire : **Pharmacy status** dans `CONTEXT.md`.

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
git checkout -b feat/issue-220-pharmacy-table-csv origin/dev
```

---

## Contraintes

- View-models pour colonnes/filtres
- Fichiers < 100 lignes
- Réutiliser panneau #215

---

## Fin

PR vers `dev` avec `Closes #220`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Colonnes CP, date, référent, œil
- [ ] Filtres ville + Client
- [ ] Label « Client » (plus « Actif »)
