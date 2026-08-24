import { aggregatePilotage } from '@/view-models/facturation-pilotage-aggregate'
import { filterPilotageContributions } from '@/view-models/facturation-pilotage-filter'
import type { PilotageFilters } from '@/view-models/facturation-pilotage-filters.schema'
import { collectPilotageContributions } from '@/view-models/facturation-pilotage-union'
import { buildPilotageGauge, EMPTY_PILOTAGE_GAUGE } from '@/view-models/facturation-pilotage-gauge'
import type { PilotageGauge } from '@/view-models/facturation-pilotage-gauge'
import { buildPilotagePoles, EMPTY_PILOTAGE_POLES } from '@/view-models/facturation-pilotage-poles'
import type { PilotagePoles } from '@/view-models/facturation-pilotage-poles'
import { buildPilotageCharts, EMPTY_PILOTAGE_CHARTS } from '@/view-models/facturation-pilotage-charts'
import type { PilotageCharts } from '@/view-models/facturation-pilotage-charts'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import { DEFAULT_OBJECTIF, type Objectif } from '@/view-models/objectif'

export type { PilotageGauge, PilotagePoles, PilotageCharts }

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
  gauge: PilotageGauge
  poles: PilotagePoles
  charts: PilotageCharts
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
  gauge: EMPTY_PILOTAGE_GAUGE,
  poles: EMPTY_PILOTAGE_POLES,
  charts: EMPTY_PILOTAGE_CHARTS,
}

export function buildPilotage(
  lines: FinanceLineRecord[],
  missions: FacturationMissionRecord[],
  filters: PilotageFilters = {},
  now = new Date(),
  objectif: Objectif = DEFAULT_OBJECTIF,
): Pilotage {
  const collected = collectPilotageContributions(lines, missions)
  const { items, months } = filterPilotageContributions(collected, filters, now)
  const poles = buildPilotagePoles(items, months, objectif)
  return {
    ...aggregatePilotage(items, months),
    gauge: buildPilotageGauge(items, objectif),
    poles,
    charts: buildPilotageCharts(poles, months, objectif),
  }
}
