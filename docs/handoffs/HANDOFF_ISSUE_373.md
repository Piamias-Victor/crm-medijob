# Handoff — Issue #373 (SUSPENDED/BANNED → Inactif et restore)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK. CI `quality` + Vercel verts sur #385.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/373
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0026`
- Blocked by : #367 — `docs/handoffs/HANDOFF_ISSUE_367.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/385 → `dev`
- Branche : `feat/issue-373-app-validated-inactif` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Candidate status Inactif ≠ Blacklisté)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_373.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #374 (filtre créneau — exclut Inactif), #375 (SMS unique — pas de 2ᵉ envoi au restore). #368 parallèle (missions)

## Livré

Badakan `SUSPENDED` / `BANNED` → Candidate **Inactif**, status d’avant mémorisé. Restore `COMPLETED` → status précédent. Pas Blacklisté. Pas de second SMS (restore ≠ create).

- `syncAppValidated` : inactivate if SUSPENDED/BANNED (skip BLACKLISTE + déjà INACTIF) ; restore if INACTIF + `statusBeforeInactive`
- Cycle : `probeInactive` GET linked App-origin absents de `searchEmployees` (injecté, 0 call live)
- Schéma : `Candidate.statusBeforeInactive` — migration `20260831190000_candidate_status_before_inactive`
- Tests deps injectées. Unitaires 1584 verts (hors integration Docker)

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Inactif vs Blacklisté | sync pose INACTIF only ; BLACKLISTE intouché |
| Restore | seulement si `status === INACTIF` **et** `statusBeforeInactive` set (Inactif manuel sans mémoire = pas de restore) |
| Probe | GET recipient manquants ; pas d’Inactif par simple absence de listing (évite faux positifs pagination) |
| SMS | hors slice (#375) — restore ne crée pas de Candidate |

## Pièges

- **Migrate dans `apps/web`** : `cd apps/web && pnpm exec prisma migrate deploy`. Sans ça → colonne `statusBeforeInactive` absente
- Preview/prod : déployer la même migration
- `searchEmployees` = COMPLETED. SUSPENDED/BANNED arrivent via GET (`probeInactive`) ou si le listing porte `status`
- Filtre vivier (#374) : population = origin App + App-validated + **pas Inactif**
- Restore COMPLETED : pas de 2ᵉ SMS auto (#375) — même token weekly availability
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Fixture SUSPENDED → Candidate Inactif, plus dans le filtre dispos (#374)
- [ ] Blacklisté manuel inchangé
- [ ] Fixture restore COMPLETED → status d’avant (ex. Qualifié)
- [x] Auto : unitaires 1584 verts ; `typecheck` + `lint:lines` OK ; CI quality + Vercel verts

## Suite

1. Merge PR #385 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-373-app-validated-inactif`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#374** (filtre, lit Inactif) ou **#375** (SMS) depuis `origin/dev` — lire ce handoff. #368 parallèle possible

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)
