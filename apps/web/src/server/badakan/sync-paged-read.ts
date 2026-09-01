export type SyncPagedReadDeps<T> = {
  search: () => Promise<T[]>
  upsertFromRead: (row: T) => Promise<unknown>
}

export async function syncPagedRead<T>(deps: SyncPagedReadDeps<T>) {
  const rows = await deps.search()
  for (const row of rows) {
    await deps.upsertFromRead(row)
  }
  return { fetched: rows.length, upserted: rows.length }
}
