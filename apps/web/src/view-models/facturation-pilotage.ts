import { aggregatePilotage } from '@/view-models/facturation-pilotage-aggregate'
import { filterPilotageContributions } from '@/view-models/facturation-pilotage-filter'
import type { PilotageFilters } from '@/view-models/facturation-pilotage-filters.schema'
import { collectPilotageContributions } from '@/view-models/facturation-pilotage-union'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'
import type { FinanceLineRecord } from '@/view-models/finance-line'

export type PilotageKpis = {
  ca: number
  caPlacement: number
  caInterim: number
  marge: number
  margePct: number
  placementsActifs: number
  pharmaciesActives: number
}

export type PilotageCancelled = {
  count: number
  ca: number
  marge: number
}

export type Pilotage = {
  kpis: PilotageKpis
  cancelled: PilotageCancelled
  months: string[]
}

export const EMPTY_PILOTAGE: Pilotage = {
  kpis: {
    ca: 0,
    caPlacement: 0,
    caInterim: 0,
    marge: 0,
    margePct: 0,
    placementsActifs: 0,
    pharmaciesActives: 0,
  },
  cancelled: { count: 0, ca: 0, marge: 0 },
  months: [],
}

export function buildPilotage(
  lines: FinanceLineRecord[],
  missions: FacturationMissionRecord[],
  filters: PilotageFilters = {},
  now = new Date(),
): Pilotage {
  const collected = collectPilotageContributions(lines, missions)
  const { items, months } = filterPilotageContributions(collected, filters, now)
  return aggregatePilotage(items, months)
}
