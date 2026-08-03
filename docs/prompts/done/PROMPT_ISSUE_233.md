# Prompt — Issue #233

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/233  
**Parent** : Epic #210 · CSV V1-064 / V1-065  
**Blocked by** : #232

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #233.

CR hebdo data-driven par Referent + raccourci meilleurs profils (matching).

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
git checkout -b feat/issue-233-assistant-week-report origin/dev
```

---

## Contraintes

- Assembly stats en service pur testable
- Zod réponses IA
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #233`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Rapport semaine — chiffres cohérents
- [ ] Meilleurs profils sur mission
