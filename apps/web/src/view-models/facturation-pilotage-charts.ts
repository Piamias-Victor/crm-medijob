import { annualFromMonthly, type Objectif } from '@/view-models/objectif'
import { facturationMonthLabelFromKey } from '@/view-models/facturation-month-key'
import type { PilotagePoles } from '@/view-models/facturation-pilotage-poles'

export type PilotageCaPoint = {
  month: string
  label: string
  placementCa: number
  interimCa: number
  objectif: number
  cumul: number
}

export type PilotageMargePoint = {
  month: string
  label: string
  marge: number
  seuil: number
  cumul: number
  cumulSeuil: number
}

export type PilotageCharts = {
  ca: PilotageCaPoint[]
  marge: PilotageMargePoint[]
}

export const EMPTY_PILOTAGE_CHARTS: PilotageCharts = { ca: [], marge: [] }

export function buildPilotageCharts(
  poles: PilotagePoles,
  months: string[],
  objectif: Objectif,
): PilotageCharts {
  const monthlyCaObjectif = objectif.monthlyCaPlacement + objectif.monthlyCaInterim
  const seuil = objectif.monthlyRentabilityThreshold
  const cumulSeuil = annualFromMonthly(seuil)
  let cumulCa = 0
  let cumulMarge = 0
  const ca: PilotageCaPoint[] = []
  const marge: PilotageMargePoint[] = []
  months.forEach((month, index) => {
    const placement = poles.placement.months[index]
    const interim = poles.interim.months[index]
    const placementCa = placement?.ca ?? 0
    const interimCa = interim?.ca ?? 0
    const monthMarge = (placement?.marge ?? 0) + (interim?.marge ?? 0)
    cumulCa += placementCa + interimCa
    cumulMarge += monthMarge
    const label = facturationMonthLabelFromKey(month)
    ca.push({ month, label, placementCa, interimCa, objectif: monthlyCaObjectif, cumul: cumulCa })
    marge.push({ month, label, marge: monthMarge, seuil, cumul: cumulMarge, cumulSeuil })
  })
  return { ca, marge }
}
