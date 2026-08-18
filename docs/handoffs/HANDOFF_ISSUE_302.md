# Handoff — Issue #302 (Interview PDF)

## État

**Code livré · CI verte · merge `dev` demandé.**

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/302
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/310
- Prompt : `docs/prompts/done/PROMPT_ISSUE_302.md`
- Spec : `docs/PRD_ENTRETIENS_V1.md` US 24–25, 40 · ADR `docs/adr/0014-interview-as-entity.md`
- Parent : PRD #226 · bloqué par #301 (mergé)
- Branche : `feat/issue-302-interview-pdf` (repo principal, pas de worktree)

## Livré

Voir diff PR #310. Ne pas relire tout le slice.

Close DRAFT → CLOSED déclenche génération PDF compte-rendu (`react-pdf`, brand MediJob). Document `CANDIDATE` / catégorie `AUTRE`, nom `CR-entretien-{interviewId}.pdf`. Download = `/api/documents/{id}/download`. Close **ne casse pas** si blob/render rate (`pdfDocumentId: null`). Onglet Entretiens : **Télécharger PDF** si doc présent, sinon **Générer PDF** (`interview.generatePdf`). Sections vides omises. Sans IA.

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Déclencheur | Auto à la clôture |
| Lien Interview | Document Candidate only — **pas** de `interviewId` / enum INTERVIEW |
| Contenu | Maximum + design (identité, décision, scores barres, mapping fiche, checklist, Q/R) |
| Fail PDF | Close OK + CTA Générer PDF |

## Pièges

- Match PDF ↔ entretien = **nom fichier** `CR-entretien-{id}.pdf` (`findInterviewPdfId`).
- `storePdf` optionnel sur `closeInterview` — swallow errors. Live : `storePdf: (id) => storeInterviewCompteRendu(id, interviewPdfStore)`.
- Snapshot mapping = champs fiche **après** patch close (ordre : close → patch → storePdf).
- Builder : `buildInterviewPdfModel` — pas parser le binaire PDF pour les vides.
- Inspiré anonymized PDF (comportement), styles séparés (`server/pdf/interview-pdf-*`).
- Chips exclusive #301 : toujours pas splitter labels sur `, `.

## Tests manuels

Non validés user (checklist postée sur PR #310). À rejouer après merge si besoin.

## Suite

- **#303** IA optionnelle close — `docs/prompts/pending/PROMPT_ISSUE_303.md` (blocked by #301, parallel OK). **Ne pas casser** le side-effect PDF à la clôture.
- Phase 5 : pas de worktree ; supprimer branche locale après merge.

## Suggested skills

- `/caveman`
- `/tdd`
- `/grill-with-docs` pour #303 (scores vs résumé vs les deux)
