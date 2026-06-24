# Prompt Rules — crm-medijob

Règles que tout agent doit respecter pour générer, stocker et exécuter un prompt lié à une issue.

## Workflow agent — 5 phases (obligatoire)

Chaque session suit **strictement** cet ordre. Ne pas sauter de phase ni fusionner sans instruction explicite.

| Phase | Déclencheur | Actions agent | Livrable utilisateur |
|-------|-------------|---------------|----------------------|
| **1 — Setup** | Début de session | Lire règles + handoffs bloquants · branche · worktree (si parallèle) · `/caveman` | — |
| **2 — Implémentation** | Automatique | `/tdd` · vertical slices · commits locaux | — |
| **3 — Prêt à tester** | Code terminé (tests auto verts) | **Poster obligatoirement** § Commande de test + § Tests manuels · push branche · ouvrir PR vers `dev` | Bloc shell copier-coller + checklist manuelle |
| **4 — Handoff** | Instruction explicite (`/handoff`, « handoff ») | Rédiger `HANDOFF_ISSUE_{N}.md` · committer · pusher sur la PR | Handoff dans la PR |
| **5 — Cleanup** | Après phase 4 **ou** merge confirmé | Supprimer worktree + branche locale (cf. `docs/github-rules.md`) | Dossier worktree supprimé |

### Règles de phase 3 (critique)

Quand l'implémentation est terminée (`pnpm test` + `typecheck` + `lint` verts), l'agent **doit** terminer son message avec **exactement** ces deux sections — copiées depuis le prompt ou adaptées au diff réel :

```markdown
## Commande de test

\`\`\`bash
cd /chemin/worktree-ou-repo
pnpm install   # première fois uniquement
pnpm dev
\`\`\`

## Tests manuels

- [ ] Étape 1 : navigation / action / résultat attendu
- [ ] Étape 2 : ...
```

**Interdit** de passer à la phase 4 sans avoir livré phase 3. **Interdit** de dire « prêt » sans checklist actionnable.

L'agent **attend** la validation manuelle de l'utilisateur avant d'enchaîner corrections ou handoff, sauf instruction contraire (« push quand même », « handoff direct »).

### Règles de phase 5

- Worktree créé en phase 1 → **suppression obligatoire** en fin de phase 4 ou 5 (cf. `docs/github-rules.md`).
- Ne pas laisser de dossiers `../crm-medijob-issue-*` orphelins.

## Stockage des prompts

Deux dossiers — **ne pas renommer** les fichiers, déplacer entre dossiers :

```
docs/prompts/pending/PROMPT_ISSUE_{NNN}.md   ← à lancer / en cours
docs/prompts/done/PROMPT_ISSUE_{NNN}.md      ← issue mergée sur dev
```

- `{NNN}` = numéro d'issue GitHub sur 3 chiffres minimum (ex. `050`, `054`)
- Nouveau prompt → créer dans **`pending/`**, **commit + push direct sur `dev`** (docs/prompts uniquement — pas de PR)
- **Après merge PR issue** : `git mv pending/ → done/` puis **commit + push direct sur `dev`**
- **Interdit** : même issue dans `pending/` **et** `done/` — CI `pnpm lint:prompts` échoue
- **Interdit** : `git checkout origin/dev -- docs/prompts/pending/` (restaure des copies obsolètes déjà dans `done/`)
- Un prompt = une issue. Pas de prompt partagé entre plusieurs issues.

## Structure obligatoire d'un prompt

Chaque `PROMPT_ISSUE_{NNN}.md` doit contenir les sections suivantes dans cet ordre :

### 1. En-tête

- Numéro et titre de l'issue
- Lien vers l'issue GitHub
- Issue parente (si applicable, ex. PRD #1)
- Issues bloquantes (`Blocked by`)

### 2. Skills obligatoires

Le prompt doit **obligatoirement** inclure ces instructions en début d'exécution :

```
/caveman
```

Réduction de tokens — lire uniquement les fichiers nécessaires à l'issue, pas le repo entier.

```
/tdd
```

Boucle Red → Green → Refactor. Écrire le test qui échoue, implémenter le minimum pour le faire passer, refactoriser.

### 3. Setup Git (avant tout travail)

Instructions explicites de :

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire les handoffs des issues bloquantes** — pour chaque issue dans `Blocked by`, consulter `docs/handoffs/HANDOFF_ISSUE_{NNN}.md` s'il existe (contexte, dette, points d'attention)
3. Choisir le mode Git (cf. `docs/github-rules.md` § Worktrees) :
   - **Mode simple** (1 issue, pas de parallèle) : branche depuis `dev` dans le repo principal
   - **Mode parallèle** : worktree dédié (un seul par issue)
