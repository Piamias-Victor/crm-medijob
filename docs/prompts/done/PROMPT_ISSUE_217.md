# Prompt — Issue #217

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/217  
**Parent** : Epic #210 · CSV V1-009  
**Blocked by** : None

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #217.

Aperçu in-app PDF/image pour Documents existants.

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
git checkout -b feat/issue-217-document-preview origin/dev
```

---

## Contraintes

- Réutiliser EntityDocumentsTab
- Fichiers < 100 lignes
- Pas d’exploit / pas de bypass auth download

---

## Fin

PR vers `dev` avec `Closes #217`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Upload PDF — Aperçu OK
- [ ] Upload image — Aperçu OK
- [ ] Download / delete toujours OK
