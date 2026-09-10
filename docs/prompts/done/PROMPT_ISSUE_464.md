# Prompt — Issue #464

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/464  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : —  
**Slug branche** : `feat/issue-464-contract-pharmacy-email`

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
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-464-contract-pharmacy-email origin/dev
```

---

## Périmètre

Mail Brevo **231** à la Pharmacy + contact primaire quand un Badakan contract devient `CREATED`. Même modèle que le mail postulé 232. Pas de burst. Pas de relance 24 h.

### Acceptance criteria

- [ ] Nouveaux `CREATED` seulement
- [ ] `Pharmacy.email` + contact primaire ; fallback principal Badakan
- [ ] `PRENOM` = contact pharmacie
- [ ] `BREVO_PHARMACY_CONTRACT_TEMPLATE_ID` (231)
- [ ] Persister `enterpriseId`
- [ ] Tampon email ≠ SMS
- [ ] Sans email : réessai
- [ ] Cron catalog, `CRON_ENABLED`

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- **Interdit : `git worktree`**

Vocabulaire : Badakan contract, Pharmacy apply email. `CONTEXT.md`. ADR 0030.

## Fichiers impactés

- `map-contract.ts` — `enterpriseId`
- `BadakanContract.enterpriseId` + `signInviteEmailSentAt`
- `pharmacy-contract-email/` — send-due après catalog (après SMS)
- `send-contract-email.ts` — template 231
- migration tampon `CREATED` existants

---

## Fin

PR vers `dev` avec `Closes #464`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Intérim → Contrats : un `CREATED` déjà en liste avant deploy n’a **pas** reçu le mail 231
- [ ] Après deploy + `BREVO_PHARMACY_CONTRACT_TEMPLATE_ID=231` : nouveau `CREATED` → mail à l’officine et au contact primaire (`PRENOM` = contact)
- [ ] Candidate SMS 1er envoi inchangé
- [ ] Sans email Pharmacy / contact / principal : pas de mail, réessai au cron suivant
- [ ] Logs `/api/cron/badakan-catalog` : `email.failed: 0`
EOF