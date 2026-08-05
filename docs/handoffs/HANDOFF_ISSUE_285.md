# Handoff — Issue #285 (Assistant chat recruteur)

## État

**Prêt merge `dev` (CI vert).** Branche `feat/issue-285-assistant-recruiter-chat`

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/285
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/290
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_285.md` → `done/` après merge
- Contexte AI : `CONTEXT.md` (section AI — interlocuteur recruteur, fenêtre messages, reset contexte)

## Livré

Voir diff PR #290. Points d’entrée :

- Persona free-chat : `apps/web/src/server/ai/chat-persona.ts` + `prompt.ts`
- Historique N=8 : `lib/constants/assistant-chat.ts`, `server/ai/chat-history.ts`, `request.ts` (`history`)
- Contexte candidat enrichi : `format-entity.ts`, `candidate-context.select/map`, `candidate.repository.findForContext`
- Reset UI : `lib/assistant/context-reset.ts` + `use-assistant-chat.ts`
- Hauteur fixe : `AssistantChat.tsx` — `calc(100dvh - 11rem)`, scroll interne messages
- Raccourci mail candidat : inchangé (`shortcuts.ts` instruction destinataire-candidat)

## Décisions user (session)

| Sujet | Choix |
|-------|-------|
| Fenêtre historique | `CHAT_HISTORY_WINDOW = 8` |
| Offset viewport | `ASSISTANT_CHAT_VIEWPORT_OFFSET = 11rem` (main p-6 + PageHeader + gap) |
| Reset contexte | `entityType`/`entityId` change ou clear ; label-only → pas reset |
| Tests prioritaires | persona, format enrichi, fenêtre, reset ; hauteur = manuel |
| Tool-calling | hors scope |

## Suite

- Prompt → `docs/prompts/done/` après merge (règle prompts)
- Vérif manuelle éventuelle : hauteur panel si chrome layout change (header mobile `h-14`)
- Pas de persist DB historique ; pas Anonymized dans contexte chat

## Suggested skills

- `/caveman`
- `/tdd`
- Relire `prompt.ts` / `chat-persona.ts` si étendre persona shortcuts hors free-chat
