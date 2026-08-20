# Prompt — Issue #315

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/315  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #313  
**Slug branche** : `feat/issue-315-interview-template-reuse-questions`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** : pour ne pas tout retaper, l’admin peut **dupliquer** une question dans le questionnaire en cours, ou **piocher** des questions dans un *autre* questionnaire (autre métier / autre type) et les coller. Ça ne publie pas tout seul. Les copies ont de **nouveaux identifiants** pour ne pas mélanger les réponses d’un entretien déjà lancé.
2. **Pose 2 à 4 questions** + **reco** :
   - Source du picker = seulement versions **publiées** vs aussi la copie de travail d’une autre trame ? **Reco : publiées seulement** (source stable).
   - Si l’insert crée un 2e mapping « dispo » : coller quand même et bloquer au Publier, ou refuser l’insert ? **Reco : coller + warning ; #313 refuse déjà le publish.**
3. **Attends validation** avant de coder.
4. Lire handoff #313. **Pas** de fusion magique de deux trames entières (#314).

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
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-315-interview-template-reuse-questions origin/dev
```

---

## Périmètre

- Dupliquer une question dans la copie de travail (nouvel id)
- Insérer depuis une autre trame **publiée** : picker métier × mode → multi-select
- Copie = texte, réponses, éliminatoire, scoring, mapping
- Pas d’auto-publish ; Interviews existants inchangés

### Acceptance criteria

- [ ] Dupliquer sur place → nouvel id
- [ ] Insert depuis une autre trame publiée → nouveaux ids
- [ ] Scoring + mapping copiés, encore éditables
- [ ] Pas de publish automatique
- [ ] Recruteur toujours sans accès éditeur

Parallel OK avec #314 après #313.

---

## Contraintes

- Fichiers < 100 lignes, TDD
- Pas de T4S
- UX : pas de ressaisie ; pas de fusion de trames entières ici

---

## Fin

PR vers `dev` avec `Closes #315`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Dupliquer une question → deux lignes, on peut modifier la copie
- [ ] Insérer 2 questions depuis Pharmacien INTERIM vers Préparateur INTERIM → présentes, ids différents
- [ ] Sauver sans publier → un DRAFT recruteur inchangé
- [ ] Publier après insert → nouvel entretien voit les questions insérées
