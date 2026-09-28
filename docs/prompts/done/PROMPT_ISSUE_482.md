# Prompt — Issue #482

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/482  
**Parent** : PRD #480 — Entrées app  
**Blocked by** : #481  
**Slug branche** : `feat/issue-482-entrees-app-intake-inline`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #480 · ADR-0032.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-482-entrees-app-intake-inline origin/dev
```

Merger / rebaser sur #481 si pas encore dans `dev`. Lire handoff #481 s’il existe.

---

## Périmètre

Champs ops sur AppProfile : **Intake status**, **Call outcome**, date RDV, notes. Enums fermés PRD. Défaut arrivée = `À appeler`. Mutation `updateIntake` (Zod) + édition inline sur le tableau. `RDV pris` ⇒ date RDV obligatoire. Pas encore Referent / relance / last-call. Pas de retrait Profils app.

Enums UI :
- Intake status : À appeler · Dossier incomplet · À relancer · Hors zone
- Call outcome : Messagerie · RDV pris · À rappeler · Pas intéressé · Hors cible · Pas de réponse  
Pas de Validé / Suspendu en Intake status.

### Acceptance criteria

- [ ] Schéma enums + notes + planned RDV ; défaut `À appeler`
- [ ] `updateIntake` : `RDV_PRIS` exige date RDV
- [ ] Inline edit status / outcome / RDV / notes sur Entrées app
- [ ] Tests createCaller + schema/VM
- [ ] Fichiers < 100 lignes, TDD, Prisma repositories only

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD · RHF/Zod · **interdit worktree**
- Vocabulaire : Intake status ≠ Candidate status

## Fichiers impactés (indicatifs)

- `apps/web/prisma/schema.prisma`
- `apps/web/src/server/routers/app-profile.ts` — updateIntake
- view-models intake enums / validation
- tableau Entrées app — cellules éditables

---

## Fin

PR vers `dev` avec `Closes #482`.

## Commande de test

```bash
cd apps/web && pnpm test -- app-profile intake
```
