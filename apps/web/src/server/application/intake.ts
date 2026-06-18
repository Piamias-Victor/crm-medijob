export type ApplicationIdentity = {
  email: string
  firstName: string
  lastName: string
  phone?: string | null
}

export type CandidateIdentity = {
  id: string
  email: string | null
  firstName: string
  lastName: string
  phone: string | null
}

export type DuplicateMatch = {
  candidateId: string
  reason: 'email' | 'name_phone'
}

const norm = (value: string) => value.trim().toLowerCase()

export function detectDuplicateCandidate(
  application: ApplicationIdentity,
  candidates: CandidateIdentity[],
): DuplicateMatch | null {
  const emailHit = candidates.find(
    (c) => c.email && norm(c.email) === norm(application.email),
  )
  if (emailHit) return { candidateId: emailHit.id, reason: 'email' }

  if (!application.phone) return null

  const namePhoneHit = candidates.find(
    (c) =>
      c.phone &&
      application.phone &&
      norm(c.phone) === norm(application.phone) &&
      norm(c.firstName) === norm(application.firstName) &&
      norm(c.lastName) === norm(application.lastName),
  )
  return namePhoneHit ? { candidateId: namePhoneHit.id, reason: 'name_phone' } : null
}

export type IntakeDeps = {
  findApplication: (id: string) => Promise<{ id: string; status: string } | null>
  markRefused: (id: string) => Promise<{ id: string; status: string }>
}

export async function refuseApplication(id: string, deps: IntakeDeps) {
  const application = await deps.findApplication(id)
  if (!application) throw new Error('Application not found')
  return deps.markRefused(id)
}
