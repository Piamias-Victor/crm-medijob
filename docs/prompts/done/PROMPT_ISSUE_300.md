# Prompt — Issue #300

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/300  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #298  
**Slug branche** : `feat/issue-300-interview-answers`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : pendant l’appel, le recruteur suit le questionnaire (sections, réponses toutes faites ou notes libres), voit les questions éliminatoires, coche le dossier (CV, pièce d’identité…), et tout s’enregistre au fur et à mesure pour ne rien perdre si l’appel coupe.
2. **Pose 2 à 4 questions** + **reco** (ex. navigation section par section vs longue page, fréquence de sauvegarde).
3. **Attends validation** avant de coder.
4. Lire handoff #298. Trames = seed #297.

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
git checkout -b feat/issue-300-interview-answers origin/dev
```

Lire règles + `docs/handoffs/HANDOFF_ISSUE_298.md`.

---

## Périmètre

- UI parcours unifié (sections → réponses)
- Réponses scorées suggérées + notes libres
- Mise en avant éliminatoires
- Checklist dossier (type B8) sur l’Interview
- Autosave DRAFT (mutation tRPC)
- Couvrir les 5 profils (trames seed)

### Acceptance criteria

- [ ] Réponses persistées en DRAFT pour tous les profils
- [ ] Éliminatoires visibles
- [ ] Autosave survit au refresh
- [ ] Checklist dossier stockée sur l’Interview

### Hors slice

Clôture / score final (#301), PDF, IA. Parallel OK avec #299.

---

## Contraintes

- RHF + Zod, fichiers < 100 lignes, atomic design
- Pas de logique métier dans les composants

---

## Fin

PR vers `dev` avec `Closes #300`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Ouvrir un DRAFT → répondre à 2–3 questions → refresh → réponses encore là
- [ ] Question éliminatoire clairement repérable
- [ ] Cocher documents dossier → toujours coché après refresh
- [ ] Changer de profil (autre candidat / autre trame) → bonnes questions affichées
