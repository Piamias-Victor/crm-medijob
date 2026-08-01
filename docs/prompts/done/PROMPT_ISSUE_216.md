# Prompt — Issue #216

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/216  
**Parent** : Epic #210 · CSV V1-008  
**Blocked by** : None

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #216.

ActivityLog auto sur create/update Pharmacy, Contact, Candidate, Mission. Pas de diff champ-par-champ.

Glossaire : **ActivityLog** dans `CONTEXT.md`.

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
git checkout -b feat/issue-216-activitylog-auto origin/dev
```

---

## Contraintes

- Prisma uniquement repositories
- Écriture auto côté server (create/update mutations)
- Fichiers < 100 lignes, tests TDD

---

## Fin

PR vers `dev` avec `Closes #216`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Créer pharmacie — Historique « Fiche créée »
- [ ] Modifier — « Fiche modifiée »
- [ ] Note manuelle coexiste
