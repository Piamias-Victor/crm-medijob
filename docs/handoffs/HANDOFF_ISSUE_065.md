# Handoff — Issue #65 (MISSIONS — Fiche Mission CRUD + ANNULEE)

`/caveman` + `/tdd` actifs.

## État

**Prêt pour review.** Branche poussée, PR ouverte vers `dev`.

- Branche : `feat/issue-65-mission-fiche-pourvu`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-65`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/65
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_065.md`
- Spec : `SPEC_V2.md` §10.865–878 · ADR 0008
- Dépend de #64 (liste/kanban missions)

## Livré

### Backend
- `mission.repository` — `findDetailById`, `update`, `terminalTransition` (existant)
- `mission` router — `getById`, `update`, `markAnnulee`, `markPourvu` (API pipeline #66), `updateStatus`
- `transition-status` — POURVU/ANNULEE + stages Placé/Pas retenu (ADR 0008)
- `contact.listByPharmacy` — picker contact sur fiche
- Referentials mission étendus (`pharmacies`)

### UI
- `/missions/[id]` — shell 6 onglets (stubs sauf Infos)
- Form mission complet RHF + Zod
- **Annuler la mission** uniquement sur fiche (pas de bouton POURVU — réservé pipeline #66)
- Liens liste + kanban → fiche
- Checkbox « Temps plein » via `CheckboxGroup` (design system)

### Tests
- `mission-detail.test.ts`, `mission.test.ts`, `mission.test.fixtures.ts`
- `transition-status.test.ts` (4) — inchangé, vert

## Décision produit (session)

POURVU **hors fiche Infos** : le recruteur ne marque pas manuellement « pourvu » depuis l’onglet Infos. Statut POURVU → pipeline candidats (#66) quand un candidat est validé/placé. Fiche = **Annuler la mission** seulement pour ANNULEE.

`markPourvu` reste exposé côté tRPC pour #66.

## Tests manuels (non exécutés par l’agent)

- CRUD champs mission OK
- Annuler mission → candidats Pas retenu, absent kanban
- Mission seed POURVU reste en liste, pas kanban
- CI locale

## Suite (#66)

- Onglet Pipeline kanban candidats
- Appel `markPourvu` / transition depuis validation candidat placé

## Points d’attention

- `.env` worktree = symlink vers `medijob/apps/web/.env`
- Ne pas committer `node_modules` symlinké dans worktree

## Suggested skills

- `/caveman` + `/tdd` pour #66
- `/handoff` en fin de session
