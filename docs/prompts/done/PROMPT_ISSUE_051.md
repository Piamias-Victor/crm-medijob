# Prompt — Issue #51

**Titre** : [FONDATIONS] Page /design-system — 12 sections charte Medijob  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/51  
**Parent** : #19  
**Blocked by** : #50 · **Débloque** : — (// avec #52)

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_050.md`, `SPEC_V2.md` §12, issue #51, ADR 0001.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_050.md` (bootstrap, pièges pnpm/sidebar)
3. Créer le worktree (travailler **exclusivement** dedans) :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-51 -b feat/issue-51-design-system-page origin/dev
cd ../crm-medijob-issue-51
```

---

## Périmètre

Page vivante `/design-system` — **12 sections** charte Medijob (SPEC_V2 §12.957–958), composants **production** (atoms #50), pas de screenshots.

Sections : Logo · Palette · Typographie · Boutons · Badges · Inputs · Sidebar · Kanban card · Candidate card · Empty state · Skeleton · Toast

**HITL** : validation visuelle humaine attendue avant merge des blocs dépendants.

**Hors périmètre** : schéma Prisma (#52), auth (#53), logique métier.

**US** : #3 · **ADR** : 0001 (preview kanban multi-mission drag handles)

### Critères d'acceptation

- [ ] Route `/design-system` accessible
- [ ] 12 sections ancrées, scrollables
- [ ] Swatches palette = tokens `globals.css` (pas de hex hors définitions)
- [ ] Button : primary teal, secondary, ghost, destructive
- [ ] Input : default, focus, error, disabled
- [ ] Kanban card mock : plusieurs missions, handles drag (ADR 0001)
- [ ] Framer Motion démo subtile
- [ ] Responsive ; tokens `--color-*` uniquement

---

## Fichiers impactés

Réutiliser atoms/molecules existants (`components/atoms/*`, `SidebarBrand`, `EmptyState`…).

Créations probables :

- `apps/web/src/app/design-system/page.tsx` — page RSC + sections
- `apps/web/src/components/organisms/DesignSystemPage.tsx` — ou split sections en molecules (< 100 lignes/fichier)
- `apps/web/src/components/molecules/design-system/*` — une molecule par section si besoin
- Tests : render page + présence des 12 ancres

Voir handoff #50 pour conventions sidebar (hover-expand, `aria-hidden`).

---

## Contraintes

Voir `CLAUDE.md` + handoff #50 : fichiers < 100 lignes, tokens uniquement, lucide-react `0.577.0`, Next 15.5.19.

**Conflit git possible avec #52** — rester sur `app/design-system/` et `components/`, ne pas toucher `prisma/`.

---

## Fin de session

**Uniquement quand l'utilisateur le demande** :

1. Si `/handoff` : `docs/handoffs/HANDOFF_ISSUE_051.md` commité **avec le code**
2. Push : `git push -u origin feat/issue-51-design-system-page`
3. PR vers `dev` avec `Closes #51`

**En fin de message** (prêt à tester) : donner le bloc « Commande de test » copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-51
pnpm install   # première fois uniquement
pnpm dev
```

Ouvrir http://localhost:3000/design-system — parcourir les 12 sections, comparer avec medijob.fr.

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] `/design-system` charge, 12 sections visibles avec ancres
- [ ] Palette swatches = teal navy Medijob
- [ ] Boutons 4 variants + inputs 4 états
- [ ] Kanban mock : 2+ missions avec handles drag distincts
- [ ] Dark mode (si scaffoldé) → tokens adaptés
- [ ] `pnpm test && pnpm lint && pnpm typecheck` → vert
