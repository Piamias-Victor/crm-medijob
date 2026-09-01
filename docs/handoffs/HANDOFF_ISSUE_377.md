# Handoff — Issue #377 (liste Badakan contracts)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés. User OK. CI `quality` + Vercel verts sur #389.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/377
- Parent : PRD #365 — `docs/PRD_INTERIM_V1.md` · ADR `docs/adr/0030`
- Blocked by : #368 — `docs/handoffs/HANDOFF_ISSUE_368.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/389 → `dev`
- Branche : `feat/issue-377-badakan-contracts` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (Badakan contract ≠ Ligne de suivi ≠ Devis)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_377.md`
- Graphe : `docs/ISSUE_DEPENDENCIES_INTERIM.md` — slice 10 / dernier AFK Intérim V1
- Next : graphe #365 fermé. Autres prompts `pending/` hors Intérim V1

## Livré

Liste lecture **Badakan contracts** dans Intérim. Pas de Ligne de suivi, pas de Devis, pas d’écriture contrat Badakan.

- Client : `searchContracts` → `POST /services/v3/contracts/search` (`fetchFn` injecté). Toujours lecture seule
- Mapper : statut (`currentStep` / `status`), PDF / DPAE (string ou `{ url }`), recipient, officine
- Persist : `BadakanContract` — migration `20260901140000_badakan_contract` (déjà `migrate deploy` Neon locale)
- Cycle : même cron Profils app tire `syncContracts` (après enterprises)
- UI : `/interim/contrats` ; sous-nav « Contrats Badakan » ; statut + liens PDF/DPAE si URLs présentes
- Router `badakanContract.list` via `createServerCaller` — pas de mutation, pas de bouton créer

## Décisions

| Sujet | Choix |
|-------|--------|
| Grill | Interdit — spec #365 |
| Vocab | Badakan contract ≠ Ligne de suivi ≠ Devis |
| Writes Badakan | hors V1 — `searchContracts` only, POST search = lecture paginée |
| GET contract | hors slice — search suffit si PDF/DPAE dans le payload |
| Finance | aucun `FinanceLine` / Devis créé depuis un contrat |
| Liste vide | normal tant que le cron n’a pas tourné (pas de bouton Rafraîchir) |

## Pièges

- **Migrate dans `apps/web`** : `cd apps/web && pnpm exec prisma migrate deploy`. Sans ça → table `BadakanContract` absente
- Liste vide au 1er load → attendre le cron (`GET /api/cron/app-profiles` + Bearer). Sans `BADAKAN_EMAIL`/`PASSWORD` → cycle `{ skipped: true }` → 0 contrats
- PDF/DPAE = URLs Badakan si le search les envoie ; sinon chip absent (« si dispo »)
- `pnpm test` : `*.integration.test.ts` KO si Docker down. Unrelated
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.** **Interdit write Badakan.** **Interdit Ligne de suivi auto.**

## Tests manuels

- [x] User OK `/handoff` (phase 3)
- [ ] Intérim → Contrats Badakan (statut visible)
- [ ] Facturation → Intérim : aucune ligne auto
- [ ] Pas de bouton « créer contrat » vers Badakan
- [x] Auto : unitaires #377 verts (1652 hors integration) ; `typecheck` + `lint:lines` OK ; migrate locale appliquée

## Suite

1. Merge PR #389 → `dev` (`gh pr merge`, pas de push direct code) — demandé cette session
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-377-badakan-contracts`
3. Prompt déjà dans `docs/prompts/done/` (cette PR)
4. Next agent : graphe Intérim V1 (#366–#377) fermé. Lire ce handoff si reprise contrats (GET contract / URLs auth)

## Suggested skills

- `/caveman`
- `/tdd`
- `/handoff` (déjà fait)
