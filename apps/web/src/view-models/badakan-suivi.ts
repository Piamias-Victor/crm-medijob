import type { BadakanProposalStatus } from '@prisma/client'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { badakanMissionPeriodLabel, parseBadakanMissionPeriods } from './badakan-mission-periods'
import { badakanMissionStepLabel } from './badakan-mission-step'
import { isOpenNeed } from './badakan-need'
import { trackingStepFromProposals } from './badakan-tracking-step'

export type SuiviMissionSource = {
  id: string
  pharmacyName: string
  city: string | null
  step: string
  periods: unknown
  expectedRecipients: number
  staffedRecipients: number
  jobTitle: { name: string } | null
  activityLabel: string | null
  proposals: Array<{ status: BadakanProposalStatus }>
}

export type SuiviMissionItem = {
  id: string
  pharmacyName: string
  cityLabel: string
  jobTitleLabel: string
  periodLabel: string
  step: string
  stepLabel: string
  href: string
}

export type SuiviBuckets = {
  open: SuiviMissionItem[]
  proposed: SuiviMissionItem[]
  staffed: SuiviMissionItem[]
  counts: { open: number; proposed: number; staffed: number }
}

function toItem(row: SuiviMissionSource, step: string): SuiviMissionItem {
  return {
    id: row.id,
    pharmacyName: row.pharmacyName,
    cityLabel: row.city?.trim() || TABLE_EMPTY_CELL,
    jobTitleLabel: row.jobTitle?.name ?? row.activityLabel ?? TABLE_EMPTY_CELL,
    periodLabel: badakanMissionPeriodLabel(parseBadakanMissionPeriods(row.periods)),
    step,
    stepLabel: badakanMissionStepLabel(step),
    href: `/interim/missions/${row.id}`,
  }
}

export function toSuiviBuckets(rows: SuiviMissionSource[]): SuiviBuckets {
  const open: SuiviMissionItem[] = []
  const proposed: SuiviMissionItem[] = []
  const staffed: SuiviMissionItem[] = []

  for (const row of rows) {
    const statuses = row.proposals.map((proposal) => proposal.status)
    const step = trackingStepFromProposals(row.step, statuses)
    const item = toItem(row, step)
    if (step === 'STAFFED') staffed.push(item)
    else if (step === 'PROPOSE') proposed.push(item)
    else if (row.step === 'CREATED' && isOpenNeed(row)) open.push(item)
  }

  return {
    open,
    proposed,
    staffed,
    counts: { open: open.length, proposed: proposed.length, staffed: staffed.length },
  }
}
