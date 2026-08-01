import { TRPCError } from '@trpc/server'
import type {
  DetectPharmacyDuplicateInput,
  PharmacyMergeInput,
} from '@/view-models/pharmacy-duplicate.schema'
import { toPharmacyUpdateData } from '@/view-models/pharmacy-update'
import type { PharmacyUpdate } from '@/view-models/pharmacy-update'
import { PharmacyMergeError } from '@/server/pharmacy/validate-merge-pharmacies'
import { assertPharmacyMergeDuplicateAllowed } from '@/server/pharmacy/assert-merge-duplicate-allowed'
import type { PharmacyDuplicateMatch } from '@/server/pharmacy/detect-duplicate.types'

type MergeDeps = {
  detectDuplicates: (input: DetectPharmacyDuplicateInput) => Promise<PharmacyDuplicateMatch[]>
  mergePharmacies: (
    keptId: string,
    absorbedId: string | undefined,
    data: PharmacyUpdate,
  ) => Promise<{ id: string }>
}

function mapMergeError(error: unknown): never {
  if (error instanceof PharmacyMergeError) {
    if (error.code === 'SAME_ID') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Impossible de fusionner une pharmacie avec elle-même.',
      })
    }
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Pharmacie introuvable.' })
  }
  throw error
}

export async function mergePharmacy(input: PharmacyMergeInput, deps: MergeDeps) {
  await assertPharmacyMergeDuplicateAllowed(input, deps.detectDuplicates)
  const data = toPharmacyUpdateData(input.data)
  try {
    return await deps.mergePharmacies(input.keptId, input.absorbedId, data)
  } catch (error) {
    mapMergeError(error)
  }
}
