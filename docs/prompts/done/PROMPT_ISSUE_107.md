# Prompt — Issue #107

**Titre** : [FIX] Audit Low — polish conventions & perf mineure  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/107  
**Parent** : #19 (remédiation audit)  
**Blocked by** : #106 · **Débloque** : —

**Source audit** : `docs/audits/AUDIT_COHERENCE_2026-06-19.md` — findings **L1–L18**

---

## Skills

```
/caveman
/tdd
```

Lire : ce prompt, audit § Low, `HANDOFF_ISSUE_106.md`.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_106.md`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-107 -b fix/issue-107-audit-low origin/dev
cd ../crm-medijob-issue-107
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Polish et conventions — aucun changement fonctionnel métier.

### Findings (18)

| ID | Problème | Action |
|----|----------|--------|
| L1 | Pas status badge candidat/contact | Ajouter si métier validé |
| L2 | Mission tabs sans badges compteurs | Aligner avec autres entités |
| L3 | Nommage `*View` vs `*Page` | Convention unique |
| L4 | `cardHover` sans shadow tokens | Aligner motion spec |
| L5 | motion variants incomplets | `listItem`, `listContainer`, `modalOverlay`, `skeletonPulse` |
| L6 | `ActivityLogFilters` wrapper vide | Supprimer si encore présent |
| L7 | `toOptions` dupliqué forms | Helper partagé |
| L8 | `findForContext` absent contact repo | Ajouter si assistant en a besoin |
| L9 | `DEFAULT_LIST_LIMIT` 500 élevé | Réduire ou documenter |
| L10 | Kanban O(n³) view-model | Optimiser si mesurable |
| L11 | ConfirmDialog molecule vs atom | Documenter ou déplacer |
| L12 | Atom `Alert` sous-utilisé | Bandeau profil incomplet candidat |
| L13 | PrimaryToggle vs CheckboxGroup | Guide usage dans commentaire court ou ADR UI |
| L14 | `ASAP_DATE_LABEL` sémantique | Props explicites par contexte |
| L15 | `mission-detail.ts` unused `candidates` | Supprimer variable |
| L16 | 11 warnings ESLint unused | Nettoyer |
| L17 | Integration tests need Docker | Note `docs/` ou README test |
| L18 | `surface-glass.ts` inline colors | Tokeniser ou commentaire exception |

### Critères d'acceptation

- [ ] 0 warning ESLint unused dans `apps/web/src`
- [ ] Motion catalogue aligné `docs/design-system-rules.md` §6
- [ ] Nommage list pages cohérent
- [ ] `pnpm test && pnpm typecheck && pnpm lint` verts
- [ ] Fichiers touchés < 100 lignes
- [ ] Doc courte : Docker requis pour tests intégration (L17)

---

## Fichiers impactés

- `lib/motion/variants.ts`
- `components/organisms/CandidatsPage.tsx`, `PharmaciesView.tsx`, `ContactsView.tsx`, `MissionsPage.tsx`
- `components/molecules/MissionDetailTabs.tsx`, `CandidateDetailTabs.tsx`
- `view-models/mission-detail.ts`
- `lib/constants/surface-glass.ts`
- `components/molecules/CandidateProfileBanner.tsx` — `Alert` atom
- Divers fichiers warnings ESLint
- `docs/` ou `apps/web/README.md` — note testcontainers

---

## Contraintes

Changements minimaux, pas de refactor large, pas de régression #104–#106.

---

## Fin de session

Sur demande : `HANDOFF_ISSUE_107.md` + PR `Closes #107`. Mettre à jour audit si findings clos.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-107
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm lint && pnpm test && pnpm typecheck
pnpm dev
```

---

## Tests manuels

- [ ] Navigation Candidats / Pharmacies / Contacts / Missions → transitions onglets fluides (pas de blur jank)
- [ ] Fiche candidat profil incomplet → bannière `Alert` visible
- [ ] ESLint : `pnpm lint` 0 warning sur fichiers modifiés
- [ ] Vérifier badges compteurs missions tabs si implémenté
