import { aggregatePilotage } from '@/view-models/facturation-pilotage-aggregate'
import { filterPilotageContributions } from '@/view-models/facturation-pilotage-filter'
import type { PilotageFilters } from '@/view-models/facturation-pilotage-filters.schema'
import { collectPilotageContributions } from '@/view-models/facturation-pilotage-union'
import { buildPilotageGauge, type PilotageGauge } from '@/view-models/facturation-pilotage-gauge'
import { buildPilotagePoles, type PilotagePoles } from '@/view-models/facturation-pilotage-poles'
import { buildPilotageCharts, type PilotageCharts } from '@/view-models/facturation-pilotage-charts'
import { buildPilotageConversion, type PilotageConversion } from '@/view-models/facturation-pilotage-conversion'
import { buildPilotageGoNoGo, type PilotageGoNoGo } from '@/view-models/facturation-pilotage-gogo'
import { buildPilotageMonthly, type PilotageMonthlyRow } from '@/view-models/facturation-pilotage-monthly'
import { buildPilotageMatrix, type PilotageMatrix } from '@/view-models/facturation-pilotage-matrix'
import type { FacturationMissionRecord } from '@/view-models/facturation-suivi'
import type { FinanceLineRecord } from '@/view-models/finance-line'
import { DEFAULT_OBJECTIF, type Objectif } from '@/view-models/objectif'

export { EMPTY_PILOTAGE } from '@/view-models/facturation-pilotage-empty'
export type {
  PilotageGauge,
  PilotagePoles,
  PilotageCharts,
  PilotageConversion,
  PilotageGoNoGo,
  PilotageMonthlyRow,
  PilotageMatrix,
}

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
  conversion: PilotageConversion
  goNoGo: PilotageGoNoGo
  monthly: PilotageMonthlyRow[]
  matrix: PilotageMatrix
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
    conversion: buildPilotageConversion(items),
    goNoGo: buildPilotageGoNoGo(items, months),
    monthly: buildPilotageMonthly(items, months),
    matrix: buildPilotageMatrix(items, months),
  }
}
