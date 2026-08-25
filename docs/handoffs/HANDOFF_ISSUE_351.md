# Handoff — Issue #351 (Pilotage Go/NoGo + mensuel + matrice)

## État

**`/handoff` + prompt `done` + merge `dev` demandés.** Manuels phase 3 postés, pas recochés user. Vercel vert. CI `quality` à confirmer au merge.

- Issue : https://github.com/Piamias-Victor/crm-medijob/issues/351
- Parent : PRD #345 · `docs/PRD_FACTURATION_PILOTAGE_V1.md` · ADR `docs/adr/0018`, `docs/adr/0020`
- PR : https://github.com/Piamias-Victor/crm-medijob/pull/358 → `dev`
- Branche : `feat/issue-351-pilotage-mensuel-matrice` — **repo `medijob` only, jamais `git worktree`**
- Glossaire : `CONTEXT.md` (NoGo, Referent, Exercice, Pilotage)
- Prompt : `docs/prompts/done/PROMPT_ISSUE_351.md`
- Next : #352 (Intérim vue client) — blocked by **#347**, pas par #351

## Livré (produit)

Fin du scroll Pilotage (KPIs / jauge / pôles / graphes #349–#350 inchangés) :

- Cartes CDI / CDD : engagés, conversion %, facturés (nb + CA), perdus (nb + CA projeté du **même type**)
- Tableau Go/NoGo 12 mois Oct→Sep : CDI ok / NoGo, CDD ok / NoGo, mix = conversion du mois, CA facturé
- Extrêmes : top 3 mois NoGo (> 0) + mois à 100 % conversion (engagés > 0, NoGo = 0)
- Caption méthode NoGo (annulé ou CA 0 et Marge 0 ; Intérim jamais NoGo)
- Tableau mensuel : placements vs intérim, CA split, Marge ; clic → lignes du mois
- Matrice Referent × mois, **pas de co-crédit** : total = `kpis.ca`. Vide → `— Non attribué —`

Seam : toujours `buildPilotage(lines, missions, filters, now, objectif)`. Tests = chiffres view-model.

## Décisions (session)

| Sujet | Choix |
|-------|-------|
| Grill | Interdit — spec #345 |
| Mix colonne | conversion % du mois (`ok / engagés`) |
| Mensuel CA | exclut annulés ; `lines` du clic **inclut** annulés |
| Matrice | 1 ligne = 1 Referent ; annulés exclus (aligné CA agence) |
| Exercice Tous | `months=[]` → tables 12 mois vides ; matrice garde totaux |
| EMPTY | extrait `facturation-pilotage-empty.ts` (composer < 100 lignes) |

## Pièges

- `pnpm test` : ~10 `*.integration.test.ts` KO = Testcontainers / pas de Docker. Unrelated
- `EMPTY_PILOTAGE` a maintenant `conversion` / `goNoGo` / `monthly` / `matrix` — mocks caller OK via spread
- Contribution union porte `id`, `pharmacyName`, `candidateName`, `referentName` (détail mois + matrice)
- UI clic mensuel : `useState` local ; remount `key={pilotage.months.join(',')}`
- Pas de browser tool. Manuels à recocher
- Fichiers < 100 lignes. Prisma seulement repositories. **Jamais `git worktree`.**

## Tests manuels

- [ ] Cartes CDI vs CDD : conversion et CA perdu projeté
- [ ] Clic une ligne du tableau mensuel → lignes de ce mois
- [ ] Matrice : un Referent, total = CA agence (pas 2×)
- [ ] Ligne sans Referent → Non attribué

## Suite

1. Merge #358 → `dev` (`gh pr merge`, pas de push direct code)
2. Phase 5 : `git checkout dev && git pull && git branch -d feat/issue-351-pilotage-mensuel-matrice`
3. Next agent : #352 depuis `origin/dev` — lire `docs/handoffs/HANDOFF_ISSUE_347.md`

## Suggested skills

- `/caveman`
- `/tdd`
- Prompt : `docs/prompts/pending/PROMPT_ISSUE_352.md`
