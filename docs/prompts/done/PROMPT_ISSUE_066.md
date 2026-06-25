# Prompt — Issue #66

**Titre** : [MISSIONS] MissionCandidate — positionner + kanban + drag  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/66  
**Parent** : #19  
**Blocked by** : #65, #54 · **Débloque** : #73

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_065.md`, `docs/handoffs/HANDOFF_ISSUE_054.md`, ADR 0004, ADR 0008, `SPEC_V2.md` §10.860–878, issue #66.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** handoffs #065 (`markPourvu` réservé pipeline, onglet Pipeline stub) et #054 (kanban DnD, `updateStage`, seed stages)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-66 -b feat/issue-66-mission-candidate-pipeline origin/dev
cd ../crm-medijob-issue-66
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/missions/[id]` — onglet **Pipeline** :

- **Positionner candidat** : picker searchable CVthèque → crée `MissionCandidate` au stage « Nouveau » (lookup par nom seed)
- **Kanban** : colonnes = `PipelineStage` ordonnés ; cartes = candidats de cette mission
- **Drag** → `missionCandidate.updateStage` (réutiliser `kanban-dnd.ts` + pattern `CvthequeKanban`)
- **Retirer** candidat de la mission
- **POURVU** : depuis pipeline, action « Valider / Placer » sur un candidat → `mission.markPourvu({ placedCandidateId })` (ADR 0008 — pas de bouton POURVU sur onglet Infos #65)

Même candidat positionnable sur plusieurs missions (ADR 0004). Refuser candidats soft-deleted.

Cohérence CVthèque : drag depuis `/candidats` kanban doit rester cohérent (même mutation `updateStage`).

**Hors périmètre** : matching IA (#73), historique/documents (#67), offre (#68).

**US** : #52–54, #87

### Critères d'acceptation

- [ ] « Positionner candidat » → MissionCandidate au stage Nouveau
- [ ] Kanban colonnes = PipelineStage ordonnées
- [ ] Drag carte → `stageId` persiste
- [ ] Option retirer candidat de la mission
- [ ] CVthèque kanban reflète les changements
- [ ] Impossible de positionner un Candidate soft-deleted

---

## Fichiers impactés

- `components/molecules/MissionDetailTabPanel.tsx` — remplacer stub Pipeline
- `components/organisms/MissionPipelineKanban.tsx` (nouveau) + `MissionPipelineColumn` / `MissionPipelineCard`
- `components/molecules/MissionCandidatePicker.tsx` (nouveau) — Combobox searchable
- `server/routers/mission-candidate.ts` — `position`, `remove` ; étendre deps
- `server/db/repositories/mission-candidate.repository.ts` — `createAtStage`, `remove`, `listByMission` enrichi (stageId + names)
- `server/db/repositories/mission.repository.selects.ts` — inclure `stageId` + stage sur `candidates`
- `view-models/mission-pipeline*.ts` — `buildMissionPipelineColumns`, move optimiste
- `view-models/mission-detail.types.ts` — rows pipeline avec stage
- `server/routers/candidate.ts` — `search` (term → id + label) pour picker si absent
- `app/(dashboard)/missions/[id]/page.tsx` — passer `pipelineStages` referentials si besoin
- Tests : router position/remove, view-model move, garde soft-delete, integration repo create

**Conflit git** avec #67/#68 sur `MissionDetailTabPanel.tsx` — worktrees séparés, merger `dev` souvent.

---

## Contraintes

- Réutiliser `TERMINAL_STAGE_NAMES`, `mission.markPourvu` existant (#65)
- Transaction Prisma pour transition POURVU (déjà dans `transition-status`)
- Fichiers < 100 lignes, mutations via `trpc.useMutation()`, update optimiste + rollback onError (pattern #54)

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_066.md` + push + PR `Closes #66`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-66
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → http://localhost:3000/missions → ouvrir mission seed → onglet **Pipeline**

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Positionner 2 candidats → colonne Nouveau
- [ ] Drag un vers Entretien → stage OK, l'autre inchangé
- [ ] Même candidat sur 2 missions → stages indépendants
- [ ] Valider candidat placé → mission POURVU, autres Pas retenu, absent kanban missions + CVthèque
- [ ] Retirer candidat → disparaît du pipeline mission
- [ ] CI locale verte
