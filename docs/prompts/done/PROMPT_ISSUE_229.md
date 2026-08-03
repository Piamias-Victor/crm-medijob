# Prompt — Issue #229

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/229  
**Parent** : Epic #210 · CSV V1-048 / V1-049 / V1-051 / V1-052  
**Blocked by** : #227

---

## Avant de coder

**Pose-moi des questions** avant d'implémenter. Lis #229.

JobOffer IA + cycle UI + `/offres` réel (sync CMS = #230).

Glossaire : **JobOffer**.

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
git checkout -b feat/issue-229-job-offers-module origin/dev
```

---

## Contraintes

- 1 JobOffer max par Mission (`missionId` unique)
- Zod sur réponses IA
- Remplacer PagePlaceholder `/offres`
- Fichiers < 100 lignes

---

## Fin

PR vers `dev` avec `Closes #229`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Générer offre depuis mission
- [ ] `/offres` liste + actions
- [ ] Publier/dépublier UI
- [ ] Soft delete
