# Prompt — Issue #330

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/330  
**Parent** : PRD #325 — Finance Devis + suivi  
**Blocked by** : #329  
**Slug branche** : `feat/issue-330-facturation-stats-recharts`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : dans Facturation, un **Suivi** pour Direction : **CA**, **Marge**, compteurs (sans devis / envoyé / accepté / facturé). Coupes : **Referent** (seau sans référent), **Pharmacy**, type de contrat, **dates** (acceptation). Graphes **Recharts**, look fluide. **Pas** de coupe par Candidate. Les tests vérifient les chiffres, pas les pixels.
2. **Pose 2 à 4 questions** + **reco** :
   - Suivi = sous-onglet vs haut de `/facturation` ? **Reco : sous-onglet Suivi** à côté de Devis (#329).
   - Période défaut : mois en cours vs 12 mois ? **Reco : mois en cours**, sélecteur de plage.
3. **Attends validation** avant de coder.
4. Lire handoff #329. Read-model CA de #328. Pas de slice Candidate (PRD).

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#329` si présent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-330-facturation-stats-recharts origin/dev
```

---

## Périmètre

- Onglet Suivi Facturation
- CA / Marge / compteurs d’état
- Slices Referent, Pharmacy, contrat, dates
- Recharts ; tests sur agrégats
- Recruteur toujours hors Facturation

### Acceptance criteria

- [ ] Suivi : CA, Marge, 4 compteurs d’état
- [ ] Slices Referent (dont sans référent), Pharmacy, contrat, dates
- [ ] Pas de slice Candidate
- [ ] Recruteur : toujours 403
- [ ] Tests = read-model, pas layout Recharts

---

## Contraintes

- Fichiers < 100 lignes, TDD
- `finance.view` only
- CA dérivé (PRD) ; ANNULEE déjà à 0 via #328

## Fichiers impactés

- Route Facturation — sous-nav Suivi
- Agrégats tRPC + view-models
- Recharts (UI seulement)

---

## Fin

PR vers `dev` avec `Closes #330`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Direction : Facturation → Suivi : CA du mois = somme des Devis acceptés
- [ ] Mission annulée absente du CA
- [ ] Coupe Referent : Léa vs sans référent
- [ ] Recruteur : toujours pas Facturation
