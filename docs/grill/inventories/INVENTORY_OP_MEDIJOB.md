# Inventory — op-medijob.netlify.app

Prototype opérationnel Medijob (devis, placements, CA/marge).

- **Scrape date:** 2026-08-17
- **Auth:** none — no login attempted; public SPA HTML/JS only
- **CRM code:** not implemented in this inventory pass

## Architecture

- **Vite SPA** on Netlify (`/assets/index-*.js`)
- **Supabase** backend (no useful public `/api/*` — those URLs serve the SPA HTML)
- **Project ref:** `qfghmxiomfakobvtaxsa`
- **URL:** `https://qfghmxiomfakobvtaxsa.supabase.co`
- **Anon key:** present in the client bundle (expected for Supabase SPA; public client key, not a server secret)

## Routes

| Route | Purpose |
|---|---|
| `/login` | Authentification Supabase |
| `/candidats` | Liste / fiches candidats |
| `/clients` | Clients (pharmacies) |
| `/devis` | Simulateur devis (intérim + recrutement / placement) |
| `/interim` | Suivi missions intérim |
| `/placements` | Suivi placements CDD/CDI |
| `/mensuel` | Pilotage mensuel CA / marge / objectifs |
| `/tarifs` | Grille tarifs & coefficients |
| `/parametres` | Paramètres (groupements, partenaires, objectifs) — admin |

## Entities / tables (Supabase `from("…")`)

- `candidats`
- `contrats`
- `groupements`
- `parametres`
- `partenaires`
- `partenaires_externes`
- `pharmacies`
- `placements`
- `profils`
- `tarifs_coefficients`
- `tarifs_interim`

## Devis simulator — curated French fields

Product-facing labels only (SheetJS / Excel / jsPDF / English internals excluded).

**Rémunération / base**
- Brut / h
- Brut 35 h
- Brut mensuel / Salaire brut mensuel (€)
- Brut annuel
- Net
- Heures / Base heures

**Coefficients & primes**
- Coefficient
- Coef facturation imposable
- Coef facturation non imposable
- Coef RGDU / Montant RGDU
- Prime imposable
- Prime non imposable
- ICC / ICP / IFM (codes présents dans le calcul bundle)

**Coûts & devis**
- Coût horaire client HT
- Coût client mensuel
- Coût employeur mensuel
- Devis
- Devis client HT (mensuel)
- Devis TTC

**Résultat**
- CA / CA/h
- Marge brute (€) / Marge B.
- Marge nette / Marge N.
- Marge / h
- % du CA / marge

**Modes & remises**
- Intérim — Conditions Intérim / Remise Intérim
- Placement CDD / CDI — Conditions Placement / Remise Placement
- Recrutement (comparatif vs intérim dans le simulateur)

## Placements

- Placements CDD / CDI
- CA CDD/CDI
- CA facturé
- CA perdu
- Encaissé
- Encaissé (global)
- Marge brute / marge nette par placement
- Remise / RFA groupement sur marge nette
- Export CSV placements
- Annuler / restaurer un placement
- Filtrage par période / recruteur

## Intérim

- Missions intérim
- CA Intérim
- Heures / CA/h / marge/h
- Fin de mission anticipée

## Mensuel (CA / marge / objectifs)

- Vue mensuelle CA / marge
- CA cumulé
- CA annuel cible (€)
- CA cible / mois (€)
- CA mensuel global cible (€)
- Objectifs vs réalisé

## Tarifs

- Tarifs & coefficients
- Coef facturation imposable / non imposable
- Coef RGDU
- ICC / ICP / IFM (libellés présents dans le bundle)
- Conditions Intérim vs Placement

## Paramètres

- Groupements (taux remise / RFA)
- Partenaires / partenaires externes
- Objectifs CA
- Édition réservée admin (message UI: contacter Mathieu)

## Gaps (auth / repo requis)

- Data behind **Supabase Auth** (`/login`) — not explored
- RLS policies, SQL views/triggers, exact devis formulas: **Supabase project / source repo**
- Admin-only paramètres (groupements, partenaires, objectifs)
- Full screen behavior after login (validated rows, filters, permissions)

## Scope CRM V1 — Q13 still open

Décision entretien (Q12): CRM remplace Netlify eval; tous profils in scope.
**Q13 (op-medijob / finance-devis)** n’est **pas** tranchée: sous-ensemble V1 vs proto complet (devis, facturation, CA, marge, écrans) reste à décider avec le client.

## Fichiers bruts

- `.raw/op.html`, `.raw/op.js` (gitignored)
- `.raw/op-extract.json`, `.raw/op-labels-clean.json`
