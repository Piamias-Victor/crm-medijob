import { IntakeError } from '@/server/application/intake-errors'
import {
  pickEmailMatch,
  pickNamePhoneMatch,
} from '@/server/candidate/duplicate-identity-match'

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

export function detectDuplicateCandidate(
  application: ApplicationIdentity,
  candidates: CandidateIdentity[],
): DuplicateMatch | null {
  const probe = {
    email: application.email,
    firstName: application.firstName,
    lastName: application.lastName,
    phone: application.phone,
  }
  const emailHit = pickEmailMatch(probe, candidates)
  if (emailHit) return { candidateId: emailHit.id, reason: 'email' }

  const namePhoneHit = pickNamePhoneMatch(probe, candidates)
  return namePhoneHit ? { candidateId: namePhoneHit.id, reason: 'name_phone' } : null
}

export type IntakeDeps = {
  findApplication: (id: string) => Promise<{ id: string; status: string } | null>
  markRefused: (id: string) => Promise<{ id: string; status: string }>
}

export async function refuseApplication(id: string, deps: IntakeDeps) {
  const application = await deps.findApplication(id)
  if (!application) throw new IntakeError('NOT_FOUND')
  if (application.status !== 'EN_ATTENTE') throw new IntakeError('INVALID_STATUS')
  return deps.markRefused(id)
}
