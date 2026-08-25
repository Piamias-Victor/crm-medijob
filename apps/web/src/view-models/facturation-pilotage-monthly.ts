import { facturationMonthKey, facturationMonthLabelFromKey } from '@/view-models/facturation-month-key'
import type { PilotageContribution, PilotagePole } from '@/view-models/facturation-pilotage-union'

export type PilotageMonthLine = {
  id: string
  pharmacyName: string
  candidateName: string
  pole: PilotagePole
  ca: number
  marge: number
}

export type PilotageMonthlyRow = {
  month: string
  label: string
  placements: number
  interim: number
  caPlacement: number
  caInterim: number
  ca: number
  marge: number
  lines: PilotageMonthLine[]
}

export const EMPTY_PILOTAGE_MONTHLY: PilotageMonthlyRow[] = []

function emptyRow(month: string): PilotageMonthlyRow {
  return {
    month,
    label: facturationMonthLabelFromKey(month),
    placements: 0,
    interim: 0,
    caPlacement: 0,
    caInterim: 0,
    ca: 0,
    marge: 0,
    lines: [],
  }
}

function toLine(item: PilotageContribution): PilotageMonthLine {
  return {
    id: item.id,
    pharmacyName: item.pharmacyName,
    candidateName: item.candidateName,
    pole: item.pole,
    ca: item.ca,
    marge: item.marge,
  }
}

function bump(row: PilotageMonthlyRow, item: PilotageContribution) {
  row.lines.push(toLine(item))
  if (item.cancelled) return
  if (item.pole === 'placement') {
    row.placements += 1
    row.caPlacement += item.ca
  } else {
    row.interim += 1
    row.caInterim += item.ca
  }
  row.ca += item.ca
  row.marge += item.marge
}

export function buildPilotageMonthly(
  items: PilotageContribution[],
  months: string[],
): PilotageMonthlyRow[] {
  const rows = months.map(emptyRow)
  const index = new Map(rows.map((row, i) => [row.month, i]))
  for (const item of items) {
    const at = index.get(facturationMonthKey(item.occurredAt))
    if (at == null) continue
    const row = rows[at]
    if (row) bump(row, item)
  }
  return rows
}
