# Prompt — Issue #106

**Titre** : [FIX] Audit Medium — DRY, design system, erreurs mutations  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/106  
**Parent** : #19 (remédiation audit)  
**Blocked by** : #105 · **Débloque** : #107

**Source audit** : `docs/audits/AUDIT_COHERENCE_2026-06-19.md` — findings **M1–M29**

---

## Skills

```
/caveman
/tdd
```

Lire : ce prompt, audit § Medium, `HANDOFF_ISSUE_105.md`.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_105.md`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-106 -b fix/issue-106-audit-medium origin/dev
cd ../crm-medijob-issue-106
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Dette transversale qualité / design system. Pas de nouvelles features métier (#66–#80).

### Findings (29)

| ID | Problème | Action |
|----|----------|--------|
| M1 | 28 mutations sans `onError` | Hook `useEntityMutation` + Toast |
| M2 | `window.alert` admin ×5 | Atom `Toast` |
| M3 | 7+ empty states `<p>Aucun…</p>` | Migrer vers `EmptyState` |
| M4 | 0 `loading.tsx`, pas de Skeleton prod | Atom `Skeleton` + `loading.tsx` pages `[id]` |
| M5 | Atoms manquants Checkbox, Switch, Toast, Slider | Créer atoms (voir design-system-rules) |
| M6 | CheckboxGroup pour bool `tempsPlein` | `Switch` atom |
| M7 | *(couvert par #105 si ActivityLog unifié)* | Vérifier rien à faire |
| M8 | ComboboxDropdown input natif | `Input` atom variant search |
| M9 | CompatibilityScoreCell range natif | Atom `Slider` |
| M10 | `tabPanelMotion` utilise `filter: blur` | opacity + transform only |
| M11 | `AppAtmosphere` #ffffff hardcodé | token CSS |
| M12 | `useFloatingPanel` + `FloatingPanel` orphelins | Supprimer si inutilisés |
| M13 | 4 list grids dupliqués | `AnimatedEntityGrid` |
| M14 | PharmaciesView ≈ ContactsView | `EntityListPageShell` |
| M15 | 4 `*DetailTabs` dupliqués | `EntityDetailTabs` config |
| M16 | Detail composition hétérogène | `EntityDetailShell` + tab panels |
| M17 | Pas de `candidate-tab-meta.ts` | Créer fichier meta |
| M18 | Mapping liste router vs UI incohérent | Centraliser view-models |
| M19 | `idSchema` ×6 | `lib/schemas/entity-id.ts` |
| M20 | Pharmacy picker dupliqué | read-model partagé |
| M21 | `contractOptions` ×3 | `lib/contract-options.ts` |
| M22 | candidate-profile repo split | Fusionner si simple |
| M23 | TRPCError limité | Mapper NOT_FOUND communs |
| M24 | `mission.create` = createQuick | Renommer ou documenter |
| M25 | *(couvert #105 DatePicker)* | Vérifier |
| M26 | PharmacyDetailTabPanel imports morts | Nettoyer |
| M27 | 4 fichiers > 95 lignes | Splitter |
| M28 | Admin referentials hard delete | Documenter ou soft-delete |
| M29 | EntitySearch empty brut | `EmptyState` compact |

### Critères d'acceptation

- [ ] Hook mutation partagé utilisé sur fiches détail + listes création
- [ ] Admin : plus de `window.alert` — Toast succès/erreur
- [ ] Atoms `Toast`, `Skeleton`, `Switch` en production (minimum)
- [ ] Empty states bruts listés en M3 migrés
- [ ] `loading.tsx` sur au moins les 4 fiches `[id]`
- [ ] `pnpm test && pnpm typecheck && pnpm lint:lines` verts
- [ ] Aucun fichier > 100 lignes dans le diff

---

## Fichiers impactés (principaux)

- `lib/hooks/use-entity-mutation.ts` (nouveau)
- `components/atoms/Toast.tsx`, `Skeleton.tsx`, `Switch.tsx` (nouveaux)
- `components/organisms/*DetailPage.tsx`, `PharmaciesView.tsx`, `ContactsView.tsx`
- `components/organisms/UsersAdmin.tsx`, `PipelineAdmin.tsx`, `JobTitleAdmin.tsx`, `SoftwareAdmin.tsx`, `GroupementAdmin.tsx`
- `components/organisms/ReferentialManager.tsx`, `UserList.tsx`, `PharmacyContactsList.tsx`, etc.
- `components/molecules/ComboboxDropdown.tsx`, `CompatibilityScoreCell.tsx`, `MissionFormExtraFields.tsx`
- `lib/motion/variants.ts`, `components/molecules/AppAtmosphere.tsx`
- `lib/schemas/entity-id.ts`, `lib/contract-options.ts` (nouveaux)
- `app/(dashboard)/*/[id]/loading.tsx` (nouveaux)

---

## Contraintes

Atomic design, tokens `--color-*`, fichiers < 100 lignes, pas de régression #104/#105.

---

## Fin de session

Sur demande : `HANDOFF_ISSUE_106.md` + PR `Closes #106`.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-106
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm test && pnpm typecheck && pnpm lint:lines
pnpm dev
```

---

## Tests manuels

- [ ] Admin pipeline → supprimer étape → Toast erreur (pas alert) si échec
- [ ] Pharmacie update avec champ invalide → Toast erreur visible
- [ ] Fiche candidat `[id]` → skeleton pendant chargement (refresh lent simulé)
- [ ] Liste pharmacies vide → `EmptyState` avec icône (pas `<p>` brut)
- [ ] Mission form → toggle temps plein via Switch
