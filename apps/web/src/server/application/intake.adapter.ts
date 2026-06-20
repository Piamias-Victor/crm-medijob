import { applicationRepository } from '@/server/db/repositories/application.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import {
  detectDuplicateCandidate,
  type ApplicationIdentity,
  type DuplicateMatch,
} from '@/server/application/intake'
import { fetchCandidateIdentitiesForDuplicate } from '@/server/application/intake.adapter.fetch'

type DuplicateDeps = {
  findApplication: (id: string) => Promise<ApplicationIdentity | null>
  findByEmail: (email: string) => ReturnType<typeof candidateRepository.findIdentityByEmail>
  findByNamePhone: (
    firstName: string,
    lastName: string,
    phone: string,
  ) => ReturnType<typeof candidateRepository.findIdentityByNamePhone>
}

const defaultDeps: DuplicateDeps = {
  findApplication: async (id) => {
    const application = await applicationRepository.findById(id)
    if (!application) return null
    return {
      email: application.email,
      firstName: application.firstName,
      lastName: application.lastName,
      phone: application.phone,
    }
  },
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

  const candidates = await fetchCandidateIdentitiesForDuplicate(application, deps)
  return detectDuplicateCandidate(application, candidates)
}
