# Prompt — Issue #566

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/566  
**Parent** : Milestone 21 · ADR 0037  
**Blocked by** : #564

## Skills

```
/caveman
/tdd
/code-review
```

## Critères d'acceptation

- [ ] Zod schema `{ resume, missions[], profil[], infos[] }`
- [ ] Renderer: 4 titles exact order, `<p><strong>`, escape, only p/strong/ul/li
- [ ] Invalid JSON → 1 retry → UI error
- [ ] Snapshot tests

## Fichiers probables

- `apps/web/src/server/ai/schemas.ts`
- `apps/web/src/server/ai/job-offer-generate.ts`
- `apps/web/src/server/job-board/offer-sections.ts` (renderer)
- generate tests + snapshots

## Tests manuels

- [ ] Générer brouillon depuis mission : contenu HTML 4 sections
- [ ] Forcer mock JSON invalide : message d'erreur, pas d'enregistrement HTML cassé
- [ ] Vérifier échappement `<script>` dans résumé

## Commande de test

```bash
cd /Users/victorpiamias/Desktop/Dev/ia/medijob
pnpm --filter web test -- offer-sections
pnpm --filter web test -- job-offer-generate
pnpm lint:lines
```

## Compte rendu

