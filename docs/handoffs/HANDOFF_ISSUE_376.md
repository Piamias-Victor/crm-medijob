# Handoff — Issue #376 (vérif Pharmacy SIRET + Contact principal)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/376
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0028`
- Blocked by : #368 — `docs/handoffs/HANDOFF_ISSUE_368.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/388 → `dev`
- Branche : `feat/issue-376-badakan-pharmacy-verify` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Pharmacy, Contact principal, Badakan enterprise)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_376.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md`
- Next : #377 (Badakan contracts) — **Blocked by #368**

## Livré

File de vérif Intérim. Enterprise Badakan → **Pharmacy** seulement après validation recruteur. Pas d’auto-create au sync.

- Client : `getEnterprise` → `GET /services/v3/enterprises/{id}` (`fetchFn` injecté). Toujours lecture seule
- Mapper : nom, SIRET, adresse, Contact principal (`users.principal` / `principalUser`)
- Persist : `BadakanEnterprise` pending (`verifiedAt` null) + `BadakanMission.enterpriseId` — migration `20260831220000_badakan_enterprise`
- Cycle : même cron Profils app tire `syncEnterprises` après `syncMissions`
- Preview : `siretMatches` → Pharmacy existante ; Contact email puis tél sur cette fiche
- Confirm : create Pharmacy PROSPECT **ou** link existante ; create Contact `isPrimary` **ou** `setPrimary` (rôle Titulaire)
- UI : `/interim/officines` + `/interim/officines/[id]` ; sous-nav « Vérif officines »
- Router `badakanEnterprise.listPending` / `getPreview` / `confirm` (`crm.write`) via `createServerCaller`

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Vocab | Pharmacy, Contact. Enterprise Badakan ≠ Pharmacy tant que non validée |
| Writes Badakan | hors V1 — GET enterprise only |
| SIRET | `siretMatches` / `findIdentityBySiret` — jamais un second fichier |
| Contact | fusion **sur la Pharmacy cible** : email puis tél (`phonesMatch`) |
| Liste vide | normal tant que le cron n’a pas GET les enterprises (pas de bouton Rafraîchir) |

## Pièges

- **Migrate dans `apps/web`** : `cd apps/web && pnpm exec prisma migrate deploy`. Sans ça → table `BadakanEnterprise` absente
- Liste vide au 1er load → attendre le cron (`GET /api/cron/app-profiles` + Bearer). Sans `BADAKAN_EMAIL`/`PASSWORD` → cycle `{ skipped: true }` → 0 officines
- Missions sans `enterprise.id` → pas de GET enterprise pour cette mission
- Rôle Contact `Titulaire` obligatoire en seed (`findByName`) sinon confirm `PRECONDITION_FAILED`
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.** **Interdit write Badakan.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Intérim → Vérif officines : SIRET déjà CRM → Pharmacy existante, Valider = même fiche
- [ ] Nouveau SIRET : Valider crée une Pharmacy PROSPECT
- [ ] Contact principal créé, ou fusionné (même email puis tél) sur cette Pharmacy
- [x] Auto : unitaires #376 verts ; `typecheck` + `lint:lines` OK

## Suite

1. Merge PR #388 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-376-badakan-pharmacy-verify`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : **#377** depuis `origin/dev` — lire `docs/handoffs/HANDOFF_ISSUE_368.md` + ce handoff

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)
