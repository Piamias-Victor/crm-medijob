# Prompt — Issue #58

**Titre** : [CANDIDATS] ActivityLog Candidate — timeline filtrable  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/58  
**Parent** : #19  
**Blocked by** : #55 · **Débloque** : —

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_055.md`, issue #58.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_055.md`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-58 -b feat/issue-58-candidat-activity-log origin/dev
cd ../crm-medijob-issue-58
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/candidats/[id]` — onglet **Historique** : timeline ActivityLog filtrable par ActivityType + création manuelle (type, content, date). Author = session user.

Prépare ADR 0003 (double log email — hors scope ici).

**US** : #19

### Critères d'acceptation

- [ ] Timeline desc + filtres ActivityType
- [ ] Form création log manuel
- [ ] RSC load + tRPC mutation
- [ ] Empty state

---

## Fichiers impactés

- `server/routers/activity-log.ts` — listByEntity, create
- `server/db/repositories/activity-log.repository.ts` (nouveau)
- Onglet Historique sur `CandidateDetailPage`
- Réutiliser patterns admin/glass UI (#96)

**Conflit git** avec #56 sur fiche candidat — merger `dev` souvent.

---

## Contraintes

Repositories only, `protectedProcedure`, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff + push + PR `Closes #58`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-58
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm dev
```

Login RECRUTEUR → fiche candidat → onglet Historique

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Ajouter NOTE → visible avec auteur
- [ ] Filtre EMAIL → autres types masqués
- [ ] CI locale verte
