# Prompt — Issue #105

**Titre** : [FIX] Audit High — ActivityLog unifié, DatePicker, docs contact, limites  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/105  
**Parent** : #19 (remédiation audit)  
**Blocked by** : #104 · **Débloque** : #106

**Source audit** : `docs/audits/AUDIT_COHERENCE_2026-06-19.md` — findings **H1–H5, H15–H21** (hors backlog)

---

## Skills

```
/caveman
/tdd
```

Lire : ce prompt, audit § High, `HANDOFF_ISSUE_104.md`.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_104.md`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-105 -b fix/issue-105-audit-high origin/dev
cd ../crm-medijob-issue-105
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Consolidation post-build (#104). **Ne pas réimplémenter** ce qui est dans le backlog ouvert.

### Findings à corriger (13)

| ID | Problème | Solution |
|----|----------|----------|
| H1 | 2 stacks ActivityLog (22 fichiers) | `EntityActivityLogTab` + 1 timeline + 1 form |
| H2 | DatePicker `clearLabel` non propagé, imports morts, tests | Propager prop ; fix tests |
| H3 | Documents Contact stub seul | `EntityDocumentsTab` (pharmacie = référence) |
| H4 | `contact.list()` sans `take` | `DEFAULT_LIST_LIMIT` |
| H5 | activityLog, documents, inbox, listByContact sans limite | `take` sur repos concernés |
| H15 | `@prisma/client` dans 4 composants UI | Types via view-models |
| H16 | Document hard delete | `deletedAt` ou ADR documenté |
| H17 | ActivityLogForm vs ActivityLogCreateForm | Garder form unifié ; supprimer doublon |
| H18 | ActivityTimeline vs ActivityLogTimeline | Garder `ActivityTimeline` |
| H19 | Labels activité ×3 | `activity-log.labels.ts` seule source |
| H20 | `candidate.cvtheque` vs `list` | Renommer `list` (+ alias optionnel) |

### Exclu — couvert par issues ouvertes

| Finding | Issue |
|---------|-------|
| H6, H7 softDelete | #80 |
| H8 application accept | #72 |
| H9, H10 offres | #69, #70 |
| H11 matching | #73 |
| H12 webhook | #71 |
| H14 mission stubs | #66, #67, #73, #68 |
| H22 missionCandidate | #66 |
| M30 documents candidat | #57 |

### Critères d'acceptation

- [ ] Une seule stack ActivityLog UI (supprimer `ActivityLogTimeline`, `ActivityLogCreateForm`, `activity-log-list.ts`, `activity-log-options.ts`)
- [ ] Contact fiche → onglet Documents fonctionnel (upload/list/delete)
- [ ] DatePicker : `clearLabel` fonctionne ; tests DatePicker verts
- [ ] `contact.repository.list()` borné ; listes activityLog/documents/inbox avec `take`
- [ ] Plus d'import `@prisma/client` dans `ActivityLogForm`, `ActivityLogTab`, `CandidateHistoryTab`, `DocumentUploadForm`
- [ ] `pnpm test && pnpm typecheck && pnpm lint` verts

---

## Fichiers impactés

- `components/molecules/EntityActivityLogTab.tsx` (nouveau) — remplace `ActivityLogTab` + `CandidateHistoryTab`
- `components/molecules/ActivityTimeline.tsx`, `ActivityTimelineItem.tsx` — garder
- `components/molecules/ActivityLogForm.tsx` — généraliser scope
- Supprimer : `ActivityLogTimeline.tsx`, `ActivityLogCreateForm.tsx`, `ActivityTypeFilter.tsx`, `view-models/activity-log-list.ts`, `lib/activity-log-options.ts`
- `components/molecules/DatePicker.tsx`, `DatePickerPanel.tsx`, `DatePicker.test.tsx`
- `components/molecules/EntityDocumentsTab.tsx` (nouveau) — depuis `PharmacyDocumentsTab`
- `components/organisms/ContactDetailPage.tsx` — brancher documents
- `server/db/repositories/contact.repository.ts`, `activity-log.repository.ts`, `document.repository.ts`, `application.repository.ts`, `mission.repository.ts`
- `server/routers/candidate.ts` — `list` naming
- `view-models/activity-log.ts`, `activity-log.labels.ts`, `activity-log-display.ts`

---

## Contraintes

Repositories only, RSC lectures, mutations client, fichiers < 100 lignes, TDD routers/repos.

---

## Fin de session

Sur demande : `HANDOFF_ISSUE_105.md` + PR `Closes #105`.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-105
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm test && pnpm typecheck
pnpm dev
```

---

## Tests manuels

- [ ] Contact fiche → Historique : filtre multi-type + création entrée
- [ ] Contact fiche → Documents : upload PDF → liste → suppression
- [ ] Candidat fiche → Historique : même UX que contact
- [ ] Mission form → DatePicker « Effacer la date » vide le champ
- [ ] Pharmacie fiche → historique + documents inchangés fonctionnels
