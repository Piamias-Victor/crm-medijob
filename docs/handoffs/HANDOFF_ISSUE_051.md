# Handoff — Issue #51 (Page /design-system — 12 sections charte Medijob)

`/caveman` + `/tdd` actifs.

## État

Livré et vert. Branche poussée, PR vers `dev`.

- Branche : `feat/issue-51-design-system-page`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-51`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/51
- Prompt source : `docs/prompts/PROMPT_ISSUE_051.md`
- Spec : `SPEC_V2.md` §12 · ADR `docs/adr/0001-kanban-cvtheque-all-active-missions.md`

## Livré (voir diff PR, pas recopié)

- Route `/design-system` (RSC) : `app/design-system/page.tsx` + nav ancrée
- `organisms/DesignSystemSections.tsx` — registre piloté par `lib/design-system.ts` (source unique ids/labels)
- 12 showcases `molecules/design-system/*Showcase.tsx` + `Section.tsx` (wrapper `role=region`) + `SectionNav.tsx`
- `lib/design-tokens.ts` — 13 tokens couleur (name/className/description)
- Atom `MedicalCross` (croix médicale centrée, réutilisée par `SidebarBrand` + showcases)
- Tests : `app/design-system/page.test.tsx` (4), `molecules/design-system/PaletteShowcase.test.tsx` (1)

## Décisions / pièges

- **`@theme inline` (globals.css #50) n'expose PAS les `--color-*` sur `:root`** → `var(--color-*)` en style inline = vide (rendu blanc). Toujours passer par les utilitaires Tailwind `bg-*` / `text-*`. Les classes doivent être des **literals** (scanner Tailwind), d'où `className` figé dans `design-tokens.ts`.
- Croix médicale : ancien path asymétrique (centre y=10) → corrigé `M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z` (centre 12,12). Extrait en atom (DRY, 3 copies SVG supprimées).
- Button atom : ajout variant `danger` (destructif) — couvre les 4 variants de la charte.
- **Framer Motion ajouté** : `framer-motion@12.40.0` (modifie `apps/web/package.json` + `pnpm-lock.yaml`). Démo subtile concentrée dans `KanbanShowcase` (entrée fade/slide + `whileHover`).
- ADR 0001 : carte kanban = candidat + plusieurs missions actives, 1 handle drag (`GripVertical`) par mission.

## Vérifs (toutes vertes)

`pnpm test` (13) · `pnpm typecheck` · `pnpm lint` · `pnpm lint:lines` (<100)

- `pnpm build` **non lancé** : `next/font/google` (Inter) fetch réseau bloqué en sandbox → faux négatif probable hors-ligne. À valider en CI / local avec réseau.
- Validation visuelle (HITL) faite par l'utilisateur : croix centrée + 13 swatches colorées OK.

## Suite / dette

- Aucune dette bloquante. Si besoin : variant `secondary` explicite sur Button (actuellement `primary` navy fait office de secondaire dans la démo).
- #52 (schéma Prisma) en parallèle — ne pas toucher `prisma/`. Pas de conflit attendu (périmètre `app/design-system/` + `components/`).

## Suggested skills

- `/caveman` + `/tdd` pour toute issue
- `/handoff` en fin de session sur demande
