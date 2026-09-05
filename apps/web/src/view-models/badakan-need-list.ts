import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { BadakanProposalStatus } from '@prisma/client'
import {
  badakanMissionPeriodLabel,
  parseBadakanMissionPeriods,
  type PeriodLike,
} from './badakan-mission-periods'
import { badakanMissionStepLabel } from './badakan-mission-step'
import { staffingGapLabel } from './badakan-need'
import { trackingStepFromProposals } from './badakan-tracking-step'

export type BadakanNeedListSource = {
  id: string
  pharmacyName: string
  city: string | null
  postalCode: string | null
  step: string
  activityLabel: string | null
  jobTitleName: string | null
  softwareName: string | null
  expectedRecipients: number
  staffedRecipients: number
  periods: PeriodLike[]
}

export type BadakanNeedListItem = {
  id: string
  pharmacyName: string
  cityLabel: string
  postalCode: string | null
  jobTitleLabel: string
  softwareLabel: string
  gapLabel: string
  periodLabel: string
  step: string
  stepLabel: string
  href: string
}

export function toBadakanNeedListItem(row: BadakanNeedListSource): BadakanNeedListItem {
  return {
    id: row.id,
    pharmacyName: row.pharmacyName,
    cityLabel: row.city?.trim() || TABLE_EMPTY_CELL,
    postalCode: row.postalCode?.trim() || null,
    jobTitleLabel: row.jobTitleName ?? row.activityLabel ?? TABLE_EMPTY_CELL,
    softwareLabel: row.softwareName ?? TABLE_EMPTY_CELL,
    gapLabel: staffingGapLabel(row),
    periodLabel: badakanMissionPeriodLabel(row.periods),
    step: row.step,
    stepLabel: badakanMissionStepLabel(row.step),
    href: `/interim/missions/${row.id}`,
  }
}

export function toBadakanNeedListItems(rows: BadakanNeedListSource[]) {
  return rows.map(toBadakanNeedListItem)
}

export type BadakanNeedDbRow = {
  id: string
  pharmacyName: string
  city: string | null
  postalCode: string | null
  step: string
  activityLabel: string | null
  expectedRecipients: number
  staffedRecipients: number
  periods: unknown
  jobTitle: { name: string } | null
  software: { name: string } | null
  proposals?: Array<{ status: BadakanProposalStatus }>
}

export function toBadakanNeedListSources(rows: BadakanNeedDbRow[]): BadakanNeedListSource[] {
  return rows.map((row) => {
    const statuses = (row.proposals ?? []).map((proposal) => proposal.status)
    return {
      id: row.id,
      pharmacyName: row.pharmacyName,
      city: row.city,
      postalCode: row.postalCode,
      step: trackingStepFromProposals(row.step, statuses),
      activityLabel: row.activityLabel,
      jobTitleName: row.jobTitle?.name ?? null,
      softwareName: row.software?.name ?? null,
      expectedRecipients: row.expectedRecipients,
      staffedRecipients: row.staffedRecipients,
      periods: parseBadakanMissionPeriods(row.periods),
    }
  })
}
