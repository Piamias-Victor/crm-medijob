# PRD Intérim V1 — CRM MediJob

> **Statut** : Ready for implementation (`ready-for-agent`)
> **Sources** : grill Intérim / Badakan (août 2026) · `CONTEXT.md` · ADR-0024 à ADR-0030 · PDF client « Workflows du CRM Intérim » (4 workflows) **rebasé**
> **Glossaire** : termes `CONTEXT.md` uniquement (`App-validated`, `Weekly availability`, `Candidate origin`, `Badakan mission`, `Badakan comment`, `Badakan contract`, `Application` ≠ `SEARCH_APPLIED`)

Le PDF client décrit 4 workflows. V1 **n’est pas** ce PDF tel quel : c’est le noyau durable (read model Badakan + weekly availability + filtres + 1 SMS en fin de V1). Le tableau d’écart est en *Further Notes*.

---

## Problem Statement

Les recruteurs MediJob staffent l’intérim depuis l’admin Badakan (app mobile) : profils validés, commentaires / résumés d’appel, missions, pharmacies, postulés, contrats. Le CRM ne récupère aujourd’hui que `searchNewEmployees` (Profils app, surtout `CREATED`). Ils ne voient pas les **App-validated**, ni les **Weekly availability**, ni les missions / pharmacies / commentaires Badakan. Ils ne peuvent pas filtrer « qui est vraiment dispo mercredi matin » ni appeler un postulé sans rouvrir Badakan. Les 4 workflows du PDF (relances J+2/5/10, SMS hebdo, matching logiciels, email « profil validé MediJob ») ne sont **pas** le besoin V1 : le bloquant est un process durable dans le CRM, alimenté en lecture par Badakan.

## Solution

Le CRM **pilote** l’intérim en lecture. Badakan reste la source app ; **V1 n’écrit jamais** vers Badakan (pas de staff, validate, PUT mission, POST commentaire, écriture contrat).

1. **Read model complet** : inscrits (Profils app) + App-validated, **Badakan comments**, **Badakan missions** + `SEARCH_APPLIED`, pharmacies (import vérifié → **Pharmacy**), **Contact** principal, **Badakan contracts**. Sync sur le **même cycle périodique** que Profils app (pas de bouton Rafraîchir).
2. Un destinataire **App-validated** (`valid` / `COMPLETED`) devient ou est lié à un **Candidate** **origine App**, status **Nouveau** (pas Qualifié). Il sort de l’inbox Profils app (ce n’est pas Ignore). Fusion email puis téléphone ; pas de doublon ; Qualifié n’est pas rétrogradé.
3. **Weekly availability** : page publique à lien secret (grille une semaine, AM/PM, historique). Tests = copier le lien. Envoi auto **un SMS** à App-validated (fin de V1) ; pas de cron hebdo. Filtre recruteur : créneau + **JobTitle** + ville / **Mobility radius**.
4. Listes Intérim **à part** du kanban **Mission** et de l’onglet Finance « Intérim » (**Ligne de suivi**).

---

## User Stories

