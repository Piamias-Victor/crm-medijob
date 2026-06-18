import { z } from 'zod'

// Enrichissement SIRET via l'API publique Sirene (SPEC_V2 §8).
const API_URL = 'https://recherche-entreprises.api.gouv.fr/search'

const siegeSchema = z
  .object({
    siret: z.string().optional(),
    adresse: z.string().optional(),
    code_postal: z.string().optional(),
    libelle_commune: z.string().optional(),
  })
  .optional()

const apiSchema = z.object({
  results: z
    .array(z.object({ nom_complet: z.string().optional(), siege: siegeSchema }))
    .default([]),
})

export const siretResultSchema = z.object({
  siret: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
})

export type SiretResult = z.infer<typeof siretResultSchema>

export async function searchSiret(
  query: string,
  fetcher: typeof fetch = fetch,
): Promise<SiretResult[]> {
  const res = await fetcher(`${API_URL}?q=${encodeURIComponent(query)}&per_page=5`)
  if (!res.ok) throw new Error(`SIRET lookup failed (${res.status})`)

  const { results } = apiSchema.parse(await res.json())
  return results
    .filter((r) => r.siege?.siret)
    .map((r) => ({
      siret: r.siege?.siret ?? '',
      name: r.nom_complet ?? '',
      address: r.siege?.adresse ?? '',
      city: r.siege?.libelle_commune ?? '',
      postalCode: r.siege?.code_postal ?? '',
    }))
}
