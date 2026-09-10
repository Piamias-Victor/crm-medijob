import type { AutomaticSendTarget } from '@/server/activity-log/log-automatic-send'

export function pharmacyEmailLogTargets(row: {
  pharmacyId: string | null
  contactId: string | null
}): AutomaticSendTarget[] {
  const targets: AutomaticSendTarget[] = []
  if (row.pharmacyId) {
    targets.push({ entityType: 'PHARMACY', entityId: row.pharmacyId })
  }
  if (row.contactId) {
    targets.push({ entityType: 'CONTACT', entityId: row.contactId })
  }
  return targets
}
