# Design System Rules — CRM MediJob

> Bible de référence pour tous les agents qui redesignent les pages du CRM.  
> Source de vérité visuelle : page **Admin** (`src/app/(dashboard)/admin/`) + tokens `apps/web/src/app/globals.css`.

---

## 1. Philosophie visuelle

### Intent

Le CRM MediJob doit se sentir **moderne, percutant, smooth et fluide** — un outil professionnel pour recruteurs, pas un back-office générique.

| Pilier | Règle |
|--------|-------|
| **Clarté** | Hiérarchie typographique nette, espacement généreux, une action primaire par zone |
| **Profondeur subtile** | Ombres légères, dégradés discrets, glassmorphism **uniquement** sur éléments flottants |
| **Mouvement intentionnel** | Framer Motion sur entrées de page, hover et transitions — jamais sur le contenu critique |
| **Performance** | `transform` + `opacity` uniquement ; pas d'animation sur listes > 20 items ; zéro layout shift |
| **Cohérence** | Tokens `--color-*` et atoms du design system — zéro valeur hardcodée |

### Ton visuel MediJob

- **Primary** (bleu profond) = structure, navigation, titres d'action
- **Accent** (teal) = CTA, états actifs, focus, icônes de section
- **Surface** (gris-bleu très clair) = fond d'app, zones secondaires
- **Blanc** = contenu principal (cards, modales, sidebar)

---

## 2. Patterns visuels obligatoires

Extraits de la page Admin (référence actuelle) + améliorations cibles.

### 2.1 Page shell

**Pattern Admin (à généraliser sur toutes les sections)**

```tsx
// layout admin — référence
<div className="mx-auto flex max-w-5xl flex-col gap-8">
  <header className="rounded-xl border border-border bg-gradient-to-br from-primary-muted/50 via-white to-accent-muted/40 p-6 shadow-sm">
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg shadow-md shadow-accent/30">
        <Icon className="size-5" />
      </span>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-fg">Titre</h1>
        <p className="text-sm text-fg-muted">Description</p>
      </div>
    </div>
  </header>
  {children}
</div>
```

**Amélioration cible** : envelopper le contenu dans `motion.div` avec variant `pageEntrance` (§6). Missions utilise déjà ce header — aligner Candidats, Pharmacies, Contacts, Assistant.

| Token layout | Valeur Admin | Usage |
|--------------|--------------|-------|
| Container max | `max-w-5xl` (admin) / `max-w-[88rem]` (missions kanban) | Admin & formulaires : `5xl` ; listes/kanbans larges : `88rem` |
| Gap vertical page | `gap-8` (admin) / `gap-6` (missions) | Standardiser sur `gap-6` entre header et contenu |
| Padding main | `p-6` (DashboardShell) | Inchangé |

### 2.2 Section cards (`AdminSectionCard`)

```tsx
// molecules/AdminSectionCard.tsx — pattern de référence
<section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
  <header className="border-b border-border bg-gradient-to-r from-accent-muted/70 via-white to-white px-5 py-4">
    <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{description}</p>
  </header>
  <div className="p-5">{children}</div>
</section>
```

**Amélioration cible** :
- Hover interactif : variant `cardHover` (§6) sur cards cliquables
- Glassmorphism sur cards **flottantes** uniquement : `bg-white/80 backdrop-blur-md` (modales, popovers — pas les sections de page)

### 2.3 Navigation secondaire (pills)

Pattern `AdminNav` / `adminNavLinkClass` :

| État | Classes |
|------|---------|
| Actif | `rounded-full border border-accent bg-accent text-accent-fg shadow-md shadow-accent/30` |
| Inactif | `rounded-full border border-border bg-white text-fg shadow-sm hover:border-accent/50 hover:bg-accent-muted/70` |
| Transition | `transition-all` |

Réutiliser pour tous les onglets (Candidats CVthèque/Inbox, détail candidat, vues liste/kanban).

### 2.4 Cards simples (`Card` atom)

```tsx
// atoms/Card.tsx
rounded-lg border border-border bg-white p-4 shadow-sm
```

Usage : kanban cards, widgets, conteneurs légers. Préférer `AdminSectionCard` pour les sections avec titre.

### 2.5 Spacing

| Contexte | Classes |
|----------|---------|
| Padding card body | `p-5` |
| Padding card header | `px-5 py-4` |
| Gap entre sections | `gap-6` |
| Gap liste d'items | `gap-2` (pipeline) / `divide-y divide-border` (référentiels) |
| Formulaire inline | `flex gap-2 rounded-lg border border-border/80 bg-surface/50 p-2` |
| Icône de section | `size-11` container, icône `size-5` |

