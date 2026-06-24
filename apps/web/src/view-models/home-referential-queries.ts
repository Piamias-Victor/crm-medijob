import type { HomeQuickCreateKind } from '@/view-models/home-referentials'

export function referentialQueriesFor(kind: HomeQuickCreateKind | null): {
  mission: boolean
  pharmacy: boolean
} {
  if (!kind) return { mission: false, pharmacy: false }
  if (kind === 'pharmacy') return { mission: false, pharmacy: true }
  return { mission: true, pharmacy: false }
}
