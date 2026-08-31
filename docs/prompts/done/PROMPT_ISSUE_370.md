# Prompt — Issue #370

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/370  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #367  
**Slug branche** : `feat/issue-370-badakan-identity-docs`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. CV = `cvUrl`, pas Document. NIR/IBAN hors filtres.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#367`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-370-badakan-identity-docs origin/dev
```

---

## Périmètre

Dossier Badakan sur la fiche : CV → `cvUrl` ; CNI, RIB, diplôme → Documents ; NIR / IBAN sur la fiche. Pas matching, pas filtre dispos.

### Acceptance criteria

- [ ] CV Badakan sur cvUrl
- [ ] CNI / RIB / diplôme en Documents sur le Candidate
- [ ] NIR et IBAN visibles sur la fiche
- [ ] Absents du matching CDI et du filtre dispos
- [ ] Tests sync fichiers (client injecté)

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- Réutiliser `fetch-resume` / Documents Candidate
- **Interdit : `git worktree`**

Vocabulaire : Document ≠ cvUrl. ADR 0029.

## Fichiers impactés

- `apps/web/src/server/badakan/fetch-resume.ts` — CV
- `apps/web/prisma/schema.prisma` — DocumentCategory si besoin
- `apps/web/src/server/db/repositories/document.repository.ts`
- fiche Candidate (onglet documents / infos)

---

## Fin

PR vers `dev` avec `Closes #370`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Fiche Candidate origine App : CV ouvrable
- [ ] Documents CNI/RIB/diplôme si présents en fixture
- [ ] NIR/IBAN sur la fiche, pas dans un filtre matching
