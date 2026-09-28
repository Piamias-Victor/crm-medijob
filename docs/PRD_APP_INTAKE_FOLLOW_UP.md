# PRD — App intake follow-up (« Entrées app »)

> **Statut** : Ready for implementation (`ready-for-agent`)
> **Sources** : grill sept. 2026 · `CONTEXT.md` · ADR-0032 · sheet Syncro « Candidats Medijob Syncro Appli »
> **Glossaire** : `App intake follow-up`, `Intake status`, `Call outcome`, `Intake booking SMS`, `AppProfile`, `App-validated`, `Referent`, `Badakan comment` — pas Candidate status, pas Hireflix

---

## Problem Statement

Les recruteurs suivent les nouveaux inscrits app (Badakan CREATED) dans un Google Sheet Syncro : appels, résultats, RDV visio, attribution, relances. Le CRM n’offre que l’inbox légère « Profils app » (Hireflix / ACCEPTE / Ignore), sans cockpit ops inline. Ils ne peuvent pas piloter la file d’entrée jusqu’à la validation Badakan depuis Intérim, ni remplacer le sheet.

## Solution

Un nouvel onglet Intérim **« Entrées app »** (`/interim/entrees-app`) — **App intake follow-up** — remplace « Profils app ». Tableau seul, édition inline des champs ops (Intake status, Call outcome, date RDV, notes, Referent, relance). Sortie succès = **App-validated** (sync Badakan, CRM read-only). Sorties négatives / **Ignore** hors vue défaut, retrouvables via filtre archives. **Hireflix invitation** et **ACCEPTE** manuel sont retirés. L’**Intake booking SMS** (Google Calendar) déjà en prod **n’est pas modifié**. Pas d’import du sheet Syncro — les lignes existantes repartent à `À appeler`.

---

## User Stories

