# Prompt — Issue #326

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/326  
**Parent** : PRD #325 — Finance Devis + suivi  
**Blocked by** : none (#213 mergé)  
**Slug branche** : `feat/issue-326-devis-draft-engine`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : sur une **Mission**, on crée un **Devis** brouillon pour la **Pharmacy**. Prix **libre** : heures + taux puis Calculer (moteur WeTransfer), **ou** HT tapé. Les heures restent modifiables ; un HT tapé ne se recale pas tout seul. CDD/CDI = forfait HT. Pas d’envoi, pas de packs tarifs Medijob. Recruteur voit HT/TTC, **pas** CA/Marge.
2. **Pose 2 à 4 questions** + **reco** :
   - Snapshot = colonnes + JSON `inputs` ? **Reco : colonnes HT/heures/kind/status + JSON inputs** (primes/coef).
   - Bloc Devis : onglet Mission vs carte dans la fiche ? **Reco : carte/section sur la fiche Mission** (`/missions/[id]`).
3. **Attends validation** avant de coder.
4. Lire `CONTEXT.md` (Devis, CA/Marge). Spec `docs/PRD_FINANCE_DEVIS_V1.md`. Source formules : WeTransfer `medijob-devis/engine.js` (saisie libre seulement).

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-326-devis-draft-engine origin/dev
```

---

## Périmètre

- Entité Devis DRAFT liée à une Mission
- INTERIM : heures + taux → Calculer HT/TTC **ou** HT libre
- CDD/CDI : forfait HT ; heures optionnelles
- Zod ; rouver le brouillon avec les saisies
- Hors slice : Send (#327), Accept/CA (#328), Facturation (#329–#330)

### Acceptance criteria

- [ ] Create/save DRAFT depuis Mission
- [ ] Calculer heures×taux remplit HT/TTC
- [ ] HT tapé : changer heures n’écrase pas tant que pas Calculer
- [ ] CDD/CDI forfait HT
- [ ] Recruteur : HT/TTC visibles, pas CA/Marge
- [ ] Pas de packs tarifs ; pas d’envoi

---

## Contraintes

- Fichiers < 100 lignes, TDD, Prisma repositories only
- RSC lectures, mutations `trpc.useMutation`
- Glossaire : Devis ≠ Document ≠ ActivityLog DEVIS

## Fichiers impactés

- `apps/web/prisma/schema.prisma` — modèle Devis
- `apps/web/src/app/(dashboard)/missions/[id]/` — UI
- WeTransfer `engine.js` — formules (port TS, pas coller le HTML)

---

## Fin

PR vers `dev` avec `Closes #326`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Mission → Devis INTERIM : 151,67 h × 28 € → Calculer → HT/TTC affichés
- [ ] Taper HT 4500, changer les heures → HT reste 4500 jusqu’à Calculer
- [ ] CDD : forfait 3000 €, sauver, recharger → valeurs là
- [ ] Compte Recruteur : pas de Marge / CA sur la fiche
