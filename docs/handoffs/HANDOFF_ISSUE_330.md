# Handoff — Issue #330 (Facturation Recharts)

## État

**Code livré · QA user OK (« super ») · merge `dev` demandé.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/330
- Parent : PRD #325 · `docs/PRD_FINANCE_DEVIS_V1.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_330.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/336
- Branche : `feat/issue-330-facturation-stats-recharts` — **repo `medijob` only, jamais `git worktree`**
- Règles : `docs/prompt-rules.md`, `docs/github-rules.md`, `CLAUDE.md`
- Handoffs amont : `docs/handoffs/HANDOFF_ISSUE_329.md`, `docs/handoffs/HANDOFF_ISSUE_328.md`

## Livré

Graphes Recharts sur **`/facturation`** (Vue d’ensemble). **`/facturation/suivi`** reste la liste #329.

- Tuiles inchangées : 4 compteurs + CA + Marge
- 4 barres CA/Marge : Referent (seau `__none__`), Pharmacy (top 8 + Autres), contrat, mois `acceptedAt`
- Pas de slice Candidate
- Recruteur / Communication : nav absente, `/facturation*` → Accueil + tRPC `FORBIDDEN`

Seam : `buildFacturationSlices` + `facturation.overview(filters).slices`. Tests = agrégats, pas pixels Recharts.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Graphes | **A** — `/facturation` Vue d’ensemble. Suivi = liste |
| Période | **A** — mois en cours, DatePicker existant |
| Graphes | **A** — 4 barres (plusieurs) |
| Dates | **B** — overview `acceptedAt` (query `acceptation.*`). Liste `sentAt` (`periode.*`). URL diverge, `preserveSearchParams` |

Suite session : brouillon seul = **Devis courant** si pas de SENT/ACCEPTED. Carte : Prévisualiser / Envoyer / Accepter. SENT/ACCEPTED existant non remplacé. CA toujours 0 tant que pas Accepté.

## Pièges

- Prompt #330 **périmé** sur le nommage Suivi (déjà #329). Ne pas recréer un onglet Suivi graphes.
- Vue d’ensemble filtre date = **`acceptedAt`**. Liste = **`sentAt`**. Nav copie la query ; clés date distinctes.
- `pickCurrentDevis` : fallback DRAFT. Liste Facturation : HT du brouillon visible, état commercial encore **Sans devis**.
- `acceptDevis` accepte DRAFT **ou** SENT. `canSend` seulement DRAFT.
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**
- CI `facturation.test.ts` : `m-draft` `amountHt` 3000 (plus `null`) après fallback DRAFT.

## Tests manuels

- [x] User : « super » (graphes + flux Devis courant)
- [x] Enregistrer brouillon → Devis courant + Prévisualiser / Envoyer / Accepter
- [ ] Recruteur : pas Facturation (non retesté ici)
- [ ] Mission ANNULEE absente du CA (non retesté ici)

## Suite

- Finance Devis V1 (#325) : slice graphes fermée. Glossaire `CONTEXT.md` « Recruteur ne voit pas CA » encore faux vs fiche Mission (#328).
- Phase 5 : checkout `dev`, `git branch -d feat/issue-330-facturation-stats-recharts`. Pas de worktree.

## Suggested skills

- `/caveman`
- `/tdd`
