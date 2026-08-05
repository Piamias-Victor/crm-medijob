# Prompt — Issue #284

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/284  
**Blocked by** : None  
**Type** : AFK (`ready-for-agent`)

---

## Avant de coder

**Pose-moi des questions** si un edge case Primary contact / missions liées n’est pas clair. Lis #284 et le terme **Primary contact** dans `CONTEXT.md`.

Backend `contact.softDelete` existe — livrer UI + garde primaire. Réutiliser le pattern Pharmacy soft-delete (modal + `useCan('softDelete')`).

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-284-contact-soft-delete origin/dev
```

---

## Décisions produit (grill)

- Soft delete liste **et** fiche détail
- Bloquer soft-delete du Primary contact jusqu’à désignation d’un autre primaire
- Pas de corbeille / restore UI (ADR soft-delete)

---

## Contraintes

- Prisma uniquement dans repositories
- Fichiers < 100 lignes
- Zéro `any`
- Droits via permissions existantes `softDelete`

---

## Fin

PR vers `dev` avec `Closes #284`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm typecheck
pnpm lint
pnpm dev
```

## Tests manuels

- [ ] Direction/RH-Admin : soft-delete Contact non-primaire depuis liste → disparu
- [ ] Soft-delete depuis fiche détail → OK
- [ ] Soft-delete Primary contact → refus + message
- [ ] Après setPrimary sur un autre Contact → soft-delete de l’ancien primaire OK
- [ ] Recruteur sans droit softDelete : pas de bouton
