# Prompt — Issue #235

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/235  
**Parent** : Epic #210 · CSV V1-010 · Q4–Q7  
**Blocked by** : #213  
**Type** : HITL (`ready-for-human`) — réponses RGPD client requises

---

## Avant de coder

**Pose-moi des questions** — statut Q4–Q7.  
Ne pas inventer la politique juridique. Lis #235 et `docs/grill/QUESTIONS_CLIENT_V1.md`.

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
git checkout -b feat/issue-235-rgpd-compliance origin/dev
```

---

## Contraintes

- Soft delete vs hard+Blob selon Q6
- Droits rôles #213
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #235`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Consentement (si applicable)
- [ ] Effacement par rôle autorisé
- [ ] Blob selon Q6
