// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { searchSiret } from '@/server/services/siret'

const apiResponse = {
  results: [
    {
      nom_complet: 'PHARMACIE DU CENTRE',
      siege: {
        siret: '12345678900012',
        adresse: '10 RUE DE LA PAIX',
        code_postal: '75002',
        libelle_commune: 'PARIS',
      },
    },
  ],
}

function fakeFetch(body: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    json: async () => body,
  }) as unknown as typeof fetch
}

describe('searchSiret', () => {
  it('maps gouv API results to SiretResult[]', async () => {
    const results = await searchSiret('pharmacie', fakeFetch(apiResponse))

    expect(results).toEqual([
      {
        siret: '12345678900012',
        name: 'PHARMACIE DU CENTRE',
        address: '10 RUE DE LA PAIX',
        city: 'PARIS',
        postalCode: '75002',
      },
    ])
  })

  it('queries the recherche-entreprises endpoint with the encoded term', async () => {
    const fetcher = fakeFetch(apiResponse)
    await searchSiret('du centre', fetcher)

    expect(fetcher).toHaveBeenCalledWith(
      expect.stringContaining('recherche-entreprises.api.gouv.fr/search?q=du%20centre'),
    )
  })

  it('returns an empty list when the API has no results', async () => {
    expect(await searchSiret('zzz', fakeFetch({ results: [] }))).toEqual([])
  })

  it('throws when the API responds with an error status', async () => {
    await expect(searchSiret('x', fakeFetch({}, false))).rejects.toThrow()
  })
})
