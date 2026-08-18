# Handoff — Issue #303 (Interview AI)

## État

**Validé user · merge `dev` demandé.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/303
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/311
- Prompt : `docs/prompts/done/PROMPT_ISSUE_303.md`
- Spec : `docs/PRD_ENTRETIENS_V1.md` US 15–16, 39 · ADR `docs/adr/0014-interview-as-entity.md`
- Parent : PRD #226 · bloqué par #301 (mergé) · parallèle #302 (PDF, mergé)
- Branche : `feat/issue-303-interview-ai` (repo principal, pas de worktree)

## Livré

Voir diff PR #311. Ne pas relire tout le slice.

Close DRAFT : bloc **Résumé IA** = champ fiche `candidate.cvSummary` (même que Profil). Aperçu prérempli avec l’existant. Bouton **Générer résumé IA** → OpenRouter (`createAssistantProvider` + mock tests) à partir des réponses. Recruteur édite. **Valider la clôture** persist. Zéro scores IA. Close **sans** Générer = pas d’appel IA. Payload Zod KO → message, close OK. PDF close (#302) non cassé.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Rôle IA | Remplir `cvSummary` fiche, pas scores B/C (déjà règles + sliders) |
| Champ | Identique Profil : « Résumé IA / Synthèse pour le matching » |
| Parcours | Afficher existant → Générer → modifier → Valider la clôture enregistre |
| Auto close | Non — bouton optionnel |

## Pièges

- Persist `cvSummary` = champ close (`interviewCloseSchema`), **pas** `candidate.saveCvSummary` séparé. Omit `cvSummary` → fiche inchangée ; form envoie toujours la string (existant ou généré).
- Suggest = `interview.suggestCvSummary` ; Zod `summaryResponseSchema` (`kind: 'summary'`). Prompt = réponses formatées en « Notes et expérience » pour le mock.
- `CloseSideEffectProfile` a maintenant `cvSummary` + `jobTitleName` — fixtures start/close doivent les porter (`provider` aussi sur `InterviewDeps`).
- Pas Claude direct proto eval. Pas T4S.

## Tests manuels

OK user (« super » + merge demandé). Checklist PR #311.

## Suite

- Parent **#226** encore OPEN — enfants #297–#303 livrés ; clôture parent = humain si le PRD est considéré fini.
- Phase 5 : pas de worktree ; supprimer branche locale après merge.

## Suggested skills

- `/caveman`
- `/tdd`
- `/triage` si clôturer #226
