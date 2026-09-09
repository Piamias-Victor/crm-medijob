import { toSmsRecipient } from '@/lib/phone-normalize'
import { INTERIM_NEED_SMS_CONTENT } from '@/view-models/interim-need-sms'
import type { NeedSmsRow } from './match.types'
import type { InterimNeedSmsDeps } from './send-due.types'

export async function sendOneInterimNeedSms(
  row: NeedSmsRow,
  deps: InterimNeedSmsDeps,
): Promise<'sent' | 'skippedNoPhone'> {
  const raw = deps.testTo?.trim() || row.phone
  const to = raw ? toSmsRecipient(raw) : null
  if (!to) return 'skippedNoPhone'
  await deps.sendSms({ to, content: INTERIM_NEED_SMS_CONTENT })
  await deps.markSent(row.id)
  return 'sent'
}
