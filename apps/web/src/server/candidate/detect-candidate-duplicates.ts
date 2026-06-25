import type { DetectDuplicateInput } from '@/view-models/candidate-duplicate.schema'
import { collectDuplicateMatches } from '@/server/candidate/detect-duplicate'

type DuplicateDeps = {
  findIdentityByEmail: (email: string) => Promise<{ id: string; firstName: string; lastName: string; email: string | null; phone: string | null } | null>
  findIdentityByNamePhone: (
    firstName: string,
    lastName: string,
    phone: string,
  ) => Promise<{ id: string; firstName: string; lastName: string; email: string | null; phone: string | null } | null>
}

export async function detectCandidateDuplicates(input: DetectDuplicateInput, deps: DuplicateDeps) {
  const emailHit = input.email ? await deps.findIdentityByEmail(input.email) : null
  const namePhoneHit =
    input.phone && input.firstName && input.lastName
      ? await deps.findIdentityByNamePhone(input.firstName, input.lastName, input.phone)
      : null
  return collectDuplicateMatches(emailHit, namePhoneHit, input.excludeId)
}
