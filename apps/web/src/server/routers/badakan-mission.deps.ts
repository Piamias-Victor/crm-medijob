import { badakanMissionRepository } from '@/server/db/repositories/badakan-mission.repository'

export type BadakanMissionRecord = {
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

export type BadakanMissionDeps = {
  list: () => Promise<BadakanMissionRecord[]>
  findById: (id: string) => Promise<BadakanMissionRecord | null>
}

export const defaultBadakanMissionDeps: BadakanMissionDeps = {
  list: () => badakanMissionRepository.list(),
  findById: (id) => badakanMissionRepository.findById(id),
}
