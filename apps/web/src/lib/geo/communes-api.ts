const COMMUNES_BASE = 'https://geo.api.gouv.fr/communes'

export async function fetchCommunes(
  params: Record<string, string>,
  fetchFn: typeof fetch = fetch,
): Promise<unknown[]> {
  const query = new URLSearchParams({ ...params, limit: '5' })
  const res = await fetchFn(`${COMMUNES_BASE}?${query}`)
  if (!res.ok) return []
  const data: unknown = await res.json()
  return Array.isArray(data) ? data : []
}
