# Prompt — Issue #369

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/369  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #367  
**Slug branche** : `feat/issue-369-badakan-field-sync`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. Vide Badakan n’efface pas le CRM.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#367`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-369-badakan-field-sync origin/dev
```

---

## Périmètre

Sync suivants : Badakan non vide gagne identité / adresse / tél / email / métier. Entretien CRM (salaire, logiciels, mobilité, Availability `availableFrom`, notes) intouchable.

### Acceptance criteria

- [ ] Identité / adresse / contact / métier mis à jour si Badakan non vide
- [ ] Salaire, logiciels, mobilité, availableFrom, notes intouchés
- [ ] Champ Badakan vide → CRM inchangé
- [ ] Tests de sync injecté couvrant les trois cas

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- **Interdit : `git worktree`**

Vocabulaire : Availability ≠ Weekly availability. ADR 0026.

## Fichiers impactés

- `apps/web/src/server/app-profile/merge-badakan-identity.ts` — Badakan non vide → patch identité ; vide omis
- `apps/web/src/server/app-profile/sync-validated.ts` — apply patch sur existing + link
- `apps/web/src/server/db/repositories/candidate-app-origin.repo.ts` — `patchAppIdentity`
- `apps/web/src/server/app-profile/sync-validated-fields.test.ts` — 3 cas injectés

---

## Fin

PR vers `dev` avec `Closes #369`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Candidate lié : changer l’adresse côté fixture Badakan → fiche CRM à jour
- [ ] Notes / salaire CRM inchangés après sync
- [ ] Badakan sans tél → tél CRM conservé
