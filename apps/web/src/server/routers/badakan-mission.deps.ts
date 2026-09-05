import { badakanMissionRepository } from '@/server/db/repositories/badakan-mission.repository'
import type { BadakanNeedDbRow } from '@/view-models/badakan-need-list'
import type { SuiviMissionSource } from '@/view-models/badakan-suivi'

export type BadakanMissionListRecord = {
  id: string
  pharmacyName: string
  step: string
  periods: unknown
  searchApplied: Array<{
    recipientId: string
    firstName: string
    lastName: string
    phone: string | null
  }>
}

export type BadakanMissionDetailRecord = BadakanMissionListRecord & {
  city: string | null
  activityLabel: string | null
  jobTitleId: string | null
  expectedRecipients: number
  staffedRecipients: number
  jobTitle: { name: string } | null
  software: { name: string } | null
}

export type BadakanMissionDeps = {
  list: () => Promise<BadakanMissionListRecord[]>
  listOpenNeeds: () => Promise<BadakanNeedDbRow[]>
  listForSuivi: () => Promise<SuiviMissionSource[]>
  findById: (id: string) => Promise<BadakanMissionDetailRecord | null>
}

export const defaultBadakanMissionDeps: BadakanMissionDeps = {
  list: () => badakanMissionRepository.list(),
  listOpenNeeds: () => badakanMissionRepository.listOpenNeeds(),
  listForSuivi: () => badakanMissionRepository.listForSuivi(),
  findById: (id) => badakanMissionRepository.findById(id),
}
