/** In-memory search on bounded DB pool — not full-text SQL (see issue #79). */
export function filterSearchPool<T>(
  rows: T[],
  term: string,
  matches: (row: T, term: string) => boolean,
  limit: number,
): T[] {
  const trimmed = term.trim()
  if (!trimmed) return []
  return rows.filter((row) => matches(row, trimmed)).slice(0, limit)
}
