# Prompt — Issue #219

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/219  
**Parent** : Epic #210 · CSV V1-006  
**Blocked by** : #213

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #219 et handoff #213 s’il existe.

`referentId` optionnel Pharmacy + Contact ; assouplir Candidate/Mission ; filtres.

Glossaire : **Referent** dans `CONTEXT.md`.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Lire `docs/handoffs/HANDOFF_ISSUE_213.md` si présent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-219-referent-optional origin/dev
```

---

## Contraintes

- Prisma dans repositories + migration
- Fichiers < 100 lignes, Zod forms
- Dépend de rôles #213 mergé ou disponible sur la branche de base

---

## Fin

PR vers `dev` avec `Closes #219`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Créer pharmacie — référent prérempli, enregistrable sans
- [ ] Filtrer pharmacies par référent
- [ ] Idem contact
