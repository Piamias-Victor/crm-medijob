import type { MapEntityType } from '@/lib/map/map-entity-type'
import { pharmacyDetailHref } from '@/lib/pharmacy-href'
import { cvthequeCandidateHref } from '@/lib/cvtheque-candidate-href'
import { missionDetailHref } from '@/lib/mission-href'
import { jobOfferDetailHref } from '@/view-models/job-offer-href'

export function mapPinDetailHref(
  entityType: MapEntityType,
  entityId: string,
  returnPath: string,
): string {
  if (entityType === 'pharmacy') return pharmacyDetailHref(entityId, returnPath)
  if (entityType === 'candidate') return cvthequeCandidateHref(entityId, returnPath)
  if (entityType === 'jobOffer') return jobOfferDetailHref(entityId)
  return missionDetailHref(entityId, returnPath)
}
