# Handoff — Issue #172

## État

**Prêt merge.** Branche `feat/issue-172-present-candidate-radius`.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/172
- Prompt : `docs/prompts/done/PROMPT_ISSUE_172.md`
- Parent : Epic #19 · Milestone Bloc 1 — Candidats
- Dépendances : #151 (mailto/ActivityLog) · #171 (présentation pharmacie, IA draft)

## Livré

### Serveur
- `candidate.listPharmaciesInRadius` — centre candidat (CP → gouv adresse) · haversine · filtre email contact
- `candidate.presentInRadius` — brouillon IA générique (sans noms pharmacies)
- Repos : `pharmacy-list-in-radius.repo.ts` (préfixe département si rayon ≤ 50 km)
- Cache mémoire 60s : `candidate-list-in-radius-cache.ts`
- IA : `present-candidate-radius.ts` + prompt dédié

### Geo
- `lib/geo/` — `gouv-coords`, `communes-api`, `resolve-candidate-center`, `filter-pharmacies-in-radius`
- Fix API gouv (404 `/search` → `/communes` + `api-adresse`)
- `GeoFields` : CP invalide ne bloque plus auto-fill ville

### UI
- Bouton **Présenter dans un périmètre** (`CandidateCvActionsBar`)
- Modal `present-candidate-radius/` — rayon, point de départ read-only, liste pharmacies checkbox
- `CandidatePresentModals` — modales présentation pharmacie + périmètre
- BCC client-side : `build-radius-bcc.ts` · sélection conservée au changement rayon

### Infra mailto / ActivityLog
- `EmailButton` : `to` optionnel · prop `bcc`
- `activity-log-context` : `pharmacyIds[]` batch + dedupe scopes
- Garde longueur BCC URL (`GMAIL_COMPOSE_MAX_BCC_CHARS = 1500`)

## Décisions validées avec le user

| Sujet | Choix |
|-------|-------|
| Destinataires | Tous en **BCC** (`to` vide) |
| Centre geo | Profil candidat uniquement (pas de saisie ville) |
| Email contact | Contact principal → fallback email pharmacie |
| Corps IA | Candidat seul (pas de noms pharmacies) |
| ActivityLog | Candidat + 1 log par pharmacie sélectionnée |
| Draft IA | Une génération à l'ouverture modal (pas au toggle rayon/pharmacie) |

## Tests

```bash
cd apps/web
pnpm vitest run \
  src/lib/geo/ \
  src/lib/present-candidate-radius/ \
  src/server/routers/candidate-list-in-radius.test.ts \
  src/server/routers/candidate-present-radius.test.ts \
  src/components/molecules/email-button/
pnpm typecheck && pnpm lint
cd .. && pnpm lint:lines
```

## Tests manuels (issue #172)

- [ ] Fiche candidat → **Présenter dans un périmètre**
- [ ] Rayon 15 km → liste pharmacies → décocher 2 → Gmail BCC 6 destinataires
- [ ] ActivityLog : candidat + pharmacies après envoi
- [ ] Profil Hyères/83400 — point de départ résolu sans erreur « Localisation insuffisante »

## Suite — Milestone Bloc 2

`docs/prompts/pending/PROMPT_ISSUE_155.md` — première issue du bloc Pharmacies & Contacts.

## Points d'attention (audit post-fix)

- Rayon > 50 km : charge toutes les pharmacies DB (pas de préfixe département)
- Cache 60s : pas invalidé si profil candidat modifié (clé sans hash geo)
- `PharmacyRadiusSource` importé depuis router dans `lib/geo` — déplacer vers view-models si refactor
- Hooks `use-present-candidate-radius*` sans tests dédiés
- PII dans URL Gmail (pattern hérité #171)

## Suggested skills

`/caveman` · `/tdd` · `/handoff` (fin de slice)
