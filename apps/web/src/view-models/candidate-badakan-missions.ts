import type { BadakanProposalStatus } from '@prisma/client'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { badakanMissionPeriodLabel, parseBadakanMissionPeriods } from './badakan-mission-periods'
import { badakanProposalStatusLabel } from './badakan-proposal-list'

export type CandidateBadakanProposalSource = {
  id: string
  status: BadakanProposalStatus
  score: number | null
  mission: {
    id: string
    pharmacyName: string
    city: string | null
    step: string
    periods: unknown
    jobTitle: { name: string } | null
    activityLabel: string | null
  }
}

export type CandidateBadakanMissionItem = {
  id: string
  missionId: string
  pharmacyName: string
  cityLabel: string
  jobTitleLabel: string
  periodLabel: string
  status: BadakanProposalStatus
  statusLabel: string
  score: number | null
  href: string
}

export function toCandidateBadakanMissionItem(
  row: CandidateBadakanProposalSource,
): CandidateBadakanMissionItem {
  return {
    id: row.id,
    missionId: row.mission.id,
    pharmacyName: row.mission.pharmacyName,
    cityLabel: row.mission.city?.trim() || TABLE_EMPTY_CELL,
    jobTitleLabel: row.mission.jobTitle?.name ?? row.mission.activityLabel ?? TABLE_EMPTY_CELL,
    periodLabel: badakanMissionPeriodLabel(parseBadakanMissionPeriods(row.mission.periods)),
    status: row.status,
    statusLabel: badakanProposalStatusLabel(row.status),
    score: row.score,
    href: `/interim/missions/${row.mission.id}`,
  }
}
