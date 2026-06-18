# Handoff — Issue #76 (Assistant IA — chat contextuel + 6 raccourcis)

`/caveman` + `/tdd` actifs.

## État

**Terminé et vert.** Page `/assistant` : chat IA via **OpenRouter**, picker de contexte custom avec **recherche par nom** (Candidat/Pharmacie/Mission), 6 raccourcis prédéfinis, toutes réponses IA validées **Zod** avant affichage.

- Branche : `feat/issue-76-assistant-ia-chat`
- Worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-76`
- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/76
- Prompt : `docs/prompts/PROMPT_ISSUE_076.md` · Spec : `SPEC_V2.md` §6.686–688 + §7.6
- Dépend de #53 (auth, `protectedProcedure`)

## Décision clé : provider = OpenRouter (pas Gemini direct)

L'utilisateur fournit une clé **OpenRouter** (API OpenAI-compatible). L'abstraction `EXTRACTION_PROVIDER` de la spec est conservée : `mock` force les réponses simulées ; toute autre valeur → OpenRouter **si** `OPENROUTER_API_KEY` est défini, sinon fallback `mock`. Modèle via `EXTRACTION_MODEL` (défaut `google/gemini-2.5-flash-lite`).

## Livré (voir diff PR)

### Serveur IA — `src/server/ai/`
- `schemas.ts` — Zod par type de réponse (`chat | summary | email | offer | report`)
- `parse.ts` — `JSON.parse` + validation Zod, throw si malformé (jamais affiché comme vérité)
- `provider.ts` — interface `AssistantProvider`, factory `createAssistantProvider(env)` (sélection mock/OpenRouter)
- `openrouter-provider.ts` — `POST /api/v1/chat/completions`, `response_format: json_object`
- `mock-provider.ts` — réponses simulées déterministes par kind (offre ≥ 100 car.)
- `shortcuts.ts` — 6 raccourcis (id, label, kind, entityType, instruction) + `findShortcut`
- `format-entity.ts` — formatage Candidate/Pharmacy/Mission → texte prompt
- `context-loader.ts` — `loadContextText(context, repos)` via `findById`
- `search.ts` — `searchEntities(type, term, repos)` → `EntityOption{id,label,sublabel}`, adapté par section
- `prompt.ts` — `buildPrompt` (system + format JSON + contexte + tâche + message)
- `render.ts` — réponse validée → texte affichable
- `chat-handler.ts` — `runAssistantChat(input, deps)` (orchestration pure, testable)
- `request.ts` — `chatInputSchema`, `assistantContextSchema`, `searchInputSchema`

### Router
- `routers/assistant.ts` — `chat` (mutation) + `searchEntities` (query), `protectedProcedure`, erreurs IA → `TRPCError BAD_REQUEST` (rien de sensible loggé). Câblé dans `_app.ts`.

### Repositories (recherche)
- `candidate/pharmacy/mission.repository.ts` — `search(term, limit=8)`, `contains` insensible casse, exclut soft-deleted (+ tests intégration)

### UI (atomic, logique en hooks)
- molecules : `ShortcutBar` · `ContextPicker` · `ContextTypePills` (pills custom) · `EntitySearch` (loupe + résultats + chip) · `ChatMessage` · `ChatComposer` (RHF+Zod)
- hooks/lib : `use-assistant-chat.ts` · `use-entity-search.ts` (≥2 car.) · `messages.ts` · `context.ts`
- organism `AssistantChat.tsx` + `(dashboard)/assistant/page.tsx`

### Env
- `.env.example` — `EXTRACTION_PROVIDER`, `OPENROUTER_API_KEY`, `EXTRACTION_MODEL`
- `.env` dev partagé (hors git) — clé + modèle ajoutés par l'utilisateur

### Tests (TDD red→green)
- AI : `parse`, `provider`, `openrouter-provider`, `mock-provider`, `format-entity`, `context-loader`, `prompt`, `render`, `chat-handler`, `search`
- Router : `assistant.test.ts` (chat + searchEntities : auth + terme vide sans DB)
- UI : `ShortcutBar.test.tsx`, `ContextTypePills.test.tsx`, `messages.test.ts`
- Repos : recherche ajoutée aux 3 tests d'intégration (Testcontainers / Docker)
- **50 tests unitaires + 9 intégration verts** ; `lint` · `typecheck` · `lint:lines` verts

## Pièges / dette

- **`.env` worktree** : symlink `apps/web/.env` → `medijob/apps/web/.env` à créer manuellement (sandbox a bloqué la création). Sans clé → fallback mock.
- **Recherche** : nécessite des Candidate/Pharmacy/Mission en base avec des noms. Pas de debounce explicite (react-query + `staleTime` 30 s, déclenche à ≥2 car.).
- **Rapport semaine** (`week-report`) : raccourci IA simple sans agrégation DB réelle — l'agrégation est le périmètre de #80.
- `searchEntities` lit via repos (`search`) — pas de pagination, `take 8`.

## Hors scope (pour la suite)

- Rapport semaine agrégé DB (#80), matching (#73), extraction CV (#56).

## Suggested skills

- `/caveman` + `/tdd` pour toute issue
- Plugin Prisma (`prisma-client-api-*`) pour le travail DB
