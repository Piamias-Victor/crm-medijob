import type { RefItem } from '@/view-models/referential'

export function labelForId(items: RefItem[], id: string) {
  return items.find((item) => item.id === id)?.name ?? '—'
}

export function labelList(items: RefItem[], ids: string[]) {
  if (!ids.length) return '—'
  return ids.map((id) => labelForId(items, id)).join(', ')
}
