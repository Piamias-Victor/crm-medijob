# Prompt — Issue #329

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/329  
**Parent** : PRD #325 — Finance Devis + suivi  
**Blocked by** : #328  
**Slug branche** : `feat/issue-329-facturation-nav-list`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : un item menu **Facturation** pour Direction / RH-Admin seulement. Recruteur / Communication ne le voient pas. Sous-onglet **Devis** : tableau de tous les devis (dates, Referent, Pharmacy, type de contrat, état commercial). Clic → Mission. **Accueil** ne change pas (pas de CA sur le dashboard ops).
2. **Pose 2 à 4 questions** + **reco** :
   - Route `/facturation` vs `/facturation/devis` ? **Reco : `/facturation` avec sous-nav Devis** (Suivi charts = #330).
   - Liste = toutes les versions ou courant seulement ? **Reco : une ligne par Mission = Devis courant** (+ filtre Sans devis).
3. **Attends validation** avant de coder.
4. Lire handoff #328. Pattern liste Missions / nav `navigation.ts`.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#328` si présent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-329-facturation-nav-list origin/dev
```

---

## Périmètre

- Nav Facturation si `finance.view`
- 403 Recruteur / Communication
- Table + filtres ; clic → Mission
- Accueil KPI inchangé
- Hors slice : graphes (#330)

### Acceptance criteria

- [ ] Nav visible Direction / RH-Admin only
- [ ] Recruteur : pas d’item, route 403
- [ ] Liste + filtres dates, Referent, Pharmacy, contrat, état commercial
- [ ] Clic ligne → Mission
- [ ] Accueil sans widgets CA

---

## Contraintes

- Fichiers < 100 lignes, TDD
- RSC liste via `createCaller` ; atomic design
- Zustand = UI filtres seulement, pas les devis

## Fichiers impactés

- `apps/web/src/lib/navigation.ts` — item Facturation
- Nouvelle route dashboard Facturation
- Permissions caller tests

---

## Fin

PR vers `dev` avec `Closes #329`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Direction : menu Facturation → liste des devis courants
- [ ] Filtrer Referent / état Envoyé → lignes cohérentes
- [ ] Clic → fiche Mission du devis
- [ ] Recruteur : pas de menu Facturation ; URL directe → 403
