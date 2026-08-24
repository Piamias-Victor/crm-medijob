# Prompt — Issue #349

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/349  
**Parent** : PRD #345 — Facturation Pilotage  
**Blocked by** : #346, #347  
**Slug branche** : `feat/issue-349-pilotage-kpis-exercice`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #345.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#346` et `#347` s’ils existent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-349-pilotage-kpis-exercice origin/dev
```

---

## Périmètre

Remplir **Pilotage** : filtre Exercice (oct→sept, défaut courant, + Tous), filtre Referent, 4 KPIs (CA cumulé split CDD/CDI · intérim, Marge brute + % CA, placements actifs, pharmacies actives), bandeau rouge lignes annulées. Union CA : Lignes + Devis Mission **sans** Ligne liée. Tests sur le builder pur, pas Recharts.

### Acceptance criteria

- [ ] Exercice oct→sept ; mois Oct→Sep ; Tous
- [ ] 4 KPIs = union + hors annulés
- [ ] Bandeau annulés : nb + CA + Marge
- [ ] Mission liée → lignes only ; ligne sans Mission ne masque pas un Devis
- [ ] Recruteur FORBIDDEN
- [ ] Tests `buildPilotage` (ou équivalent) + createCaller

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- View-models pour les agrégats ; Recharts hors slice

## Fichiers impactés

- `apps/web/src/app/(dashboard)/facturation/` — page Pilotage
- `apps/web/src/view-models/` — Exercice + union + KPIs
- `apps/web/src/server/routers/facturation.ts` — query Pilotage

Vocabulaire : Exercice, Pilotage, CA / Marge. ADR 0019.

---

## Fin

PR vers `dev` avec `Closes #349`. Phase 3 obligatoire. **Interdit worktree.**

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Direction : Pilotage, Exercice 25/26 → 4 tuiles + split CA
- [ ] Annuler une ligne → KPI actifs baissent, bandeau rouge +1
- [ ] Devis accepté sans Ligne : CA dans Pilotage, pas dans Placements
- [ ] Recruteur : pas Facturation