1. As a Recruteur, I want an Intérim tab « Entrées app », so that app intake follow-up lives next to other Intérim tools.
2. As a Recruteur, I want « Entrées app » to replace the Candidats « Profils app » tab, so that I have one inbox only.
3. As a Recruteur, I want the default list to show AppProfiles not yet App-validated and not negatively archived, so that I only see people I still need to process.
4. As a Recruteur, I want App-validated people to leave the default view automatically, so that validated people do not clutter the queue (even if Candidate status is still Nouveau).
5. As a Recruteur, I want people with Call outcome `Pas intéressé` or `Hors cible`, or Intake status `Hors zone`, to leave the default view, so that dead ends do not drown the queue.
6. As a Recruteur, I want an Ignore row action that archives like a negative exit, so that I can clear a row without picking a Call outcome.
7. As a Recruteur, I want archived / refused / App-validated rows findable via filter or search, so that history is not lost.
8. As a Recruteur, I want no recruiter ACCEPTE path from this list, so that Badakan App-validated is the only door into the CVthèque.
9. As a Recruteur, I want Hireflix invite UI and flows gone from this product surface, so that we do not pretend video-interview invites still exist.
10. As a Recruteur, I want the existing Intake booking SMS (Google Calendar) left unchanged, so that newcomers still get the RDV booking link as today.
11. As a Recruteur, I want read-only columns for phone, first name, last name, email, job/profile, city, postal code, enrolled-at, Badakan comments, and SMS-sent indicator, so that I can call without opening a fiche.
12. As a Recruteur, I want inline-editable Intake status with closed set `À appeler`, `Dossier incomplet`, `À relancer`, `Hors zone`, so that ops status matches the Syncro sheet without Validé/Suspendu.
13. As a Recruteur, I want new AppProfiles to default to Intake status `À appeler`, so that every arrival is immediately actionable.
14. As a Recruteur, I want inline-editable Call outcome with closed set `Messagerie`, `RDV pris`, `À rappeler`, `Pas intéressé`, `Hors cible`, `Pas de réponse`, so that call results are structured.
15. As a Recruteur, I want choosing `RDV pris` to require a planned RDV date, so that scheduled interviews are never dateless.
16. As a Recruteur, I want a planned RDV date field editable inline (optional unless outcome is `RDV pris`), so that I can record when the visio is booked.
17. As a Recruteur, I want a free-text notes field on the AppProfile editable inline, so that I can keep sheet-style notes before any Candidate exists.
18. As a Recruteur, I want to assign a Referent (CRM User) inline, so that ATTRIBUE A is a real user not free text.
19. As a Recruteur, I want last-call timestamp and caller stamped automatically when I save a Call outcome (current User), so that DERNIER APPEL / APPEL PAR stay accurate.
20. As a Recruteur, I want relance date to default to intake day on arrival, so that every row has a follow-up date.
21. As a Recruteur, I want relance date to move to last-call + 2 days when Call outcome is saved, so that follow-ups stay current without manual math.
22. As a Recruteur, I want to override the relance date inline, so that I can schedule exceptions.
23. As a Recruteur, I want a past relance date to show as overdue (badge/sort) without auto-changing Intake status, so that `Dossier incomplet` / `RDV pris` are not silently flipped to `À relancer`.
24. As a Recruteur, I want the default Referent filter to be me or unassigned, so that my actionable queue includes claimable rows.
25. As a Recruteur, I want to switch the filter to the full queue, so that a lead can see everyone’s intake.
26. As a Recruteur, I want table-only UX with no AppProfile detail page, so that the sheet mental model is preserved.
27. As a Recruteur, I want routes and UI under Candidats « Profils app » (list tab, detail, convert/ACCEPTE) removed or redirected, so that nobody lands on the legacy inbox.
28. As Direction, I want no one-shot import from the Syncro CSV, so that we start clean at `À appeler` and keep the sheet as archive only.
29. As Direction, I want CRM to stay read-only toward Badakan for validation, so that recruiters validate in Badakan after the visio and sync exits the row.
30. As a Recruteur, I want App-validated exit to still trigger the weekly-availability SMS as today, so that dispos outreach is unchanged.
31. As Communication, I want read access to Entrées app consistent with other Intérim / Candidate lists, so that I can consult without a new role.
32. As a Recruteur with `crm.write`, I want intake field mutations and Ignore gated on write permission, so that read-only roles cannot edit the queue.
33. As an agent/developer, I want Intake status and Call outcome as closed enums (not admin-editable referentials), so that the Syncro vocabulary stays stable.
34. As an agent/developer, I want Validé and Suspendu never stored as Intake status, so that Badakan sync remains source of truth for App-validated / Inactif.
35. As a Recruteur, I want navigation label « Entrées app » (not « Suivi candidats »), so that it does not collide with `/interim/suivi` (Badakan missions) or `/interim/candidats` (staffable pool).
36. As a Recruteur, I want `/interim/candidats` unchanged as the App-origin staffable pool with declared availability, so that intake and positioning stay separate.
37. As Direction, I want ADR-0032 respected, so that future agents do not reintroduce Hireflix or ACCEPTE as the intake door.

---

## Implementation Decisions

- **ADR** : 0032 (App intake follow-up replaces Profils app; no Hireflix; no ACCEPTE).
- **Route / nav** : primary Intérim subnav item « Entrées app » → `/interim/entrees-app` (near Suivi / Candidats). Remove or redirect Candidats tab « Profils app », detail `/candidats/profils-app/[id]`, convert/ACCEPTE pages.
- **Entity** : ops fields live on **AppProfile** (not Candidate — no CVthèque row until App-validated). Add Referent (`referentId`), Intake status, Call outcome, planned RDV datetime, notes, relance date, last-call-at, last-call-by User.
- **Enums (closed)** :
  - Intake status: `A_APPELER` | `DOSSIER_INCOMPLET` | `A_RELANCER` | `HORS_ZONE` (UI labels as grilled). Default on create/sync arrival: `A_APPELER`.
  - Call outcome: `MESSAGERIE` | `RDV_PRIS` | `A_RAPPELER` | `PAS_INTERESSE` | `HORS_CIBLE` | `PAS_DE_REPONSE` (nullable until first save).
