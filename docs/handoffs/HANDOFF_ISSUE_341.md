# Handoff — Issue #341 (Ligne de suivi)

## État

**Code livré · QA user OK (« super ») · PR + merge `dev` puis `main` demandés.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/341
- Parent : PRD #325 · ADR `docs/adr/0017-finance-line-suivi.md` · glossaire `CONTEXT.md` (Ligne de suivi / Devis)
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/342 → `dev`
- Branche : `feat/issue-341-finance-line-suivi` — **repo `medijob` only, jamais `git worktree`**
- Règles : `docs/prompt-rules.md`, `docs/github-rules.md`, `CLAUDE.md`
- Pas de `docs/prompts/pending/PROMPT_ISSUE_341.md`

## Livré (produit)

Facturation → Suivi → **Nouvelle ligne** (`GlassModal`). Pharmacie + candidat requis, Mission optionnelle. Kind Placement | Intérim. CA/Marge bookent sur `occurredAt` sans Devis accepté. Direction / RH-Admin (`finance.view`).

**Générer un devis** n’enregistre pas la ligne : ouvre `DevisPreviewModal` (même aperçu que l’onglet Mission). Dans l’aperçu : **Enregistrer le brouillon** / **Envoyer** / Fermer. Puis retour au popup → **Enregistrer** crée la `FinanceLine` et attache le `devisId` s’il existe.

Sans Mission : `Devis.missionId` nullable (migration `20260821140000_devis_optional_mission`, déjà appliquée sur Neon). PDF + ActivityLog sur la **Pharmacie**. Tableau Suivi : Générer / Envoyer sans exiger une Mission.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Mission | Optionnelle (ligne **et** devis) |
| Label Mission | Juste « Mission », plus de suffixe « pour générer / envoyer » |
| Générer | Aperçu d’abord, **pas** createLine immédiat |
| Envoyer depuis le formulaire ligne | Retiré ; envoi depuis l’aperçu |
| Envoyer / Générer tableau | Conservé sur une ligne déjà persistée |
| QA | « super » puis `/handoff` + merge `dev` **et** `main` |

## Pièges

- Nested modals : aperçu `DevisPreviewModal` `overlayClassName="z-[60]"` au-dessus de Nouvelle ligne (`z-50`).
- `devis.previewPdf` / `devis.send` exigent encore une Mission. Formulaire ligne : `facturation.previewDevis` / `saveDevis` / `sendDevis`.
- Neon : `Devis.missionId` DROP NOT NULL déjà déployé. **Interdit `prisma migrate reset`.**
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**
- `pnpm test` : ~10 fichiers integration KO = Testcontainers / pas de Docker. Unrelated.

## Tests manuels

- [x] Générer → aperçu, pas de ligne dans Suivi
- [x] Aperçu Enregistrer / Envoyer puis Enregistrer la ligne
- [ ] Recruteur : pas Facturation (non retesté ici)
- [ ] Tableau Générer / Envoyer sur ligne sans mission (non retesté après preview)

## Suite (cette demande)

1. Commit + push branche → PR #342
2. Merge #342 dans `dev` (`gh pr merge`, pas de push direct)
3. PR `dev` → `main` puis merge (règle : PRs feature ciblent `dev` ; `main` seulement via PR depuis `dev`)
4. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-341-finance-line-suivi`

## Suggested skills

- `/caveman` si reprise produit Facturation
- `/tdd` pour tout fix post-merge
