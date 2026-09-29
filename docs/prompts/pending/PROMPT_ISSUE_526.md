# Prompt — Issue #526

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/526  
**Parent** : Milestone 19 — Import Excel → Lignes de suivi  
**Blocked by** : None  
**Slug branche** : `chore/issue-526-adr-excel-import`

---

## Skills

```
/caveman
```

Docs only — no `/tdd` required. `/code-review` on diff vs `dev`.

---

## Setup

Lire `docs/prompt-rules.md`, `docs/github-rules.md`, ADR 0017/0035, `CONTEXT.md`, PRD `docs/prd/19-import-excel-finance-lines.md`.

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b chore/issue-526-adr-excel-import origin/dev
```

---

## Périmètre

Réécrire ADR 0035 (Context / Decision 1–15 / Consequences / Amends 0017). Aligner 0017 + CONTEXT. `.gitignore` → `data/import/`. Inclure PRD si absent sur la branche.

### Acceptance criteria

- [ ] ADR 0035 structuré Context / Decision / Consequences / Amends 0017
- [ ] FK nullables en base, requises à la création UI ; importKey skip ; CHIFFRE > Suivi
- [ ] CONTEXT cohérent
- [ ] `data/import/` gitignored ; aucun xlsx réel commité

## Fichiers probables

- `docs/adr/0035-finance-line-excel-import-unlinked.md`
- `docs/adr/0017-finance-line-suivi.md`
- `CONTEXT.md`
- `.gitignore`
- `docs/prd/19-import-excel-finance-lines.md`

---

## Compte rendu

