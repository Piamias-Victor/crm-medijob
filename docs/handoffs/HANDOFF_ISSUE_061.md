# Handoff — Issue #61 (Documents Pharmacy — upload Vercel Blob)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert (tests unitaires).** Onglet **Documents** sur `/pharmacies/[id]` : upload/list/delete via Vercel Blob (`entityType: PHARMACY`), formats PDF/PNG/DOC/DOCX/CSV/XLSX.

- Branche : `feat/issue-61-pharmacy-documents-blob`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-61`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/61
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_061.md` · Spec : `SPEC_V2.md` §3 Document · ADR 0007 (delete physique DB+Blob en UI, pas soft delete Document)
- Dépend de #60 (fiche pharmacy + onglet Documents stub) — **mergé sur `dev`**

## Livré

### Backend
- `document.repository.ts` — `listByEntity`, `create`, `findById`, `deleteById`
- `blob.ts` — wrapper `@vercel/blob` injectable, **`access: 'private'`** (store Vercel private)
- `document.ts` — `makeDocumentRouter(deps)` : `listByEntity`, `upload`, `delete`
- `document.schema.ts` — Zod + allowlist MIME/extension (`document-upload.ts`)
- `_app.ts` — router `document` branché
- `.env.example` — `BLOB_READ_WRITE_TOKEN`

### Download private store
- `app/api/documents/[id]/download/route.ts` — stream via `get(url, { access: 'private' })` + session `auth()`
- Raison : URL Blob private → `Forbidden` en lien direct navigateur ; proxy serveur requis

### UI
- `PharmacyDocumentsTab` — upload + liste + delete confirm
- `DocumentUploadForm` — catégorie Combobox + fichier base64 → tRPC
- `PharmacyDocumentsList` — category, name, size, date, download, delete
- `PharmacyDetailTabPanel` / `page.tsx` — RSC fetch `document.listByEntity`

### Tests (TDD)
- `document.test.ts` (5), `document.schema.test.ts` (2), `document-upload.test.ts` (8)
- Blob mocké via deps fakes — pas d’appel réseau Vercel en CI

## Décisions

- Store Vercel **Private** (`crm-medijob-web-blob`, région CDG1) — upload `private`, download via API route authentifiée
- Allowlist fichiers partagée client/serveur (`lib/document-upload.ts`)
- Delete = suppression row DB + `del()` Blob (pas soft delete — modèle Document sans `deletedAt`)

## Pièges / config

- **`BLOB_READ_WRITE_TOKEN`** requis en local (`apps/web/.env`) — variable Vercel Sensitive, récup via `vercel env pull` ou cocher env **Development**
- Erreur upload initiale : `Cannot use public access on a private store` → corrigé (`access: 'private'`)
- Erreur download initiale : `Forbidden` sur URL directe → corrigé (route `/api/documents/[id]/download`)
- `.env` worktree = symlink vers `medijob/apps/web/.env`

## Tests manuels (à valider post-merge)

- [x] Upload PDF → listé
- [x] Upload PNG/XLSX → accepté
- [x] Download via bouton → fichier OK (après fix API route)
- [ ] Delete → retiré liste + blob supprimé
- [ ] CI preview Vercel avec `BLOB_READ_WRITE_TOKEN` en env projet

## Hors scope

- Documents Contact/Mission/Candidat (même router réutilisable)
- ActivityLog pharmacie (#63)

## Suggested skills

- `/caveman` + `/tdd` pour suites issues documents
- Plugin Prisma si évolution schéma Document (ex. soft delete ADR)
