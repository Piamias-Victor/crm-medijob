# Prompt — Issue #365 (PRD parent — ne pas implémenter en une PR)

**Issue** : https://github.com/Piamias-Victor/crm-medijob/issues/365  
**Type** : PRD parent Intérim V1 (Badakan read + weekly availability)  
**Enfants** : #366 → #367 → (#369 #370 #371 #372 #373) · #372 → #374 #375 · #366 → #368 → #376 #377  
**Parent** : —  
**Graphe** : `docs/ISSUE_DEPENDENCIES_INTERIM.md`

---

## Important

**Ne code pas toute l’issue #365 d’un coup.** Spec grillée — **ne pas re-grill.**

1. `PROMPT_ISSUE_366.md` — Fondations (client lecture, schéma, nav Intérim)
2. `PROMPT_ISSUE_367.md` — App-validated → Candidate origine App (**Blocked by #366**)
3. `PROMPT_ISSUE_368.md` — Badakan missions + SEARCH_APPLIED (**Blocked by #366**, parallèle à #367)
4. `PROMPT_ISSUE_369.md` — Sync champs (**Blocked by #367**)
5. `PROMPT_ISSUE_370.md` — CV / Documents / NIR / IBAN (**Blocked by #367**)
6. `PROMPT_ISSUE_371.md` — Badakan comments + ActivityLog (**Blocked by #367**)
7. `PROMPT_ISSUE_372.md` — Weekly availability page publique (**Blocked by #367**)
8. `PROMPT_ISSUE_373.md` — SUSPENDED → Inactif + restore (**Blocked by #367**)
9. `PROMPT_ISSUE_374.md` — Filtre dispos (**Blocked by #372**)
10. `PROMPT_ISSUE_375.md` — SMS unique (**Blocked by #372**) — **dernier** lot V1
11. `PROMPT_ISSUE_376.md` — Vérif Pharmacy + Contact (**Blocked by #368**)
12. `PROMPT_ISSUE_377.md` — Badakan contracts (**Blocked by #368**)

PRD : `docs/PRD_INTERIM_V1.md` · ADRs 0024–0030 · `CONTEXT.md`

**Interdit : `git worktree`.** Toujours `/Users/victorpiamias/Desktop/Dev/ia/medijob`.
**Interdit :** writes Badakan (staff, validate, PUT, POST comments, contrats).
**Interdit :** confondre Facturation → Intérim (Ligne de suivi) avec ce module.
