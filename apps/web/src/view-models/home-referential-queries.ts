import type { HomeQuickCreateKind } from '@/view-models/home-referentials'

export function referentialQueriesFor(kind: HomeQuickCreateKind | null): {
  mission: boolean
} {
  if (!kind) return { mission: false }
  return { mission: true }
}
