import { facturationMonthKey } from '@/view-models/facturation-month-key'
import type { Objectif } from '@/view-models/objectif'
import type { PilotageContribution, PilotagePole } from '@/view-models/facturation-pilotage-union'

export type PilotagePoleMonth = { month: string; ca: number; marge: number }

export type PilotagePoleSeries = {
  annualCa: number
  annualMarge: number
  months: PilotagePoleMonth[]
}

export type PilotagePolesMonthly = {
  caPlacement: number
  margePlacement: number
  caInterim: number
  margeInterim: number
}

export type PilotagePoles = {
  placement: PilotagePoleSeries
  interim: PilotagePoleSeries
  monthly: PilotagePolesMonthly
}

const EMPTY_SERIES: PilotagePoleSeries = { annualCa: 0, annualMarge: 0, months: [] }

export const EMPTY_PILOTAGE_POLES: PilotagePoles = {
  placement: EMPTY_SERIES,
  interim: EMPTY_SERIES,
  monthly: { caPlacement: 0, margePlacement: 0, caInterim: 0, margeInterim: 0 },
}

function emptyMonths(months: string[]): PilotagePoleMonth[] {
  return months.map((month) => ({ month, ca: 0, marge: 0 }))
}

function seriesFor(items: PilotageContribution[], pole: PilotagePole, months: string[]): PilotagePoleSeries {
  const buckets = emptyMonths(months)
  const index = new Map(buckets.map((row, i) => [row.month, i]))
  let annualCa = 0
  let annualMarge = 0
  for (const item of items) {
    if (item.cancelled || item.pole !== pole) continue
    annualCa += item.ca
    annualMarge += item.marge
    const at = index.get(facturationMonthKey(item.occurredAt))
    if (at == null) continue
    const bucket = buckets[at]
    if (!bucket) continue
    bucket.ca += item.ca
    bucket.marge += item.marge
  }
  return { annualCa, annualMarge, months: buckets }
}

export function buildPilotagePoles(
  items: PilotageContribution[],
  months: string[],
  objectif: Objectif,
): PilotagePoles {
  return {
    placement: seriesFor(items, 'placement', months),
    interim: seriesFor(items, 'interim', months),
    monthly: {
      caPlacement: objectif.monthlyCaPlacement,
      margePlacement: objectif.monthlyMargePlacement,
      caInterim: objectif.monthlyCaInterim,
      margeInterim: objectif.monthlyMargeInterim,
    },
  }
}
