import { annualFromMonthly, type Objectif } from '@/view-models/objectif'
import { projectNoGo } from '@/view-models/facturation-pilotage-nogo'
import type { PilotageContribution } from '@/view-models/facturation-pilotage-union'

export type PilotageGauge = {
  billedCa: number
  lostCa: number
  cap: number
  realisePct: number
  potentielPct: number
  nogoCount: number
  resteAFaire: number
}

function pct(part: number, whole: number) {
  return whole === 0 ? 0 : Math.round((part / whole) * 1000) / 10
}

export const EMPTY_PILOTAGE_GAUGE: PilotageGauge = {
  billedCa: 0,
  lostCa: 0,
  cap: 0,
  realisePct: 0,
  potentielPct: 0,
  nogoCount: 0,
  resteAFaire: 0,
}

export function buildPilotageGauge(
  items: PilotageContribution[],
  objectif: Objectif,
): PilotageGauge {
  const cap = annualFromMonthly(objectif.monthlyCaPlacement)
  const { billedCa, nogoCount, lostCa } = projectNoGo(items)
  return {
    billedCa,
    lostCa,
    cap,
    realisePct: pct(billedCa, cap),
    potentielPct: pct(billedCa + lostCa, cap),
    nogoCount,
    resteAFaire: Math.max(0, cap - billedCa),
  }
}
