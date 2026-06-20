# Handoff — Issue #66 (MISSIONS — MissionCandidate pipeline)

`/caveman` + `/tdd` actifs.

## État

**Prêt pour review.** Branche poussée, PR vers `dev`.

- Branche : `feat/issue-66-mission-candidate-pipeline`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-66`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/66
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_066.md`
- Spec : `SPEC_V2.md` §10.860–878 · ADR 0004/0008
- Dépend de #65, #54

## Livré

### Backend
- `missionCandidate.position` / `remove` + repo `createAtDefaultStage`, garde soft-delete
- `candidate.search` — nom, métier, ville, CP ; fold accents/majuscules (`lib/search-fold.ts`)
- Mission detail select enrichi (stage + profil candidat)
- Drag vers stage « Placé » → `mission.markPourvu` (plus de bouton Placer)

### UI — onglet Pipeline
- Picker searchable + kanban DnD (pattern #54)
- Cartes compactes : nom + meta, croix retirer, drag entre stages
- **Besoin abandonné** : banner danger + confirm dialog, **bas** onglet Infos (sous formulaire)

### UI — polish session
- Temps plein : `CheckboxGroup` (plus double label Switch)
- Recherche picker redesign + badges résultats

### Tests
- 354 unit verts (excl. integration Docker) · typecheck · lint:lines

## Tests manuels (non exécutés par l’agent)

- Positionner 2 candidats → Nouveau
- Drag → Entretien ; même candidat 2 missions → stages indépendants
- Drag → Placé → mission POURVU
- Retirer candidat (croix)
- Recherche sans accent (`francois` → François)
- Annuler mission en bas fiche Infos

## Suite

- #73 matching IA · #67 historique/documents · #68 offre

## Points d’attention

- Search fold scanne jusqu’à `DEFAULT_LIST_LIMIT` candidats — OK V2, indexer si volume explose
- Conflit git possible #67/#68 sur `MissionDetailTabPanel.tsx`

## Suggested skills

- `/caveman` + `/tdd` pour #73
- `/handoff` en fin de session
