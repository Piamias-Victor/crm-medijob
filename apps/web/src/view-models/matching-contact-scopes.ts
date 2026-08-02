import type { ActivityLogScope } from '@/view-models/activity-log.types'

export function matchingContactScopes(
  missionId: string,
  candidateIds: string[],
): ActivityLogScope[] {
  return [
    { entityType: 'MISSION', entityId: missionId },
    ...candidateIds.map((entityId) => ({ entityType: 'CANDIDATE' as const, entityId })),
  ]
}
