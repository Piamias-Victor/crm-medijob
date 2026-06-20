# Handoff — Issue #57 (CANDIDATS — cvSummary IA + dossier anonymisé + export PDF)

`/caveman` + `/tdd` actifs.

## État

**Prêt PR.** Branche `feat/issue-57-candidate-cv-summary-pdf` · worktree `crm-medijob-issue-57`.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/57
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_057.md`
- Dépend de #56 (mergée) · Parent #19

## Livré

### Backend
- `candidate.generateSummary` — notes + métier + logiciels → `cvSummary` (Zod `summaryResponseSchema`)
- `candidate.saveCvSummary` — édition manuelle post-génération
- `candidate.generateAnonymized` — dossier sans PII + garde `ANONYMIZED_CONTAINS_PII`
- Kind IA `anonymized` dans schemas/mock/OpenRouter
- `updateDerivedFields` repository
- `GET /api/candidates/[id]/anonymized-pdf` — PDF brandé `@react-pdf/renderer`
- Mock summary propre (`mock-summary.ts`) — n’injecte plus le prompt brut

### UI
- Onglet **Documents** : dossier anonymisé, export PDF, lien CV, `EntityDocumentsTab`
- Onglet **Profil** : `CandidateCvSummaryPanel` — générer / éditer / enregistrer résumé IA
- Pas de mention résumé dans Documents

### Tests
- 10 tests unitaires #57 (summary, anonymized, PII, router, PDF smoke, saveCvSummary)
- `typecheck` + `lint` verts
- Intégration testcontainers : flaky sans Docker (hors scope)

## Décisions / pièges

- **Profil vs Documents** : résumé IA = Profil ; anonymisé + PDF = Documents (demande utilisateur session)
- **OpenRouter** : `EXTRACTION_PROVIDER=openrouter` + `OPENROUTER_API_KEY` + `EXTRACTION_MODEL=google/gemini-2.5-flash-lite` dans `apps/web/.env` (fichier local gitignored, symlink worktrees)
- **Blob** : `BLOB_READ_WRITE_TOKEN` requis pour « Voir le CV » — config dans `.env` principal `medijob`
- **`.env` jamais committer** — secrets restent locaux

## Tests manuels (checklist)

- [ ] Profil → Générer résumé IA (OpenRouter) → texte FR lisible
- [ ] Éditer résumé → Enregistrer → persiste après refresh
- [ ] Documents → Générer dossier anonymisé → sans nom/email/tél
- [ ] Exporter PDF → branding MediJob
- [ ] Upload document additionnel (CANDIDATE)
- [ ] `pnpm --filter web test` (unit) + lint + typecheck

## Suite / dette

- Déplacer prompt `pending/` → `done/` après merge sur `dev`
- Matching IA (#73) hors scope
- Soft delete UI (#80) hors scope

## Suggested skills

- `/caveman` + `/tdd` pour issues suivantes candidats
- `/handoff` après merge
- Plugin Prisma si schema évolue
