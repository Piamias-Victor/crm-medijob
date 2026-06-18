import type { ContextRepos } from '@/server/ai/context-loader'
import type { CandidateLike, MissionLike, PharmacyLike } from '@/server/ai/format-entity'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pharmacyRepository } from '@/server/db/repositories/pharmacy.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'

type PartialRepos = Partial<{
  candidate: { findForContext: (id: string) => Promise<CandidateLike | null> }
  pharmacy: { findForContext: (id: string) => Promise<PharmacyLike | null> }
  mission: { findForContext: (id: string) => Promise<MissionLike | null> }
}>

export function makeAssistantContextRepos(overrides: PartialRepos = {}): ContextRepos {
  return {
    candidate: {
      findById: (id) =>
        (overrides.candidate?.findForContext ?? candidateRepository.findForContext.bind(candidateRepository))(id),
    },
    pharmacy: {
      findById: (id) =>
        (overrides.pharmacy?.findForContext ?? pharmacyRepository.findForContext.bind(pharmacyRepository))(id),
    },
    mission: {
      findById: (id) =>
        (overrides.mission?.findForContext ?? missionRepository.findForContext.bind(missionRepository))(id),
    },
  }
}

export const assistantContextRepos = makeAssistantContextRepos()
