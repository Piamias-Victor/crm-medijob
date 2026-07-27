# Prompt — Issue #234

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/234  
**Parent** : Epic #210 · ADD Finance · Q13  
**Blocked by** : #213  
**Type** : HITL (`ready-for-human`) — inventaire proto op-medijob requis

---

## Avant de coder

**Pose-moi des questions** — Q13 tranché ? sous-ensemble écrans ?  
Lis #234, Q13, et https://op-medijob.netlify.app (inventaire).

CA/Marge gated via #213.

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
git checkout -b feat/issue-234-finance-perf-devis origin/dev
```

---

## Contraintes

- Permissions CA/Marge
- Prisma repositories
- Fichiers < 100 lignes
- Ne pas livrer hors inventaire validé

---

## Fin

PR vers `dev` avec `Closes #234`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Direction voit CA/Marge
- [ ] Recruteur ne voit pas CA/Marge
- [ ] Parcours devis selon inventaire
