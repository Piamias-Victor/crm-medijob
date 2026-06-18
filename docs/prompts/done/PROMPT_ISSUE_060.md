# Prompt — Issue #60

**Titre** : [PHARMACIES] Fiche Pharmacy — Contacts, Besoins en cours, création Mission  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/60  
**Parent** : #19  
**Blocked by** : #59 · **Débloque** : #61, #63

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_059.md`, `SPEC_V2.md` §6.651–656, issue #60.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_059.md` (router pharmacy, Combobox, PharmacyForm, repos)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-60 -b feat/issue-60-pharmacy-fiche-tabs origin/dev
cd ../crm-medijob-issue-60
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/pharmacies/[id]` — 5 onglets : **Infos** · **Contacts** · **Besoins en cours** · **Historique** (stub) · **Documents** (stub).

- Infos : mêmes champs CRUD que liste #59
- Contacts : liste contacts rattachés ; contact principal en header
- Besoins en cours : missions actives + **quick-create Mission** (title, JobTitle, contractType, startDate, referentId) pré-liée à la Pharmacy

**Hors périmètre** : documents Blob (#61), ActivityLog (#63), module contacts global (#62).

**US** : #37, #38

### Critères d'acceptation

- [ ] Navigation 5 onglets
- [ ] Infos éditables (réutiliser form #59)
- [ ] Contacts tab liste Contact records
- [ ] Besoins : missions non terminales + création rapide A_POURVOIR
- [ ] Primary Contact visible sur Infos

---

## Fichiers impactés

- `app/(dashboard)/pharmacies/[id]/page.tsx`
- `server/routers/pharmacy.ts` — getById enrichi
- `server/routers/mission.ts` — create minimal (ou stub router mission)
- Organisms fiche pharmacy + tabs
- Réutiliser `PharmacyForm`, `Combobox`, repos contact/mission

---

## Contraintes

Patterns #59 (makeRouter injectable, RSC + refresh), fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_060.md` + push + PR `Closes #60`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-60
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → http://localhost:3000/pharmacies → ouvrir une pharmacie

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] 5 onglets visibles
- [ ] Besoins → créer mission → liste mise à jour status A_POURVOIR
- [ ] Contacts tab affiche contacts seed
- [ ] CI locale verte
