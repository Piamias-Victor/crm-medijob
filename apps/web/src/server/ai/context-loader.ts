import type { AssistantContext } from './request'
import {
  formatCandidate,
  formatPharmacy,
  formatMission,
  type CandidateLike,
  type PharmacyLike,
  type MissionLike,
} from './format-entity'

type Finder<T> = { findById: (id: string) => Promise<T | null> }

export type ContextRepos = {
  candidate: Finder<CandidateLike>
  pharmacy: Finder<PharmacyLike>
  mission: Finder<MissionLike>
}

export async function loadContextText(
  context: AssistantContext | undefined,
  repos: ContextRepos,
): Promise<string | null> {
  if (!context?.entityType || !context.entityId) return null

  switch (context.entityType) {
    case 'candidate': {
      const entity = await repos.candidate.findById(context.entityId)
      return entity ? formatCandidate(entity) : null
    }
    case 'pharmacy': {
      const entity = await repos.pharmacy.findById(context.entityId)
      return entity ? formatPharmacy(entity) : null
    }
    case 'mission': {
      const entity = await repos.mission.findById(context.entityId)
      return entity ? formatMission(entity) : null
    }
  }
}
