import { ACTIVITY_TYPE_LABELS } from '@/view-models/activity-log.labels'
import { formatDateFr } from '@/view-models/format-date-fr'
import type {
  MissionQuickViewEntity,
  MissionQuickViewPayload,
} from '@/view-models/mission-quick-view.types'

export type {
  MissionQuickViewEntity,
  MissionQuickViewPayload,
} from '@/view-models/mission-quick-view.types'

export function toMissionQuickView(entity: MissionQuickViewEntity): MissionQuickViewPayload {
  const last = entity.lastActivity
  return {
    id: entity.id,
    title: entity.title,
    status: entity.status,
    contractType: entity.contractType,
    jobTitleName: entity.jobTitle.name,
    referentName: entity.referent?.name ?? null,
    pharmacyName: entity.pharmacy.name,
    coordinates: {
      address: entity.pharmacy.address,
      postalCode: entity.pharmacy.postalCode,
      city: entity.pharmacy.city,
      phone: entity.pharmacy.phone,
    },
    lastAction: last
      ? {
          typeLabel: ACTIVITY_TYPE_LABELS[last.type],
          dateLabel: formatDateFr(last.date),
          content: last.content,
          authorName: last.author.name,
        }
      : null,
  }
}
