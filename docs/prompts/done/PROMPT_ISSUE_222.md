# Prompt — Issue #222

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/222  
**Parent** : Epic #210 · CSV V1-021  
**Blocked by** : #220

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #222.

Import CSV pharmacies + dédup SIRET ou nom+ville+CP + fusion (pattern candidats #170).

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.  
Relire handoffs fusion candidats si utiles (`HANDOFF_ISSUE_170.md`).

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-222-pharmacy-csv-import origin/dev
```

---

## Contraintes

- CSV only (pas xlsx)
- Zod validation mapping
- Fichiers < 100 lignes, TDD pipeline

---

## Fin

PR vers `dev` avec `Closes #222`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] CSV valide — pharmacies créées
- [ ] SIRET doublon — écran fusion
- [ ] CSV invalide — erreur claire
