import { hasMatchingNewNeed } from './match'
import { sendOneInterimNeedSms } from './send-one'
import type { InterimNeedSmsDeps, InterimNeedSmsResult } from './send-due.types'

export async function sendDueInterimNeedSms(
  deps: InterimNeedSmsDeps,
): Promise<InterimNeedSmsResult> {
  const candidates = await deps.listCandidates()
  const needs = await deps.listOpenNeeds()
  const result: InterimNeedSmsResult = {
    sent: 0,
    skippedNoPhone: 0,
    failed: 0,
  }
  for (const row of candidates) {
    if (!(await hasMatchingNewNeed(row, needs, deps.lookupGeo))) continue
    try {
      const outcome = await sendOneInterimNeedSms(row, deps)
      result[outcome] += 1
    } catch (error) {
      result.failed += 1
      result.lastError = error instanceof Error ? error.message : 'sms failed'
    }
  }
  return result
}
