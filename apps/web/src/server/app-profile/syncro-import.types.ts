import type { AppProfileStatus } from '@prisma/client'
import type {
  AppProfileIntakeUpdate,
  AppProfileUpsertInput,
} from '@/server/db/repositories/app-profile.repository.types'

export type SyncroImportProfile = {
  id: string
  candidateId: string | null
  status: AppProfileStatus
}

export type SyncroImportDeps = {
  findByBadakanId: (badakanId: string) => Promise<SyncroImportProfile | null>
  upsertPending: (data: AppProfileUpsertInput) => Promise<{ id: string }>
  updateIntake: (id: string, data: AppProfileIntakeUpdate) => Promise<unknown>
  markStatus: (
    id: string,
    status: Extract<AppProfileStatus, 'IGNORE' | 'APP_VALIDATED'>,
    candidateId?: string | null,
  ) => Promise<unknown>
  resolveUserIdByName: (name: string) => Promise<string | null>
  findJobTitleIdByName: (name: string) => Promise<string | null>
  createAppCandidate: (data: {
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    postalCode: string | null
    jobTitleId: string
    badakanId: string
    origin: 'APP'
    status: 'NOUVEAU'
  }) => Promise<{ id: string }>
  linkCandidate: (profileId: string, candidateId: string) => Promise<unknown>
  findCandidateByBadakanId: (badakanId: string) => Promise<{ id: string } | null>
  muteOutbound: (profileId: string) => Promise<unknown>
}

export type SyncroImportResult = {
  updated: number
  created: number
  skipped: number
  dryRun: boolean
}
