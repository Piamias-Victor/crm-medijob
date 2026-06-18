# Prompt — Issue #55

**Titre** : [CANDIDATS] Fiche Candidate — profil, contract preferences, bandeau incomplet  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/55  
**Parent** : #19  
**Blocked by** : #54 · **Débloque** : #56, #58

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_054.md`, ADR 0010, `SPEC_V2.md` §6.642–646, issue #55.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_054.md` (routers candidate, kanban, seed-demo Camille Durand)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-55 -b feat/issue-55-candidat-fiche-profil origin/dev
cd ../crm-medijob-issue-55
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/candidats/[id]` — onglets **Profil** + **Missions** (liste MissionCandidate + PipelineStage).

Profil : RHF + Zod — name, email, phone, address, city, postalCode, JobTitle, Software, contract preferences, `mobilityRadiusKm` (default 30), mobilityNotes, `availableFrom` (null = immédiat), notes, referentId.

**ADR 0010** : bandeau informatif si champs matching manquants — ne bloque pas la soumission.

**Hors périmètre** : upload CV (#56), ActivityLog (#58), matching inversé (#74).

**US** : #15, #16, #20

### Critères d'acceptation

- [ ] Form profil complet + mutations tRPC
- [ ] JobTitle + Software multi-select (referentials)
- [ ] CandidateContractPreference
- [ ] Referent modifiable par tout RECRUTEUR
- [ ] View-model `isProfileIncompleteForMatching`
- [ ] Onglet Missions : positions + stages

---

## Fichiers impactés

- `app/(dashboard)/candidats/[id]/page.tsx` — RSC
- `server/routers/candidate.ts` — getById, update
- `view-models/candidate-profile.ts` — bandeau incomplet
- Organisms/molecules fiche + tabs
- Réutiliser patterns #54 (Combobox si besoin) et repos candidate (#52)

---

## Contraintes

`CLAUDE.md` + handoff #54 : RSC reads, mutations client, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_055.md` + push + PR `Closes #55`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-55
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → http://localhost:3000/candidats → ouvrir fiche Camille Durand (seed-demo)

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Candidat sans city → bandeau jaune, form soumissible
- [ ] Modifier referent → sauvegardé
- [ ] Onglet Missions → 2 positions avec stages corrects
- [ ] CI locale verte
