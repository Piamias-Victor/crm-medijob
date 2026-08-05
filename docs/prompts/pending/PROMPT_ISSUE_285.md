# Prompt — Issue #285

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/285  
**Blocked by** : None  
**Type** : AFK (`ready-for-agent`)

---

## Avant de coder

**Pose-moi des questions** si la taille de la fenêtre d’historique ou le calc hauteur chrome n’est pas clair. Lis #285 et le contexte **AI** dans `CONTEXT.md` (audience recruteur, 3e personne, fenêtre messages, reset contexte).

Bug actuel : free-chat se comporte comme un coach candidat (« Bonjour Camille… ») et la page s’allonge.

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
git checkout -b feat/issue-285-assistant-recruiter-chat origin/dev
```

---

## Décisions produit (grill)

- Persona dure + few-shot : interlocuteur = recruteur ; entités en 3e personne
- Contexte candidat enrichi (JobTitle, logiciels, mobilité, contrats, salary expectations, status) — **pas** Anonymized dossier
- Fenêtre ~8 messages UI → LLM ; pas de persist DB
- Changement / clear contexte entité → vide la conversation
- Hauteur fixe viewport + scroll interne messages
- Raccourci « Rédiger mail candidat » reste destinataire-candidat

---

## Contraintes

- Pas de tool-calling LLM dans cette issue
- Fichiers < 100 lignes
- Zéro `any`
- Réponses assistant toujours validées Zod / parse existant

---

## Fin

PR vers `dev` avec `Closes #285`.

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm test
pnpm typecheck
pnpm lint
pnpm dev
```

## Tests manuels

- [ ] « salut que peux tu faire » → aide recruteur CRM, pas candidats job-seekers
- [ ] Contexte Camille + « resume le profil » → résumé riche 3e personne
- [ ] « c’est tout ? » → reste registre recruteur (pas « Bonjour Camille »)
- [ ] Changer de contexte → conversation vidée
- [ ] Beaucoup de messages → scroll **dans** le panneau, page ne s’allonge pas
- [ ] Raccourci mail candidat → toujours rédigé **à** le candidat
