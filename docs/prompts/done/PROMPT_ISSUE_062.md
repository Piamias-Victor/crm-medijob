# Prompt — Issue #62

**Titre** : [PHARMACIES] Module Contact — liste + fiche (1 Pharmacy obligatoire)  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/62  
**Parent** : #19  
**Blocked by** : #59 · **Débloque** : #63

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_059.md`, `SPEC_V2.md` §6.658–665, `CONTEXT.md`, issue #62.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_059.md`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-62 -b feat/issue-62-contacts-module origin/dev
cd ../crm-medijob-issue-62
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/contacts` liste + `/contacts/[id]` fiche. Contact → **exactement 1** Pharmacy (`pharmacyId` requis).

`isPrimary` : un seul titulaire principal par Pharmacy ; changement de titulaire → ancien reste actif, `isPrimary` bascule (SPEC §6.653).

**Hors périmètre** : ActivityLog (#63), fiche pharmacy contacts tab (#60 peut coexister).

**US** : #41–45

### Critères d'acceptation

- [ ] Liste : nom, role, pharmacy, phone, email, createdAt
- [ ] Create avec pharmacyId obligatoire (picker)
- [ ] ContactRole enum complet
- [ ] Set isPrimary → unset previous sur même Pharmacy
- [ ] Fiche tabs : Infos, Historique stub, Missions stub, Documents stub
- [ ] Missions tab : missions où contactId match

---

## Fichiers impactés

- `app/(dashboard)/contacts/page.tsx` + `[id]/page.tsx`
- `server/routers/contact.ts` — list, getById, create, update, softDelete, setPrimary
- `server/db/repositories/contact.repository.ts` — étendre si besoin
- UI : ContactTable, ContactForm (RHF + Zod)

**Conflit git** possible avec #60 sur contact repo — merger `dev` souvent.

---

## Contraintes

Repositories only, `protectedProcedure`, patterns Combobox #59, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_062.md` + push + PR `Closes #62`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-62
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm --filter web db:seed
pnpm dev
```

Login RECRUTEUR → http://localhost:3000/contacts

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Créer 2e titulaire + isPrimary → 1er reste listé, non primary
- [ ] Create sans pharmacy → erreur validation
- [ ] Missions tab liste missions liées
- [ ] CI locale verte
