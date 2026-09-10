import { resolvePharmacyApplyEmails } from '@/lib/pharmacy/resolve-apply-emails'
import type {
  ContractSignEmailDueDeps,
  ContractSignEmailDueRow,
} from './send-due.types'

export async function sendOneContractSignEmail(
  row: ContractSignEmailDueRow,
  deps: ContractSignEmailDueDeps,
): Promise<'sent' | 'skippedNoEmail'> {
  const to = resolvePharmacyApplyEmails({
    pharmacyEmail: row.pharmacyEmail,
    primaryContactEmail: row.primaryEmail,
  })
  if (to.length === 0) return 'skippedNoEmail'
  await deps.sendEmail({ to, firstName: row.primaryFirstName?.trim() || ' ' })
  await deps.markSent(row.contractId)
  return 'sent'
}
