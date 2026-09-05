import { badakanMissionPeriodLabel, type PeriodLike } from './badakan-mission-periods'
import { badakanMissionStepLabel } from './badakan-mission-step'
import { staffingGapLabel } from './badakan-need'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'

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
  city: string | null
  activityLabel: string | null
  jobTitleId: string | null
  jobTitleName: string | null
  softwareName: string | null
  expectedRecipients: number
  staffedRecipients: number
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
  sectionTitle: 'Candidats ayant postulé'
  fields: Array<{ label: string; value: string }>
  searchApplied: SearchAppliedItem[]
  matching: {
    canMatch: boolean
    jobTitleName: string
    pharmacyName: string
  }
}

function toApplied(row: SearchAppliedSource): SearchAppliedItem {
  return {
    recipientId: row.recipientId,
    fullName: `${row.firstName} ${row.lastName}`.trim(),
    phone: row.phone,
    telHref: row.phone ? `tel:${row.phone}` : null,
  }
}

export function toBadakanMissionDetail(row: BadakanMissionDetailSource): BadakanMissionDetail {
  const jobTitleName = row.jobTitleName ?? row.activityLabel ?? TABLE_EMPTY_CELL
  return {
    id: row.id,
    pharmacyName: row.pharmacyName,
    stepLabel: badakanMissionStepLabel(row.step),
    periodLabel: badakanMissionPeriodLabel(row.periods),
    sectionTitle: 'Candidats ayant postulé',
    fields: [
      { label: 'Étape', value: badakanMissionStepLabel(row.step) },
      { label: 'Périodes', value: badakanMissionPeriodLabel(row.periods) },
      { label: 'Métier', value: jobTitleName },
      { label: 'Ville', value: row.city?.trim() || TABLE_EMPTY_CELL },
      { label: 'LGO', value: row.softwareName ?? TABLE_EMPTY_CELL },
      { label: 'Staffing', value: staffingGapLabel(row) },
    ],
    searchApplied: row.searchApplied.map(toApplied),
    matching: {
      canMatch: Boolean(row.jobTitleId),
      jobTitleName,
      pharmacyName: row.pharmacyName,
    },
  }
}
