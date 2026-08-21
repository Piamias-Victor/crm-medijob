## Problem Statement

Recruiters still double-enter job ads: they draft a JobOffer in the CRM, then the public listing lives on a separate job board. Publishing in the CRM today only flips an internal status — nothing appears on https://medijob-offres.netlify.app/offres. People who apply on that site do not land in the CRM Application inbox. Medijob-eval/T4S/Webflow are the wrong pipes; the live board is medijob-jobs (Supabase tables `offres` and `candidatures`) and we are not paid to change that app.

## Solution

The CRM is the source of truth for a Mission’s JobOffer. Publier writes (or updates) a row in the board’s `offres` table and stores the board listing id on the JobOffer — never the CRM id on the board (`source_crm_id` would send applicants to Tool4Staffing). Dépublier sets `publiee = false`; rows are never deleted. Filling or cancelling the Mission unpublishes automatically. CRM status `PUBLIEE` only after a successful board write.

Applicants on that listing become Applications via ingest of `candidatures` (cron + on-demand sync). Each board submission id is unique. Spontaneous rows (no listing id) are ignored. Accept/refuse/dedup stay the existing Application inbox: accept copies the CV into CRM storage; refuse keeps a stats trace and is not reopened on later sync.

## User Stories

1. As a Recruteur, I want Publier on a JobOffer to create the public listing, so that I do not retype the ad on the website.
2. As a Recruteur, I want Republier / update after editing a draft or unpublished offer to update the same listing, so that I do not create duplicates on the site.
3. As a Recruteur, I want the public titre and description to come from the JobOffer, so that the IA-written ad is what candidates see.
4. As a Recruteur, I want métier, contract type, hours, pay, and start date to come from the Mission, so that the listing matches the staffing need.
5. As a Recruteur, I want city, postal code, and department to come from the Pharmacy, so that the listing is geographically accurate.
6. As a Recruteur, I want entreprise on the listing to be the Pharmacy name, so that candidates see the officine, not a generic brand.
7. As a Recruteur, I want contact_email on the listing to be a Medijob address from configuration, so that pharmacy or Tool4Staffing emails are not exposed.
8. As a Recruteur, I want coordinates filled when we can geocode the Pharmacy city, so that the site map still works.
9. As a Recruteur, I want a public slug generated for the listing, so that the offer URL stays readable.
10. As a Recruteur, I want Dépublier to hide the listing without deleting it, so that history and linked applications stay intact.
11. As a Recruteur, I want a failed board write to leave the JobOffer unpublished and show an error, so that “publiée” always means visible on the site.
12. As a Recruteur, I want an already published JobOffer to refuse a second Publier, so that I update via the existing lifecycle instead of duplicating.
13. As a Recruteur, I want setting the Mission to Pourvu to unpublish the JobOffer, so that a filled role disappears from the site.
14. As a Recruteur, I want setting the Mission to Annulée to unpublish the JobOffer, so that a cancelled need is not still advertised.
15. As a Recruteur, I want manual Dépublier to remain available, so that I can take an ad down before the Mission closes.
16. As Direction, I want no `source_crm_id` written on the listing, so that Postuler stays on the job-board form instead of Tool4Staffing.
17. As Direction, I want the CRM never to write old-CRM tables in that database (`offres_emploi`, `missions`, `candidats`, …), so that production Base44 data is not corrupted.
18. As Direction, I want the job-board Next.js app left untouched, so that we do not take on unpaid site maintenance.
19. As a Recruteur, I want Applications to appear in Candidatures reçues after ingest, so that website applicants are processed in the CRM.
20. As a Recruteur, I want ingest to run on a schedule, so that I do not miss applicants if I forget to refresh.
21. As a Recruteur, I want a sync action on the inbox, so that I can pull new applications immediately.
22. As a Recruteur, I want each board submission to become at most one Application, so that cron does not duplicate rows.
23. As a Recruteur, I want ingest to ignore applications without a listing id, so that spontaneous site CV drops stay out of V1.
24. As a Recruteur, I want ingest to ignore board rows whose listing id is not one of our published JobOffers, so that leftover T4S/legacy ads do not flood the inbox.
25. As a Recruteur, I want an accepted or refused Application to stay in that status after later ingest, so that the inbox does not reopen finished work.
26. As a Recruteur, I want the inbox to show name, métier, phone, email, city, CV link, related JobOffer, date, and message, so that I can triage like the CSV.
27. As a Recruteur, I want Accept to create a Candidate when there is no duplicate, so that the person enters the CVthèque with their CV when copy succeeds.
28. As a Recruteur, I want Accept to still create the Candidate if CV copy fails, so that a storage glitch does not drop the hire pipeline.
29. As a Recruteur, I want Accept on a duplicate email/phone/name to use the existing merge-review screen, so that we do not silently overwrite a Candidate.
30. As a Recruteur, I want Refuse to mark the Application refused with a stats trace, so that we keep counts without keeping them pending.
31. As a Recruteur, I want two Applications never merged together, so that each site submission stays its own record.
32. As Communication, I want the same read rules as today on JobOffers and Applications, so that this feature does not invent a new permission model.
33. As a Recruteur, I want `/offres` to still show published vs unpublished and mission link, so that the existing list remains the control surface.
34. As a Recruteur, I want the Mission Offre tab Publish/Unpublish buttons to be the same actions that talk to the board, so that I do not learn a second screen.
35. As Direction, I want production board credentials only in env, so that secrets never live in git.
36. As a developer/agent, I want the board client mockable, so that CI never writes or reads the client production database.
37. As a Recruteur, I want listing contract labels to match the board vocabulary (CDI, CDD, Intérim, Vacation), so that site filters keep working.
38. As a Recruteur, I want temps plein / partiel mapped from the Mission, so that the listing hours are honest.
39. As a Recruteur, I want JobTitle name used as `metier`, so that board métier filters stay aligned with the CRM referential.
40. As Direction, I want this work sliced as publish first then ingest, so that Applications can attach to a listing id we actually own.

