# Prompt — Issue #221

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/221  
**Parent** : Epic #210 · CSV V1-018 / V1-020  
**Blocked by** : #216

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #221. Handoff #216 si présent.

Historique mixte + type contrat visible dans Besoins.

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
git checkout -b feat/issue-221-pharmacy-history-besoins origin/dev
```

---

## Contraintes

- View-models ; fichiers < 100 lignes
- Terminal = POURVU / ANNULEE

---

## Fin

PR vers `dev` avec `Closes #221`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Mission POURVU dans Historique pas Besoins
- [ ] Mission ouverte dans Besoins avec type contrat
- [ ] ActivityLog manuel visible
