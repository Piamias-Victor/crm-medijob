# Prompt — Issue #376

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/376  
**Parent** : PRD #365 — Intérim V1  
**Blocked by** : #368  
**Slug branche** : `feat/issue-376-badakan-pharmacy-verify`

---

## Skills

```
/caveman
/tdd
```

**Ne pas re-grill.** Spec #365. SIRET unique. Prior art import pharmacies.

---

## Setup

Lire `docs/prompt-rules.md` et `docs/github-rules.md`. Handoffs `#366` `#368`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
# Interdit: git worktree — rester dans medijob
git checkout -b feat/issue-376-badakan-pharmacy-verify origin/dev
```

---

## Périmètre

Enterprise Badakan → **Pharmacy** après écran de vérif. SIRET existant → fiche existante. Même écran : Contact principal (fusion email puis tél).

### Acceptance criteria

- [ ] Écran de vérif avant validation Pharmacy
- [ ] SIRET existant → Pharmacy existante
- [ ] Contact principal proposé ; fusion email puis tél
- [ ] Lecture GET enterprises ; pas d’écriture Badakan
- [ ] Tests SIRET + Contact

---

## Contraintes

- Fichiers < 100 lignes, zéro `any`, TDD
- Prisma uniquement repositories
- Réutiliser `siretMatches` / duplicate pharmacy
- **Interdit : `git worktree`**

Vocabulaire : Pharmacy, Contact. ADR 0028.

## Fichiers impactés

- `apps/web/src/server/pharmacy/duplicate-identity-match.ts`
- `apps/web/src/server/routers/pharmacy.ts` / contact
- UI file de vérif Intérim
- client GET enterprises/{id}

---

## Fin

PR vers `dev` avec `Closes #376`. Phase 3 : poster commande de test + tests manuels.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm install   # première fois uniquement
pnpm test
pnpm dev
```

## Tests manuels

- [ ] Mission Badakan → vérif officine : SIRET déjà CRM → même Pharmacy
- [ ] Nouveau SIRET : valider crée une Pharmacy
- [ ] Contact principal créé ou fusionné (même email)
