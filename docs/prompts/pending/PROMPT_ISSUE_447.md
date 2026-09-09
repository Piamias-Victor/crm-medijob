# Prompt — Issue #447

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/447  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : —  
**Slug branche** : `feat/issue-447-availability-sms-reminder`

---

## Skills

```
/caveman
/tdd
```

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoff `#375`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-447-availability-sms-reminder origin/dev
```

---

## Périmètre

Premier SMS App-validated : validation + app + lien dispos (1 segment GSM-7). Relance J+15 à 9h Paris. Plus de zone départements. Pas Inactif, pas Blacklisté.

### Acceptance criteria

- [ ] Premier copy : `Bonne nouvelle, profil MEDIJOB validé. Consultez les missions dans l'app. Dispos : {url}`
- [ ] Relance / renvoy manuel : `MediJob : actualisez vos dispos pour recevoir des missions : {url}`
- [ ] Relance tous les 15 jours (même déjà déclarés), cron `0 7 * * *` UTC
- [ ] Premier envoi reste sur cron `*/5`
- [ ] Renvoy manuel reset `smsSentAt`
- [ ] Pas de filtre départements
- [ ] Blacklisté / Inactif : aucun SMS dispo

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- **Interdit : `git worktree`**

Vocabulaire : Weekly availability, App-validated. `CONTEXT.md`.

## Fichiers impactés

- `view-models/weekly-availability-sms.ts`
- `weekly-availability-sms.repo.ts` (`listReminderDue`)
- cron `availability-sms-reminder` + `vercel.json`
- drop `availability-sms-zone`

---

## Fin

PR vers `dev` avec `Closes #447`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] App-validated + tél : SMS félicitations + lien `/dispo/…`
- [ ] Lyon / hors ancienne zone : SMS quand même
- [ ] Blacklisté : pas de SMS
- [ ] Renvoy manuel : copy relance, horloge 15 jours reset
- [ ] `smsSentAt` > 15 jours : relance au cron 9h
EOF