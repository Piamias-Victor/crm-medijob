# Prompt — Issue #377

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/377  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #368  
**Slug branche** : `feat/issue-377-badakan-contracts`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. Badakan contract ≠ Ligne de suivi ≠ Devis.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#368`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-377-badakan-contracts origin/dev
```

---

## Périmètre

Liste lecture **Badakan contracts** (statut, PDF, DPAE) dans Intérim. Pas de Ligne de suivi, pas d’écriture contrat.

### Acceptance criteria

- [ ] Liste Intérim des contrats Badakan
- [ ] Aucune Ligne de suivi créée
- [ ] Facturation → Intérim inchangé
- [ ] Pas d’écriture contrat Badakan
- [ ] Tests client injecté + liste UI

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- **Interdit : `git worktree`** · **interdit write contrats Badakan**

Vocabulaire : Badakan contract, Ligne de suivi. ADR 0030.

## Fichiers impactés

- `apps/web/src/server/badakan/client.ts` — `searchContracts` POST `/services/v3/contracts/search`
- `apps/web/src/server/badakan/map-contract.ts` — statut, PDF, DPAE
- `apps/web/src/server/badakan-contract/sync.ts` — persist lecture, jamais FinanceLine
- `apps/web/src/server/db/repositories/badakan-contract.repository.ts`
- `apps/web/src/server/routers/badakan-contract.ts` — `list`
- `apps/web/src/app/(dashboard)/interim/contrats/page.tsx`
- `apps/web/src/components/organisms/BadakanContractList.tsx`
- `apps/web/prisma/schema.prisma` — `BadakanContract`

---

## Fin

PR vers `dev` avec `Closes #377`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Intérim → liste contrats Badakan (statut visible)
- [ ] Facturation → Intérim : aucune ligne auto
- [ ] Pas de bouton « créer contrat » vers Badakan