1. As a Recruteur, I want App-validated people from Badakan to appear as Candidates with origin App, so that the staffable intérim pool lives in the CVthèque without clicking ACCEPTE in Profils app.
2. As a Recruteur, I want a CREATED signup to stay in Profils app only, so that the inbox remains new inscriptions, not the staffable pool.
3. As a Recruteur, I want a person who becomes App-validated to leave Profils app automatically, so that I do not see them twice (that exit is not Ignore).
4. As a Recruteur, I want ACCEPTE from Profils app to remain possible but rare, so that existing Hireflix / accept flows are not deleted.
5. As a Recruteur, I want a new App-origin Candidate to start at status Nouveau, so that Qualifié still means a CRM Interview.
6. As a Recruteur, I want origin App visible on the Candidate fiche, so that I know they come from the app.
7. As a Recruteur, I want sync to link an existing Candidate by email then phone instead of creating a duplicate, so that Marie already in CVthèque is not cloned.
8. As a Recruteur, I want Qualifié (or any richer status) kept on that link, so that App-validated never downgrades qualification.
9. As a Recruteur, I want later Badakan identity/address/phone/email/job updates to win when non-empty, so that the app remains source of truth for those fields.
10. As a Recruteur, I want salary, software, mobility, Availability (`availableFrom`), and notes to stay CRM-owned, so that Interview close is not overwritten.
11. As a Recruteur, I want an empty Badakan field never to clear a filled CRM field, so that blanks do not wipe data.
12. As a Recruteur, I want CV from Badakan on `cvUrl`, so that I can open the résumé without leaving the CRM.
13. As a Recruteur, I want CNI, RIB, diploma files as Documents on the Candidate, so that the full Badakan dossier is on the fiche.
14. As a Recruteur, I want NIR and IBAN stored on the Candidate fiche, so that staffing paperwork does not require Badakan.
15. As a Recruteur, I want those identity numbers excluded from matching and from the availability filter, so that sensitive data is not a search key.
16. As a Recruteur, I want Badakan comments (e.g. « Répondeur : Entretien téléphonique. ») on the AppProfile or Candidate fiche, so that call summaries written in Badakan are visible.
17. As a Recruteur, I want comments on CREATED Profils app people too (Tounkara), so that notes exist before App-validated.
18. As a Recruteur, I want new call notes to be ActivityLog in the CRM, so that we do not POST `/comments` to Badakan.
19. As a Recruteur, I want Badakan missions in an Intérim list (not the CRM Mission kanban), so that app shifts stay separate from recruiter-created needs.
20. As a Recruteur, I want to open a Badakan mission and see `SEARCH_APPLIED` applicants with phone, so that I can contact someone who applied (Application job board is a different thing).
21. As a Recruteur, I want pharmacy name, dates/periods, and mission step on that list, so that I know which officine and when.
22. As a Recruteur, I want a Badakan enterprise to become a Pharmacy only after a verification screen, so that imports are checked (name, SIRET, address, principal).
23. As a Recruteur, I want that screen to show the existing Pharmacy when SIRET matches, so that we never create a second file.
24. As a Recruteur, I want the same screen to offer create/link of a Contact from the Badakan principal user, so that I can call the officine.
25. As a Recruteur, I want Contact merge by email then phone, so that Dominique Litzler is not duplicated.
26. As a Recruteur, I want Badakan contracts in an Intérim read list (PDF/DPAE/status), so that paperwork is visible without Finance.
27. As a Recruteur, I want a Badakan contract never booked as a Ligne de suivi, so that Facturation Intérim stays human CA lines.
28. As Direction, I want V1 never to write to Badakan (staff, validate, PUT periods, POST comments, contract writes), so that billed API mistakes and dual-write do not happen.
29. As a Recruteur, I want sync on the same periodic cycle as Profils app, so that postulés and comments appear without a refresh button.
30. As a Recruteur, I want SUSPENDED or BANNED to set Candidate Inactif, so that they leave the availability filter and the availability SMS.
31. As a Recruteur, I want Inactif from Badakan not to mean Blacklisté, so that MediJob keeps blacklist as an explicit decision.
32. As a Recruteur, I want restore to COMPLETED to bring back the previous Candidate status and the filter, so that a lifted suspension is staffable again.
33. As a Recruteur, I want no second automatic SMS on restore, so that we do not spam; the secret URL still works.
34. As an App-validated Candidate (Marie), I want a public week-grid page (Skello / Google Calendar style, AM/PM cells) with no CRM login, so that I can declare slots from my phone.
35. As Marie, I want to see one week at a time and switch to following weeks, so that the page stays simple.
36. As Marie, I want full history of weeks I filled, so that past declarations are not lost.
37. As Marie, I want a week I never submitted to stay unknown, so that empty silence is not treated as no.
38. As Marie, I want saving a week with no cells to mean declared unavailable for those days, so that I can say I do not work that week.
39. As Marie, I want the same secret URL to stay valid forever (V1), so that I can update later without a new SMS.
40. As a Recruteur, I want to copy that secret URL during tests, so that we can try the page before SMS exists.
41. As a Recruteur, I want to resend the same link by hand, so that I can ping someone without a weekly cron.
42. As Marie, I want one SMS with the link when I become App-validated (shipped last in V1), so that I receive the page without a weekly spam.
43. As the system, I want to wait for a phone on a later sync then send that SMS once, so that missing numbers still get the link (Hireflix-style wait).
44. As a Recruteur, I want to filter App-origin App-validated non-Inactif Candidates by a dated AM/PM slot + JobTitle + city/mobility radius, so that I can shortlist for a shift.
45. As a Recruteur, I want unknown weeks excluded from the “available” filter, so that I do not call people who never declared.
46. As a Recruteur, I want declared-unavailable weeks excluded from “available”, so that empty saved weeks are not mixed with unknown.
47. As a Recruteur, I want that filter not to use software, salary, or preferred contract types, so that intérim week search stays lighter than CDI matching.
48. As a Recruteur, I want to call a filtered Candidate from the CRM (phone / sms: URL already used on matching), so that contact is the V1 “positionner” action.
49. As a Recruteur, I want not to auto-create a MissionCandidate on a CRM Mission from this filter, so that Badakan staffing stays in the app.
50. As a Recruteur, I want default mobility 30 km when radius is unset, so that geo filter matches existing matching rules.
51. As Communication, I want read access to Intérim lists consistent with Candidate/Pharmacy permissions, so that I can consult without a new role.
52. As Direction, I want Facturation → Intérim (Lignes de suivi) unchanged, so that finance vocabulary is not mixed with operational Intérim.
53. As a Recruteur, I want Hireflix invitations to keep running only while AppProfile is EN_ATTENTE, so that COMPLETED leaving the inbox cancels a pending invite like accept/ignore.
54. As a Recruteur, I want JobTitle mapped from Badakan activities when possible, so that the availability filter has a métier.
55. As a Recruteur, I want ActivityLog on Candidate when origin App is created/linked, so that the fiche history shows the app intake.
56. As an agent/developer, I want all Badakan HTTP behind an injected client, so that tests never hit live Badakan.
57. As Direction, I want the public availability token unguessable, so that a leaked sequential id cannot edit someone else’s slots.
58. As Marie, I want past days in the current week not clickable, so that I cannot rewrite history by accident (history remains visible).
59. As a Recruteur, I want timezone Europe/Paris for weeks and SMS “today”, so that slots match officine days.
60. As a Recruteur, I want an Intérim nav area distinct from Missions and from Facturation Intérim, so that I find Badakan missions, contracts, verification queue, and availability filter in one module.

