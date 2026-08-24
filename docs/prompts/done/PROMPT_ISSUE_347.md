# Prompt — Issue #347

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/347  
**Parent** : PRD #345 — Facturation Pilotage  
**Blocked by** : #346  
**Slug branche** : `feat/issue-347-facturation-nav-placements`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #345.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. **Lire** `docs/handoffs/HANDOFF_ISSUE_346.md` s’il existe.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-347-facturation-nav-placements origin/dev
```

---

## Périmètre

Remplacer Suivi par **Placements** (lignes Placement) et **Intérim** (lignes Intérim). Ajouter **Pilotage** (coquille : filtres Exercice + Referent, corps vide OK). Garder Vue d’ensemble. Redirect `/facturation/suivi` → Placements. Nouveau / CSV / filtres sur chaque liste. JobTitle depuis Candidate. Générer devis depuis la ligne inchangé. Vue par pharmacie Intérim = #352.

### Acceptance criteria

- [ ] Nav : Vue d’ensemble | Pilotage | Placements | Intérim — plus de Suivi
- [ ] `/facturation/suivi` → Placements
- [ ] Placements : filtres + CSV + Nouveau + totaux filtrés
- [ ] Intérim : liste missions + CSV + Nouvelle mission
- [ ] Recruteur FORBIDDEN ; Accueil inchangé

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories ; RSC + `createCaller`
- Listes = Lignes seulement (pas les Devis orphelins)

## Fichiers impactés

- `apps/web/src/lib/navigation.ts` — `facturationSubNav`
- `apps/web/src/app/(dashboard)/facturation/` — routes suivi / placements / interim / pilotage
- `apps/web/src/components/molecules/FacturationNav.tsx`
- `apps/web/src/lib/csv/build-csv.ts` — export listes

Vocabulaire : Pilotage, Placement, Exercice. ADR 0017.

---

## Fin

PR vers `dev` avec `Closes #347`. Phase 3 obligatoire. **Interdit worktree.**

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Direction : Facturation → 4 onglets ; Suivi absent
- [ ] `/facturation/suivi` redirige vers Placements
- [ ] Nouveau Placement depuis Placements ; Nouvelle mission depuis Intérim
- [ ] Export CSV sur une liste filtrée
