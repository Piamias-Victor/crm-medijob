type PageListing = { content?: unknown[]; totalPages?: number }

export async function searchPages<T>(
  fetchFn: typeof fetch,
  url: string,
  token: string,
  pageSize: number,
  failLabel: string,
  mapItem: (raw: unknown) => T | null,
): Promise<T[]> {
  const rows: T[] = []
  for (let pageNumber = 0; pageNumber < 50; pageNumber++) {
    const res = await fetchFn(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        security_token: token,
      },
      body: JSON.stringify({
        order: { descending: true, parameter: 'CREATION_DATE' },
        page: { pageNumber, pageSize },
      }),
    })
    if (!res.ok) throw new Error(`${failLabel} failed (${res.status})`)
    const body = (await res.json()) as PageListing
    const chunk = body.content ?? []
    for (const raw of chunk) {
      const mapped = mapItem(raw)
      if (mapped) rows.push(mapped)
    }
    if (pageNumber + 1 >= (body.totalPages ?? 1) || chunk.length === 0) break
  }
  return rows
}
