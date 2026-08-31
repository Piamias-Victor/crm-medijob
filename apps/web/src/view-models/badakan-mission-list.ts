import { badakanMissionPeriodLabel, type PeriodLike } from './badakan-mission-periods'
import { badakanMissionStepLabel } from './badakan-mission-step'

export type BadakanMissionListSource = {
  id: string
  pharmacyName: string
  step: string
  periods: PeriodLike[]
}

export type BadakanMissionListItem = {
  id: string
  pharmacyName: string
  step: string
  stepLabel: string
  periodLabel: string
  href: string
}

export function toBadakanMissionListItem(
  row: BadakanMissionListSource,
): BadakanMissionListItem {
  return {
    id: row.id,
    pharmacyName: row.pharmacyName,
    step: row.step,
    stepLabel: badakanMissionStepLabel(row.step),
    periodLabel: badakanMissionPeriodLabel(row.periods),
    href: `/interim/missions/${row.id}`,
  }
}

export function toBadakanMissionListItems(rows: BadakanMissionListSource[]) {
  return rows.map(toBadakanMissionListItem)
}
