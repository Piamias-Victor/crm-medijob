# Prompt — Issue #351

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/351  
**Parent** : PRD #345 — Facturation Pilotage  
**Blocked by** : #350  
**Slug branche** : `feat/issue-351-pilotage-mensuel-matrice`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Pas de co-crédit : 1 ligne = 1 Referent. Matrice somme = CA agence.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#350` s’il existe.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-351-pilotage-mensuel-matrice origin/dev
```

---

## Périmètre

Fin du scroll Pilotage : cartes conversion CDI/CDD, tableau Go/NoGo mensuel, extrêmes, légende méthode, tableau mensuel (clic → lignes du mois), matrice Referent × mois. Seau « — Non attribué — ».

### Acceptance criteria

- [ ] Cartes CDI / CDD : engagés, conversion %, facturés, perdus + CA projeté
- [ ] Tableau Go/NoGo + extrêmes + caption
- [ ] Tableau 12 mois : placements (CDD/CDI + intérim), CA split, Marge ; clic → détail
- [ ] Matrice sans co-crédit ; vide = Non attribué
- [ ] Tests sur le même builder Pilotage

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Pas de slice par Candidate

## Fichiers impactés

- View-models Go/NoGo / mensuel / matrice
- Organism Pilotage (suite du scroll)

Vocabulaire : NoGo, Referent, Exercice. ADR 0018, 0020.

---

## Fin

PR vers `dev` avec `Closes #351`. Phase 3 obligatoire. **Interdit worktree.**

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Cartes CDI vs CDD : conversion et CA perdu projeté
- [ ] Clic une ligne du tableau mensuel → lignes de ce mois
- [ ] Matrice : un Referent, total = CA agence (pas 2×)
- [ ] Ligne sans Referent → Non attribué
