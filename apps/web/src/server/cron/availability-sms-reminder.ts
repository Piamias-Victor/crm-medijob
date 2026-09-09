import { CRON_DISABLED_RESPONSE, isCronEnabled, type CronEnv } from '@/server/cron/enabled'
import { sendDueAvailabilitySms } from '@/server/weekly-availability/sms-due'
import { defaultReminderSmsDueDeps } from '@/server/weekly-availability/sms-due.deps'
import type { SmsDueResult } from '@/server/weekly-availability/sms-due.types'

export async function runAvailabilitySmsReminderCron(
  env: CronEnv = process.env,
  sendDue: () => Promise<SmsDueResult> = () =>
    sendDueAvailabilitySms(defaultReminderSmsDueDeps()),
) {
  if (!isCronEnabled(env)) return CRON_DISABLED_RESPONSE
  return { sms: await sendDue() }
}
