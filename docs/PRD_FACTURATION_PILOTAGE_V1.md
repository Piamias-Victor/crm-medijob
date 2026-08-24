# PRD — Facturation Pilotage (port op-medijob)

Parent: [#325](https://github.com/Piamias-Victor/crm-medijob/issues/325) (Finance Devis) · Ligne de suivi [#341](https://github.com/Piamias-Victor/crm-medijob/issues/341) · Epic #210.

Reference UI: [op-medijob.netlify.app](https://op-medijob.netlify.app/) (Tableau de bord, Mensuel, Placements, Intérim, Paramètres objectifs). Clone that product in CRM Facturation. Do not iframe Netlify.

Glossary: `CONTEXT.md` (Pilotage, Exercice, Placement, NoGo, Encaissé, Objectif). ADRs 0017–0023.

---

## Problem Statement

Direction still steers CA, Marge, poles, and CDD/CDI conversion in the old Netlify tool. CRM Facturation only shows Devis pipeline counts, four generic bar charts, and a mixed Suivi list. Matthieu asked for Facturation to look like op-medijob: fiscal year October→September, KPIs, 240 k€ CDD/CDI cap, pole objectives, cumulative charts, Go/NoGo, monthly table, commercial matrix, CDD/CDI list, intérim-by-pharmacy.

## Solution

Port the op-medijob commercial follow-up into Facturation. Keep **Vue d’ensemble** (Devis commercial-status counts). Replace **Suivi** with **Pilotage** (dashboard + monthly), **Placements** (CDD/CDI lines), and **Intérim** (by Pharmacy + mission list). Create a Ligne de suivi from the matching list. Edit **Objectif** numbers in Admin (defaults = current Medijob figures). Recruteur / Communication still never see Facturation.

## User Stories

1. As Direction, I want Facturation to match the old Tableau de bord, so that I stop using Netlify for steering.
2. As Direction, I want Vue d’ensemble to stay as the Devis pipeline (Sans devis / Envoyé / Accepté / Facturé), so that quotes remain visible beside Pilotage.
3. As Direction, I want a Pilotage tab, so that KPIs, objectives, charts, Go/NoGo, and the monthly view live in one steering place.
4. As Direction, I want a Placements tab, so that every CDD/CDI Ligne de suivi is listed like the old placements screen.
5. As Direction, I want an Intérim tab, so that I see Pharmacy aggregates and every intérim Ligne de suivi.
6. As Direction, I want the Suivi tab gone, so that I do not keep a third mixed list.
7. As Direction, I want Recruteur and Communication to still have no Facturation nav and FORBIDDEN on these APIs, so that Marge stays confidential.
8. As Direction, I want an Exercice filter (25/26, 26/27, Tous) defaulting to the current October–September year, so that months run Oct→Sep not Jan–Dec.
9. As Direction, I want a Referent filter (Tous + one User), so that I can see one commercial’s contribution.
10. As Direction, I want KPI CA cumulé split CDD/CDI vs intérim, so that I see the mix at a glance.
11. As Direction, I want KPI Marge brute and % of CA, so that I see rentability.
12. As Direction, I want KPI Placements actifs (non-cancelled lines in the Exercice), so that I see volume.
13. As Direction, I want KPI Pharmacies actives (distinct clients in the Exercice), so that I see the client base.
14. As Direction, I want cancelled lines excluded from those four KPIs and shown in a red banner (count, CA, Marge), so that abandoned deals are visible but not mixed into realized CA.
15. As Direction, I want the CDD/CDI gauge against the annual Placement CA Objectif (12 × monthly Placement CA), so that I see Réalisé % and Potentiel %.
16. As Direction, I want Réalisé to be billed Placement CA, so that zero-amount and cancelled hires do not inflate the bar.
17. As Direction, I want Potentiel to add projected lost CA (NoGo count × average billed CA by CDI vs CDD), so that I see recoverable pipeline.
18. As Direction, I want Reste à faire vs the 240 k€-style cap, including how much of that gap is already in lost pipeline, so that I know what is still to win vs already lost.
19. As Direction, I want Objectifs par pôle (Placement vs Intérim) with Mois / Annuel toggle, so that I see 9 768 € / 20 000 € style progress.
20. As Direction, I want to pick the month used by the pole “Mois” toggle, so that I can inspect September vs another month.
21. As Direction, I want the CA composed chart (CDD/CDI + Intérim bars, monthly Objectif line, cumulative line) for the Exercice, so that I see 1,1 M€ vs 600 k€.
22. As Direction, I want the Marge chart vs monthly/annual rentability threshold, so that I see months above/below 15 k€ and cumul vs 180 k€.
23. As Direction, I want Go/NoGo cards for CDI and CDD (engaged, conversion %, billed count+CA, lost count+projected CA), so that I see conversion by type.
24. As Direction, I want the monthly Go/NoGo table (CDI ok / NoGo / CDD ok / NoGo / mix / billed CA), so that I see the year trend.
25. As Direction, I want the three months with the most NoGo and the months with 100 % conversion, so that I see extremes.
26. As Direction, I want the NoGo method caption (cancelled or 0 CA and 0 Marge; lost CA = type average), so that the team shares the rule.
27. As Direction, I want the monthly follow-up table (month, placements CDD+CDI vs intérim, CA split, total CA, Marge brute), so that I can scan the Exercice.
28. As Direction, I want a commercial matrix (Referent × month × CA, with period total), so that I see who produced what.
29. As Direction, I want a line with no Referent in “— Non attribué —”, so that unassigned CA is not dropped.
30. As Direction, I want each Ligne de suivi attributed to exactly one Referent (Combobox of Users), so that co-credit of two names is not used.
31. As Direction, I want a new Placement line from the Placements tab (Pharmacy, Candidate, optional Mission, CDD or CDI, Referent, date, CA, Marge), so that I book a hire without a Devis.
32. As Direction, I want CDD vs CDI required on a Placement line, prefilled from the Mission when linked, so that Go/NoGo can split types.
33. As Direction, I want CA 0 allowed on a Placement, so that an engaged unbilled hire is a NoGo.
34. As Direction, I want to cancel a line (reversible, stays visible, filter Annulés), so that I mark a lost hire without soft-deleting.
35. As Direction, I want to restore a cancelled line, so that a mistake is undone.
36. As Direction, I want Facturé and Encaissé marks on the line, independent of Devis Commercial status, so that I track invoice sent vs paid without a Facture entity.
37. As Direction, I want those marks not to move CA (still booked on the line date), so that invoicing is status not re-booking.
38. As Direction, I want Placements filters (search, month, CDD/CDI, status, actifs only) and filtered totals, so that the list matches the old screen.
39. As Direction, I want JobTitle shown from the Candidate, so that I see Pharmacien / Préparateur without a extra field.
40. As Direction, I want Export CSV of the filtered Placements list, so that I can work in Excel.
41. As Direction, I want a new Intérim line from the Intérim tab (hours, rate, CA, Marge, Pharmacy, Candidate, optional Mission, Referent, date), so that one line is the whole mission.
42. As Direction, I want Intérim vue par client (mission count, hours, CA, Marge, CA/h, Marge/h, last date), so that I see which pharmacies produce volume.
43. As Direction, I want Intérim toutes les missions with the same style of filters and CSV, so that I can drill a single line.
44. As Direction, I want Intérim lines never classified as NoGo, so that the 240 k€ gauge stays CDD/CDI only.
45. As Direction, I want Pilotage CA to union Ligne de suivi amounts with Mission Devis CA, except a Mission that has a linked line contributes only the lines, so that we do not double-count when both exist.
46. As Direction, I want an unlinked line never to hide a Devis, so that we do not invent a Pharmacy+Candidate join.
47. As Direction, I want Placements and Intérim lists to show only Lignes de suivi, so that Facturé / Annuler apply to a real line; orphan Devis stay on Vue d’ensemble and in Pilotage CA.
48. As Direction or RH-Admin, I want Objectif fields in Admin (monthly CA/Marge Placement, monthly CA/Marge Intérim, monthly rentability threshold), so that next year’s cap is not a deploy.
49. As Direction, I want annual targets in Pilotage to be 12 × those monthly numbers, so that 20 k€ × 12 = 240 k€ and (20 k+30 k)×12 = 600 k€.
50. As Direction, I want seeded defaults matching today’s Medijob figures (20 k / 20 k Placement, 30 k / 10 k Intérim, 15 k threshold), so that the first screen matches the pasted dashboard.
51. As Direction, I want create-line and Devis-from-line to keep working from Placements / Intérim, so that quoting from a line is not lost.
52. As Recruteur, I want Accueil unchanged (no CA widgets), so that finance does not land on home.
53. As Direction, I want months without activity still listed in the Exercice charts/table (zeros), so that Oct→Sep is a full year.
54. As Direction, I want clicking a monthly table row to show that month’s lines, so that “Clique une ligne pour voir le détail” still works.
55. As RH-Admin, I want the same Facturation and Objectif rights as Direction, so that finance.view stays the gate.

## Implementation Decisions

- Clone op-medijob follow-up. Do not iframe it. Do not keep it as system of record.
- Facturation sub-nav: Vue d’ensemble | Pilotage | Placements | Intérim. Remove Suivi. `/facturation/suivi` redirects to Placements (or Intérim if kind filter). Create-line CTA lives on Placements vs Intérim by kind.
- Vue d’ensemble stays the current commercial-status KPIs + existing slice charts. Pilotage is the new steering read-model.
- Unit of Placements / Intérim lists = Ligne de suivi only. Kind Placement vs Intérim.
- Placement line stores CDD or CDI. Intérim kind does not use that split. JobTitle is displayed from Candidate, not stored on the line.
- One Referent User on the line (Combobox). No free-text recruteur. No co-credit. Empty Referent → Non attribué.
- Cancel = reversible status on the line, not soft delete (ADR 0007 still applies to true deletion). Cancelled lines excluded from active KPIs; they feed NoGo if Placement.
- Facturé + Encaissé = two booleans on the line. Independent of Devis Commercial status Facturé. They do not change CA/Marge or the CA month (`occurredAt`).
- Placement `amountHt` may be 0. NoGo if cancelled OR (CA = 0 and Marge = 0). Lost CA = count of NoGo of that type × average CA of non-NoGo billed lines of that type (CDI vs CDD). Intérim never NoGo.
- Exercice = 1 October–30 September. Filter values derived from dates, not two hardcoded years. Chart/table month order = Oct→Sep.
- Follow-up union: all in-scope Lignes (non-cancelled for realized KPIs) + Mission Devis CA for Missions with **no** linked Ligne. Linked Mission → lines only. Unlinked line does not hide any Devis.
- Objectif: Admin singleton (or single parametres row). Fields: monthly CA/Marge Placement, monthly CA/Marge Intérim, monthly rentability threshold. Annual = ×12. Agency monthly CA Objectif = Placement monthly CA + Intérim monthly CA. Seed defaults: 20000 / 20000 / 30000 / 10000 / 15000.
- Schema on Ligne de suivi: Referent, Placement contract type (CDD|CDI), cancelled flag, Facturé flag, Encaissé flag, allow zero CA. Optional: cancel reason later — not required to match the dashboard.
- Permissions unchanged: `finance.view` (Direction, RH-Admin). Objectif Admin uses the same gate (or `admin`, which is the same two roles).
- Charts: Recharts ComposedChart like today. Test aggregates, not pixels.
- CSV: existing `buildCsv` helper.
- Marge nette, groupement RFA, two-instalment billing, tarifs admin, candidats/clients proto screens: not in this PRD.

Prototype-shaped state (from op-medijob + grill):

```
Exercice: Oct 1 Y → Sep 30 Y+1

NoGo(line):
  kind === Placement
  AND (cancelled OR (ca === 0 AND marge === 0))

lostCaCdi = nogoCdiCount * avgBilledCdi
lostCaCdd = nogoCddCount * avgBilledCdd
capPlacementYear = objectifCaMoisPlacement * 12
realisePct = billedPlacementCa / capPlacementYear
potentielPct = (billedPlacementCa + lostCaCdi + lostCaCdd) / capPlacementYear

followUpCa:
  sum(lines) + sum(missionDevisCa where mission has zero linked lines)
```

## Testing Decisions

Good tests assert numbers and permissions through public APIs / pure builders, not Recharts layout or CSS.

Existing seams (prefer these):

1. **Pure view-models** — Exercice window, follow-up union, NoGo + averages, pole % vs Objectif, monthly buckets, commercial matrix, interim-by-pharmacy. Prior art: `buildFacturationOverview`, `buildFacturationSlices`, `buildFacturationKpis`. Highest seam for the dashboard math.
2. **tRPC `createCaller` + `financeProcedure`** — Pilotage query, Placements/Intérim lists, create/update line (0 €, CDD/CDI, Referent), cancel/restore, Facturé/Encaissé. Prior art: `facturation.overview.test.ts`, `facturation-create-line.test.ts`, `facturation.test.ts`.
3. **Admin caller** — get/save Objectif, Recruteur forbidden. Prior art: `admin/software.test.ts`, `permissions.caller.test.ts`.
4. **`buildCsv`** — Placements/Intérim export rows. Prior art: `build-csv.test.ts`, candidate export tests.
5. **`can(role, 'finance.view')`** — Recruteur / Communication FORBIDDEN on Pilotage and lists. Prior art: `facturation.overview.test.ts`.

New seams (keep high):

6. **Pure `buildPilotage(lines, orphanMissions, objectifs, exercice)`** — one function returning KPIs, gauge, poles, chart series, Go/NoGo, monthly table, matrix. Charts consume it; they are not the test.
7. **Pure list filters** — search / month / type / cancelled / actifs on Ligne de suivi rows.

Do not test Netlify/Supabase. Do not test co-credit. Repository/Testcontainers only if cancel flag persistence cannot be proven at caller/pure seams.

## Out of Scope

- Co-credit (two Referents at 100 %)
- Free-text recruteur
- Marge nette, groupement RFA, two-instalment schema, partenaires
- Legal Invoice, Pennylane, payments beyond the Encaissé mark
- Replacing Vue d’ensemble
- Auto-creating a Ligne when a Devis is accepted
- Fuzzy anti-duplication on Pharmacy+Candidate
- Iframe or sync from op-medijob
- Tarifs / devis simulator / candidats / clients proto screens
- Accueil CA widgets
- Recruteur access to Facturation
- Soft-delete as the cancel action
- Changing Mission ANNULEE rules (still zeros Mission Devis CA; does not by itself cancel a Ligne)

## Further Notes

- Visual reference: pasted op-medijob dashboard (Exercice 25/26 figures). Behaviour from `docs/grill/inventories/.raw/op.js` and `INVENTORY_OP_MEDIJOB.md`.
- #325 Out of Scope listed `/mensuel`, `/placements`, `/interim` — this PRD **reopens** those as CRM Facturation, built on Ligne de suivi (#341), not a second app.
- Split implementation with `/to-issues` (schema+create-line fields → Pilotage read-model → lists → Admin Objectifs is a possible order; prefer vertical slices that show a screen).
- Glossary and ADRs 0018–0023 drafted in the grill; commit them with the first implementation slice (never push straight to `dev`).
