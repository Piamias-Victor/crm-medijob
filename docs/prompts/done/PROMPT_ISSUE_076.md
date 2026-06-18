# Prompt — Issue #76

**Titre** : [IA] Assistant IA — chat contextuel + 6 raccourcis  
**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/76  
**Parent** : #19  
**Blocked by** : #53 · **Débloque** : #80 (rapport semaine)

---

## Skills

```
/caveman
/tdd
```

Lire **uniquement** : ce prompt, `docs/handoffs/HANDOFF_ISSUE_053.md`, `SPEC_V2.md` §6.686–688 + §7, issue #76.

---

## Setup Git

1. Lire `docs/prompt-rules.md` et `docs/github-rules.md`
2. **Lire** `docs/handoffs/HANDOFF_ISSUE_053.md`
3. Worktree :

```bash
git fetch origin
git worktree add ../crm-medijob-issue-76 -b feat/issue-76-assistant-ia-chat origin/dev
cd ../crm-medijob-issue-76
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
```

---

## Périmètre

`/assistant` — chat Gemini + picker contexte (Candidate, Pharmacy, Mission) + **6 raccourcis** :

Résumer candidat · Résumer pharmacie · Rédiger mail candidat · Rédiger mail pharmacie · Générer offre · Rapport semaine

Abstraction `EXTRACTION_PROVIDER=gemini|mock` (SPEC_V2 §7). Toutes réponses IA validées **Zod** avant affichage.

Historique chat session-local OK. Accessible RECRUTEUR (pas ADMIN-only).

**Hors périmètre** : matching (#73), extraction CV (#56), rapport agrégé DB (#80).

**US** : #74–77

### Critères d'acceptation

- [ ] UI chat + historique messages
- [ ] Context loader : attacher données Candidate/Pharmacy/Mission au prompt
- [ ] 6 raccourcis → prompts templated
- [ ] Schémas Zod par type de réponse
- [ ] Provider mock pour tests sans clé API
- [ ] `GEMINI_API_KEY` via env (`.env.example`)

---

## Fichiers impactés

- `apps/web/src/app/(dashboard)/assistant/page.tsx`
- `apps/web/src/server/routers/assistant.ts` — `chat`
- `apps/web/src/server/ai/provider.ts` — abstraction gemini|mock
- `apps/web/src/server/ai/schemas.ts` — Zod réponses
- `apps/web/src/components/organisms/AssistantChat.tsx` + shortcuts sidebar
- `apps/web/.env.example` — `GEMINI_API_KEY`, `EXTRACTION_PROVIDER`
- Tests : mock provider + validation Zod reject

Piste isolée — peu de conflits avec #54/#59/#77.

---

## Contraintes

Zod obligatoire sur sorties IA, `protectedProcedure`, pas de données sensibles loggées, fichiers < 100 lignes.

---

## Fin de session

Sur demande : handoff `HANDOFF_ISSUE_076.md` + push + PR `Closes #76`.

**En fin de message** : bloc « Commande de test » copiable.

---

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/crm-medijob-issue-76
pnpm install
ln -sf /Users/victorpiamias/Desktop/Dev/ia/medijob/apps/web/.env apps/web/.env
# Ajouter GEMINI_API_KEY ou EXTRACTION_PROVIDER=mock dans .env
pnpm dev
```

Login RECRUTEUR → http://localhost:3000/assistant

```bash
pnpm test && pnpm lint && pnpm typecheck
```

---

## Tests manuels

- [ ] Chat répond (mock ou Gemini selon env)
- [ ] Charger contexte Candidate → résumé cohérent
- [ ] Raccourci « Rédiger mail pharmacie » → brouillon avec nom pharmacie
- [ ] Réponse IA malformée → erreur UI, pas affichée comme vérité
- [ ] CI locale verte
