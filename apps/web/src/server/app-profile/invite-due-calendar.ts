import { toSmsRecipient } from '@/lib/phone-normalize'
import type { InviteDueDeps, InviteDueProfile } from './invite-due.types'

export async function maybeSendHireflixCalendarSms(
  row: InviteDueProfile,
  deps: InviteDueDeps,
): Promise<void> {
  if (deps.testTo || !deps.sendCalendarSms || !row.phone) return
  if (row.status !== 'EN_ATTENTE') return
  if (row.candidateId || row.calendarSmsSentAt) return
  const to = toSmsRecipient(row.phone)
  if (!to) return
  try {
    await deps.sendCalendarSms(to)
    await deps.saveCalendarSmsSent?.(row.id)
  } catch {
    return
  }
}
