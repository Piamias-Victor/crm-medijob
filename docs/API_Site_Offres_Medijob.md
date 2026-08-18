# API du site des offres — https://medijob-offres.netlify.app

Documentation destinée à un développeur qui souhaite **brancher son outil sur le site public des offres Medijob**.

> ⚠️ Cette documentation a été reconstituée par observation du site en production (aucune doc officielle publique n'est disponible). La partie **lecture** (endpoints `GET`) est confirmée par des appels réels. La partie **écriture** (endpoints `POST` / `PUT` / `DELETE`) est **détectée mais protégée par authentification** — il faudra obtenir un token auprès de l'équipe technique qui maintient le site.

---

## 1. Stack technique du site

- **Framework** : Next.js (App Router — routes détectées : `/_next/static/chunks/app/offres/*`)
- **Hébergement** : Netlify (headers `x-nf-request-id`, `server: Netlify`)
- **API** : routes Next.js internes, servies sous le même domaine (`/api/*`)
- **Domaine public** : `https://medijob-offres.netlify.app`

Chaque offre porte un champ `source_crm_id` (ex : `"1612-14"`), ce qui indique que la base est **alimentée depuis un CRM en amont** (vraisemblablement l'app Medijob interne / Base44). Deux stratégies d'intégration sont donc possibles pour ton développeur — voir §6.

---

## 2. URL de base

```
https://medijob-offres.netlify.app/api
```

---

## 3. Schéma d'une offre (`Offre`)

Confirmé par appel réel sur `/api/offres/{id}` :

| Champ | Type | Exemple / Notes |
|---|---|---|
| `id` | string (UUID) | `"9777eb04-cf59-4235-9fcd-b5d5f050d992"` |
| `slug` | string | `"preparateur-en-pharmacie-cdi-publier-1612-14"` (utilisé dans les URLs SEO) |
| `titre` | string | `"Préparateur en pharmacie CDI"` |
| `metier` | string | `"Préparateur en pharmacie"`, `"Pharmacien"`, `"Étudiant en pharmacie"` |
| `description` | string (HTML) | Balises `<h2>`, `<p>`, `<ul>`, `<strong>` acceptées |
| `entreprise` | string | Nom affiché de l'employeur (ex : `"MEDIJOB"`) |
| `ville` | string | `"Publier"` |
| `code_postal` | string \| null | `"74500"` |
| `departement` | string \| null | `"74"` (2 chiffres) |
| `latitude` | number \| null | `46.387398` |
| `longitude` | number \| null | `6.543474` |
| `type_contrat` | string | `"CDI"`, `"CDD"`, `"Intérim"`, `"Vacation"` |
| `temps_travail` | string | `"Temps plein"`, `"Temps partiel"` |
| `salaire_min` | number \| null | Salaire mensuel min (€) |
| `salaire_max` | number \| null | Salaire mensuel max (€) |
| `avantages` | string \| null | Texte libre |
| `profil_recherche` | string \| null | Texte libre |
| `date_debut` | string (ISO date) \| null | `"2026-09-01"` |
| `contact_email` | string | Email de contact (souvent un alias de tracking, ex : `medijob_1612-14_source@myt4s.com`) |
| `publiee` | boolean | `true` si visible en ligne |
| `mise_en_avant` | boolean | `true` = offre "featured" |
| `source_crm_id` | string | ID de référence dans le CRM amont (ex : `"1612-14"`) — sert de clé pivot |
| `created_at` | string (ISO datetime) | `"2026-06-15T14:03:41.392315+00:00"` |
| `updated_at` | string (ISO datetime) | |

---

## 4. Endpoints de lecture (publics, sans auth)

### 4.1 Liste paginée

```
GET /api/offres?page=1&limit=20
```

**Query params** :

| Param | Type | Défaut | Description |
|---|---|---|---|
| `page` | number | `1` | Numéro de page (1-indexed) |
| `limit` | number | `20` | Nombre d'offres par page |
| `type_contrat` | string | — | Filtre exact (ex : `CDI`). ✅ **Confirmé** (68 résultats sur `CDI`) |
| `ville` | string | — | Filtre par ville. ✅ **Confirmé** (4 résultats sur `Nice`) |
| `departement` | string | — | Filtre par département (2 chiffres) |
| `metier` | string | — | Filtre par métier (utiliser le libellé exact du champ `metier`) |

⚠️ Les paramètres `search`, `q`, `publiee` semblent **ignorés** par l'API (retournent le total complet). Si ton dev a besoin d'une recherche plein texte ou d'un filtre sur `publiee`, il devra demander à l'équipe du site.

**Réponse** :

```json
{
  "offres": [ /* tableau d'objets Offre */ ],
  "total": 98,
  "page": 1,
  "totalPages": 5
}
```

### 4.2 Détail d'une offre par ID

```
GET /api/offres/{id}
```

`{id}` est l'UUID de l'offre. Retourne un objet `Offre` complet.

> Le lookup par `slug` **ne fonctionne pas** sur cet endpoint (retourne une erreur). Si ton outil ne connaît que le slug, il doit d'abord retrouver l'UUID via la liste paginée.

---

## 5. Endpoints d'écriture (protégés)

Détectés lors du sondage :

| Méthode | Endpoint | Statut observé sans token |
|---|---|---|
| `POST` | `/api/offres` | `401 Unauthorized` |

Un `POST /api/offres` sans header d'authentification renvoie `401` — l'endpoint **existe** et attend un token. Le format exact du header d'auth et le schéma du body ne sont pas publics ; il faut les demander à l'équipe qui maintient le site.

**Questions précises à poser à l'équipe du site `medijob-offres.netlify.app`** :

1. Quel header d'authentification l'endpoint `POST /api/offres` attend-il ? (`Authorization: Bearer …`, `x-api-key`, autre ?)
2. Comment obtenir un token pour un outil tiers ?
3. Le body attendu est-il exactement le schéma de l'objet `Offre` (§3), ou une variante ?
4. Existe-t-il également des endpoints `PUT /api/offres/{id}` et `DELETE /api/offres/{id}` pour mise à jour / suppression ?
5. Existe-t-il un environnement de recette (staging) pour tester l'intégration ?
6. Y a-t-il un webhook sortant à la création/mise à jour d'une offre, auquel l'outil pourrait s'abonner ?

---

## 6. Deux stratégies d'intégration possibles

Le champ `source_crm_id` montre que **les offres du site sont poussées depuis un CRM amont** (l'app Medijob interne, sur Base44). Ton développeur a donc **deux points d'entrée possibles** — il faut choisir avec l'équipe technique lequel est le plus propre.

### Option A — Écrire dans le CRM Medijob (Base44) 🟢 recommandé

L'outil externe pousse les offres dans l'app Medijob (Base44), qui les synchronise ensuite vers le site public via son mécanisme interne.

- ✅ Une seule source de vérité, pas de désynchronisation possible
- ✅ Les offres passent par la validation Medijob (statut `brouillon` → `publiee`)
- ⚠️ Nécessite un `APP_ID` et un token Base44 (à demander à Mathieu)
- Doc dédiée : voir *"API JobOffer Medijob (Base44)"* déjà transmise

### Option B — Écrire directement dans l'API du site Netlify

L'outil externe pousse les offres directement dans `POST /api/offres` du site public.

- ✅ Pas de dépendance à Base44
- ⚠️ Contourne le CRM : les offres peuvent être écrasées à la prochaine synchro depuis le CRM si un mécanisme de sync inverse existe
- ⚠️ Nécessite obtenir un token API auprès de l'équipe qui maintient le site
- ⚠️ Format du body à confirmer

---

## 7. Exemples de lecture (fonctionnent immédiatement, sans auth)

### 7.1 cURL — Récupérer 5 offres CDI

```bash
curl "https://medijob-offres.netlify.app/api/offres?type_contrat=CDI&limit=5"
```

### 7.2 cURL — Détail d'une offre

```bash
curl "https://medijob-offres.netlify.app/api/offres/9777eb04-cf59-4235-9fcd-b5d5f050d992"
```

### 7.3 JavaScript

```js
// Liste paginée
const res = await fetch(
  "https://medijob-offres.netlify.app/api/offres?page=1&limit=20&type_contrat=CDI"
);
const { offres, total, page, totalPages } = await res.json();

// Détail par UUID
const detail = await fetch(
  `https://medijob-offres.netlify.app/api/offres/${offres[0].id}`
).then((r) => r.json());
```

---

## 8. Codes HTTP observés

| Code | Signification |
|---|---|
| `200` | OK (lecture) |
| `401` | Auth requise (endpoints d'écriture) |
| `404` | Route inexistante |

---

## 9. Ce qu'il faut demander avant de démarrer

À rassembler avant que le développeur ne commence à coder :

1. **Décision** : Option A (Base44) ou Option B (API du site) — voir §6
2. Si Option A → `APP_ID` Base44 + token API (voir la doc *"API JobOffer Medijob (Base44)"*)
3. Si Option B → token API du site + confirmation du header d'auth attendu + schéma du body pour `POST /api/offres`
4. Existence d'un environnement de recette
5. SLA / rate limit acceptable pour les écritures automatisées

---

*Contact côté Medijob : mathieu.mouysset@medijob.fr*
