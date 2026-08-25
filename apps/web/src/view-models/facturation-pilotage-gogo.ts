import { facturationMonthKey, facturationMonthLabelFromKey } from '@/view-models/facturation-month-key'
import { goNoGoExtremes } from '@/view-models/facturation-pilotage-gogo-extremes'
import { isNoGo } from '@/view-models/facturation-pilotage-nogo'
import type { PilotageContribution } from '@/view-models/facturation-pilotage-union'

export type PilotageGoNoGoMonth = {
  month: string
  label: string
  cdiOk: number
  cdiNogo: number
  cddOk: number
  cddNogo: number
  mixPct: number
  billedCa: number
}

export type PilotageGoNoGo = {
  months: PilotageGoNoGoMonth[]
  topNogo: { month: string; label: string; nogo: number }[]
  fullConversion: { month: string; label: string }[]
}

export const EMPTY_PILOTAGE_GOGO: PilotageGoNoGo = {
  months: [],
  topNogo: [],
  fullConversion: [],
}

function emptyRow(month: string): PilotageGoNoGoMonth {
  return {
    month,
    label: facturationMonthLabelFromKey(month),
    cdiOk: 0,
    cdiNogo: 0,
    cddOk: 0,
    cddNogo: 0,
    mixPct: 0,
    billedCa: 0,
  }
}

function mixPct(row: PilotageGoNoGoMonth) {
  const engaged = row.cdiOk + row.cdiNogo + row.cddOk + row.cddNogo
  const ok = row.cdiOk + row.cddOk
  return engaged === 0 ? 0 : Math.round((ok / engaged) * 1000) / 10
}

function bump(row: PilotageGoNoGoMonth, item: PilotageContribution) {
  const nogo = isNoGo(item)
  if (item.placementType === 'CDI') {
    if (nogo) row.cdiNogo += 1
    else {
      row.cdiOk += 1
      row.billedCa += item.ca
    }
    return
  }
  if (item.placementType !== 'CDD') return
  if (nogo) row.cddNogo += 1
  else {
    row.cddOk += 1
    row.billedCa += item.ca
  }
}

export function buildPilotageGoNoGo(
  items: PilotageContribution[],
  months: string[],
): PilotageGoNoGo {
  const rows = months.map(emptyRow)
  const index = new Map(rows.map((row, i) => [row.month, i]))
  for (const item of items) {
    if (item.pole !== 'placement') continue
    const at = index.get(facturationMonthKey(item.occurredAt))
    if (at == null) continue
    const row = rows[at]
    if (row) bump(row, item)
  }
  for (const row of rows) row.mixPct = mixPct(row)
  return { months: rows, ...goNoGoExtremes(rows) }
}
