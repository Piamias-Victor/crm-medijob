# Handoff — Issue #171

## État

**Prêt review.** Branche `feat/issue-171-present-candidate-pharmacy`.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/171
- Prompt : `docs/prompts/done/PROMPT_ISSUE_171.md`
- Parent : Epic #19 · Milestone Bloc 1 — Candidats
- Débloque : #172 (patterns IA + mailto réutilisables)

## Livré

### Serveur
- `candidate.presentToPharmacy` — handler `candidate-present-pharmacy.ts`, procédure splittée
- IA : `present-candidate.ts` + `present-candidate-prompt.ts` (Zod `emailResponseSchema`)
- `contact.listByPharmacy` étendu — email, isPrimary, filtre sans email (`contact-list-by-pharmacy.repo.ts`)

### UI
- Bouton **Présenter à une pharmacie** à côté de **Voir le CV** (`CandidateCvActionsBar`)
- Modal `present-candidate-pharmacy/` — recherche pharmacie remote, contact principal, brouillon éditable
- `EmailButton` Gmail + `onActivityLogPrompt` → modal présentation se ferme, ActivityLog sur `CandidateDetailPage`

### Infra mailto
- Gmail via anchor (`open-email-compose.ts`) — plus de faux popup bloqué
- Body tronqué 500 chars URL (`truncate-compose-body.ts`)
- `Combobox` : `remoteSearch` + `onQueryChange`

### Robustesse (post-audit)
- Debounce 400ms + stale guard (`present-draft-key.ts`, `use-present-candidate-draft.ts`)
- Recherche pharmacie via `assistant.searchEntities` (2 car. min.)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Shell | Modal GlassModal |
| Compose | Gmail web (EmailButton défaut) |
| ActivityLog | candidateId + pharmacyId + contactId |
| Contacts | `listByPharmacy` étendu, filtre email serveur |
| Contexte IA | Profil complet |
| Bouton | À côté Voir le CV |
| Génération | Auto dès pharmacie + contact |
| ActivityLog UX | Fermer modal présentation quand prompt apparaît |

## Tests

```bash
cd apps/web
pnpm vitest run \
  src/server/ai/present-candidate.test.ts \
  src/server/routers/candidate-present-pharmacy.test.ts \
  src/view-models/contact-pharmacy-picker.test.ts \
  src/server/routers/contact-list-by-pharmacy.test.ts \
  src/lib/present-candidate-pharmacy/ \
  src/lib/mailto/ \
  src/components/molecules/email-button/email-button.test.tsx
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
```

## Tests manuels (issue #171)

- [ ] Fiche candidat → **Présenter à une pharmacie** (à côté Voir le CV)
- [ ] Rechercher pharmacie (2 car.) → contact principal pré-sélectionné
- [ ] Brouillon IA éditable → **Ouvrir dans Gmail**
- [ ] Retour onglet → ActivityLog (candidat + pharmacie + contact), modal présentation fermée
- [ ] Pharmacie sans contact email → bloqué

## Suite (#172)

`presentInRadius` — `docs/prompts/pending/PROMPT_ISSUE_172.md`

## Points d'attention

- PII sujet Gmail encore en URL (body tronqué seulement) — follow-up Medium
- Corps >500 chars : Gmail reçoit version tronquée sans warning UI
- `use-present-candidate-draft` sans test hook dédié
- Recherche pharmacie limitée à 8 résultats (`pharmacy.repository.search`)

## Suggested skills

- `/caveman` + `/tdd` pour #172
- `/handoff` en fin de session
