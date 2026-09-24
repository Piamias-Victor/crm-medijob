# Prompt — Issue #484

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/484  
**Parent** : PRD #480 — Entrées app  
**Blocked by** : #482  
**Slug branche** : `feat/issue-484-entrees-app-referent-relance`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #480.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-484-entrees-app-referent-relance origin/dev
```

Rebaser sur #482 mergé.

---

## Périmètre

**Referent** sur AppProfile (User CRM, inline). **Last-call** auto (timestamp + user session) à chaque save Call outcome. **Relance** : jour d’arrivée à l’intake ; puis last-call + 2 jours à chaque outcome ; surcharge inline OK. Badge/tri **overdue** si relance passée — **sans** auto-flip Intake status. Filtre défaut liste = moi ∪ non attribué ; toggle « tous ».

### Acceptance criteria

- [ ] Referent optionnel sur AppProfile, éditable inline
- [ ] Save Call outcome → stamp lastCalledAt + lastCalledBy
- [ ] Relance : arrivée = jour J ; outcome = J+2 depuis last-call ; override OK
- [ ] Overdue = badge/sort seulement (pas de changement de statut)
- [ ] Filtre défaut moi ∪ vide ; toggle full queue
- [ ] Tests createCaller + VM purs
- [ ] Fichiers < 100 lignes, TDD, Prisma repositories only

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD · **interdit worktree**
- Vocabulaire : Referent (pas ATTRIBUE A texte)

## Fichiers impactés (indicatifs)

- schema AppProfile + User relation Referent
- updateIntake étendu
- filtres liste Entrées app
- VM overdue / relance defaults

---

## Fin

PR vers `dev` avec `Closes #484`.

## Commande de test

```bash
cd apps/web && pnpm test -- app-profile intake referent
```
