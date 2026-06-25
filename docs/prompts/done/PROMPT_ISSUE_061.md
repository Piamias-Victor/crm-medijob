# Prompt — Issue #61

**Titre** : [PHARMACIES] Documents Pharmacy — upload Vercel Blob  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/61  
**Parent** : #19  
**Blocked by** : #60 · **Débloque** : —

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_059.md`, `SPEC_V2.md` §3 Document, issue #61.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** handoffs #059 (+ #060 si présent sur `dev`)
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-61 -b feat/issue-61-pharmacy-documents-blob origin/dev
cd ../crm-medijob-issue-61
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

Onglet **Documents** sur `/pharmacies/[id]` : upload/list/delete Documents (CONTRAT, DEVIS, FACTURE, CONVENTION, AUTRE) via Vercel Blob, `entityType: PHARMACY`.

Si fiche pharmacy absente sur `dev`, implémenter **shell minimal** `/pharmacies/[id]` avec onglet Documents uniquement (reste stub).

**US** : #37 (documents)

### Critères d'acceptation

- [ ] Upload → Blob URL + row Document
- [ ] Liste category, name, size, date
- [ ] Delete document
- [ ] Mock Blob en tests

---

## Fichiers impactés

- `server/routers/document.ts` — upload, listByEntity, delete
- `server/db/repositories/document.repository.ts`
- UI Documents tab pharmacy
- `.env.example` — `BLOB_READ_WRITE_TOKEN`

---

## Contraintes

ADR 0007 soft delete metadata, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff + push + PR `Closes #61`. **En fin de message** : commande de test copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-61
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
pnpm dev
```

Login RECRUTEUR → pharmacie → onglet Documents

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Upload PDF contrat → listé avec bonne catégorie
- [ ] Download OK · Delete OK
- [ ] CI locale verte
