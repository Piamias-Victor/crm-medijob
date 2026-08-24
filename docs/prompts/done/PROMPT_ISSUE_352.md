# Prompt — Issue #352

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/352  
**Parent** : PRD #345 — Facturation Pilotage  
**Blocked by** : #347  
**Slug branche** : `feat/issue-352-interim-vue-client`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #345.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#347` s’il existe.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-352-interim-vue-client origin/dev
```

---

## Périmètre

Onglet Intérim : **Vue par client** (nb missions, heures, CA, Marge, CA/h, Marge/h, dernière date) **et** Toutes les missions. Toggle comme op-medijob. Mêmes filtres Exercice / Referent.

### Acceptance criteria

- [ ] Toggle Vue par client / Toutes les missions
- [ ] Agrégats pharmacie : count, heures, CA, Marge, CA/h, Marge/h, dernière date
- [ ] Recruteur FORBIDDEN
- [ ] Tests builder agrégat pharmacie

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Heures déjà sur la Ligne de suivi

## Fichiers impactés

- Page / organisms Intérim
- View-model agrégat par Pharmacy

Vocabulaire : Ligne de suivi (kind Intérim), Pharmacy.

---

## Fin

PR vers `dev` avec `Closes #352`. Phase 3 obligatoire. **Interdit worktree.**

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Intérim → Vue par client : pharmacies triées, totaux heures/CA
- [ ] Toggle Toutes les missions → liste lignes
- [ ] Filtre mois → les deux vues se recoupent
