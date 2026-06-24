import { TRPCError } from '@trpc/server'
import type { CandidateMergeInput, DetectDuplicateInput } from '@/view-models/candidate-duplicate.schema'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'

type DetectDuplicates = (input: DetectDuplicateInput) => Promise<DuplicateMatch[]>

export async function assertMergeDuplicateAllowed(
  input: CandidateMergeInput,
  detectDuplicates: DetectDuplicates,
) {
  const matches = await detectDuplicates({
    firstName: input.data.firstName,
    lastName: input.data.lastName,
    email: input.data.email,
    phone: input.data.phone,
    excludeId: input.absorbedId,
  })
  if (!matches.some((match) => match.candidateId === input.keptId)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Fusion non autorisée pour ces candidats.',
    })
  }
}
