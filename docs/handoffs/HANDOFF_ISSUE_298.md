# Handoff — Issue #298 (Interview start)

## État

**Validé user · mergé / à merger sur `dev`.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/298
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/306
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_298.md` → `docs/prompts/done/` après merge
- Spec : `docs/PRD_ENTRETIENS_V1.md` · ADR `docs/adr/0014-interview-as-entity.md`
- Parent : PRD #226 · bloqué par #297 (mergé)
- Branche : `feat/issue-298-interview-start` (repo principal, pas de worktree)

## Livré

Voir diff PR #306. Points d’entrée :

- tRPC `interview.start` / `interview.abandon`
- Service `apps/web/src/server/interview/start.ts` + `abandon.ts`
- Un DRAFT / candidat : check applicatif + index partiel `Interview_one_draft_per_candidate`
- Routes : `/candidats/entretiens/new`, `/candidats/[id]/entretiens/new`, `/candidats/[id]/entretiens/[interviewId]`
- CTAs : Accueil, CVthèque, header fiche, onglet Entretiens
- Page brouillon = **shell** (statut + abandon). Questionnaire = **#300**

DX local (hors prod) : auto-login Testeur via `/api/auth/dev-login`. Désactiver avec `AUTH_DEV_AUTO_LOGIN=off`. Jamais en `NODE_ENV=production`.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Identité min | `firstName`, `lastName`, `jobTitleId`, `mode` + **email OU téléphone** |
| 2ᵉ DRAFT | **2A** — serveur refuse ; message + CTA **Reprendre le brouillon** |
| Abandon | Soft-delete Interview (`deletedAt`) ; Candidate reste `Nouveau` |
| Depuis fiche | **4B** — confirmer identité (form prérempli), pas mode seul |
| Mode UI | Combobox custom (`InterviewStartFields`) |
| Page DRAFT vide | Attendu — questionnaire #300 |

## Tests

- Unitaires : verts localement
- Intégration : CI `quality` cassé sur 2e `create` DRAFT même candidat — tests repo alignés sur l’index unique partiel
- Manuels : **OK** (user « ok parfait »)

## Suite

- Prochaine slice : **#299** (`docs/prompts/pending/PROMPT_ISSUE_299.md`) — dédup email/tél à l’ouverture
- Puis **#300** — questionnaire (la page DRAFT restera un shell jusqu’à là)
- Hors slice : clôture, PDF, IA, éditeur admin trames
- Phase 5 : pas de worktree ; supprimer branche locale après merge

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` si la slice #300 (trames / parcours questions) a des choix encore flous
