# Prompt — Issue #301

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/301  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #300  
**Slug branche** : `feat/issue-301-interview-close`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : à la fin de l’entretien on note (grille B/C préremplie mais modifiable), on décide éligible ou non, on propose de mettre à jour la fiche candidat (sans écraser en silence) et éventuellement le statut (ex. Qualifié / Blacklisté) avec confirmation, et on garde l’historique de plusieurs entretiens terminés.
2. **Pose 2 à 4 questions** + **reco** (seuils Qualifié vs À qualifier, libellés décision).
3. **Attends validation** avant de coder.
4. Lire handoff #300.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-301-interview-close origin/dev
```

---

## Périmètre

- Clôture : grille B/C préremplie + éditable
- Décision ELIGIBLE | NON_ELIGIBLE | REVIEW
- Mapping champs Candidate **sans écrasement silencieux** (confirm)
- Proposition changement status Candidate (confirm)
- ActivityLog création/clôture
- Soft-delete selon rôles
- Plusieurs CLOSED OK ; toujours 1 DRAFT max
- **Sans IA obligatoire** (IA = #303)

### Acceptance criteria

- [ ] Clôture sans IA OK
- [ ] Scores + décision persistés
- [ ] Mapping avec confirm si overwrite
- [ ] Status seulement après confirm
- [ ] ActivityLog
- [ ] Multi CLOSED + 1 DRAFT max

---

## Contraintes

- Services purs testables pour scoring + mapping
- Fichiers < 100 lignes, TDD

---

## Fin

PR vers `dev` avec `Closes #301`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Clôturer un entretien rempli → statut CLOSED, visible dans l’historique
- [ ] Champ déjà rempli sur la fiche → demande confirm avant écrasement
- [ ] Proposition Blacklisté / Qualifié → rien ne change sans confirm
- [ ] Relancer un nouvel entretien après clôture → OK (historique + nouveau DRAFT)
