# Prompt — Issue #224

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/224  
**Parent** : Epic #210 · CSV V1-029–033 / V1-039 / V1-054  
**Blocked by** : #219 · #215

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #224.

Candidate status CSV + En mission auto ; prétentions salariales ; colonnes/filtres/vue rapide.

Glossaire : **Candidate status**, **Salary expectations**.

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
git checkout -b feat/issue-224-candidate-status-pretentions origin/dev
```

---

## Contraintes

- Prisma repositories + migration
- Dérivation En mission testée
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #224`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Nouveau candidat — statut Nouveau
- [ ] Positionner mission — En mission
- [ ] Blacklist manuel persiste
- [ ] Filtres + vue rapide
