# Handoff — Issue #327 (Envoyer Devis PDF + Gmail)

## État

**Code livré · merge `dev` demandé par l’user.** QA : aperçu HTML validé (« parfait »). Envoi local dépend du jeton Blob.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/327
- Parent : PRD #325 · `docs/PRD_FINANCE_DEVIS_V1.md`
- Prompt : `docs/prompts/done/PROMPT_ISSUE_327.md`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/333
- Branche : `feat/issue-327-devis-send-pdf-gmail` — **repo `medijob` only, jamais `git worktree`**
- Règles : `docs/prompt-rules.md`, `docs/github-rules.md`, `CLAUDE.md`
- ADR : `docs/adr/0012` (Gmail compose, pas d’email serveur)

## Livré

`devis.send({ missionId })` → DRAFT → SENT (courant = dernier SENT/ACCEPTED par `sentAt`). Nouveau DRAFT ≠ courant. PDF React-PDF → Vercel Blob → Document `MISSION` / `DEVIS`. Liste Pharmacy : même blob (agrégat lecture). Gmail prérempli (`buildComposeUrl`) ; Léa joint le PDF. ActivityLog type DEVIS. Soft-delete DRAFT only.

**Aperçu (follow-up session)** : `devis.previewPdf` → `{ quote }` (pas de Blob, pas de persist). Popup HTML `DevisQuoteSheet` (émetteur / destinataire / tableau / HT / TVA 20% / TTC). De là : Enregistrer (brouillon) ou Envoyer (save + send + Gmail). PDF envoyé = même layout.

**Blob** : `storeDevisPdf` **avant** `markSent`. Échec token → toast `DOCUMENT_UPLOAD_BLOB_DENIED`, DRAFT reste DRAFT.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| PDF | React-PDF CRM (pas jsPDF du zip) |
| Pharmacy docs | Même Document Mission, agrégation lecture — pas de 2e blob |
| Gmail `to` | Mission.contact, sinon Pharmacy primary ; sans email → compose sans `to` |
| Aperçu | Popup avant envoi ; Envoyer **ou** Enregistrer sans envoyer |
| Viewer | Pas d’embed PDF Chrome (trop petit) → feuille HTML |

## Pièges

- **Neon / migrate** : DB a `20260819140000_application_board_submission_id` (#231) absente de cette branche. **Interdit `prisma migrate reset`.** `sentAt` : `20260820110000_devis_sent_at` via `db execute` + `migrate resolve --applied` si besoin. Local : `pnpm dev` seulement.
- Envoi **local** 500 si `BLOB_READ_WRITE_TOKEN` invalide/absent. Prod OK. Aperçu marche sans Blob. Pull : `vercel env pull` dans `apps/web`. Ne pas logger le token.
- Prisma seulement dans `apps/web/src/server/db/repositories/`. Router : `makeDevisRouter` + `devis.adapter.ts`.
- Fichiers < 100 lignes. **Jamais** `git worktree`.
- `useEntityMutation` `onSuccess` ne reçoit pas la data mutation → `openDevisSendResult(await send.mutateAsync(...))` dans le flow.

## Tests manuels

- [ ] Mission → Devis → Prévisualiser → feuille devis (tableau + totaux), pas de carré PDF Google
- [ ] Aperçu → Enregistrer → brouillon, pas d’envoi
- [ ] Aperçu → Envoyer → SENT, PDF téléchargé, Gmail Contact (si Blob OK)
- [ ] 2e brouillon → SENT reste courant
- [ ] Fiche Pharmacy → Documents : un PDF DEVIS (pas doublon)
- [ ] Historique Mission : ligne Devis
- [ ] Local sans jeton Blob : toast stockage, DRAFT inchangé

## Suite

- **#328** Accept / CA. Hors slice. Briefing obligatoire.
- Puis #329–#330 Facturation.
- Phase 5 : checkout `dev`, `git branch -d feat/issue-327-devis-send-pdf-gmail`. Pas de worktree.

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` au briefing #328 (Accept vs CA, qui voit les montants)
