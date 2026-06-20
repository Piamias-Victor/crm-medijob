# Handoff — Issue #67 (MISSIONS — ActivityLog & Documents)

`/caveman` + `/tdd` actifs.

## État

**Prêt pour review.** Branche poussée, PR ouverte vers `dev`.

- Branche : `feat/issue-67-mission-activity-documents`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-67`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/67
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_067.md`
- Parent : #19 · Dépend de #65 · Spec : `SPEC_V2.md` §6.671–677 · ADR 0011

## Livré

### Backend (tests TDD — scope MISSION déjà implémenté)
- `activity-log.test.ts` — list + create MISSION (+2)
- `document.test.ts` — list + upload (`missionId`) + delete (+3)
- `entity-scope.test.ts` — filters MISSION document/activity (nouveau, 3 tests)

### UI
- `MissionDetailTabPanel` — onglets **Historique** + **Documents** (stubs remplacés)
- Réutilisation : `EntityActivityLogTab`, `EntityDocumentsTab` (pattern contact/pharmacie #61/#63)
- `MissionDetailPage` + `missions/[id]/page.tsx` — props `activities` / `documents` (fetch RSC déjà en place)
- Badges compteurs tabs déjà branchés via `activityCount` / `documentCount`

### Hors périmètre (inchangé)
- Pipeline candidats (#66), offre IA (#68), logs email auto

## Tests manuels (non exécutés par l’agent)

- [ ] Upload convention PDF → listé avec catégorie
- [ ] Ajouter log APPEL → visible timeline mission uniquement
- [ ] Filtre NOTE → autres types masqués
- [ ] Download document → fichier OK (route API authentifiée)
- [ ] Delete document → retiré liste
- [ ] Badges compteurs Historique/Documents sur tabs mission

## Points d’attention

- `.env` worktree = symlink vers `medijob/apps/web/.env`
- `BLOB_READ_WRITE_TOKEN` requis pour upload local
- Conflit potentiel `MissionDetailTabPanel.tsx` avec #68 (matching/offre) — merger `dev` souvent
- Tests intégration Docker — exclure si pas de runtime : `--exclude "**/*.integration.test.ts"`

## Suggested skills

- `/caveman` + `/tdd` pour #68 (offre IA mission)
- `/handoff` en fin de session
