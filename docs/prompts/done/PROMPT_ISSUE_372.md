# Prompt — Issue #372

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/372  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #367  
**Slug branche** : `feat/issue-372-weekly-availability-page`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. Page publique, token secret. Pas de SMS (c’est #375). Grille AM/PM, pas Calendly RDV.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#367`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-372-weekly-availability-page origin/dev
```

---

## Périmètre

**Weekly availability** : page publique (pas de login), token non devinable, une semaine, cases AM/PM, semaines suivantes, historique. Inconnu vs indispo déclarée. Jours passés non cliquables. Europe/Paris. Recruteur copie le lien.

### Acceptance criteria

- [ ] Token inconnu → refus ; token valide → lecture/écriture
- [ ] Une semaine à l’écran, switch, histo conservé
- [ ] Jamais soumis → inconnu ; save vide → indispo déclarée
- [ ] Recruteur copie le lien depuis la fiche origine App
- [ ] Pas de compte candidat ; pas de SMS
- [ ] Tests token + règles inconnu / vide

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- Route hors `(dashboard)` ; Zod sur le token
- **Interdit : `git worktree`**

Vocabulaire : Weekly availability ≠ Availability. ADR 0024.

## Fichiers impactés

- `apps/web/prisma/schema.prisma` — slots / semaine soumise / token
- route publique App Router
- fiche Candidate — bouton copier le lien
- view-models grille AM/PM

---

## Fin

PR vers `dev` avec `Closes #372`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Fiche Candidate origine App : copier le lien → page publique sans login
- [ ] Cocher mercredi AM, enregistrer, changer de semaine, revenir : créneau conservé
- [ ] Enregistrer une semaine sans case → indispo ; semaine jamais ouverte absente du « dispo » (#374)
- [ ] URL token bidon → pas de grille
