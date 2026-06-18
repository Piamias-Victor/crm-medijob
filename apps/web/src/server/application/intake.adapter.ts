import { applicationRepository } from '@/server/db/repositories/application.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import type { DuplicateMatch } from '@/server/application/intake'

type DuplicateDeps = {
  findApplication: (id: string) => ReturnType<typeof applicationRepository.findById>
  findByEmail: (email: string) => ReturnType<typeof candidateRepository.findIdentityByEmail>
  findByNamePhone: (
    firstName: string,
    lastName: string,
    phone: string,
  ) => ReturnType<typeof candidateRepository.findIdentityByNamePhone>
}

const defaultDeps: DuplicateDeps = {
  findApplication: (id) => applicationRepository.findById(id),
  findByEmail: (email) => candidateRepository.findIdentityByEmail(email),
  findByNamePhone: (firstName, lastName, phone) =>
    candidateRepository.findIdentityByNamePhone(firstName, lastName, phone),
}

export async function detectApplicationDuplicate(
  applicationId: string,
  deps: DuplicateDeps = defaultDeps,
): Promise<DuplicateMatch | null> {
  const application = await deps.findApplication(applicationId)
  if (!application) return null

  const emailHit = await deps.findByEmail(application.email)
  if (emailHit) return { candidateId: emailHit.id, reason: 'email' }

  if (!application.phone) return null

  const namePhoneHit = await deps.findByNamePhone(
    application.firstName,
    application.lastName,
    application.phone,
  )
  return namePhoneHit ? { candidateId: namePhoneHit.id, reason: 'name_phone' } : null
}
