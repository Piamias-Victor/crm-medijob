# Prompt — Issue #350

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/350  
**Parent** : PRD #345 — Facturation Pilotage  
**Blocked by** : #348, #349  
**Slug branche** : `feat/issue-350-pilotage-nogo-poles-charts`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #345. NoGo = Placement annulé **ou** CA 0 et Marge 0. Intérim jamais NoGo.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#348` `#349` s’ils existent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-350-pilotage-nogo-poles-charts origin/dev
```

---

## Périmètre

Jauge CDD/CDI vs Objectif annuel Placement (12 × mensuel) : Réalisé / Potentiel / Reste à faire. CA perdu projeté = nb NoGo × CA moyen facturé par type. Cards pôles Placement / Intérim (Mois / Annuel + sélecteur de mois). Deux graphes Recharts : CA vs objectif, Marge vs seuil. 12 mois de l’Exercice (zéros inclus). Tests = chiffres, pas pixels.

### Acceptance criteria

- [ ] Jauge branchée sur Objectifs Admin ; Intérim jamais NoGo
- [ ] Cards pôles Mois/Annuel
- [ ] Graphe CA : stacked + ligne objectif mensuel + cumul
- [ ] Graphe Marge : seuil mensuel + cumul vs 12×
- [ ] Tests view-model, pas layout Recharts

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Réutiliser `FacturationBarChart` / ComposedChart existants

## Fichiers impactés

- View-models Pilotage / NoGo / pôles
- `apps/web/src/components/organisms/` — jauge + cards + charts
- Query Pilotage enrichie

Vocabulaire : NoGo, Objectif, Placement. ADR 0020, 0023.

---

## Fin

PR vers `dev` avec `Closes #350`. Phase 3 obligatoire. **Interdit worktree.**

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Jauge : Réalisé % = CA Placement facturé / (20k×12)
- [ ] Une ligne CDI 0 € → NoGo, potentiel monte
- [ ] Card Intérim mois courant vs 30 000 € CA
- [ ] Graphes : 12 mois Oct→Sep
