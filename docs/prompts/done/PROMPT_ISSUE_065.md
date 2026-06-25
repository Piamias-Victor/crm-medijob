# Prompt — Issue #65

**Titre** : [MISSIONS] Fiche Mission — CRUD + transitions POURVU/ANNULEE  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/65  
**Parent** : #19  
**Blocked by** : #64 · **Débloque** : #66, #68

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_064.md`, ADR 0008, `SPEC_V2.md` §10.865–878, issue #65.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_064.md` (mission kanban, status themes, seed missions)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-65 -b feat/issue-65-mission-fiche-pourvu origin/dev
cd ../crm-medijob-issue-65
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/missions/[id]` — shell onglets + **Infos** CRUD complet. Transitions **POURVU** / **ANNULEE** (ADR 0008) :

- POURVU → candidat placé → stage Placé ; autres → Pas retenu
- ANNULEE → tous MissionCandidates → Pas retenu

Stubs : Pipeline, Matching, Offre, Historique, Documents.

**US** : #50, #51, #59–61

### Critères d'acceptation

- [ ] Form mission complet RHF + Zod
- [ ] Flow POURVU avec pick candidat placé
- [ ] Flow ANNULEE → tous Pas retenu
- [ ] Lookup stages Placé/Pas retenu par nom seed
- [ ] Mission sort des kanbans actifs après transition terminal
- [ ] referentId modifiable par tout RECRUTEUR

---

## Fichiers impactés

- `app/(dashboard)/missions/[id]/page.tsx`
- `server/routers/mission.ts` — getById, update, markPourvu, markAnnulee
- `mission.repository.ts` — transitions + MissionCandidate batch update
- UI : MissionDetailPage, tabs, status actions

---

## Contraintes

Transaction Prisma pour transitions POURVU/ANNULEE, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff + push + PR `Closes #65`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-65
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → `/missions` → ouvrir une mission seed

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] CRUD champs mission OK
- [ ] POURVU avec candidat → stages Placé / Pas retenu corrects
- [ ] ANNULEE → tous Pas retenu ; mission absente du kanban
- [ ] CI locale verte
