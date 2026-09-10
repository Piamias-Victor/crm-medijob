import { toSmsRecipient } from '@/lib/phone-normalize'
import { AUTOMATIC_OUTBOUND } from '@/view-models/automatic-outbound'
import {
  weeklyAvailabilityReminderSmsContent,
  weeklyAvailabilitySmsContent,
} from '@/view-models/weekly-availability-sms'
import type { SmsDueDeps, SmsDueRow } from './sms-due.types'

function contentFor(row: SmsDueRow, url: string) {
  if (row.kind === 'reminder') return weeklyAvailabilityReminderSmsContent(url)
  return weeklyAvailabilitySmsContent(url)
}

function logContent(row: SmsDueRow) {
  if (row.kind === 'reminder') return AUTOMATIC_OUTBOUND.smsAvailabilityReminder
  return AUTOMATIC_OUTBOUND.smsAvailability
}

export async function sendOneAvailabilitySms(
  row: SmsDueRow,
  deps: SmsDueDeps,
): Promise<'sent' | 'skippedNoPhone'> {
  const raw = deps.testTo?.trim() || row.phone
  const to = raw ? toSmsRecipient(raw) : null
  if (!to) return 'skippedNoPhone'
  const url = await deps.ensureUrl(row.candidateId)
  if (!url) return 'skippedNoPhone'
  await deps.sendSms({ to, content: contentFor(row, url) })
  await deps.markSent(row.candidateId)
  await deps.logSend({
    type: 'SMS',
    content: logContent(row),
    targets: [{ entityType: 'CANDIDATE', entityId: row.candidateId }],
  })
  return 'sent'
}