### 2.6 Typography

| Élément | Classes |
|---------|---------|
| H1 page | `text-2xl font-bold tracking-tight text-fg` |
| H2 section | `text-lg font-semibold tracking-tight text-fg` |
| Sous-titre page | `text-sm text-fg-muted` |
| Corps | `text-sm text-fg` |
| Label / meta | `text-xs text-fg-muted` |
| Table header | `text-xs font-semibold uppercase tracking-wide text-fg-muted` |
| Font family | `var(--font-sans)` → Inter |

### 2.7 Couleurs sémantiques

Utiliser les classes Tailwind mappées aux tokens (jamais de hex/oklch inline) :

| Rôle | Classe bg | Classe texte |
|------|-----------|--------------|
| Texte principal | — | `text-fg` |
| Texte secondaire | — | `text-fg-muted` |
| Fond app | `bg-surface` | — |
| Bordures | `border-border` | — |
| CTA primaire | `bg-primary text-primary-fg hover:bg-primary-hover` | — |
| CTA accent | `bg-accent text-accent-fg hover:bg-accent-hover` | — |
| Succès | `bg-success/15` | `text-success` |
| Attention | `bg-warning/15` | `text-warning` |
| Erreur | `bg-error/15` | `text-error` |

### 2.8 Shadows

| Usage | Classes |
|-------|---------|
| Card standard | `shadow-sm` |
| Nav pill active / icône section | `shadow-md shadow-accent/30` |
| Modale | `shadow-lg` |
| Hover card (cible) | `shadow-md` via Framer Motion |

### 2.9 Border-radius

| Token | Valeur | Usage |
|-------|--------|-------|
| `--radius-sm` | `0.375rem` | Inputs, petits boutons |
| `--radius-md` | `0.5rem` | Boutons, rows pipeline |
| `--radius-lg` | `0.875rem` | Cards, modales |
| `--radius-xl` | `1.25rem` | Headers de page, section cards |
| Pills / badges | `rounded-full` | Nav, Badge atom |

### 2.10 Dégradés subtils

| Zone | Gradient |
|------|----------|
| Header de page | `bg-gradient-to-br from-primary-muted/50 via-white to-accent-muted/40` |
| Header de section | `bg-gradient-to-r from-accent-muted/70 via-white to-white` |
| Fond formulaire inline | `bg-surface/50` |

Ne pas empiler les dégradés — un seul par viewport visible.

### 2.11 Modales

Pattern `Modal` atom actuel + améliorations :

| Couche | Classes actuelles | Cible |
|--------|-------------------|-------|
| Overlay | `bg-black/40` | `bg-black/30 backdrop-blur-sm` |
| Panel | `rounded-lg border border-border bg-white shadow-lg` | `rounded-xl bg-white/90 backdrop-blur-md` |
| Animation | Aucune | `modalEntrance` (§6) |

### 2.12 Empty states

Pattern `EmptyState` atom — **obligatoire** partout (remplacer les `<p>Aucun élément</p>` bruts, ex. `ReferentialManager`) :

```tsx
<EmptyState
  icon={LucideIcon}
  title="Titre actionnable"
  description="Contexte et prochaine étape."
  action={<Button>CTA</Button>}
/>
```

Conteneur : `rounded-lg border border-dashed border-border bg-white/50 p-10 text-center`.

### 2.13 Tables & listes

- Lignes : `hover:bg-surface/80 transition-colors`
- Séparateurs : `divide-y divide-border`
- Sticky header (matrice compatibilité) : `sticky left-0 z-10 bg-surface/95 backdrop-blur`

### 2.14 Formulaires

- Toujours `Input` atom (jamais `<input>` nu dans les pages)
- Selects : `Combobox` molecule ou futur `Select` atom
- Range sliders (matrice) : à migrer vers atom `Slider` — interdit en production nue

---

## 3. Règles non négociables

### Composants

- **Zéro HTML natif visible** : pas de `<select>`, `<input>`, `<checkbox>`, `<alert>` bruts dans l'UI
- **Tout passe par les atoms** du design system (`Button`, `Input`, `Badge`, `Card`, `Modal`, `EmptyState`, `Avatar`, `Spinner`)
- **Sélection** : `Combobox` molecule (existant) ou atom `Select` à créer
- **Feedback** : atom `Toast` à créer — remplacer `window.alert()` / `window.confirm()` (encore présents dans Admin)

### États

