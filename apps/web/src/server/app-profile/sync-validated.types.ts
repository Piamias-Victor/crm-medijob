import type {
  AppIdentityPatch,
  AppOriginCreateInput as AppCandidateCreate,
} from '@/server/db/repositories/candidate-app-origin.repo'
import type { DuplicateIdentity } from '@/server/candidate/detect-duplicate.types'

export type { AppCandidateCreate, AppIdentityPatch }

export type SyncValidatedDeps = {
  findByBadakanId: (badakanId: string) => Promise<{ id: string } | null>
  findMatch: (probe: {
    email?: string | null
    phone?: string | null
    firstName: string
    lastName: string
  }) => Promise<DuplicateIdentity | null>
  createAppCandidate: (data: AppCandidateCreate) => Promise<{ id: string }>
  linkAppOrigin: (candidateId: string, badakanId: string) => Promise<unknown>
  patchIdentity: (candidateId: string, patch: AppIdentityPatch) => Promise<unknown>
  findAppProfileByBadakanId: (
    badakanId: string,
  ) => Promise<{ id: string; status: string } | null>
  markAppValidated: (profileId: string, candidateId: string) => Promise<unknown>
  resolveJobTitleId: (activityLabel: string | null) => Promise<string | null>
  mapJobTitleId: (activityLabel: string) => Promise<string | null>
}

export type SyncValidatedResult = {
  created: number
  linked: number
  skipped: number
}
