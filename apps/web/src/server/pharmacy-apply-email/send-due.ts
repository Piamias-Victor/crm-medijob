import { sendOnePharmacyApplyEmail } from './send-one'
import type {
  PharmacyApplyEmailDueDeps,
  PharmacyApplyEmailDueResult,
} from './send-due.types'

export async function sendDuePharmacyApplyEmails(
  deps: PharmacyApplyEmailDueDeps,
): Promise<PharmacyApplyEmailDueResult> {
  const due = await deps.listDue()
  const result: PharmacyApplyEmailDueResult = {
    sent: 0,
    skippedNoEmail: 0,
    failed: 0,
  }
  for (const row of due) {
    try {
      const outcome = await sendOnePharmacyApplyEmail(row, deps)
      result[outcome] += 1
    } catch (error) {
      result.failed += 1
      result.lastError = error instanceof Error ? error.message : 'email failed'
    }
  }
  return result
}
