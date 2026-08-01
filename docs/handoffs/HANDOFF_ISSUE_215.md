# Handoff — Issue #215 (Panneau vue rapide générique + pharmacie)

## État

**Merge demandé sur `dev`.** Branche `feat/issue-215-quick-view-panel`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/215
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/240
- Parent : Epic #210 · CSV V1-007 / V1-013 · `docs/grill/CSV_V1_DECISIONS.md`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_215.md` → `done/` après merge
- Graphe : `docs/ISSUE_DEPENDENCIES_V1.md` (slice 6)

## Livré

- Shell générique : `apps/web/src/components/molecules/quick-view-panel/`
- Contenu pharmacie (sections UI) : `apps/web/src/components/molecules/pharmacy-quick-view/`
- Organisme fetch : `apps/web/src/components/organisms/PharmacyQuickView.tsx`
- Read-model : `pharmacy.quickView` + `pharmacy-quick-view.repo.ts` + VM `toPharmacyQuickView`
- Liste : clic ligne → panneau ; Actions sticky ; bouton Aperçu + Modifier
- Tests UI / VM / router ciblés

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Interface panneau | Shell slots + `QuickViewSection` |
| Data | Nouveau `pharmacy.quickView` (pas `getById`, pas fatten list) |
| Tests | Panel open/link, VM mapping, eye/actions, row click |
| Trigger | Row click ouvre panneau ; œil/Aperçu en plus de Modifier |
| État | `useState` local dans `PharmacyTable` |
| UX | Drawer droit ; contenu structuré (icônes/badges), pas texte brut |

## Hors scope / notes

- Neon unreachable → login « Identifiants invalides » (faux négatif credentials)
- Idle JWT middleware vs Node peut produire `UNAUTHORIZED` RSC après ~30 min (pré-existant #213) — pas fixé dans #215
- Compte local de test créé hors repo (ne pas documenter secrets)

## Suite

Prochaine slice V1 selon `docs/ISSUE_DEPENDENCIES_V1.md` après merge (souvent colonnes/filtres pharmacies #220, autres vues rapides #223/#224/#227).

## Suggested skills

- `/caveman`
- `/tdd`
- Lire ce handoff + `CONTEXT.md` si suite listes ops / vue rapide
