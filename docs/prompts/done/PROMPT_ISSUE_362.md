# Prompt — Issue #362

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/362  
**Parent** : PRD #345 — Facturation Pilotage  
**Blocked by** : #350, #351  
**Slug branche** : `fix/issue-362-pilotage-poles-ui`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #345. QA `/facturation/pilotage` — Objectifs par pôle.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#350` `#351`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b fix/issue-362-pilotage-poles-ui origin/dev
```

---

## Périmètre

Corriger l’UI Objectifs par pôle + KPIs Pilotage :

- Titres KPI lisibles (pas le `truncate` Accueil)
- Pastilles Mois/Annuel + Combobox mois (design system, portail)
- Exercice **Tous** : buckets mois depuis les lignes (`uniqueFacturationMonthKeys`), pas `months=[]`
- Une seule section pôle — clés React distinctes vs tableau mensuel

### Acceptance criteria

- [ ] Titres **CA cumulé** / **Marge brute** entiers
- [ ] Une seule carte **Objectifs par pôle**
- [ ] Mois = CA du mois / Objectif mensuel ; Annuel = totaux / ×12
- [ ] Combobox de mois, pas de `<select>` natif
- [ ] Tous : août avec CA réel, pas `0,00 € / 0,00 €`

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- View-models = chiffres ; zéro logique dans les composants
- **Interdit : `git worktree`**

## Fichiers impactés

- `apps/web/src/view-models/facturation-pilotage-filter.ts` — mois Tous
- `apps/web/src/view-models/facturation-month-key.ts` — `uniqueFacturationMonthKeys`
- `apps/web/src/components/organisms/FacturationPilotagePoles.tsx` — contrôles dans le body
- `apps/web/src/components/organisms/FacturationPilotagePoleControls.tsx` — PillTabs + Combobox
- `apps/web/src/components/organisms/FacturationPilotagePage.tsx` — clés React uniques
- `apps/web/src/components/molecules/PilotageStatTile.tsx` — titres KPI sans truncate

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm dev
```

Ouvrir http://localhost:3000/facturation/pilotage

## Tests manuels

- [ ] Titres KPI **CA cumulé** et **Marge brute** lisibles (pas `CA c…`)
- [ ] Une seule section Objectifs par pôle (Placement + Intérim)
- [ ] Pastille **Mois** : CA août / 20 000 € ; **Annuel** : même CA / 240 000 €
- [ ] Combobox mois : un mois vide → `0,00 € / 20 000,00 €`
- [ ] Exercice **Tous** : mode Mois non vide si des lignes existent
