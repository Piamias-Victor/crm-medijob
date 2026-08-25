# Prompt — Issue #346

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/346  
**Parent** : PRD #345 — Facturation Pilotage  
**Blocked by** : none  
**Slug branche** : `feat/issue-346-ligne-suivi-referent-nogo`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Décisions dans #345. Un Referent (pas de co-crédit). Annuler ≠ soft delete.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#341` si présent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-346-ligne-suivi-referent-nogo origin/dev
```

---

## Périmètre

Étendre la **Ligne de suivi** (écran Suivi actuel) : Referent User Combobox, CDD/CDI obligatoire si Placement (prérempli Mission), CA 0 autorisé, pastilles Facturé / Encaissé (ne bougent pas le CA), Annuler / restaurer (statut réversible). Commiter glossaire + ADR 0018–0023 + `docs/PRD_FACTURATION_PILOTAGE_V1.md`. Hors slice : nav Pilotage/Placements (#347).

### Acceptance criteria

- [ ] Placement : CDD ou CDI obligatoire (prérempli si Mission)
- [ ] Un Referent Combobox (vide → Non attribué)
- [ ] CA Placement peut être 0
- [ ] Facturé / Encaissé sans changer CA ni date
- [ ] Annuler / restaurer : ligne visible, pas un soft delete
- [ ] Recruteur FORBIDDEN
- [ ] CONTEXT.md + ADRs 0018–0023 + PRD dans la PR
- [ ] Tests createCaller + Zod

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- RSC lectures / `trpc.useMutation()` client
- RHF + Zod ; atomic design ; view-models
- Zustand = UI seulement

## Fichiers impactés

- `apps/web/prisma/schema.prisma` — champs Ligne de suivi
- `apps/web/src/view-models/finance-line.schema.ts` — Zod (CA ≥ 0, CDD/CDI, Referent)
- `apps/web/src/components/molecules/FinanceLineFormFields.tsx` — Combobox Referent + type
- `apps/web/src/server/routers/facturation.ts` — mutations cancel / marks
- `CONTEXT.md` · `docs/adr/0018`–`0023` · `docs/PRD_FACTURATION_PILOTAGE_V1.md`

Vocabulaire : Ligne de suivi, Placement, Referent, Encaissé, NoGo (flag plus tard). ADR 0017, 0018, 0020, 0021, 0022.

---

## Fin

PR vers `dev` avec `Closes #346`. Phase 3 : poster commande de test + tests manuels. Handoff seulement si demandé. **Interdit worktree.** Phase 5 : supprimer la branche locale après merge.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Direction : Facturation → Suivi → Nouvelle ligne Placement CDI, CA 0, Referent choisi → ligne créée
- [ ] Cocher Facturé puis Encaissé → CA inchangé
- [ ] Annuler la ligne → toujours visible, filtre Annulés ; Restaurer → active
- [ ] Recruteur : pas de menu Facturation