4. Créer la branche : `feat/issue-{N}-{slug}` ou `fix/issue-{N}-{slug}`
5. Travailler exclusivement dans le worktree **ou** la branche checkoutée

### 4. Contexte & périmètre

- Résumé de ce qui doit être livré (vertical slice end-to-end)
- Critères d'acceptation de l'issue (copiés depuis GitHub)
- Fichiers impactés listés par `/grill` (ou analyse préalable équivalente)
- ADRs applicables (`docs/adr/`)
- Vocabulaire domaine depuis `CONTEXT.md`

### 5. Contraintes techniques

Rappel des règles non négociables (sans dupliquer `CLAUDE.md` en entier) :

- Prisma uniquement dans repositories
- RSC pour lectures, mutations via `trpc.useMutation()` en Client Components
- Fichiers < 100 lignes, zéro `any`, React Hook Form + Zod
- Atomic design, view-models, Zustand = UI state uniquement

### 6. Fin de session

Voir **Workflow agent — 5 phases** en tête de ce fichier.

**Phase 3** (automatique quand le code est prêt) :

1. Pusher sur la branche de feature (`origin`)
2. Ouvrir une PR vers `dev` avec `Closes #{N}` dans le body
3. **Poster** § Commande de test + § Tests manuels dans le chat (et recopier les tests manuels dans le body de la PR)

**Phase 4** — uniquement sur instruction explicite (`/handoff`, « handoff ») :

1. Rédiger `docs/handoffs/HANDOFF_ISSUE_{NNN}.md` et **committer avec le code** (même PR)
2. Pusher la mise à jour sur la branche
3. Mettre à jour la PR si nécessaire

**Phase 5** — cleanup worktree (cf. `docs/github-rules.md`)

**Après merge** (sur `dev`, humain ou agent sur `dev`) : déplacer le prompt `pending/` → `done/`

### 7. Tests manuels

Section **obligatoire** dans le prompt **et** recopiée par l'agent en **phase 3** (message chat + body PR).

```markdown
## Tests manuels

- [ ] Étape 1 : ...
- [ ] Étape 2 : ...
- [ ] Étape 3 : ...
```

Chaque étape doit être actionnable (navigation, clic, saisie, résultat attendu). Pas de formulations vagues.

Minimum **3 étapes** couvrant le happy path + au moins 1 cas limite si pertinent.

### 8. Commande de test pour l'utilisateur

Section **obligatoire** dans le prompt **et** recopiée par l'agent en **phase 3**.

L'agent **doit** fournir ce bloc **à chaque fois** que le code est prêt à tester — pas seulement en fin de session multi-jours.

Format :

```markdown
## Commande de test

\`\`\`bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-{N}
pnpm install   # première fois uniquement
pnpm dev
\`\`\`
```

- Chemin worktree : `/Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-{N}`
- Adapter `{N}` au numéro d'issue
- Ajouter d'autres commandes si pertinent (`pnpm test`, URL à ouvrir, etc.)

Le prompt référence **toujours** les fichiers impactés listés par `/grill` (ou par exploration ciblée si `/grill` n'a pas été lancé). Format :

```markdown
## Fichiers impactés

- `chemin/vers/fichier` — raison
```

Si la liste évolue en cours de session, mettre à jour le prompt avant le commit final.

## Handoffs

### Lecture (début de session)

Avant d'implémenter, l'agent **doit** lire les handoffs des issues listées dans `Blocked by` :

```
docs/handoffs/HANDOFF_ISSUE_{NNN}.md
```

S'il n'existe pas encore (première issue ou handoff pas déposé), continuer sans bloquer.

### Rédaction (phase 4)

Sur instruction explicite (`/handoff`) — **après** phase 3 (PR ouverte + tests manuels postés).

```
docs/handoffs/HANDOFF_ISSUE_{NNN}.md
```

- Committer et pusher **avec le code** dans la même PR
- Enchaîner immédiatement la **phase 5** (cleanup worktree) sauf si l'utilisateur demande de garder le worktree pour corrections

Contenu minimal :

- Ce qui a été livré
- Ce qui reste / dette technique
- Résultat des tests manuels (OK / KO / non testés — avec détail si KO)
- Lien PR + chemin worktree (avant cleanup)
- Points d'attention pour l'issue suivante

## Références

- Règles Git : `docs/github-rules.md`
- Workflow agent : `CLAUDE.md`
- Glossaire domaine : `CONTEXT.md`
- Spec technique : `SPEC_V1.md`
