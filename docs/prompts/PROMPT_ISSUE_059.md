# Prompt — Issue #59

**Titre** : [PHARMACIES] Portefeuille Pharmacy — liste, CRUD, lookup SIRET + TVA  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/59  
**Parent** : #19  
**Blocked by** : #53 · **Débloque** : #60, #64, #79

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_053.md`, ADR 0002, `SPEC_V2.md` §6 + §8, issue #59.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_053.md`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-59 -b feat/issue-59-pharmacies-portefeuille-siret origin/dev
cd ../crm-medijob-issue-59
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/pharmacies` — liste portefeuille + CRUD Pharmacy avec lookup SIRET (`recherche-entreprises.api.gouv.fr`) et calcul TVA intracommunautaire (SIREN).

**ADR 0002** : affiliation réseau via `Groupement` uniquement — pas de `PharmacyType.GROUPE`. Types : INDEPENDANTE | CLINIQUE.

Colonnes liste : nom, ville, Groupement, statut, contact principal, nb missions.

**Hors péminètre** : fiche pharmacy (#60), contacts (#62), missions (#64).

**US** : #33–36, #39 · **ADR** : 0002

### Critères d'acceptation

- [ ] Liste avec colonnes SPEC_V2 §6.649
- [ ] CRUD RHF + Zod
- [ ] Recherche SIRET → pré-remplissage nom, adresse, ville, CP
- [ ] `numeroTVA` calculé depuis SIREN (FR + clé + SIREN)
- [ ] Selects Groupement + Software (seeds #52)
- [ ] Statuts PROSPECT | ACTIF | INACTIF
- [ ] Mock API SIRET en tests
- [ ] Soft delete masque de la liste

---

## Fichiers impactés

- `apps/web/src/app/(dashboard)/pharmacies/page.tsx` + form create/edit
- `apps/web/src/server/routers/pharmacy.ts` — list, getById, create, update, softDelete, searchSiret
- `apps/web/src/server/services/siret.ts` — client API gouv + mock
- `apps/web/src/lib/tva.ts` — calcul numeroTVA
- `apps/web/src/view-models/pharmacy-list.ts`
- Réutilise `pharmacy.repository.ts` (#52)

**Conflit git** avec #54/#77 sur routers — merger `dev` souvent.

---

## Contraintes

Repositories only, `protectedProcedure`, mock SIRET en test, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_059.md` + push + PR `Closes #59`.

**En fin de message** : bloc « Commande de test » copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-59
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login : `recruteur@medijob.fr` / `recruteur-medijob-2026` → http://localhost:3000/pharmacies

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Liste pharmacies avec colonnes attendues
- [ ] Recherche SIRET → champs auto-remplis + TVA calculée
- [ ] Assigner Groupement → sauvegardé ; pas de type GROUPE
- [ ] Soft delete → absent de la liste
- [ ] CI locale verte
