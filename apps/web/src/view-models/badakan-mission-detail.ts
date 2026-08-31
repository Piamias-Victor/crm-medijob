import { badakanMissionPeriodLabel, type PeriodLike } from './badakan-mission-periods'
import { badakanMissionStepLabel } from './badakan-mission-step'

export type SearchAppliedSource = {
  recipientId: string
  firstName: string
  lastName: string
  phone: string | null
}

export type BadakanMissionDetailSource = {
  id: string
  pharmacyName: string
  step: string
  periods: PeriodLike[]
  searchApplied: SearchAppliedSource[]
}

export type SearchAppliedItem = {
  recipientId: string
  fullName: string
  phone: string | null
  telHref: string | null
}

export type BadakanMissionDetail = {
  id: string
  pharmacyName: string
  stepLabel: string
  periodLabel: string
  sectionTitle: 'Postulés SEARCH_APPLIED'
  fields: Array<{ label: string; value: string }>
  searchApplied: SearchAppliedItem[]
}

function toApplied(row: SearchAppliedSource): SearchAppliedItem {
  return {
    recipientId: row.recipientId,
    fullName: `${row.firstName} ${row.lastName}`.trim(),
    phone: row.phone,
    telHref: row.phone ? `tel:${row.phone}` : null,
  }
}

export function toBadakanMissionDetail(
  row: BadakanMissionDetailSource,
): BadakanMissionDetail {
  return {
    id: row.id,
    pharmacyName: row.pharmacyName,
    stepLabel: badakanMissionStepLabel(row.step),
    periodLabel: badakanMissionPeriodLabel(row.periods),
    sectionTitle: 'Postulés SEARCH_APPLIED',
    fields: [
      { label: 'Étape', value: badakanMissionStepLabel(row.step) },
      { label: 'Périodes', value: badakanMissionPeriodLabel(row.periods) },
    ],
    searchApplied: row.searchApplied.map(toApplied),
  }
}
