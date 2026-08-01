# Prompt — Issue #212

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/212  
**Parent** : Epic #210 · CSV V1-001  
**Blocked by** : None

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter.

Lis #212. Login email+password existe ; ajouter reset email one-shot + idle logout 30 min.

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
git checkout -b feat/issue-212-auth-reset-idle origin/dev
```

---

## Contraintes

- NextAuth v5 existant — étendre, ne pas remplacer
- Zod sur entrées reset
- Fichiers < 100 lignes, zéro `any`
- Tests router/service obligatoires (TDD)

---

## Fin

PR vers `dev` avec `Closes #212`. Phase 3 : commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Mot de passe oublié — email valide → lien (ou log dev) → nouveau mot de passe → login OK
- [ ] Relancer le même lien — refusé
- [ ] Idle 30 min (ou timer test) — redirect login
