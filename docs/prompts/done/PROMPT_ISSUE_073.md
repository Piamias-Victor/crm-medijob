# Prompt — Issue #73

**Titre** : [IA] Matching Mission → Candidates — pré-filtre + Gemini  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/73  
**Parent** : #19  
**Blocked by** : #66, #52 · **Débloque** : #74, #75

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_052.md`, `docs/handoffs/HANDOFF_ISSUE_065.md`, `docs/handoffs/HANDOFF_ISSUE_077.md`, ADR 0009, ADR 0010, `SPEC_V2.md` §7.5, issue #73.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** handoffs #052 (JobTitleCompatibility seeds), #065 (fiche mission, onglet Matching stub), #077 (matrice scores 0–100 %, score 0 = exclu)
3. Si #66 mergé : consulter `docs/handoffs/HANDOFF_ISSUE_066.md` (pipeline — hors scope matching mais prérequis graphe)
4. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-73 -b feat/issue-73-mission-matching-ia origin/dev
cd ../crm-medijob-issue-73
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/missions/[id]` — onglet **Matching IA** :

**Phase 1 — pré-filtre déterministe** (zéro IA, SPEC §7.5) :

| Règle | Comportement |
|-------|--------------|
| Métier | `JobTitleCompatibility` mission → candidat ; score `0` = exclu (ADR 0009) |
| Mobilité | distance Candidate ↔ Pharmacy ≤ `mobilityRadiusKm` (null → **30 km**) |
| Géo | exige `city` + `postalCode` candidat **et** pharmacy — sinon exclu + raison (ADR 0010) |
| Dispo | `availableFrom` ≤ `mission.startDate` (null → immédiat) |
| Contrat | `mission.contractType` ∈ `preferredContractTypes` (vide → pas de filtre) |

**Phase 2 — scoring IA** : Gemini/OpenRouter sur candidats pré-filtrés (max 20), mock en test.

Output Zod : `z.array(z.object({ candidateId, score: 0–100, justification }))`.

UI : liste scorée + section candidats **exclus** avec raison lisible (métier, geo, distance, contrat, dispo). Lien fiche candidat. Bandeau profil incomplet possible sur candidat — n’empêche pas l’affichage, mais geo manquante = exclusion distance.

**Hors périmètre** : matching inversé (#74), contact depuis matching (#75), positionner depuis matching (pipeline #66).

**US** : #55, #56

### Critères d'acceptation

- [ ] Pré-filtre exécuté avant appel IA
- [ ] Exclus affichent la raison (geo, métier, distance, contrat, dispo)
- [ ] Gemini score les candidats restants (mock provider en test)
- [ ] Zod validation réponse IA
- [ ] Utilise seeds / matrice `JobTitleCompatibility`
- [ ] Candidats bandeau incomplet visibles mais geo manquante → exclus avec raison

---

## Fichiers impactés

- `components/molecules/MissionDetailTabPanel.tsx` — onglet Matching (remplacer stub)
- `components/organisms/MissionMatchingTab.tsx` (nouveau) — bouton lancer + listes scored/excluded
- `server/matching/prefilter.ts` (nouveau) — règles Phase 1 pures (testables sans IA)
- `server/matching/distance.ts` (nouveau) — distance km via coords `geo.api.gouv.fr` (CP → centre)
- `server/matching/exclusion-reasons.ts` — codes + labels FR
- `server/ai/matching.schema.ts` — Zod scoring response
- `server/ai/matching-prompt.ts` — prompt builder (mission + candidats)
- `server/routers/matching.ts` (nouveau) — `scoreMissionCandidates` ; brancher `_app.ts`
- `server/db/repositories/candidate.repository.ts` — `listForMatching` (profil + prefs + geo)
- `server/db/repositories/job-title.repository.ts` — réutiliser `listCompatibleCandidateTitles` / scores
- `view-models/mission-matching.ts` — rows scored + excluded
- Tests : prefilter (matrix, geo, distance, contract, availability), schema IA, router mock provider

**Conflit git** avec #67/#68 sur `MissionDetailTabPanel.tsx` — worktrees séparés.

---

## Contraintes

- Pré-filtre **sans** appel réseau IA ; distance peut appeler geo.api.gouv.fr (server-side, cache optionnel en mémoire par CP)
- `EXTRACTION_PROVIDER=mock` pour tests scoring
- Prisma uniquement en repositories ; fichiers < 100 lignes
- Ne pas persister scores en DB (calcul à la demande V2)

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_073.md` + push + PR `Closes #73`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-73
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → mission seed Pharmacien → onglet **Matching IA** → lancer matching (mock)

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Mission Pharmacien + candidat Préparateur → exclu (matrice métier)
- [ ] Candidat sans code postal → exclu, raison geo affichée
- [ ] Candidats compatibles géo/métier → liste scorée ordonnée par score
- [ ] Mock provider → résultats stables sans clé OpenRouter
- [ ] CI locale verte
