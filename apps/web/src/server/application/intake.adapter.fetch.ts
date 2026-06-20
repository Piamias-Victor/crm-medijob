import type { ApplicationIdentity, CandidateIdentity } from '@/server/application/intake'

type IdentityFetchDeps = {
  findByEmail: (email: string) => Promise<CandidateIdentity | null>
  findByNamePhone: (
    firstName: string,
    lastName: string,
    phone: string,
  ) => Promise<CandidateIdentity | null>
}

export async function fetchCandidateIdentitiesForDuplicate(
  application: ApplicationIdentity,
  deps: IdentityFetchDeps,
): Promise<CandidateIdentity[]> {
  const candidates: CandidateIdentity[] = []
  const emailHit = await deps.findByEmail(application.email)
  if (emailHit) candidates.push(emailHit)
  if (!application.phone) return candidates

  const namePhoneHit = await deps.findByNamePhone(
    application.firstName,
    application.lastName,
    application.phone,
  )
  if (namePhoneHit && !candidates.some((candidate) => candidate.id === namePhoneHit.id)) {
    candidates.push(namePhoneHit)
  }
  return candidates
}