---

## Implementation Decisions

- **PDF vs V1** : workflow 1 « validation MediJob + email » n’est pas la porte V1 — la porte est **App-validated** Badakan. Workflow 3 relances J+2/5/10 hors V1. Workflow 2 : un SMS à App-validated, pas un SMS chaque semaine. Workflow 4 : filtre créneau + métier + geo, pas logiciels / élargir rayon / MissionCandidate auto.
- **ADR** : 0024 (périmètre V1), 0025 superseded by 0026 (Candidate origine App), 0027 (Badakan mission ≠ Mission), 0028 (Pharmacy après vérif SIRET), 0029 (pièces identité sur fiche), 0030 (Badakan contract ≠ Ligne de suivi).
- **BadakanClient** : étendre le client injecté actuel (`searchNewEmployees` + `fetchFn`) en lecture v3 : `searchEmployees` (COMPLETED), GET recipient, GET comments/target/{id}, POST missions/search, GET enterprises/{id}, POST contracts/search, GET contract. Header `security_token`. **Aucun POST/PUT/DELETE** métier en V1.
- **Sync** : même cron que Profils app (`isCronAuthorized` + cycle périodique). Pas de contrôle Rafraîchir UI. Quand COMPLETED : sortir l’AppProfile de l’inbox ; create/link Candidate.
- **Candidate** : `badakanId` unique nullable ; **Candidate origin** (App vs autres chemins). Status create = Nouveau. SUSPENDED/BANNED → Inactif + mémoriser le status précédent pour restore.
- **Fusion Candidate** : email d’abord, puis téléphone (`phonesMatch`) — plus large que le match nom+tél actuel si l’email manque.
- **Champs sync** : Badakan non vide gagne identité/adresse/contact/métier ; Interview-mapped intouchables ; vide n’efface pas.
- **Documents** : CV → `cvUrl` (déjà le pattern AppProfile resume). CNI/RIB/diplôme → Document sur Candidate (étendre `DocumentCategory` si besoin, pas `cvUrl`). NIR/IBAN sur la fiche, hors filtres.
- **Weekly availability** : entité/slots datés AM|PM + flag « semaine soumise » (inconnu vs vide déclaré). Token secret public. Route App Router hors dashboard (pas de session). Mutation publique Zod + token.
- **SMS** : nouveau port sortant injecté (aujourd’hui seul Brevo email Hireflix existe ; `sms:` URLs sont des deep links recruteur). Un envoi à App-validated ; attente tél comme `invite-due` attend l’email ; pas de 2e envoi auto au restore.
- **Filtre** : requête déterministe (pas `matchingRouter` / score IA). JobTitle + geo existants (`mobilityRadiusKm` défaut 30, lat/lng Candidate). Population : origin App + App-validated + pas Inactif.
- **Pharmacy** : file de vérif calquée sur l’import pharmacies / `siretMatches`. Contact create/link via router Contact existant.
- **UI** : module Intérim opérationnel ≠ `/facturation/interim`. Atomic design + view-models ; Prisma seulement dans les repositories ; lectures RSC `createCaller` ; mutations tRPC.
- **Permissions** : `crm.write` pour vérif pharmacie / notes ActivityLog ; lecture Intérim pour les rôles qui voient Candidats/Pharmacies. Page dispo : pas d’auth.
- **Fichiers < 100 lignes**, Zod, zéro `any`, pas de write Badakan même « pour tester en prod ».

