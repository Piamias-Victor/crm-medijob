# Handoff — Issue #217 (Aperçu documents PDF/image)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-217-document-preview`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/217
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/242
- Parent : Epic #210 · CSV V1-009
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_217.md` → `done/` après merge

## Livré

- Preview URL : `/api/documents/[id]/preview` (`inline`) — download reste `attachment`
- Shared stream : `apps/web/src/server/documents/document-stream.ts` + `document-file-response.ts`
- Lib : `apps/web/src/lib/document-preview.ts` (`isPreviewableDocument`, URL, PDF src)
- UI : `document-preview/DocumentPreviewModal` + `DocumentPreviewBody` wired via `EntityDocumentsTab` / `EntityDocumentsList`
- VM : `mimeType` exposé sur `DocumentListRow`

## Décisions session

| Sujet | Choix |
|-------|-------|
| Route | Nouvelle `/preview` (pas query sur download) |
| UI | Modal `GlassModal` |
| Bouton Aperçu | Toujours visible ; non-previewable → fallback + download |
| Formats | PDF + images (png/jpeg/webp/gif) ; office/csv → fallback |
| Auth | Même gate session que download (401 sans user) |

## Hors scope

- Preview Office (docx/xlsx) in-browser
- Integration tests Docker (testcontainers) — échecs locaux si Docker absent

## Suite (post-merge)

1. `git mv docs/prompts/pending/PROMPT_ISSUE_217.md docs/prompts/done/`
2. Commit + push direct sur `dev` (docs/prompts only)
3. Prochaine slice V1 selon epic #210 / `docs/ISSUE_DEPENDENCIES_V1.md`

## Suggested skills

- `/caveman`
- `/tdd`
- Lire ce handoff + `EntityDocumentsTab` avant toute suite documents
