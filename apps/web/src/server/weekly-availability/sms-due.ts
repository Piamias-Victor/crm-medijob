import { sendOneAvailabilitySms } from './sms-due-one'
import { inAvailabilitySmsZone } from '@/lib/availability-sms-zone'
import type { SmsDueDeps, SmsDueResult } from './sms-due.types'

export async function sendDueAvailabilitySms(deps: SmsDueDeps): Promise<SmsDueResult> {
  const due = await deps.listDue()
  const result: SmsDueResult = { sent: 0, skippedNoPhone: 0, skippedOutOfZone: 0, failed: 0 }
  for (const row of due) {
    if (!inAvailabilitySmsZone(row.postalCode)) {
      result.skippedOutOfZone += 1
      continue
    }
    try {
      const outcome = await sendOneAvailabilitySms(row, deps)
      result[outcome] += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : 'sms failed'
      result.failed += 1
      result.lastError = message
    }
  }
  return result
}
