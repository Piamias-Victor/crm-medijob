# Prompt — Issue #348

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/348  
**Parent** : PRD #345 — Facturation Pilotage  
**Blocked by** : none  
**Slug branche** : `feat/issue-348-admin-objectifs-facturation`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #345. Parallèle à #346.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-348-admin-objectifs-facturation origin/dev
```

---

## Périmètre

Écran **Admin** : Objectifs mensuels CA/Marge Placement, CA/Marge Intérim, seuil de rentabilité. Seed 20000 / 20000 / 30000 / 10000 / 15000. Annuel = ×12 (consommé par #350). Direction / RH-Admin.

### Acceptance criteria

- [ ] Admin édite les cinq montants mensuels
- [ ] Défauts seedés comme ci-dessus
- [ ] Recruteur ne charge ni n’enregistre
- [ ] Tests tRPC get/save

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- Pattern referential Admin (Software)

## Fichiers impactés

- `apps/web/src/lib/navigation.ts` — `adminSubNav`
- `apps/web/src/app/(dashboard)/admin/` — page Objectifs
- Router admin + repository Objectif
- Seed Prisma

Vocabulaire : Objectif. ADR 0023.

---

## Fin

PR vers `dev` avec `Closes #348`. Phase 3 obligatoire. **Interdit worktree.**

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Direction : Admin → Objectifs : 20 000 / 20 000 / 30 000 / 10 000 / 15 000
- [ ] Modifier le CA Placement mensuel → enregistrement OK
- [ ] Recruteur : pas d’Admin Objectifs
