import { isTerminalMissionStatus } from '@/lib/kanban-terminal'
import { ACTIVITY_TYPE_LABELS } from '@/view-models/activity-log.labels'
import { formatDateFr } from '@/view-models/format-date-fr'
import type {
  PharmacyQuickViewEntity,
  PharmacyQuickViewPayload,
} from '@/view-models/pharmacy-quick-view.types'

export type {
  PharmacyQuickViewEntity,
  PharmacyQuickViewPayload,
} from '@/view-models/pharmacy-quick-view.types'

export function toPharmacyQuickView(entity: PharmacyQuickViewEntity): PharmacyQuickViewPayload {
  const last = entity.lastActivity
  return {
    id: entity.id,
    name: entity.name,
    coordinates: {
      address: entity.address,
      postalCode: entity.postalCode,
      city: entity.city,
      phone: entity.phone,
      email: entity.email,
    },
    primaryContacts: entity.contacts
      .filter((c) => c.isPrimary)
      .map((c) => ({
        id: c.id,
        fullName: `${c.firstName} ${c.lastName}`.trim(),
        email: c.email,
        phone: c.phone,
      })),
    openNeeds: entity.missions
      .filter((m) => !isTerminalMissionStatus(m.status))
      .map((m) => ({
        id: m.id,
        title: m.title,
        status: m.status,
        jobTitle: m.jobTitle.name,
      })),
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
