export function toggleSelectedId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]
}
