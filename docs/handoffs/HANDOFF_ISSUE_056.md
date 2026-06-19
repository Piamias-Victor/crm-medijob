# Handoff — Issue #56 (CANDIDATS — Upload CV + extraction IA + revue humaine)

`/caveman` + `/tdd` actifs.

## État

**Prêt PR.** Upload PDF/PNG → Blob → extraction OpenRouter/mock → revue humaine → `confirmExtraction` met à jour Candidate + `cvUrl`.

- Branche : `feat/issue-56-upload-cv-extraction`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-56`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/56
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_056.md` (repo principal `medijob`)
- Dépend de #55 · Débloque #57

## Livré

### Backend
- `candidate.extractCv` — upload Blob, extraction IA, suggestions métier fuzzy, rollback blob si IA invalide
- `candidate.confirmExtraction` — revue validée → persist `cvUrl` + profil (pas d’auto-save)
- Provider dédié `createCvExtractionProvider` (mock | OpenRouter multimodal PDF/PNG)
- `CvExtractionSchema` + `normalizeCvExtractionJson` + `enrichCvExtraction` (regex email/tél/CP depuis `rawText`)
- `profileSummary` → notes internes (synthèse IA, pas copier-coller)
- Route auth `GET /api/candidates/[id]/cv` — stream blob privé (fix Forbidden)

### UI Profil
- `CandidateCvPanel` — barre upload + « Voir le CV » (justify-between)
- Revue split : preview CV + formulaire éditable (tous champs + JobTitle/Software/contracts)
- Preview bas de page (`CandidateCvStoredPreview`, hauteur `32rem`)
- Preview revue (`review`, `70vh`) · PDF sans sidebar (`view=Fit`)
- Sync form post-confirm : `useCandidateProfileForm` + invalidate `candidate.getById` + `router.refresh()`
- Label « Résumé IA (notes internes) » + Textarea

### Tests (TDD)
- Router CV, schema, enrich, normalize, prompt, preview URL, profile form reset
- **331 tests unitaires verts** · `lint:lines` · `typecheck` verts
- Intégration testcontainers pharmacy : flaky Docker (hors scope, pattern #55)

## Décisions / pièges

- **Blob privé** : jamais lien direct Vercel → proxy `/api/candidates/[id]/cv`
- **EXTRACTION_PROVIDER=mock** par défaut dans `.env.example` ; OpenRouter si clé + non-mock
- **Placeholders IA** (`N/A`) ignorés ; fallback profil existant à la revue
- **Conflit git** possible #58 sur fiche candidat — merger `dev` souvent
- **Handoff + code** dans worktree `crm-medijob-issue-56`, pas dans workspace `medijob` principal

## Hors scope (suite)

- `cvSummary` / dossier anonymisé / export PDF (#57)
- PDF text fallback (`pdf-parse`) si qualité IA insuffisante
- Proxy preview pour re-review sans re-upload

## Tests manuels (checklist)

- [ ] Camille Durand → upload `CvTest.pdf` → revue pré-remplie + preview côte-à-côte
- [ ] Éditer nom → Confirmer → profil + preview bas mis à jour sans reload
- [ ] « Voir le CV » ouvre nouvel onglet (pas Forbidden)
- [ ] Notes internes = résumé synthétique, pas texte brut CV
- [ ] `pnpm test && pnpm lint && pnpm typecheck` verts

## Suggested skills

- `/caveman` + `/tdd` pour #57
- Plugin Prisma si extension schema CV
- `/handoff` après merge → déplacer prompt `pending/` → `done/`
