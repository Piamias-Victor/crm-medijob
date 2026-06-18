# Handoff — Issue #55 (CANDIDATS — Fiche Candidate profil + missions)

`/caveman` + `/tdd` actifs.

## État

**Prêt PR.** Fiche `/candidats/[id]` : onglets Profil + Missions. Form RHF+Zod complet, mutations tRPC, bandeau matching ADR 0010, kanban missions candidat, UX polish post-review.

- Branche : `feat/issue-55-candidat-fiche-profil`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-55`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/55
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_055.md`
- Dépend de #54 (routers candidate, kanban, seed Camille Durand) · Débloque #56, #58

## Livré

### Backend
- `candidate.getById`, `candidate.update`, `candidate.referentials` (+ `pipelineStages`)
- Repos : `findProfileById` / `updateProfile` (split `candidate-profile.repo.ts`), `user.listRecruiters`
- View-models : `candidate-profile*`, `candidate-missions`, payload + bandeau `isProfileIncompleteForMatching` (city + postalCode)

### UI Profil
- RSC `app/(dashboard)/candidats/[id]/page.tsx` → `CandidateDetailPage`
- Form : coordonnées, métier (Combobox), logiciels + prefs contractuelles (CheckboxGroup), mobilité (défaut 30), dispo, notes, référent
- **Bandeau matching** : fond blanc + badges (plus jaune agressif), live update via `watch(city/postalCode)`
- **DatePicker** custom (`DatePicker` + `DatePickerPanel` + `date-picker-utils`)
- **Geo auto-fill** : `geo.api.gouv.fr` au blur ville↔CP (`CandidateGeoFields`)
- Liens CVthèque liste + kanban → fiche candidat ; hover full-row / full-card

### UI Missions
- Kanban par PipelineStage (`CandidateMissionsKanban`) — drag DnD → `missionCandidate.updateStage`
- 2 missions actives seed Camille (POURVU exclu)

### Tests (TDD)
- `candidate-profile.test.ts`, `candidate-missions*.test.ts`, `candidate.test.ts` (4)
- `geo-fr.test.ts`, `date-picker-utils.test.ts` (unicité labels semaine)
- **178 tests unitaires verts** · `lint` · `typecheck` · `lint:lines` verts
- Intégration testcontainers : flaky Docker (hors scope)

## Décisions / pièges

- **Bandeau matching** : champs manquants = `city` + `postalCode` seulement (`mobilityRadiusKm` null → défaut 30, pas bloquant bandeau ; `availableFrom` null = immédiat)
- **DatePicker keys** : labels semaine `Lu Ma Me Je Ve Sa Di` (évite duplicate key `M`)
- **Geo lookup** : client-side fetch API gouv — réseau requis, remplit l'autre champ seulement si vide
- **Missions tab** : kanban minimal — matching inversé (#74), liens mission, historique (#58) hors scope

## Hors scope (suite)

- Upload CV (#56) · ActivityLog (#58) · matching inversé (#74)

## Tests manuels (checklist)

- [ ] Camille Durand → bandeau « Code postal » → saisir `69001` → ville auto → bandeau disparaît
- [ ] Enregistrer profil + référent modifiable
- [ ] DatePicker sans warning console
- [ ] Onglet Missions → 2 cartes stage Nouveau, drag autre colonne
- [ ] Hover liste CVthèque sur ligne entière

## Suggested skills

- `/caveman` + `/tdd` pour #56 / #58
- `/handoff` en fin de session
- Plugin Prisma pour repos si extension fiche
