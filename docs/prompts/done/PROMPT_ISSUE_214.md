# Prompt — Issue #214

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/214  
**Parent** : Epic #210 · CSV V1-003  
**Blocked by** : None

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #214.

Recherche globale shell : Pharmacy, Contact, Candidate, Mission uniquement.

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
git checkout -b feat/issue-214-global-search origin/dev
```

---

## Contraintes

- RSC / tRPC patterns repo
- Fichiers < 100 lignes, zéro `any`
- Réutiliser search-pool / ILIKE existants si pertinents

---

## Fin

PR vers `dev` avec `Closes #214`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Chercher une pharmacie — résultat groupé
- [ ] Chercher un candidat — résultat
- [ ] Clic — ouvre la fiche
