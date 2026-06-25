import { fetchCommunes } from '@/lib/geo/communes-api'

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