- **Empty states soignés** : icône Lucide + titre + description + CTA optionnel
- **Loading skeletons** sur tous les fetch async (modales d'édition, recherche SIRET, assistant) — créer `loading.tsx` + atom `Skeleton`
- **Spinner** atom uniquement pour actions ponctuelles (submit, chat en cours)

### Animations (Framer Motion)

- Entrées de page : `pageEntrance`
- Hover cards / kanban : `cardHover`
- Listes courtes (≤ 20 items) : `listItem` avec stagger
- Modales : `modalEntrance`
- Chargement : `skeletonPulse` (CSS `animate-pulse` acceptable en fallback)
- **Interdit** : animation sur listes > 20 items, animation de `width`/`height`, layout shift

### Glassmorphism

- `backdrop-blur` **uniquement** sur : overlay modale, panel modale, popovers, tooltips flottants
- **Interdit** sur : cards de page, tables, sidebar, headers de section

### Code quality (rappel CLAUDE.md)

- Fichiers < 100 lignes
- Tokens `--color-*` — zéro hardcode couleur
- Atomic design : atoms → molecules → organisms
- Un fichier = une responsabilité

---

## 4. Tokens CSS — liste exhaustive

Source : `apps/web/src/app/globals.css`

### 4.1 Couleurs (`--color-*`)

| Token | Valeur OKLCH | Classe Tailwind | Usage exact dans le projet |
|-------|--------------|-----------------|---------------------------|
| `--color-primary` | `oklch(0.26 0.10 255)` | `bg-primary`, `text-primary` | Boutons primaires, liens forts, avatar texte |
| `--color-primary-hover` | `oklch(0.32 0.12 255)` | `hover:bg-primary-hover` | Hover bouton primary |
| `--color-primary-muted` | `oklch(0.93 0.02 255)` | `bg-primary-muted` | Fonds header page (gradient), avatar bg |
| `--color-primary-fg` | `oklch(0.99 0.00 0)` | `text-primary-fg` | Texte sur fond primary |
| `--color-accent` | `oklch(0.64 0.10 185)` | `bg-accent`, `text-accent`, `border-accent`, `ring-accent-muted` | CTA accent, nav active, icônes section, focus ring, spinner |
| `--color-accent-hover` | `oklch(0.52 0.09 185)` | `hover:bg-accent-hover`, `text-accent-hover` | Hover accent, texte badge accent |
| `--color-accent-muted` | `oklch(0.95 0.03 185)` | `bg-accent-muted` | Gradients header, hover nav, focus ring |
| `--color-accent-fg` | `oklch(0.99 0.00 0)` | `text-accent-fg` | Texte sur fond accent / danger |
| `--color-surface` | `oklch(0.974 0.005 255)` | `bg-surface` | Fond body, hover lignes, skeleton pulse, empty state icon bg |
| `--color-border` | `oklch(0.880 0.010 255)` | `border-border` | Toutes les bordures, spinner track |
| `--color-fg` | `oklch(0.13 0.00 0)` | `text-fg` | Texte principal |
| `--color-fg-muted` | `oklch(0.44 0.00 0)` | `text-fg-muted` | Sous-titres, placeholders, labels secondaires |
| `--color-success` | `oklch(0.57 0.17 145)` | `text-success`, `bg-success/15` | Toast succès, badge success |
| `--color-warning` | `oklch(0.64 0.16 72)` | `text-warning`, `bg-warning/15` | Toast warning, badge warning |
| `--color-error` | `oklch(0.52 0.22 25)` | `text-error`, `bg-error/15`, `bg-error` | Erreurs, bouton danger, icône supprimer |

### 4.2 Typographie

| Token | Valeur | Usage |
|-------|--------|-------|
| `--font-sans` | `var(--font-inter), ui-sans-serif, system-ui, sans-serif` | `font-family` body via `@layer base` |

### 4.3 Border-radius

| Token | Valeur | Usage recommandé |
|-------|--------|------------------|
| `--radius-sm` | `0.375rem` | Chips, tags compacts |
| `--radius-md` | `0.5rem` | Input, Button (`rounded-md`) |
| `--radius-lg` | `0.875rem` | Card atom (`rounded-lg`) |
| `--radius-xl` | `1.25rem` | Section cards, headers (`rounded-xl`) |

### 4.4 Variante dark (préparée, non activée)

```css
@custom-variant dark (&:is(.dark *));
```

Tokens dark non définis — **ne pas implémenter** en V2 (hors scope PRD).

### 4.5 Dépendances CSS

- `tailwindcss` v4 (`@import "tailwindcss"`)
- `tw-animate-css` (`@import "tw-animate-css"`) — utilitaires `animate-pulse`, `animate-spin`

---

## 5. Composants atoms requis

### 5.1 Existants — à vérifier avant redesign

| Atom | Fichier | Statut | Actions redesign |
|------|---------|--------|------------------|
| **Button** | `atoms/Button.tsx` | ✅ Existe | Ajouter variantes `size` (sm/md), support `asChild`, motion hover subtil |
| **Badge** | `atoms/Badge.tsx` | ✅ Existe | OK — 6 variants sémantiques |
| **Card** | `atoms/Card.tsx` | ✅ Existe | Ajouter prop `interactive` → `cardHover` |
| **Input** | `atoms/Input.tsx` | ✅ Existe | Ajouter `error` state, label slot |
| **Modal** | `atoms/Modal.tsx` | ✅ Existe | Glassmorphism overlay + `modalEntrance` + trap focus |
| **EmptyState** | `atoms/EmptyState.tsx` | ✅ Existe | Ajouter `pageEntrance` à l'apparition |
| **Avatar** | `atoms/Avatar.tsx` | ✅ Existe | Option image URL + fallback initiales |
| **Spinner** | `atoms/Spinner.tsx` | ✅ Existe | OK pour actions ponctuelles |

### 5.2 À créer

| Atom | Responsabilité | Référence |
|------|----------------|-----------|
| **Select** | Dropdown custom accessible (remplace `<select>` natif) | S'inspirer de `Combobox` — version simple sans recherche |
| **Checkbox** | Case à cocher stylée | Pour préférences contrat, filtres |
| **Switch** | Toggle on/off | Paramètres futurs |
| **Toast** | Notifications éphémères (succès, warning, erreur) | Showcase : `molecules/design-system/ToastShowcase.tsx` |
| **Skeleton** | Placeholders pulse (ligne, avatar, card) | Showcase : `molecules/design-system/SkeletonShowcase.tsx` |
| **Alert** | Bannière inline persistante (profil incomplet) | Remplace `<div role="alert">` ad hoc |
| **Slider** | Range stylé | Remplace `<input type="range">` dans `CompatibilityScoreCell` |
| **ConfirmDialog** | Confirmation destructive | Remplace `window.confirm()` |

### 5.3 Molecules clés (non-atoms mais requis)

| Molecule | Usage |
|----------|-------|
| `Combobox` | Sélection avec recherche (pharmacies, métiers, rôles) |
| `AdminSectionCard` | Sections avec header gradient |
| `PageHeader` | **À extraire** du pattern admin/missions — DRY les headers |
| `ReferentialAddForm` | Pattern ajout inline référentiel |

---

## 6. Animations Framer Motion — catalogue

Créer `apps/web/src/lib/motion/variants.ts` et importer partout. **Ne pas dupliquer** les valeurs.

```ts
// apps/web/src/lib/motion/variants.ts — contrat cible

import type { Variants, Transition } from 'framer-motion'

const easeOut: Transition = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }

export const pageEntrance: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: easeOut },
}

export const cardHover = {
  rest: { scale: 1, boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)' },
  hover: { scale: 1.01, boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)', transition: { duration: 0.2 } },
}

export const listItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, ...easeOut },
  }),
}

export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

export const modalEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
}

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const skeletonPulse = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
}
```

### Usage par contexte

| Variant | Où l'appliquer | Limite |
|---------|----------------|--------|
| `pageEntrance` | Wrapper principal de chaque page dashboard | 1 par page |
| `cardHover` | Kanban cards, cards cliquables, `AdminSectionCard` interactives | Pas sur tables |
| `listItem` + `listContainer` | Nav pills, inbox < 20, pipeline stages | **Max 20 items** |
| `modalEntrance` + `modalOverlay` | Atom `Modal`, drawers | `AnimatePresence` obligatoire |
| `skeletonPulse` | Atom `Skeleton` | Préférer CSS `animate-pulse` si perf critique |

### Déjà en production

- `PipelineAdmin` : `Reorder.Group` / `Reorder.Item` (drag reorder)
- `KanbanShowcase` : `initial/animate/whileHover` sur card démo
- **À étendre** : toutes les pages dashboard

---

## 7. Liste complète des pages à redesigner

Périmètre : `apps/web/src/app/(dashboard)/` — état au 2026-06-18.

### Légende statut

| Statut | Signification |
|--------|---------------|
| **Placeholder** | Page vide ou message « bientôt disponible » |
| **Partielle** | Fonctionnelle mais design incohérent ou features manquantes |
| **Fonctionnelle** | CRUD/lecture opérationnels — polish visuel à appliquer |

### 7.1 Pages principales

| Chemin | Statut | Priorité | Composants principaux à créer / aligner |
|--------|--------|----------|----------------------------------------|
| `/candidats` | Partielle | **High** | `PageHeader`, onglets pills (style AdminNav), `CvthequeSection` + kanban/liste animés, `ApplicationInbox`, `Skeleton` liste |
| `/candidats/[id]` | Partielle | **High** | Header détail enrichi, `CandidateDetailTabs`, `CandidateProfileForm`, `CandidateMissionsTab`, bannière `Alert` profil incomplet, `Skeleton` |
| `/pharmacies` | Partielle | **High** | `PageHeader`, `PharmacyTable`, `PharmacyForm` + modale glass, `EmptyState`, `Skeleton` |
| `/contacts` | Partielle | **Medium** | `PageHeader`, `ContactTable`, `ContactForm`, modale, `EmptyState` |
| `/contacts/[id]` | Partielle | **Medium** | `ContactDetailView`, tabs, missions liées, timeline ActivityLog, `Document` list |
| `/missions` | Partielle | **High** | `PageHeader` ✅, `ViewToggle`, `MissionList`, `MissionKanban`, `AdminSectionCard`, animations kanban |
| `/offres` | Placeholder | **High** | Tout le module : `JobOfferTable`, `JobOfferForm`, publication Webflow, détail offre + inbox candidatures |
| `/assistant` | Partielle | **Medium** | `PageHeader`, `AssistantChat` (sidebar + chat), `ContextPicker`, `ShortcutBar`, `ChatMessage`, `ChatComposer`, `Skeleton` messages |

### 7.2 Pages Admin (référence design)

| Chemin | Statut | Priorité | Composants principaux à créer / aligner |
|--------|--------|----------|----------------------------------------|
| `/admin` | Redirect → pipeline | Low | — |
| `/admin/pipeline` | Fonctionnelle | Low | Polish : `Toast` erreurs, `EmptyState`, `ConfirmDialog` delete, motion `listItem` |
| `/admin/logiciels` | Fonctionnelle | Low | `ReferentialManager` → `EmptyState`, `Toast` |
| `/admin/groupements` | Fonctionnelle | Low | Idem logiciels |
| `/admin/metiers` | Fonctionnelle | Low | `ReferentialManager` + `CompatibilityMatrix` + atom `Slider` |
| `/admin/utilisateurs` | Fonctionnelle | Low | `UserTable`, `UserCreateForm`, `UserEditForm`, modales glass, `ConfirmDialog` |

### 7.3 Layout partagé

| Fichier | Statut | Priorité | Actions |
|---------|--------|----------|---------|
| `(dashboard)/layout.tsx` | Fonctionnelle | Medium | `DashboardShell` — transition page entre routes |
| `DashboardShell` | Fonctionnelle | Medium | `AppSidebar` polish, responsive |
| `admin/layout.tsx` | **Référence** | — | Modèle à répliquer |

### 7.4 Pages futures (hors `(dashboard)` actuel — à prévoir)

Non routées aujourd'hui mais requises par le PRD :

| Chemin cible | Priorité | Notes |
|--------------|----------|-------|
| `/pharmacies/[id]` | High | Fiche pharmacie : contacts, missions, ActivityLog, documents |
| `/missions/[id]` | High | Fiche mission : pipeline, matching IA, offre, historique |
| `/offres/[id]` | High | Détail offre + candidatures reçues |

### 7.5 Ordre de redesign recommandé

1. **Atoms manquants** : `Skeleton`, `Toast`, `Select`, `ConfirmDialog`, `Alert`, `Slider`
2. **Molecule `PageHeader`** : extraire pattern admin → appliquer partout
3. **High** : `/candidats`, `/candidats/[id]`, `/pharmacies`, `/missions`, `/offres`
4. **Medium** : `/contacts`, `/contacts/[id]`, `/assistant`
5. **Low** : polish Admin (déjà proche de la cible)

---

## Checklist agent — avant de merger un redesign

- [ ] Aucun HTML natif visible (input/select/checkbox/alert)
- [ ] Couleurs via tokens `--color-*` uniquement
- [ ] `PageHeader` ou pattern admin sur la page
- [ ] `EmptyState` sur listes vides
- [ ] `Skeleton` ou `loading.tsx` sur fetch async
- [ ] `pageEntrance` sur le contenu principal
- [ ] Modales : glassmorphism + `modalEntrance`
- [ ] Listes > 20 items : pas d'animation stagger
- [ ] Fichiers < 100 lignes
- [ ] `window.alert` / `window.confirm` remplacés par `Toast` / `ConfirmDialog`

---

*Dernière mise à jour : issue design system — référence admin `apps/web/src/app/(dashboard)/admin/`.*
