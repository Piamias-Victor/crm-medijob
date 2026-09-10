import { resolvePharmacyApplyEmails } from '@/lib/pharmacy/resolve-apply-emails'
import type {
  PharmacyApplyEmailDueDeps,
  PharmacyApplyEmailDueRow,
} from './send-due.types'

export async function sendOnePharmacyApplyEmail(
  row: PharmacyApplyEmailDueRow,
  deps: PharmacyApplyEmailDueDeps,
): Promise<'sent' | 'skippedNoEmail'> {
  const to = resolvePharmacyApplyEmails({
    pharmacyEmail: row.pharmacyEmail,
    primaryContactEmail: row.primaryEmail,
  })
  if (to.length === 0) return 'skippedNoEmail'
  await deps.sendEmail({ to, firstName: row.primaryFirstName?.trim() || ' ' })
  await deps.markSent(row.missionBadakanId, row.recipientId)
  return 'sent'
}
