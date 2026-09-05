import type {
  AppIdentityPatch,
  AppOriginCreateInput as AppCandidateCreate,
} from '@/server/db/repositories/candidate-app-origin.repo'
import type { DuplicateIdentity } from '@/server/candidate/detect-duplicate.types'
import type { CandidateStatus } from '@/view-models/candidate-status'
import type { AppLifecyclePatch } from '@/server/db/repositories/candidate-app-lifecycle.repo'
import type { CommentIntakePatch } from '@/server/app-profile/enrich-from-comments'

export type { AppCandidateCreate, AppIdentityPatch }

export type LinkedAppCandidate = {
  id: string
  status: CandidateStatus
  statusBeforeInactive: CandidateStatus | null
}

export type SyncValidatedDeps = {
  findByBadakanId: (badakanId: string) => Promise<LinkedAppCandidate | null>
  applyLifecycle: (candidateId: string, patch: AppLifecyclePatch) => Promise<unknown>
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
  ) => Promise<{ id: string; status: string; candidateId: string | null } | null>
  markAppValidated: (profileId: string, candidateId: string) => Promise<unknown>
  linkAppProfileCandidate: (profileId: string, candidateId: string) => Promise<unknown>
  resolveJobTitleId: (activityLabel: string | null) => Promise<string | null>
  mapJobTitleId: (activityLabel: string) => Promise<string | null>
  syncDossier: (candidateId: string, badakanId: string) => Promise<unknown>
  enrichFromComments: (badakanId: string) => Promise<CommentIntakePatch>
}

export type SyncValidatedResult = {
  created: number
  linked: number
  skipped: number
}
