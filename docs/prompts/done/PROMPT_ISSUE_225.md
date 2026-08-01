# Prompt — Issue #225

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/225  
**Parent** : Epic #210 · CSV V1-036 / V1-040  
**Blocked by** : #216 · #224

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #225. Handoffs #216/#224/#170.

Timeline candidat + import CSV + fusion.

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
git checkout -b feat/issue-225-candidate-history-import origin/dev
```

---

## Contraintes

- Réutiliser merge candidats existant
- CSV only
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #225`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Historique montre positionnements
- [ ] Import avec email existant → fusion
- [ ] Import clean → créations
