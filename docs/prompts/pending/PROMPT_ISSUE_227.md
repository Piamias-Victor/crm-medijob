# Prompt — Issue #227

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/227  
**Parent** : Epic #210 · CSV V1-041–V1-047  
**Blocked by** : #219 · #215

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #227.

Tableau missions CSV + filtres + `profilRecherche` ; kanban toggle optionnel.

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
git checkout -b feat/issue-227-missions-table-csv origin/dev
```

---

## Contraintes

- Pattern entity-table existant
- Migration champ profilRecherche
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #227`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Vue tableau colonnes CSV + vue rapide
- [ ] Filtres type/statut/référent
- [ ] profilRecherche en fiche
- [ ] Toggle kanban
