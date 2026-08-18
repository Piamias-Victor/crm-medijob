# Prompt — Issue #298

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/298  
**Parent** : PRD #226 — Entretiens CRM  
**Blocked by** : #297  
**Slug branche** : `feat/issue-298-interview-start`

---

## Briefing humain (obligatoire — AVANT tout code)

1. **Explique en français simple** ce qu’on livre : pouvoir lancer un entretien même si la personne n’est pas encore dans la CVthèque — ça crée le candidat tout de suite, avec un brouillon d’entretien ; ou lancer depuis une fiche existante ; un seul brouillon à la fois ; reprendre / abandonner sans effacer le candidat.
2. **Pose 2 à 4 questions** + **reco** chacune (ex. champs identité minimum obligatoires, comportement si brouillon déjà ouvert).
3. **Attends validation** avant de coder.
4. Lire handoff #297 si présent : `docs/handoffs/HANDOFF_ISSUE_297.md`.

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md` + handoff #297.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-298-interview-start origin/dev
```

Merger / rebaser `dev` pour inclure #297 si déjà mergé.

---

## Périmètre

- CTA **Nouvel entretien** (accueil / candidats)
- Identité minimale → Candidate `Nouveau` + Interview DRAFT
- Démarrage depuis fiche candidat existante
- Modes INTERIM | CDD_CDI
- **Un seul DRAFT** par Candidate (serveur)
- Reprise depuis onglet Entretiens
- Abandon brouillon ≠ suppression Candidate
- JobTitle depuis profil si manquant ; référent sur Interview

### Acceptance criteria

- [ ] Sans candidat → crée Candidate + DRAFT
- [ ] Depuis fiche → DRAFT sur l’existant
- [ ] 2ᵉ DRAFT refusé tant qu’un ouvert
- [ ] Reprise OK
- [ ] Abandon garde le Candidate

### Hors slice

Dédup (→ #299), questionnaire complet (#300), clôture (#301).

---

## Contraintes

- Réutiliser patterns création candidat
- Fichiers < 100 lignes, RHF + Zod, TDD
- Prisma dans repositories uniquement

---

## Fin

PR vers `dev` avec `Closes #298`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm dev
```

## Tests manuels

- [ ] CTA Nouvel entretien → saisie identité → candidat créé + brouillon ouvert
- [ ] Depuis fiche existante → nouvel entretien DRAFT
- [ ] Tentative 2ᵉ brouillon → message d’erreur / reprise du premier
- [ ] Abandonner le brouillon → candidat toujours en CVthèque
