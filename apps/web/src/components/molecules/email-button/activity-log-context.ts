import type { ActivityLogScope } from '@/view-models/activity-log.types'
import type { DocumentEntityTypeValue } from '@/view-models/activity-log.types'

export type ActivityLogContext = {
  candidateId?: string
  pharmacyId?: string
  contactId?: string
  missionId?: string
}

const CONTEXT_ENTRIES: { key: keyof ActivityLogContext; entityType: DocumentEntityTypeValue }[] = [
  { key: 'candidateId', entityType: 'CANDIDATE' },
  { key: 'pharmacyId', entityType: 'PHARMACY' },
  { key: 'contactId', entityType: 'CONTACT' },
  { key: 'missionId', entityType: 'MISSION' },
]

export function activityLogScopesFromContext(context: ActivityLogContext): ActivityLogScope[] {
  return CONTEXT_ENTRIES.flatMap(({ key, entityType }) => {
    const entityId = context[key]
    return entityId ? [{ entityType, entityId }] : []
  })
}
