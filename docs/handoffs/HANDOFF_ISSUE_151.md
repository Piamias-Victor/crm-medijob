# Handoff — Issue #151 (EmailButton)

## État

**Prêt merge.** Branche `feat/issue-151-email-button`.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/151
- Prompt : `docs/prompts/done/PROMPT_ISSUE_151.md`
- Parent : Epic #19 · Milestone Bloc 0 — Fondations
- Débloque : fiches entités US #10–12 (branchement `EmailButton` sur pages)

## Livré

### `<EmailButton>` (`apps/web/src/components/molecules/email-button/`)
- Props : `to`, `subject?`, `body?`, `label?`, `composeClient?`, `activityLogContext?`
- Défaut **Gmail web** (`composeClient="gmail"`) — ADR `docs/adr/0012-gmail-web-compose-default.md`
- `mailto` via `composeClient="mailto"`
- Validation email (`isValidEmailRecipient`) · tooltips manquant/invalide
- Popup bloqué → toast `COMPOSE_POPUP_BLOCKED`
- ActivityLog optionnel : dialog RHF+Zod · hook `use-activity-log-email-save` · `activityLog.createBatch` (transaction)

### Utilitaires `apps/web/src/lib/mailto/`
- `buildMailtoUrl`, `buildGmailComposeUrl`, `buildComposeUrl`, `openEmailCompose`, `scheduleActivityLogPrompt`
- Constante `ACTIVITY_LOG_PROMPT_DELAY_MS = 500`

### Serveur
- `activityLog.createBatch` — router + repository `$transaction`

### Showcase
- `/design-system#email-button` (pas d'ActivityLog demo — page hors auth)

### Atom `Button`
- Variant `outline` (dialog skip)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Périmètre | Molecule + showcase, pas de branchement fiches |
| Multi-log | 1 log par ID context (ADR 0003) via **batch transaction** |
| Dialog | GlassModal + champ content (subject pré-rempli) |
| Timing prompt | Focus retour OU 500ms (dedup) |
| Compose | **Gmail web par défaut** |
| Showcase ActivityLog | Retiré (401 hors session sur `/design-system`) |

## Tests

```bash
cd apps/web
pnpm vitest run src/server/routers/activity-log.test.ts src/lib/mailto/ src/components/molecules/email-button/ src/app/design-system/page.test.tsx
pnpm typecheck && pnpm lint
pnpm dev  # /design-system#email-button
```

## Suite (#152)

`DuplicateDetectionPage` — `docs/prompts/pending/PROMPT_ISSUE_152.md`

## Points d'attention

- Brancher `EmailButton` sur fiches Candidate/Pharmacy/Contact/Mission (issues module)
- PII sujet/corps visible dans URL Gmail — minimiser `body` pré-rempli en prod
- `#150` SoftDeleteModal peut être sur branche parallèle — pas de conflit direct

## Suggested skills

- `/caveman` + `/tdd` pour #152
- `/handoff` en fin de session
