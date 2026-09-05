type PageListing = { content?: unknown[]; totalPages?: number }

export type SearchPagesInput<T> = {
  fetchFn: typeof fetch
  url: string
  token: string
  pageSize: number
  orderParameter: string
  failLabel: string
  mapItem: (raw: unknown) => T | null
}

export async function searchPages<T>(input: SearchPagesInput<T>): Promise<T[]> {
  const rows: T[] = []
  for (let pageNumber = 0; pageNumber < 50; pageNumber++) {
    const res = await input.fetchFn(input.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        security_token: input.token,
      },
      body: JSON.stringify({
        order: { descending: true, parameter: input.orderParameter },
        page: { pageNumber, pageSize: input.pageSize },
      }),
    })
    if (!res.ok) throw new Error(`${input.failLabel} failed (${res.status})`)
    const body = (await res.json()) as PageListing
    const chunk = body.content ?? []
    for (const raw of chunk) {
      const mapped = input.mapItem(raw)
      if (mapped) rows.push(mapped)
    }
    if (pageNumber + 1 >= (body.totalPages ?? 1) || chunk.length === 0) break
  }
  return rows
}
