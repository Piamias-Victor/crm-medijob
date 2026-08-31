# Prompt — Issue #375

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/375  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #372  
**Slug branche** : `feat/issue-375-weekly-availability-sms`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. **Dernier** lot V1. Un SMS, pas un cron hebdo. Port injecté (prior art Hireflix / Brevo email).

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#367` `#372` `#373`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-375-weekly-availability-sms origin/dev
```

---

## Périmètre

Un SMS avec le lien secret à App-validated. Sans tél : attendre le sync, envoyer une fois. Recruteur peut renvoyer à la main. Restore ≠ second SMS auto. Adapter fake en tests.

### Acceptance criteria

- [ ] Un SMS à App-validated si tél présent
- [ ] Sans tél : un envoi dès que le tél arrive
- [ ] Pas de SMS hebdo
- [ ] Renvoi manuel du même URL
- [ ] Adapter injecté ; tests sans réseau
- [ ] Restore COMPLETED : pas de second SMS auto

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Même pattern `invite-due` (skip sans canal, sent-once)
- **Interdit : `git worktree`** · **interdit write Badakan**

Vocabulaire : Weekly availability, App-validated. ADR 0024.

## Fichiers impactés

- port SMS injecté (nouveau, à côté de `server/brevo`)
- cycle sync — file d’attente SMS
- fiche Candidate — renvoyer le lien

---

## Fin

PR vers `dev` avec `Closes #375`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Fixture App-validated avec tél : un SMS (ou log adapter) contenant le lien #372
- [ ] Sans tél puis tél au sync suivant : un seul envoi
- [ ] Restore Inactif → COMPLETED : pas de nouvel envoi auto ; bouton renvoyer manuel OK
