# Prompt — Issue #54

**Titre** : [CANDIDATS] CVthèque liste + kanban PipelineStage + inbox Applications  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/54  
**Parent** : #19  
**Blocked by** : #53 · **Débloque** : #55, #64, #71

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_053.md`, ADR 0001/0004/0005, `SPEC_V2.md` §6 + §10, issue #54.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_053.md` (auth JWT, `protectedProcedure`, seed users, symlink `.env`)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-54 -b feat/issue-54-candidats-cvtheque-kanban origin/dev
cd ../crm-medijob-issue-54
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/candidats` — 2 onglets :

1. **CVthèque** — liste + kanban par PipelineStage
2. **Candidatures reçues** — inbox read-only (`Application` EN_ATTENTE, traitement complet en #72)

**ADR 0001** : carte = Candidate ; missions **actives** seules ; drag **par mission** (handle par `MissionCandidate`).

View-model `activeMissions` : exclure `Mission.status` ∈ {POURVU, ANNULEE} et stages Placé / Pas retenu.

**Hors périmètre** : fiche candidat (#55), webhook (#71), fusion inbox (#72).

**US** : #8–11, #24 · **ADR** : 0001, 0004, 0005

### Critères d'acceptation

- [ ] Onglets CVthèque | Candidatures reçues
- [ ] Liste + toggle kanban (nom, JobTitle, ville, referent, nb missions actives)
- [ ] Colonnes kanban = PipelineStage par `position`
- [ ] Carte : nom + lignes mission avec badge stage ; drag 1 mission → 1 `MissionCandidate.stageId`
- [ ] Inbox : Applications EN_ATTENTE en lecture seule
- [ ] RSC lectures ; mutations `trpc.useMutation()` en Client Component
- [ ] View-model + repository pour filtre missions actives

---

## Fichiers impactés

- `apps/web/src/app/(dashboard)/candidats/page.tsx` — remplace placeholder
- `apps/web/src/server/routers/candidate.ts` — list, kanban data
- `apps/web/src/server/routers/mission-candidate.ts` — `updateStage`
- `apps/web/src/server/routers/application.ts` — `listInbox` (read-only)
- `apps/web/src/view-models/candidate-kanban.ts` — filtre activeMissions
- `apps/web/src/components/organisms/CandidatsPage.tsx` + molecules kanban/liste
- Tests : view-model + mutation updateStage

**Conflit git** avec #59/#77 sur routers tRPC — coordonner ou merger `dev` souvent.

---

## Contraintes

`CLAUDE.md` + handoff #53 : `protectedProcedure`, Prisma via repositories, fichiers < 100 lignes.

---

## Fin de session

Sur demande utilisateur : handoff `HANDOFF_ISSUE_054.md` + push + PR `Closes #54`.

**En fin de message** : bloc « Commande de test » copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-54
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR : `recruteur@medijob.fr` / `recruteur-medijob-2026` → http://localhost:3000/candidats

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Onglets CVthèque + Candidatures reçues visibles
- [ ] Candidat sur 2 missions → carte kanban avec 2 lignes draggables
- [ ] Drag mission A → Contacté ; mission B inchangée
- [ ] Mission POURVU → disparaît de la carte
- [ ] Inbox liste Applications EN_ATTENTE (seed si besoin)
- [ ] CI locale verte
