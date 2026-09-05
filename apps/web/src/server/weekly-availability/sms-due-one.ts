import { toSmsRecipient } from '@/lib/phone-normalize'
import { weeklyAvailabilitySmsContent } from '@/view-models/weekly-availability-sms'
import type { SmsDueDeps, SmsDueRow } from './sms-due.types'

export async function sendOneAvailabilitySms(
  row: SmsDueRow,
  deps: SmsDueDeps,
): Promise<'sent' | 'skippedNoPhone'> {
  const raw = deps.testTo?.trim() || row.phone
  const to = raw ? toSmsRecipient(raw) : null
  if (!to) return 'skippedNoPhone'
  const url = await deps.ensureUrl(row.candidateId)
  if (!url) return 'skippedNoPhone'
  await deps.sendSms({ to, content: weeklyAvailabilitySmsContent(url) })
  await deps.markSent(row.candidateId)
  return 'sent'
}
