# Prompt — Issue #64

**Titre** : [MISSIONS] Liste + kanban Mission status  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/64  
**Parent** : #19  
**Blocked by** : #54, #59 · **Débloque** : #65, #79

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_054.md`, `docs/handoffs/HANDOFF_ISSUE_059.md`, ADR 0008, `SPEC_V2.md` §10.880–882, issue #64.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** handoffs #054 et #059 (kanban DnD pattern, mission repo, seed-demo missions)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-64 -b feat/issue-64-missions-liste-kanban origin/dev
cd ../crm-medijob-issue-64
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/missions` — toggle **Liste** + **Kanban** par `MissionStatus` (6 colonnes fixes).

Drag carte → update `Mission.status`. Exclure POURVU/ANNULEE du kanban actif (ADR 0008) — restent en liste.

Colonnes liste : title, JobTitle, pharmacy, city, status, referent, startDate.

Réutiliser pattern DnD HTML5 de #54 (`kanban-dnd.ts`, update optimiste + refresh).

**Hors périmètre** : fiche mission (#65), pipeline candidats (#66).

**US** : #48, #49, #62

### Critères d'acceptation

- [ ] Liste + kanban toggle
- [ ] 6 colonnes MissionStatus
- [ ] Drag → mutation status persiste
- [ ] Terminal statuses cachés du kanban
- [ ] Données pharmacy + referent affichées

---

## Fichiers impactés

- `app/(dashboard)/missions/page.tsx` — RSC
- `server/routers/mission.ts` — list, updateStatus
- `view-models/mission-kanban.ts` — colonnes + filtre terminal
- UI : MissionsView, MissionKanban, MissionKanbanCard (réutiliser DnD #54)
- `mission.repository.ts` — list enrichi

**Conflit git** avec #55/#60 sur `_app.ts` — merger `dev` souvent.

---

## Contraintes

`TERMINAL_MISSION_STATUSES` depuis `pipeline-constants.ts` (#54), fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_064.md` + push + PR `Closes #64`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-64
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → http://localhost:3000/missions

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Drag A_POURVOIR → EN_RECHERCHE → persiste au refresh
- [ ] Mission POURVU absente du kanban, visible en liste
- [ ] Colonnes pharmacy + referent OK
- [ ] CI locale verte
