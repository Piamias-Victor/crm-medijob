# Prompt — Issue #213

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/213  
**Parent** : Epic #210 · CSV V1-002 · `docs/grill/CSV_V1_DECISIONS.md`  
**Blocked by** : None

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter.

Lis #213. Remplacer ADMIN|RECRUTEUR par Direction / Recruteur / Communication / RH-Admin. Matrice Q2 en hypothèse. CA/Marge : Direction + RH-Admin only. Fresh DB seeds.

Glossaire : **UserRole**, **CA / Marge** dans `CONTEXT.md`.

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
git checkout -b feat/issue-213-user-roles-permissions origin/dev
```

---

## Contraintes

- Prisma uniquement dans repositories
- Helper permissions central (pas de checks dispersés)
- Fichiers < 100 lignes, zéro `any`
- Tests matrice permissions via createCaller

---

## Fin

PR vers `dev` avec `Closes #213`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Recruteur — CRUD ops OK, pas CA/Marge, pas admin users
- [ ] Communication — lecture ops, pas soft delete
- [ ] Direction — voit CA/Marge + admin
