# Prompt — Issue #297

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/297  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : None  
**Slug branche** : `feat/issue-297-interview-foundations`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** (comme à un non-dev) ce qu’on va faire dans cette issue, en 5–10 phrases max. Pas de jargon (pas « Prisma », « tRPC », « seed » sans traduction). Ex. : « On pose les bases de l’entretien dans le CRM : le vocabulaire, la fiche technique en base, les métiers aux bons noms, les questionnaires, et un onglet Entretiens encore vide sur le candidat. »
2. **Pose 2 à 4 questions** sur les choix encore flous pour *cette* slice uniquement. Pour chaque question : options courtes + **ta recommandation** + pourquoi en une phrase.
3. **Attends la réponse** de Victor avant `/caveman` + setup git + code.
4. Interdit de commencer l’implémentation tant que le briefing n’a pas été validé (ou « ok go » explicite).

Sources : issue #297, `docs/PRD_ENTRETIENS_V1.md`, `CONTEXT.md`, inventaires `docs/grill/inventories/`, zip eval si besoin (trames).

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
git checkout -b feat/issue-297-interview-foundations origin/dev
```

(Worktree seulement si parallèle — cf. github-rules.)

---

## Périmètre

Vertical slice fondations :

- Terme **Interview** + chemins de création Candidate dans `CONTEXT.md`
- ADR : Interview = entité à part entière
- Modèle Interview (DRAFT|CLOSED, INTERIM|CDD_CDI, décision, answers/scores, candidateId, referentId)
- Seed JobTitles : libellés **identiques** aux profils (Pharmacien, Préparateur, Étudiant en pharmacie, Conseiller parapharmacie, Rayonniste) + mapping profileKey
- Seed trames (5 profils × modes) depuis medijob-eval
- Repo + tRPC list/get par candidat
- Onglet **Entretiens** sur fiche candidat (liste vide / shell)
- Droits lecture selon matrice de rôles

### Acceptance criteria (issue)

- [ ] Interview persisté et listable pour un Candidate
- [ ] Libellés JobTitle = profils entretien
- [ ] Trames seedées 5 profils
- [ ] ADR + CONTEXT à jour
- [ ] Tests repo / tRPC

### Hors slice

Démarrer entretien, dédup, UI réponses, clôture, PDF, IA.

---

## Contraintes

- Prisma uniquement dans repositories
- Fichiers < 100 lignes, zéro `any`, Zod
- Vocabulaire `CONTEXT.md` (Interview ≠ PipelineStage « Entretien », ≠ Application)
- Pas de T4S / qualification projet

---

## Fin

PR vers `dev` avec `Closes #297`.  
Phase 3 : poster commande de test + tests manuels.  
Handoff seulement sur demande → `docs/handoffs/HANDOFF_ISSUE_297.md`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Ouvrir un candidat → onglet Entretiens visible (liste vide OK)
- [ ] Admin métiers : libellés Pharmacien / Préparateur / etc. présents et alignés
- [ ] Rôle Communication : peut voir l’onglet en lecture selon droits existants