- **Validation** : `RDV_PRIS` requires planned RDV date; otherwise RDV date optional.
- **Relance** : on arrival = intake calendar day (Europe/Paris); on Call outcome save = last-call date + 2 days; recruiter override allowed. Past relance → overdue flag in view-model only (no status auto-write).
- **Last call** : on Call outcome save, stamp `lastCalledAt = now`, `lastCalledById = session user` — not free-text editable.
- **Default list filter** : Referent = current user OR null; toggle « tous ». Default population = not App-validated AND not Ignore AND not negative exit (`PAS_INTERESSE`, `HORS_CIBLE`, `HORS_ZONE`). Archive filter shows the rest (including App-validated linked rows if still queryable).
- **Ignore** : keep existing ignore semantics (status IGNORE, no reappear on sync); surfaces as row action; counts as default-view exit.
- **Remove** : `accept` mutation / ACCEPTE UI / convert flow; Hireflix invitation send/completeness UI from this surface (dead code cleanup in scope if it only served Profils app — do not change Intake booking SMS send rules or copy).
- **SMS** : Intake booking SMS and weekly-availability SMS — **out of change scope** (already shipped).
- **API** : extend `appProfile` router — list query with filters (Referent, archive vs default); `updateIntake` mutation (Zod); keep `ignore`; delete or hard-fail `accept`.
- **UI** : RSC page + client table; inline edits via tRPC mutations; atomic design + view-models; Prisma only in repositories; files &lt; 100 lines; no `any`.
- **Permissions** : list readable like other Intérim lists; mutations require `crm.write`.
- **No Syncro CSV import**.
- **No AppProfile detail page**.

---

## Testing Decisions

- Test **external behavior** only (exits, defaults, validation, filters, permission denials) — not React cell rendering or CSS.
- **Existing seams** :
  1. `appProfile` tRPC `createCaller` — list / ignore / remove accept — prior art `app-profile.test.ts`
  2. `ignoreAppProfile` domain — prior art accept/ignore tests
  3. Sync App-validated exit — prior art `sync-validated*.test.ts` (default view must exclude APP_VALIDATED)
  4. Pure view-models — enums, relance defaults (J / J+2), `RDV_PRIS` ⇒ date required, default Referent filter moi∪vide, overdue badge — prior art Intérim / filter VMs
  5. `interimSubNav` / navigation tests — « Entrées app » present; Profils app gone
  6. Permissions — `crm.write` on mutations — prior art `permissions*.test.ts`
- **New high seams** :
  7. `updateIntake` (name flexible) — Zod + caller: stamps, relance bump, negative-exit visibility, Referent assign
  8. List query Entrées app — default vs archive populations
- **Do not test** : inline edit pixels; Google Calendar SMS content/send (unchanged); Syncro import; live Badakan HTTP; Badakan validate write.

---

## Out of Scope

- Changing Intake booking SMS (copy, URL, send triggers, flags).
- Weekly-availability SMS behavior at App-validated (already shipped).
- One-shot Syncro CSV import / backfill of sheet history.
- Writing to Badakan (validate, comments, staff).
- Creating Candidate before App-validated.
- Admin-editable Intake status / Call outcome referentials.
- Auto-flipping Intake status to `À relancer` when overdue.
- AppProfile detail / convert pages.
- Replacing or merging `/interim/candidats` (staffable pool).
- PDF workflow relances J+2/5/10 as a separate reminder engine.
- Hireflix product revival.

---

## Further Notes

### Seams (user-validated)

1. `appProfile` tRPC createCaller  
2. ignore domain (accept removed)  
3. sync App-validated  
4. pure view-models (enums, relance, filters, overdue)  
5. interimSubNav  
6. permissions `crm.write`  
7. **new** `updateIntake` mutation  
8. **new** list query default vs archive  

### Écart sheet Syncro → CRM

| Sheet | CRM |
|---|---|
| STATUT Validé / Suspendu | Not Intake status — App-validated / Inactif via Badakan |
| ATTRIBUE A (texte) | Referent (User) |
| DERNIER APPEL / APPEL PAR | Auto stamp on Call outcome |
| _RELANCE | Auto J / J+2 + override |
| Fiche Emma / SOURCE / ZONE / NIVEAU | Not in V1 table |
| Import 866 CREATED rows | Explicitly no |

### Related

- ADR-0032 · CONTEXT.md terms App intake follow-up, Intake status, Call outcome, Intake booking SMS  
- Distinct from ADR-0024 Intérim V1 read model / weekly availability core
