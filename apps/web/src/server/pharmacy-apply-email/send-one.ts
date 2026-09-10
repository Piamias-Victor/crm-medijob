import { resolvePharmacyApplyEmails } from '@/lib/pharmacy/resolve-apply-emails'
import { pharmacyEmailLogTargets } from '@/server/activity-log/pharmacy-email-targets'
import { AUTOMATIC_OUTBOUND } from '@/view-models/automatic-outbound'
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
  await deps.logSend({
    type: 'EMAIL',
    content: AUTOMATIC_OUTBOUND.emailPharmacyApply,
    targets: pharmacyEmailLogTargets(row),
  })
  return 'sent'
}

