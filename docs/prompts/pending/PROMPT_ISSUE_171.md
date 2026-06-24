# Prompt — Issue #171

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/171  
**Parent** : Epic #19 · `docs/PRD_V2.md` · Milestone **Bloc 1 — Candidats**  
**Blocked by** : #151 (mergée)

---

## Avant de coder

**Pose-moi des questions** pour bien cadrer le besoin. Ne commence pas l'implémentation tant que je n'ai pas répondu.

Lis l'issue GitHub (#171) — tout le périmètre, les critères d'acceptation et les tests manuels y sont.

Handoffs dépendances :
- `docs/handoffs/HANDOFF_ISSUE_151.md` — EmailButton générique, mailto:, ActivityLog optionnel

Contexte : présenter un candidat à une pharmacie — brouillon email IA (subject + body Zod), envoi via **mailto:** (pas Resend). Contact destinataire choisi (défaut = principal, emails only).

---

## Skills

```
/caveman
/tdd
```

---

## Setup

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
git fetch origin
git checkout -b feat/issue-171-present-candidate-pharmacy origin/dev
```

Lire `docs/prompt-rules.md` et `docs/github-rules.md`.

---

## Fin

PR vers `dev` avec `Closes #171`.  
Quand c'est prêt : commande de test + tests manuels (copiés depuis l'issue).
