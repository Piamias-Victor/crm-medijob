# Prompt — Issue #455

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/455  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : —  
**Slug branche** : `feat/issue-455-contract-sign-sms`

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
git checkout -b feat/issue-455-contract-sign-sms origin/dev
```

---

## Périmètre

SMS invitation à signer quand un **Badakan contract** devient `CREATED`. Tampon go-live (pas de burst). Relance 24 h si toujours `CREATED`. Après sync catalog.

### Acceptance criteria

- [ ] 1er SMS : nouveaux `CREATED` seulement
- [ ] Copy 1er : `Bonne nouvelle ! Vous etes validé(e) pour la mission. Contrat envoyé par e-mail via Badakan. Consultez-le et signez.`
- [ ] Relance 24 h après 1er SMS si toujours `CREATED`
- [ ] Copy relance : `MediJob : votre contrat n'est pas encore signe. Consultez l'e-mail Badakan et signez.`
- [ ] Stop si `VALIDATED` / `CANCELLED`
- [ ] Candidate `badakanId` = recipient Badakan ; tél CRM
- [ ] Pas Inactif / Blacklisté
- [ ] Sans Candidate / sans tél : réessai, pas de tampon
- [ ] 1 SMS par contrat
- [ ] Cron catalog, `CRON_ENABLED` only

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- **Interdit : `git worktree`**

Vocabulaire : Badakan contract. `CONTEXT.md`. ADR 0030.

## Fichiers impactés

- `view-models/badakan-contract-sms.ts` — copy + cutoff 24 h
- `map-contract.ts` — `recipientId`
- `BadakanContract` — `recipientId`, `signInviteSmsSentAt`, `signInviteReminderSentAt`
- `badakan-contract-sms/` — send-due après catalog
- `run-cycle.ts` — SMS après sync contrats
- migration tampon `CREATED` existants

---

## Fin

PR vers `dev` avec `Closes #455`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Intérim → Contrats : un `CREATED` déjà en liste avant deploy n’a **pas** reçu de SMS (Brevo)
- [ ] Après deploy : nouveau contrat Badakan `CREATED` + Candidate App avec tél → SMS copy 1er envoi
- [ ] Même contrat passé `VALIDATED` avant 24 h → pas de relance
- [ ] Toujours `CREATED` 24 h après 1er SMS → copy relance
- [ ] Candidate Inactif ou Blacklisté : pas de SMS
EOF