const BASE = 'https://geo.api.gouv.fr/communes'

async function fetchCommunes(params: Record<string, string>): Promise<unknown[]> {
  const query = new URLSearchParams({ ...params, limit: '5' })
  const res = await fetch(`${BASE}?${query}`)
  if (!res.ok) return []
  const data: unknown = await res.json()
  return Array.isArray(data) ? data : []
}

export async function lookupCityByPostalCode(postalCode: string): Promise<string | null> {
  const code = postalCode.trim()
  if (!/^\d{5}$/.test(code)) return null
  const rows = (await fetchCommunes({ codePostal: code, fields: 'nom' })) as { nom?: string }[]
  return rows[0]?.nom?.trim() ?? null
}

export async function lookupPostalCodeByCity(city: string): Promise<string | null> {
  const name = city.trim()
  if (name.length < 2) return null
  const rows = (await fetchCommunes({ nom: name, fields: 'codesPostaux' })) as {
    codesPostaux?: string[]
  }[]
  return rows[0]?.codesPostaux?.[0] ?? null
}
