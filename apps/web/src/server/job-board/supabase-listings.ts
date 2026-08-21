import type { BoardListing, JobBoardListingsPort } from '@/server/job-board/port'

export type JobsBoardConfig = { url: string; secret: string }

type FetchFn = typeof fetch

function restUrl(config: JobsBoardConfig, path: string) {
  return `${config.url.replace(/\/$/, '')}/rest/v1/${path}`
}

function headers(secret: string): Record<string, string> {
  return {
    apikey: secret,
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
}

function offresBody(listing: BoardListing) {
  return {
    titre: listing.titre,
    metier: listing.metier,
    description: listing.description,
    entreprise: listing.entreprise,
    ville: listing.ville,
    code_postal: listing.code_postal ?? null,
    departement: listing.departement ?? null,
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    type_contrat: listing.type_contrat,
    temps_travail: listing.temps_travail,
    salaire_min: listing.salaire_min ?? null,
    salaire_max: listing.salaire_max ?? null,
    avantages: listing.avantages ?? null,
    profil_recherche: listing.profil_recherche ?? null,
    date_debut: listing.date_debut ?? null,
    contact_email: listing.contact_email,
    publiee: listing.publiee,
    mise_en_avant: listing.mise_en_avant,
    ...(listing.slug ? { slug: listing.slug } : {}),
  }
}

async function parseError(res: Response) {
  throw new Error(`Job board ${res.status}: ${await res.text()}`)
}

export function createSupabaseListingsPort(
  config: JobsBoardConfig,
  fetchFn: FetchFn = fetch,
): JobBoardListingsPort {
  const offres = restUrl(config, 'offres')
  const auth = headers(config.secret)

  return {
    async upsert(listing) {
      if (listing.id) {
        const res = await fetchFn(`${offres}?id=eq.${listing.id}`, {
          method: 'PATCH',
          headers: auth,
          body: JSON.stringify(offresBody(listing)),
        })
        if (!res.ok) await parseError(res)
        return { id: listing.id }
      }
      const res = await fetchFn(offres, {
        method: 'POST',
        headers: auth,
        body: JSON.stringify(offresBody(listing)),
      })
      if (!res.ok) await parseError(res)
      const rows = (await res.json()) as { id: string }[]
      const id = rows[0]?.id
      if (!id) throw new Error('Job board insert returned no id')
      return { id }
    },
    async setPubliee(id, publiee) {
      const res = await fetchFn(`${offres}?id=eq.${id}`, {
        method: 'PATCH',
        headers: auth,
        body: JSON.stringify({ publiee }),
      })
      if (!res.ok) await parseError(res)
    },
  }
}
