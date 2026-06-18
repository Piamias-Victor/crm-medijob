import { applicationRepository } from '@/server/db/repositories/application.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { detectDuplicateCandidate } from '@/server/application/intake'

export async function detectApplicationDuplicate(applicationId: string) {
  const application = await applicationRepository.findById(applicationId)
  if (!application) return null
  const candidates = await candidateRepository.listIdentities()
  return detectDuplicateCandidate(application, candidates)
}
