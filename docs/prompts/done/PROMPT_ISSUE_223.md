# Prompt — Issue #223

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/223  
**Parent** : Epic #210 · CSV V1-022–V1-026  
**Blocked by** : #219 · #215

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #223.

Liste/filtres contacts CSV + Contact role admin référentiel (seed inclut Comptabilité).

Glossaire : **Contact role** dans `CONTEXT.md`.

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
git checkout -b feat/issue-223-contacts-roles-admin origin/dev
```

---

## Contraintes

- Pattern admin comme JobTitle / Software
- Migration enum → table référentiel
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #223`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Liste — nom/prénom séparés + vue rapide
- [ ] Admin — créer rôle Comptabilité
- [ ] Créer contact avec ce rôle
