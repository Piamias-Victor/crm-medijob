# Handoff — Issue #211 (Palette Medijob CSV + logo)

## État

**Prêt merge** (après fix types PNG CI). Branche `feat/issue-211-medijob-palette`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/211
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/236
- Parent : Epic #210 · CSV V1-004
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_211.md` → `done/` après merge

## Livré

- Tokens CSS CSV : teal `#0C2F37`, mint `#5AE2A1`, sky `#73C6EF`, rose `#FE7CCA` (+ success/warning/error dérivés)
- Atom `MedijobLogo` + assets bundlés `src/assets/brand/` (login hors middleware)
- Sidebar : mark compact + wordmark, crossfade slot fixe `h-9`, expand 300ms
- Sky/rose discrets : badges mission, pipeline themes, orbs, Alert info
- `/design-system` + PDF brand colors alignés

## Décisions user

| Sujet | Choix |
|-------|-------|
| Mapping | primary=teal, accent=mint + tokens sky/rose |
| Sky/rose | Usage discret pertinent (missions/kanban/orbs) |
| Semantic colors | Alignés palette |
| Dark mode | Hors scope |
| Logo | PNG Downloads `…_Medijob-03` |

## Suite

Issue suivante naturelle (socle V1) : **#212** — reset password + idle logout 30 min.  
Prompt : `docs/prompts/pending/PROMPT_ISSUE_212.md`

## Suggested skills

- `/caveman`
- `/tdd`
- Auth : skill Better Auth N/A — stack = **NextAuth v5** existant (étendre)
