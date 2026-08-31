# Handoff — Issue #374 (Filtre weekly availability)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/374
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0024`
- Blocked by : #372 — `docs/handoffs/HANDOFF_ISSUE_372.md` · Inactif #373 — `docs/handoffs/HANDOFF_ISSUE_373.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/386 → `dev`
- Branche : `feat/issue-374-weekly-availability-filter` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Weekly availability, JobTitle, Mobility radius)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_374.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #375 (SMS unique à App-validated) — **Blocked by #372**, pas par #374. #376 parallèle (blocked by #368)

## Livré

Filtre recruteur Intérim : créneau AM/PM daté + JobTitle + ville / Mobility radius (défaut 30 km). Origin App, pas Inactif. Contact tél/SMS. Pas matching IA. Pas MissionCandidate.

- `weeklyAvailability.filter` — requête déterministe, pas `matchingRouter`
- Repo : origin `APP`, `status !== INACTIF`, slot daté exact. Unknown + declared-unavailable = pas de slot → exclus
- Geo : `createAvailabilityFilterGeoLookup` (CP vs ville) + `haversineKm`. `radiusKm ?? DEFAULT_MOBILITY_RADIUS_KM` (30)
- Schema filtre : `date`, `period`, `jobTitleId`, `city`, `radiusKm` — pas logiciel / salaire / contrat
- Row : `telHref` + `buildSmsUrl` — pas de `missionCandidateId`
- UI : GET `/interim/disponibilites` (RSC `searchParams`) · subnav **Disponibilités**
- Unitaires 1602 verts (hors integration Docker)

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Population | origin APP + not Inactif. Slot = preuve de dispo |
| Rayon | recruteur (`radiusKm`) sinon 30. Pas `candidate.mobilityRadiusKm` |
| JobTitle | exact, pas matrice compat |
| Contact | `tel:` + `sms:` · aucun create MissionCandidate |
| Lectures | RSC `createServerCaller` + form GET |

## Pièges

- Geo : CP → lookup postal ; ville → `createGeoQueryLookup`. Tests injectent `lookupGeo`
- Form GET envoie `radiusKm=30` si champ défaut — même sémantique que unset côté serveur
- `candidate.referentials()` pour la liste métiers UI only — le filtre n’en lit pas logiciels
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Pas de migration cette slice (lit tables #372)
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Filtrer mercredi AM + métier → seulement origin App avec ce créneau
- [ ] Semaine jamais remplie absente ; save vide absente
- [ ] Inactif absent ; tél cliquable ; kanban Mission inchangé
- [x] Auto : unitaires 1602 verts ; `typecheck` + `lint:lines` OK

## Suite

1. Merge PR #386 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-374-weekly-availability-filter`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#375** depuis `origin/dev` — lire ce handoff + #372. #376 parallèle possible (#368)

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)