## Testing Decisions

- Tester le **comportement** (sync create/link, inbox exit, filter unknown vs unavailable, token save, no Badakan write, SIRET merge) — pas le détail SQL.
- Modules : client Badakan (fetch injecté), cycle de sync (prior art `syncAppProfiles` / `runAppProfileCycle`), fusion Candidate, weekly availability (submit empty vs never), filtre, vérif Pharmacy/Contact, file d’attente SMS sans tél, restore status, public token.
- Prior art : `apps/web/src/server/app-profile/sync.ts` + `run-cycle.test.ts` ; `duplicate-identity-match` ; `pharmacy-import` SIRET ; `invite-due` skip sans email ; `createCallerFactory` sur les routers ; cron `isCronAuthorized`.
- Interdit : appels réseau live Badakan dans les unit tests. Pas d’exploit / payload d’attaque sur le token : seulement « token inconnu → 404/refus » et « token valide → save ».

## Out of Scope

- Relances auto J+2 / J+5 / J+10, délais configurables, alerte recruteur après J+10 (workflow 3 PDF).
- SMS hebdomadaire de dispos ; relance si la semaine n’est pas actualisée (workflow 2 PDF étape 6).
- Email « profil validé » après acceptation MediJob ; validation dossier par l’équipe comme porte V1 (workflow 1 PDF « profil accepté »).
- Entretien CRM / Hireflix comme **condition** d’entrée dans le vivier Intérim (Hireflix Profils app **existe déjà**, hors ce PRD sauf cancel à la sortie inbox).
- Matching logiciels, niveau, compétences, « élargir la zone », « non affecté à une autre mission » comme MissionCandidate (workflow 4 PDF riche).
- Writes Badakan : staff, validate, reject, PUT periods, POST comments, contrats.
- Créer une **Mission** CRM depuis une **Badakan mission**.
- Compte candidat / magic link.
- Notifs client quand quelqu’un postule.
- Lignes de suivi / Devis / CA depuis un Badakan contract.
- Calendly (prise de RDV) ; heures précises ; semaine type récurrente.

## Further Notes

### Écart PDF client → V1 grillé

| Workflow PDF | V1 |
|---|---|
| 1. Complet ? → relance → entretien → **validé MediJob** + email | Complet/validé = **App-validated** Badakan. Relance et email hors V1. CREATED = Profils app. |
| 2. SMS **chaque semaine** + relance si pas à jour | **Un** SMS à App-validated (fin de V1). Lien secret persistant. Grille AM/PM 1 semaine + histo. |
| 3. Relances J+2/5/10 | Hors V1. |
| 4. Recherche dates + métier + geo + **logiciels** + élargir + positionner pipeline | Filtre créneau + JobTitle + ville/rayon. Contacter. Pas MissionCandidate auto. `SEARCH_APPLIED` sur liste Badakan mission. |

### Preuves API (lecture live, compte MediJob)

- Commentaires : `GET /services/v3/comments/target/{recipientId}` — pas dans le GET recipient. Tounkara `CREATED` : « Répondeur : Entretien téléphonique. » (Deslances Jensie).
- `SEARCH_APPLIED` existe ; snapshot grill : seulement sur missions CANCELLED ; Tounkara : 0 mission.
- V1 read-only : erreurs API facturées (Pierre).

### Seams (existants à réutiliser)

1. `BadakanClient` + cron Profils app  
2. Duplicate Candidate / SIRET Pharmacy  
3. Documents Candidate + `cvUrl`  
4. ActivityLog  
5. Contact create  
6. Geo `mobilityRadiusKm`  
7. Port email Hireflix → **nouveau** port SMS à côté  
8. Route publique token (nouveau, hors `(dashboard)`)
