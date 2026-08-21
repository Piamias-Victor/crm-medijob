# Prompt — Issue #328

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/328  
**Parent** : PRD #325 — Finance Devis + suivi  
**Blocked by** : #327  
**Slug branche** : `feat/issue-328-devis-accept-ca-status`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : **Accepter** le Devis courant enregistre le **CA** (montant HT **une fois**, date = acceptation). Pastille **état commercial** à côté du statut Mission (Sans devis → Envoyé → Accepté → Facturé) — on **n’ajoute pas** ça dans `MissionStatus`. Recruteur voit l’état. **Marge** déjà saisie par tout le monde sur l’onglet Devis (#326). Direction / RH-Admin voient le **CA** et cochent **Facturé** (date). Mission **Annulée** → CA 0. Communication peut accepter (`crm.write`).
2. **Pose 2 à 4 questions** + **reco** :
   - CA stocké vs dérivé ? **Reco : dérivé** (PRD) ; Marge colonne Mission.
   - Facturé : qui clique ? **Reco : `finance.view` only** (Direction / RH-Admin).
3. **Attends validation** avant de coder.
4. Lire handoff #327. `CONTEXT.md` Commercial status, CA/Marge.

```
CA = ANNULEE ? 0 : (current ACCEPTED ? amountHt : 0)
```

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#327` si présent.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-328-devis-accept-ca-status origin/dev
```

---

## Périmètre

- Accept SENT → ACCEPTED ; CA une fois ; date accept
- Commercial status dérivé ; Mission status inchangé
- Marge déjà sur Devis (#326) ; Facturé = `invoicedAt` ; ne bouge pas le mois de CA
- Facturé = `invoicedAt` ; ne bouge pas le mois de CA
- ANNULEE → CA 0
- Hors slice : écran Facturation (#329)

### Acceptance criteria

- [ ] Accept → CA = HT, date = accept
- [ ] Recruteur/Communication : pas CA ; Marge déjà sur Devis (#326) ; peuvent accepter
- [ ] Pastille état commercial
- [ ] Marge manuelle Direction ; Facturé date
- [ ] ANNULEE → CA 0
- [ ] ActivityLog DEVIS à l’accept

---

## Contraintes

- Fichiers < 100 lignes, TDD
- `finance.view` pour CA / Facturé (Marge = tous les rôles, #326)
- Ne pas étendre l’enum MissionStatus

## Fichiers impactés

- Fiche Mission — pastille + bloc Marge (gate)
- Permissions `can()` — déjà `finance.view`
- Lifecycle Mission ANNULEE

---

## Fin

PR vers `dev` avec `Closes #328`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Recruteur accepte → pastille Accepté ; Marge déjà sur Devis ; pas de CA
- [ ] Direction : CA = HT, tape Marge, coche Facturé → mois CA inchangé
- [ ] Annuler la Mission → CA disparaît du suivi (0)
- [ ] Communication : peut accepter, ne voit pas le CA
