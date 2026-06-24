# Prompt — Issue #67

**Titre** : [MISSIONS] ActivityLog & Documents Mission  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/67  
**Parent** : #19  
**Blocked by** : #65 · **Débloque** : —

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_065.md`, `docs/handoffs/HANDOFF_ISSUE_061.md`, `docs/handoffs/HANDOFF_ISSUE_063.md`, ADR 0011, `SPEC_V2.md` §6.671–677, issue #67.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** handoffs #065 (shell 6 onglets, stubs Historique/Documents), #061 (EntityDocumentsTab, Blob private), #063 (EntityActivityLogTab)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-67 -b feat/issue-67-mission-activity-documents origin/dev
cd ../crm-medijob-issue-67
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/missions/[id]` — onglets **Historique** + **Documents** :

- **Historique** : timeline ActivityLog + filtre type (client-side) + création manuelle → `EntityActivityLogTab` scope `{ entityType: 'MISSION', entityId }`
- **Documents** : upload / liste / delete avec catégories → `EntityDocumentsTab` (`entityType: 'MISSION'`)

Le RSC `missions/[id]/page.tsx` **charge déjà** `document.listByEntity` + `activityLog.listByEntity` pour MISSION — brancher les props jusqu’aux onglets (badges tabs inclus).

Backend `entity-scope.ts`, routers `document` + `activityLog` supportent déjà MISSION — vérifier tests scope MISSION, compléter si absent.

**Hors périmètre** : pipeline candidats (#66), offre IA (#68), logs email automatiques.

**US** : #63

### Critères d'acceptation

- [ ] Historique : timeline + filtre + création manuelle
- [ ] Documents : upload/list/delete avec catégories
- [ ] `entityType MISSION` sur Document et ActivityLog.missionId
- [ ] UX cohérente avec pharmacy/contact (#61/#63)

---

## Fichiers impactés

- `components/molecules/MissionDetailTabPanel.tsx` — onglets Historique + Documents (remplacer stubs)
- `components/organisms/MissionDetailPage.tsx` — props `activities`, `documents` → tab panel
- `app/(dashboard)/missions/[id]/page.tsx` — passer `activities` + `documents` (fetch déjà en place)
- Réutiliser sans duplication : `EntityActivityLogTab`, `EntityDocumentsTab`, `ActivityLogForm`, `DocumentUploadForm`
- `server/routers/activity-log.test.ts` — cas scope MISSION list/create
- `server/routers/document.test.ts` — cas scope MISSION upload/list/delete (mock Blob)
- `server/db/repositories/entity-scope.ts` — déjà OK, test unitaire si manquant

**Conflit git** avec #66/#68 sur `MissionDetailTabPanel.tsx` — worktrees séparés, merger `dev` souvent.

---

## Contraintes

- ADR 0011 : delete document = row DB + Blob (pas soft delete Document)
- Download via `/api/documents/[id]/download` (store private #61)
- `BLOB_READ_WRITE_TOKEN` requis en local
- Fichiers < 100 lignes — extraire sous-composant mission si panel grossit
- Mutations → `router.refresh()` après create/upload/delete

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_067.md` + push + PR `Closes #67`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-67
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → http://localhost:3000/missions → ouvrir mission seed → onglets **Historique** et **Documents**

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Upload convention PDF sur mission → listé avec catégorie
- [ ] Ajouter log type APPEL → visible timeline mission uniquement
- [ ] Filtre NOTE → autres types masqués
- [ ] Download document → fichier OK (route API authentifiée)
- [ ] Delete document → retiré de la liste
- [ ] Badges compteurs Historique/Documents sur tabs mission
- [ ] CI locale verte
