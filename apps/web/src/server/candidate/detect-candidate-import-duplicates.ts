import type {
  DuplicateIdentity,
  ImportDuplicateMatch,
} from '@/server/candidate/detect-duplicate.types'

type ImportDuplicateDeps = {
  findIdentityByEmail: (email: string) => Promise<DuplicateIdentity | null>
  findIdentityByPhone: (phone: string) => Promise<DuplicateIdentity | null>
}

function toMatch(
  identity: DuplicateIdentity,
  reason: ImportDuplicateMatch['reason'],
): ImportDuplicateMatch {
  return {
    candidateId: identity.id,
    reason,
    firstName: identity.firstName,
    lastName: identity.lastName,
    email: identity.email,
    phone: identity.phone,
  }
}

export async function detectCandidateImportDuplicates(
  input: { email?: string; phone?: string },
  deps: ImportDuplicateDeps,
): Promise<ImportDuplicateMatch[]> {
  const matches: ImportDuplicateMatch[] = []
  if (input.email) {
    const emailHit = await deps.findIdentityByEmail(input.email)
    if (emailHit) matches.push(toMatch(emailHit, 'email'))
  }
  if (input.phone) {
    const phoneHit = await deps.findIdentityByPhone(input.phone)
    if (phoneHit && !matches.some((m) => m.candidateId === phoneHit.id)) {
      matches.push(toMatch(phoneHit, 'phone'))
    }
  }
  return matches
}