## Implementation Decisions

- Parent epic remains #210. Implementation slices: #230 (publish/unpublish) then #231 (ingest). This PRD is the spec both slices implement.
- Glossary: JobOffer listing identity is the **board’s** id stored on the JobOffer; Application is one board submission identified by that submission id. Webflow is not the CMS (Q9). ADR 0016.
- Replace the unused Webflow item field on JobOffer with a board listing id (nullable until first successful publish). Unique board submission id on Application.
- Do not call the board HTTP API (`POST /api/offres`). Use a job-board port over the board Supabase project: write `offres`, read `candidatures`.
- Never set `source_crm_id`. Never DELETE `offres`. Unpublish = `publiee false`. Ignore `offre_id` empty. Do not touch `offres_emploi` / `missions` / `candidats` / other old-CRM tables.
- Extend existing JobOffer publish/unpublish handlers: load Mission + Pharmacy, map listing payload, call the port, persist listing id + `PUBLIEE` only on success. Same buttons / tRPC mutations as today.
- Mission status POURVU and ANNULEE trigger the same unpublish path when a published JobOffer exists.
- Listing map: titre/description ← JobOffer; métier ← JobTitle name; type_contrat / temps_travail / salaire / date_debut ← Mission; ville / CP / département / geo ← Pharmacy; entreprise ← Pharmacy name; contact_email ← env `JOBS_CONTACT_EMAIL`.
- Geocode via existing BAN lookup (ADR 0013). Slug generated in the CRM (title + city), unique enough for insert; updates keep the existing slug unless we must change city/title on an unpublished listing.
- Ingest is one function with two triggers (cron + inbox sync mutation), same pattern as AppProfile sync. Filter to listing ids we own. Insert Application EN_ATTENTE on first see; skip if submission id already exists.
- Accept/refuse/dedup: reuse Application intake + ADR 0006 merge review. Store board `cv_url` on Application at ingest; copy into Candidate `cvUrl` / blob on accept; Candidate is still created if copy fails.
- Permissions: existing JobOffer write + Application inbox procedures. No new UserRole.
- Architecture constraints unchanged: Prisma only in repositories; board SDK only behind the port; view-models; files under line limit; RSC reads / client mutations.

Board listing payload (decision-rich, not a demo):

```
offres upsert:
  titre, metier, description, entreprise, ville,
  code_postal?, departement?, latitude?, longitude?,
  type_contrat, temps_travail, salaire_min?, salaire_max?,
  avantages?, profil_recherche?, date_debut?,
  contact_email, publiee, mise_en_avant=false
  // slug on insert; omitted source_crm_id
```

## Testing Decisions

Good tests observe CRM state and port calls — not the Supabase SDK, not HTML, not production.

Highest seams (mock the board, keep existing handler tests):

1. **Job-board listings port** — upsert listing (returns id), set `publiee`. Tests assert arguments (no `source_crm_id`, pharmacy name, env contact email) and that publish does not call delete.
2. **JobOffer publish / unpublish handlers** (extend current lifecycle tests) — `PUBLIEE` only if upsert succeeds; port error → unpublished + error; unpublish calls `publiee false` with stored listing id.
3. **Mission status POURVU / ANNULEE** — existing status tests plus: published JobOffer becomes `DEPUBLIEE` and port `publiee false`.
4. **Job-board applications port** — list submissions. Tests never hit prod.
5. **Application ingest function** (prior art: AppProfile `syncAppProfiles`) — first pull creates Application; second pull no duplicate; unknown listing id skipped; empty listing id skipped; ACCEPTEE/REFUSEE not reset to EN_ATTENTE.
6. **Accept CV copy port** — existing refuse tests stay; accept tests mock copy success/failure (Candidate created either way). Duplicate path reuses merge-review tests.

CI uses mocks only. Manual prod publish is a human checklist on #230, one offer at a time.

## Out of Scope

- Any change to the medijob-jobs / Netlify site codebase
- Webflow CMS client
- Tool4Staffing portal, RSS, or `source_crm_id` tracking emails
- Writing old-CRM tables in the shared Supabase project
- Spontaneous applications (`offre_id` empty) and a generic “drop CV” inbox
- HTTP `POST /api/offres` / `ADMIN_PASSWORD`
- Deleting board listings
- Porting the public job board UI into the CRM
- Auto-accept Applications into the CVthèque
- Merging two Applications together
- Veille JobOffers with no Mission (not in current CRM model)

## Further Notes

- Q9 answered 2026-08-19: not Webflow; board is medijob-offres / medijob-jobs. Credentials live in env (`JOBS_SUPABASE_*`, `JOBS_CONTACT_EMAIL`); do not put secrets in issues or git.
- Shared production database: listings live beside the former CRM. Read/write only `offres` and `candidatures`.
- Slice order: #230 must land before #231 so ingest can match `offre_id` to a listing id we created.
- CSV coverage: V1-049, V1-050, V1-052, V1-057, V1-058, V1-059, V1-060. V1-048 / V1-051 already shipped in #229 (IA + `/offres` list).
