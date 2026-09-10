import { sendOneContractSignEmail } from './send-one'
import type {
  ContractSignEmailDueDeps,
  ContractSignEmailDueResult,
} from './send-due.types'

export async function sendDueContractSignEmails(
  deps: ContractSignEmailDueDeps,
): Promise<ContractSignEmailDueResult> {
  const due = await deps.listDue()
  const result: ContractSignEmailDueResult = {
    sent: 0,
    skippedNoEmail: 0,
    failed: 0,
  }
  for (const row of due) {
    try {
      const outcome = await sendOneContractSignEmail(row, deps)
      result[outcome] += 1
    } catch (error) {
      result.failed += 1
      result.lastError = error instanceof Error ? error.message : 'email failed'
    }
  }
  return result
}
