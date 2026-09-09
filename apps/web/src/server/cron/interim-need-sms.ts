import { CRON_DISABLED_RESPONSE, isCronEnabled, type CronEnv } from '@/server/cron/enabled'
import { sendDueInterimNeedSms } from '@/server/interim-need-sms/send-due'
import { defaultInterimNeedSmsDeps } from '@/server/interim-need-sms/send-due.deps'
import type { InterimNeedSmsResult } from '@/server/interim-need-sms/send-due.types'

export async function runInterimNeedSmsCron(
  env: CronEnv = process.env,
  sendDue: () => Promise<InterimNeedSmsResult> = () =>
    sendDueInterimNeedSms(defaultInterimNeedSmsDeps()),
) {
  if (!isCronEnabled(env)) return CRON_DISABLED_RESPONSE
  return { sms: await sendDue() }
}
