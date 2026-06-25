import type { ActivityLogScope } from '@/view-models/activity-log.types'

export type ActivityLogContext = {
  candidateId?: string
  pharmacyId?: string
  pharmacyIds?: string[]
  contactId?: string
  missionId?: string
}

function dedupeActivityLogScopes(scopes: ActivityLogScope[]) {
  const seen = new Set<string>()
  return scopes.filter((scope) => {
    const key = `${scope.entityType}:${scope.entityId}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function activityLogScopesFromContext(context: ActivityLogContext): ActivityLogScope[] {
  const scopes: ActivityLogScope[] = []
  if (context.candidateId) scopes.push({ entityType: 'CANDIDATE', entityId: context.candidateId })
  if (context.pharmacyId) scopes.push({ entityType: 'PHARMACY', entityId: context.pharmacyId })
  if (context.contactId) scopes.push({ entityType: 'CONTACT', entityId: context.contactId })
  if (context.missionId) scopes.push({ entityType: 'MISSION', entityId: context.missionId })
  for (const entityId of context.pharmacyIds ?? []) {
    scopes.push({ entityType: 'PHARMACY', entityId })
  }
  return dedupeActivityLogScopes(scopes)
}
