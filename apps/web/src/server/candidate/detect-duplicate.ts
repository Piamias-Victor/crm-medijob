import type { DuplicateIdentity, DuplicateMatch } from '@/server/candidate/detect-duplicate.types'

function toMatch(identity: DuplicateIdentity, reason: DuplicateMatch['reason']): DuplicateMatch {
  return {
    candidateId: identity.id,
    reason,
    firstName: identity.firstName,
    lastName: identity.lastName,
    email: identity.email,
    phone: identity.phone,
  }
}

export function collectDuplicateMatches(
  emailHit: DuplicateIdentity | null,
  namePhoneHit: DuplicateIdentity | null,
  excludeId?: string,
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = []
  if (emailHit && emailHit.id !== excludeId) matches.push(toMatch(emailHit, 'email'))
  if (namePhoneHit && namePhoneHit.id !== excludeId && !matches.some((m) => m.candidateId === namePhoneHit.id)) {
    matches.push(toMatch(namePhoneHit, 'name_phone'))
  }
  return matches
}
