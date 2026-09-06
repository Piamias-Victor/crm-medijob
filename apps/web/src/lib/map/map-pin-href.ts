import type { MapEntityType } from '@/lib/map/map-entity-type'
import { pharmacyDetailHref } from '@/lib/pharmacy-href'
import { cvthequeCandidateHref } from '@/lib/cvtheque-candidate-href'
import { missionDetailHref } from '@/lib/mission-href'

export function mapPinDetailHref(
  entityType: MapEntityType,
  entityId: string,
  returnPath: string,
): string {
  if (entityType === 'pharmacy') return pharmacyDetailHref(entityId, returnPath)
  if (entityType === 'candidate') return cvthequeCandidateHref(entityId, returnPath)
  return missionDetailHref(entityId, returnPath)
}
