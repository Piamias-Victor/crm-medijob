# PROMPT_ISSUE_608 — schema postalCode + ApplicationSource

**Issue:** https://github.com/Piamias-Victor/crm-medijob/issues/608  
**Blocked by:** #607

## Skills
```
/caveman
/tdd
```

## What
Prisma: `Application.postalCode String?`; enum `ApplicationSource` (`BOARD_INGEST` | `PUBLIC_APPLY`) default `BOARD_INGEST`; local migrate. Inbox + detail show CP + source. Board ingest unchanged (default source).

## Acceptance
- [ ] Local migration
- [ ] Inbox/detail CP + source
- [ ] Ingest tests green

## Compte rendu
-
