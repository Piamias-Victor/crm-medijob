# Prompt — Issue #299

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/299  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #298  
**Slug branche** : `feat/issue-299-interview-dedup`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : au démarrage d’entretien, si l’email ou le téléphone existe déjà, on ne crée pas un doublon — on propose de rattacher l’entretien au candidat déjà en base (comme quand on crée un candidat à la main).
2. **Pose 2 à 4 questions** + **reco** (ex. fusion complète vs simple rattachement du brouillon).
3. **Attends validation** avant de coder.
4. Lire handoffs #298 (et #297 si utile).

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
git checkout -b feat/issue-299-interview-dedup origin/dev
```

Lire `docs/prompt-rules.md`, `docs/github-rules.md`, `docs/handoffs/HANDOFF_ISSUE_298.md`.

---

## Périmètre

- Détection doublon email/tél à l’ouverture (réutiliser detect candidat existant)
- Écran review attach / merge
- DRAFT créé sur le Candidate existant si rattache
- Pas de doublon silencieux

### Acceptance criteria

- [ ] Doublon email/tél → review
- [ ] Attach → DRAFT sur candidat existant
- [ ] Merge réutilise les patterns existants

### Hors slice

Parcours questions (#300), clôture (#301). Peut avancer en parallèle de #300 après #298.

---

## Contraintes

- Réutiliser `detectCandidateDuplicates` / duplicate-review
- Fichiers < 100 lignes, TDD

---

## Fin

PR vers `dev` avec `Closes #299`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Nouvel entretien avec email d’un candidat existant → écran doublon
- [ ] Choisir rattacher → brouillon sur la fiche existante (pas de 2ᵉ fiche)
- [ ] Email inconnu → création normale (régression #298)
