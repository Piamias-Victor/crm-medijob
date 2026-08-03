import { filterActivePositionings } from '@/lib/kanban-active-positionings'
import { formatCandidateAvailability } from '@/view-models/cvtheque-core-fields'
import { toEffectiveCandidateStatus } from '@/view-models/candidate-status'
import type {
  CandidateQuickViewEntity,
  CandidateQuickViewPayload,
} from '@/view-models/candidate-quick-view.types'

export type {
  CandidateQuickViewEntity,
  CandidateQuickViewPayload,
} from '@/view-models/candidate-quick-view.types'

export function toCandidateQuickView(
  entity: CandidateQuickViewEntity,
  now = new Date(),
): CandidateQuickViewPayload {
  const active = filterActivePositionings(entity.missions)
  return {
    id: entity.id,
    fullName: `${entity.firstName} ${entity.lastName}`.trim(),
    jobTitle: entity.jobTitle.name,
    effectiveStatus: toEffectiveCandidateStatus(entity.status, active.length > 0),
    city: entity.city,
    postalCode: entity.postalCode,
    email: entity.email,
    phone: entity.phone,
    mobilityRadiusKm: entity.mobilityRadiusKm,
    availabilityLabel: formatCandidateAvailability(entity.availableFrom, now),
    salaryExpectations: entity.salaryExpectations,
    salaryMin: entity.salaryMin,
    salaryMax: entity.salaryMax,
    referentName: entity.referent?.name ?? null,
    activeMissions: active.map((row) => ({
      id: row.mission.id,
      title: row.mission.title,
      stageName: row.stage.name,
    })),
  }
}
