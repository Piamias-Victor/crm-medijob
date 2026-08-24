import { facturationMonthKey } from '@/view-models/facturation-month-key'
import type { PilotageContribution } from '@/view-models/facturation-pilotage-union'

export const PILOTAGE_UNASSIGNED_REFERENT = '— Non attribué —'

export type PilotageMatrixRow = {
  referentId: string | null
  referentName: string
  total: number
  values: number[]
}

export type PilotageMatrix = {
  months: string[]
  rows: PilotageMatrixRow[]
  total: number
}

export const EMPTY_PILOTAGE_MATRIX: PilotageMatrix = { months: [], rows: [], total: 0 }

function emptyRow(item: PilotageContribution, months: string[]): PilotageMatrixRow {
  return {
    referentId: item.referentId,
    referentName: item.referentName ?? PILOTAGE_UNASSIGNED_REFERENT,
    total: 0,
    values: months.map(() => 0),
  }
}

function compareRows(a: PilotageMatrixRow, b: PilotageMatrixRow) {
  if (a.referentId == null) return 1
  if (b.referentId == null) return -1
  return a.referentName.localeCompare(b.referentName, 'fr')
}

export function buildPilotageMatrix(
  items: PilotageContribution[],
  months: string[],
): PilotageMatrix {
  const monthIndex = new Map(months.map((month, i) => [month, i]))
  const byRef = new Map<string, PilotageMatrixRow>()
  let total = 0
  for (const item of items) {
    if (item.cancelled) continue
    total += item.ca
    const key = item.referentId ?? ''
    const row = byRef.get(key) ?? emptyRow(item, months)
    byRef.set(key, row)
    row.total += item.ca
    const at = monthIndex.get(facturationMonthKey(item.occurredAt))
    if (at != null) row.values[at] = (row.values[at] ?? 0) + item.ca
  }
  return { months, rows: [...byRef.values()].sort(compareRows), total }
}
