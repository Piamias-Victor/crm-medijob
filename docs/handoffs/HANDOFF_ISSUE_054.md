# Handoff — Issue #54 (CANDIDATS — CVthèque liste + kanban PipelineStage + inbox Applications)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert.** Page `/candidats` : 2 onglets (CVthèque, Candidatures reçues). CVthèque = toggle Liste/Kanban. Kanban drag-and-drop par mission (natif HTML5) → mutation `MissionCandidate.stageId`. Inbox = Applications EN_ATTENTE read-only.

- Branche : `feat/issue-54-candidats-cvtheque-kanban`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-54`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/54 · Prompt : `docs/prompts/PROMPT_ISSUE_054.md`
- Spec : `SPEC_V2.md` §6 + §10 · ADR 0001/0004/0005
- Dépend de #53 (auth JWT, `protectedProcedure`, `getServerCaller`)

## Décision clé : layout kanban (tension spec résolue)

Spec dit "colonnes = stages" ET ADR 0001 "carte = candidat avec ses missions actives". Incompatible tel quel (1 carte ne vit pas dans 2 colonnes).

**Choix** : colonnes = PipelineStage par `position`. Une carte candidat est rendue **par colonne**, regroupant uniquement ses rows actives à ce stage. Candidat 2 missions même stage → 1 carte, 2 rows. Drag d'1 row → autre colonne = 1 seul `MissionCandidate` modifié (l'autre intacte). Satisfait drag-par-mission + colonnes=stages + manual tests.

## Livré (voir diff PR)

- `lib/pipeline-constants.ts` — `TERMINAL_STAGE_NAMES` (Placé/Pas retenu), `TERMINAL_MISSION_STATUSES` (POURVU/ANNULEE) ; import type-only de `@prisma/client` (évite bundle Prisma côté client)
- `view-models/candidate-kanban.{ts,types,fixtures}` — `activeMissions` (filtre), `buildKanbanColumns` (colonnes par position, group par stage), `moveMissionRow` (update optimiste pur), `toListItems`
- `server/db/repositories/candidate.repository.ts` — `listForKanban` (select candidat + jobTitle/referent/missions+stage+mission.status)
- `server/db/repositories/mission-candidate.repository.ts` (nouveau) — `updateStage`
- `server/db/repositories/application.repository.ts` — `listInbox` (EN_ATTENTE + jobTitle/jobOffer)
- `server/routers/{candidate,mission-candidate,application}.ts` + `_app.ts` — tous `protectedProcedure` ; `candidate.cvtheque`, `missionCandidate.updateStage` (Zod), `application.listInbox`
- UI atomic (<100 lignes/fichier) : `CandidatsPage`, `CandidatTabs`, `ViewToggle`, `CvthequeSection`, `CvthequeList`, `CvthequeKanban`, `KanbanColumn`, `CandidateKanbanCard`, `KanbanMissionRow`, `kanban-dnd.ts` (parse payload typé, zéro `any`), `ApplicationInbox`
- `app/(dashboard)/candidats/page.tsx` — RSC via `getServerCaller`, reads parallèles, props → `<CandidatsPage>` client
- `prisma/seed-demo.ts` + hook dans `seed.ts` — démo idempotente : Camille Durand sur 3 missions (2 actives stage Nouveau + 1 POURVU exclue), 1 Application EN_ATTENTE (Léa Bernard)

### Tests (TDD red→green)

- `view-models/candidate-kanban.test.ts` (8) + `.move.test.ts` (2) — filtre actif, colonnes, group même stage, exclusion terminale, list items, move ciblé
- `server/routers/mission-candidate.test.ts` (3) — updateStage (repo mocké), unauth rejette, input vide rejette
- Suite complète **67 verts** · `lint` · `typecheck` · `lint:lines` · `next build` verts

## Pièges / dette

- **Kanban DnD natif HTML5** (pas de lib dnd-kit). Pas de feedback visuel drop-zone ni clavier/a11y drag — itérer si besoin (#64+).
- **Update optimiste** : `moveMissionRow` local + `router.refresh()` en `onSettled`. Pas de rollback explicite si la mutation échoue → l'état se resync au refresh (donc revert visuel au prochain render serveur). OK pour V2.
- **`export type *`** utilisé dans `candidate-kanban.ts` pour re-exporter les types (contrainte <100 lignes → types splités dans `.types.ts`).
- **Conflit attendu** #59/#77 sur `_app.ts` + repos partagés — merger `dev` souvent.
- **Test intégration flaky** : 1 fichier testcontainers a échoué 1x au démarrage Docker (0 test en échec), vert au re-run. Non lié au code.
- Seed démo idempotent (ids `demo-*`) — réexécutable sans doublon.

## Hors scope (suite)

- Fiche candidat `/candidats/[id]` (#55)
- Webhook Webflow candidatures (#71)
- Traitement/fusion inbox → conversion Candidate (#72)

## Suggested skills

- `/caveman` + `/tdd` pour toute issue
- Plugin Prisma (`prisma-client-api-*`) pour le travail DB
