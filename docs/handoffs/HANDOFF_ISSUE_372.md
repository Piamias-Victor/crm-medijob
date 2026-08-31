# Handoff — Issue #372 (Weekly availability — page publique)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/372
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0024`
- Blocked by : #367 — `docs/handoffs/HANDOFF_ISSUE_367.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/384 → `dev`
- Branche : `feat/issue-372-weekly-availability-page` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Weekly availability ≠ Availability)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_372.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #374 (filtre créneau + métier + geo), #375 (SMS unique) — **Blocked by #372**

## Livré

Page publique token secret. Grille une semaine AM/PM. Recruteur copie le lien depuis fiche origine App. Pas de SMS (#375). Pas de compte candidat.

- Route `GET /dispo/[token]` hors `(dashboard)` + matcher middleware `dispo`
- Token inconnu / mal formé → `notFound()` ; token valide → lecture/écriture
- Jamais soumis → `unknown` ; save vide → `declared_unavailable` ; slots → `submitted`
- Semaines suivantes + histo (row semaine = soumise). Jours passés non cliquables, Europe/Paris
- Fiche Candidate origine App : bouton « Copier le lien dispos » (`weeklyAvailability.copyLink`)
- Schéma : `WeeklyAvailabilityToken` + `Week` + `Slot` AM|PM — migration `20260831160820_weekly_availability`
- Tests : token refuse, inconnu vs vide, histo, past days, copy APP only, access anonyme `/dispo`
- Unitaires 1574 verts (hors integration Docker)

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Token | plaintext unique (lien recopiable) ; `createRawToken` 32 bytes base64url |
| Semaine soumise | existence de la row `WeeklyAvailabilityWeek` (0 slots = indispo déclarée) |
| Past slots | conservés au save mid-week ; incoming past dropped |
| Copy | lazy ensure token au clic ; CRM origin → pas de bouton |
| SMS | hors slice (#375) |

## Pièges

- **Migrate dans `apps/web`** : `cd apps/web && pnpm exec prisma migrate deploy`. Sans ça → tables token/week/slot absentes
- Apply déjà fait sur Neon **locale** de la session #372. Preview/prod : même migration
- `/dispo` exclu du matcher auth **et** `evaluateAccess` allow — les deux
- Token Zod `min(20).max(64)` base64url — pas de tests d’exploit (spec #365)
- Filtre « dispo » (#374) lit `declaration` : `unknown` exclu, `declared_unavailable` = pas dispo, slots datés AM/PM
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Fiche Candidate origine App : copier le lien → page publique sans login
- [ ] Cocher mercredi AM, enregistrer, changer de semaine, revenir : créneau conservé
- [ ] Enregistrer une semaine sans case → indispo ; semaine jamais ouverte absente du « dispo » (#374)
- [ ] URL token bidon → pas de grille
- [x] Auto : unitaires 1574 verts ; `typecheck` + `lint:lines` OK

## Suite

1. Merge PR #384 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-372-weekly-availability-page`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#374** ou **#375** depuis `origin/dev` — lire ce handoff. #373 parallèle (blocked by #367)

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)
