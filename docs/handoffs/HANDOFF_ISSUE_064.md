# Handoff — Issue #64 (MISSIONS — Liste + kanban MissionStatus)

`/caveman` + `/tdd` actifs.

## État

**Prêt pour review.** Branche locale implémentée, tests unitaires verts, `typecheck` + `lint:lines` verts. Pas encore mergée sur `dev`.

- Branche : `feat/issue-64-missions-liste-kanban`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-64`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/64
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_064.md`
- Spec : `SPEC_V2.md` §10.880–882 · ADR 0008
- Dépend de #54 (DnD HTML5, `TERMINAL_MISSION_STATUSES`) et #59 (seed missions démo)

## Livré

### Backend
- `mission.repository` — `list` enrichi (pharmacy, referent, jobTitle) + `updateStatus`
- `mission` router injectable — `list`, `updateStatus` (`protectedProcedure`) · branché `_app.ts`

### View-model
- `mission-kanban.ts` — `buildMissionKanbanColumns` (4 colonnes actives), `toMissionListItems`, `moveMissionStatus`
- Filtre terminal via `TERMINAL_MISSION_STATUSES` (#54)

### UI
- `/missions` RSC — header style `/admin` (gradient + icône Briefcase)
- Toggle Liste/Kanban (`ViewToggle` #54)
- **Liste** : `AdminSectionCard` + tableau 7 colonnes, badges colorés
- **Kanban** : colonnes par statut actif, DnD → `mission.updateStatus`, update optimiste + `router.refresh()`
- Thèmes couleur par statut : `mission-status-theme.ts` (warning/accent/primary/success/error)
- Composants : `MissionsView`, `MissionList`, `MissionKanban`, `MissionKanbanColumn`, `MissionKanbanCard`, `MissionStatusBadge`
- `kanban-dnd.ts` étendu — `readMissionDragPayload`
- `Badge` — variant `primary` ajouté

### Tests (TDD)
- `mission-kanban.test.ts` (3), `mission-kanban.move.test.ts` (1)
- `mission.test.ts` (3), `mission-status-theme.test.ts` (2)
- **9 tests** nouveaux verts

## Tests manuels (non exécutés par l'agent)

- Drag A_POURVOIR → EN_RECHERCHE → persiste au refresh
- Mission POURVU absente kanban, visible liste
- Colonnes pharmacy + referent OK
- Design kanban : couleurs distinctes par colonne

## Pièges / dette

- Branche créée depuis `dev` — merger `origin/dev` avant PR si conflits `_app.ts` (#55/#60/#77)
- DnD natif HTML5 — pas d'a11y clavier (hérité #54)
- Update optimiste sans rollback explicite si mutation échoue (pattern #54)
- `pnpm test` complet peut flaky (LoginForm timeout) — tests issue #64 isolés verts
- `.env` worktree = symlink manuel vers `medijob/apps/web/.env`

## Hors scope (suite)

- Fiche mission `/missions/[id]` (#65)
- Pipeline candidats mission (#66)
- Transitions POURVU/ANNULEE → stages candidats (ADR 0008, issue ultérieure)

## Suggested skills

- `/caveman` + `/tdd` pour toute issue
- `/handoff` en fin de session
- Plugin Prisma pour travail DB (#65+)
