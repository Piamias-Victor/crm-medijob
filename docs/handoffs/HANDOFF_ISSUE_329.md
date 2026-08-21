# Handoff — Issue #329 (Facturation nav + liste)

## État

**Code livré · QA user OK (localhost + filtres overview) · merge `dev` demandé.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/329
- Parent : PRD #325 · `docs/PRD_FINANCE_DEVIS_V1.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_329.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/335
- Branche : `feat/issue-329-facturation-nav-list` — **repo `medijob` only, jamais `git worktree`**
- Règles : `docs/prompt-rules.md`, `docs/github-rules.md`, `CLAUDE.md`

## Livré

Nav **Facturation** si `finance.view` (Direction / RH-Admin). Recruteur / Communication : pas d’item, `/facturation*` → redirect Accueil (même `forbid-admin` qu’Admin) + tRPC `FORBIDDEN`.

```
/facturation        → Vue d’ensemble (tuiles compteurs + CA + Marge)
/facturation/suivi  → liste 1 ligne / Mission = devis courant (+ Sans devis)
```

Filtres **identiques** sur les deux pages (URL sync, barre `FacturationFilterBar`) : contrat, état commercial, Pharmacy, Referent (seau `__none__`), dates = **`sentAt`**. Sans devis hors filtre date. Clic ligne → `/missions/{id}`. Accueil KPI **sans** CA/Marge.

Seam : `facturation.overview(filters)` / `facturation.listSuivi(filters)` via `financeProcedure`. Agrégats : `buildFacturationOverview` + `listFacturationSuivi`. CA dérivé #328. **Pas de Recharts.**

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Route | **`/facturation`** + sous-nav (pas `/facturation/devis`) |
| Lignes | **1 / Mission** = devis courant. Sans devis inclus |
| Dates liste | **`sentAt`** du courant |
| Recruteur URL | **Redirect Accueil** comme Admin + caller `FORBIDDEN` |
| Page vs liste | Stats globales = `/facturation`. Liste = onglet **Suivi** |
| Filtres stats | **Oui** aussi sur `/facturation` (même barre, stats filtrées) |
| Graphes | **#330** — user confirmé, pas ce slice |

Handoff #328 : `CONTEXT.md` dit encore « Recruteur ne voit pas CA » (overridé fiche Mission). **Pas corrigé ici.**

## Pièges

- **#330 prompt stale** : reco « sous-onglet Suivi à côté de Devis ». User #329 a nommé **Suivi = liste**. Reco #330 : Recharts sur **`/facturation`** (Vue d’ensemble). Ne pas écraser l’onglet liste.
- Dates stats #330 = **`acceptedAt`** (CA). Dates liste #329 = **`sentAt`**.
- Nav sous-onglets **conserve la query** (filtres partagés). `isActive` strip `?…`.
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**
- `pnpm test` : unitaires verts. 10 fichiers `*.integration.test.ts` KO = Testcontainers / pas de Docker (déjà #328).

## Tests manuels

- [x] Direction : Facturation → tuiles + CA / Marge
- [x] Filtres sur `/facturation` (demande user post-QA)
- [x] User : graphes = autre issue (#330)
- [ ] Recruteur : pas de menu ; `/facturation` → Accueil (non retesté ici)
- [ ] Clic ligne Suivi → Mission (non retesté ici)

## Suite

- **#330** Facturation Recharts. Briefing obligatoire. Lire ce handoff **avant** le prompt #330 (nommage Suivi).
- Phase 5 : checkout `dev`, `git branch -d feat/issue-329-facturation-nav-list`. Pas de worktree.

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` au briefing #330 (onglet liste vs graphes sur `/facturation`)
