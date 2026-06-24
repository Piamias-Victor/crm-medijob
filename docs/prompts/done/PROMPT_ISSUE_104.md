# Prompt — Issue #104

**Titre** : [FIX] Audit Critical — build regressions merge #58/#61/#63/#65  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/104  
**Parent** : #19 (remédiation audit)  
**Blocked by** : — · **Débloque** : #105

**Source audit** : `docs/audits/AUDIT_COHERENCE_2026-06-19.md` — findings **C1–C8**

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/audits/AUDIT_COHERENCE_2026-06-19.md` (§ Critical), handoffs #058, #061, #063, #065.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_058.md`, `HANDOFF_ISSUE_061.md`, `HANDOFF_ISSUE_063.md`, `HANDOFF_ISSUE_065.md`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-104 -b fix/issue-104-audit-critical origin/dev
cd ../crm-medijob-issue-104
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

**Débloquer le build et le runtime** après merges parallèles. Pas de nouvelles features backlog (#66–#80).

### Findings à corriger (8)

| ID | Problème | Fichiers |
|----|----------|----------|
| C1 | Combobox : `filtered`, `showCreate`, `selected` manquants → crash | `Combobox.tsx` |
| C2 | Router activity-log merge invalide | `activity-log.ts` |
| C3 | Pharmacy detail page double `Promise.all` | `pharmacies/[id]/page.tsx` |
| C4 | PharmacyDetailPage double export / Props incomplet | `PharmacyDetailPage.tsx` |
| C5 | activity-log-form.schema double Zod | `activity-log-form.schema.ts` |
| C6 | `listByEntity` + `create` polymorphe (4 entités) | `activity-log.repository.ts`, router, schemas |
| C7 | Tests health + activity-log load fail | transitif C2 |
| C8 | Build CI impossible | transitif C1–C5 |

### Critères d'acceptation

- [ ] `pnpm typecheck` — 0 erreur
- [ ] `pnpm lint` — 0 erreur parsing
- [ ] `pnpm test` — Combobox (5), UserRoleSelect (2), ContactInfoForm (1), PharmacyForm (2), activity-log, health verts
- [ ] Combobox ouvrable sur fiche candidat (métier) et mission (contrat)
- [ ] `/pharmacies/[id]` compile et charge documents + historique
- [ ] `/candidats/[id]` historique charge via `activityLog.listByEntity`
- [ ] API ActivityLog unique : `{ entityType, entityId }` alignée `document.listByEntity`
- [ ] Fichiers modifiés < 100 lignes (split si besoin)

### Hors scope (issues ouvertes backlog)

H6–H12, H14, H22, M30 → #66–#73, #80, #57. Unification ActivityLog complète (H1) → **#105**.

---

## Fichiers impactés

- `components/molecules/Combobox.tsx` — restaurer `selected`, `filtered`, `showCreate`
- `server/routers/activity-log.ts` — un seul router
- `server/db/repositories/activity-log.repository.ts` — `listByEntity`, `create` polymorphe
- `view-models/activity-log.schema.ts` — schéma canonique
- `view-models/activity-log-form.schema.ts` — supprimer doublon
- `app/(dashboard)/pharmacies/[id]/page.tsx` — un `Promise.all`
- `components/organisms/PharmacyDetailPage.tsx` — une signature Props
- `server/routers/activity-log.test.ts`, `activity-log.test.fixtures.ts` — adapter API
- `server/routers/health.test.ts` — doit charger `appRouter`

---

## Contraintes

Repositories only, `protectedProcedure`, fichiers < 100 lignes, zéro `any`, TDD sur router + Combobox.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_104.md` + push + PR `Closes #104`.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-104
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm typecheck && pnpm test && pnpm lint && pnpm lint:lines
pnpm dev
```

---

## Tests manuels

- [ ] Login → `/missions` → créer/éditer mission → Combobox métier/contrat s'ouvre et sélectionne
- [ ] `/pharmacies/{id}` → onglets Infos, Historique, Documents sans erreur
- [ ] `/candidats/{id}` → onglet Historique affiche la timeline (même vide)
- [ ] `pnpm typecheck` exit 0
