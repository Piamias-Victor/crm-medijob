import { TRPCError } from '@trpc/server'
import type { CandidateMergeInput, DetectDuplicateInput } from '@/view-models/candidate-duplicate.schema'
import { toCandidateUpdateData } from '@/view-models/candidate-profile-map'
import type { CandidateProfileUpdate } from '@/server/db/repositories/candidate-profile.repository'
import { CandidateMergeError } from '@/server/candidate/validate-merge-candidates'
import { assertMergeDuplicateAllowed } from '@/server/candidate/assert-merge-duplicate-allowed'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'

type MergeDeps = {
  detectDuplicates: (input: DetectDuplicateInput) => Promise<DuplicateMatch[]>
  mergeCandidates: (
    keptId: string,
    absorbedId: string | undefined,
    data: CandidateProfileUpdate,
  ) => Promise<{ id: string }>
}

function mapMergeError(error: unknown): never {
  if (error instanceof CandidateMergeError) {
    if (error.code === 'SAME_ID') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Impossible de fusionner un candidat avec lui-même.' })
    }
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })
  }
  throw error
}

export async function mergeCandidate(input: CandidateMergeInput, deps: MergeDeps) {
  await assertMergeDuplicateAllowed(input, deps.detectDuplicates)
  const data = toCandidateUpdateData(input.data)
  if (input.cvUrl) data.cvUrl = input.cvUrl
  try {
    return await deps.mergeCandidates(input.keptId, input.absorbedId, data)
  } catch (error) {
    mapMergeError(error)
  }
}
