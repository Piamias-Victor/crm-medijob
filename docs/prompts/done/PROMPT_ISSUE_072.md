# Prompt — Issue #72

**Titre** : [CANDIDATURES] Traitement inbox — dédup, fusion diff, accept/refuse  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/72  
**Parent** : #19  
**Blocked by** : #71, #54 · **Débloque** : —

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_054.md`, `docs/handoffs/HANDOFF_ISSUE_056.md` (revue diff CV), ADR 0006, `SPEC_V2.md` §9 (Candidatures webhook), issue #72.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** handoff #054 (inbox read-only, `detectDuplicate`, `refuse`, seed `demo-application-1`) ; #056 si merge UI (pattern revue champ par champ)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-72 -b feat/issue-72-application-inbox-intake origin/dev
cd ../crm-medijob-issue-72
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Onglet **Candidatures reçues** (`/candidats`) — workflow complet inbox (SPEC §9, ADR 0006) :

| Action | Comportement |
|--------|--------------|
| **Accepter** | Crée Candidate (si pas fusion) → `Application.status=ACCEPTEE` + `candidateId` |
| **Refuser** | `Application.status=REFUSEE`, pas de Candidate (#54 partiel — compléter UI) |
| **Fusionner** | Match Candidate (email ou nom+tél) → écran diff Candidate vs Application → validation → update Candidate + lien `candidateId` + ACCEPTEE |
| **Créer quand même** | Ignore doublon Candidate → à l'acceptation, nouveau Candidate même si existant |
| **Soft delete** | `Application.deletedAt`, disparaît inbox |
| **Alerte doublon Application** | Autre Application EN_ATTENTE même personne → alerte informative **seulement** (pas de merge entre Applications) |

**Déjà livré (#54)** : `listInbox`, `detectDuplicate`, `refuse` (backend), inbox read-only UI.

**Hors périmètre** : webhook Webflow (#71 — prérequis pour prod, seed démo suffit en dev).

**US** : #26–32

### Critères d'acceptation

- [ ] Actions inbox : Accepter, Refuser, Fusionner, Créer quand même, Soft delete
- [ ] Merge : diff champ par champ, pas d'écrasement sans validation
- [ ] Accept crée Candidate si pas fusion
- [ ] Refuse conserve Application pour stats
- [ ] Alerte doublon Application (autre EN_ATTENTE) — pas de regroupement
- [ ] Candidate accepté visible CVthèque

---

## Fichiers impactés

- `server/application/intake.ts` — `acceptApplication`, `mergeApplication`, garde statuts
- `server/application/intake.adapter.ts` — `detectPendingApplicationDuplicate` (autre EN_ATTENTE)
- `server/application/merge-diff.ts` (nouveau) — diff Candidate ↔ Application pour revue
- `server/routers/application.ts` — `accept`, `merge`, `createAnyway`, `softDelete`, étendre deps
- `server/db/repositories/application.repository.ts` — `linkCandidate`, `findPendingByIdentity`
- `server/db/repositories/candidate.repository.ts` — `createFromApplication` (referent default seed)
- `view-models/application-merge.schema.ts` — Zod champs fusionnables
- `view-models/application-inbox.ts` — flags duplicate candidate / duplicate application
- UI : `ApplicationInboxCard.tsx` — boutons actions + alertes
- `ApplicationIntakeActions.tsx` / `ApplicationMergeReview.tsx` (nouveaux) — modale revue diff (pattern `CandidateCvReviewLayout` #56)
- `ApplicationInbox.tsx` — mutations + `router.refresh()`
- Tests : intake accept/refuse/merge, duplicate application alert, router intégration mock repos

**Conflit git** possible avec #71 sur `application.repository` / route webhook — merger `dev` souvent.

---

## Contraintes

- ADR 0006 : revue humaine obligatoire avant fusion
- Transaction Prisma : accept/merge = Candidate + Application atomiques
- Zod sur payload merge ; fichiers < 100 lignes
- Mutations via `trpc.useMutation()` ; RSC recharge inbox

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_072.md` + push + PR `Closes #72`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-72
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → http://localhost:3000/candidats → onglet **Candidatures reçues** (seed Léa Bernard)

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Application email existant (Camille) → Fusionner → diff → champs choisis → Candidate mis à jour, Application ACCEPTEE
- [ ] Doublon Candidate → Créer quand même → Accepter → second Candidate en CVthèque
- [ ] Refuser → status REFUSEE, absent CVthèque
- [ ] Deux Applications EN_ATTENTE même personne → alerte visible, pas de merge auto
- [ ] Soft delete → disparaît inbox
- [ ] CI locale verte
