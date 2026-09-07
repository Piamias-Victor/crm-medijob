import { CRON_DISABLED_RESPONSE, isCronEnabled } from '@/server/cron/enabled'
import { sendDueAvailabilitySms } from '@/server/weekly-availability/sms-due'
import { defaultSmsDueDeps } from '@/server/weekly-availability/sms-due.deps'
import type { SmsDueResult } from '@/server/weekly-availability/sms-due.types'

export async function runAvailabilitySmsCron(
  env: NodeJS.ProcessEnv = process.env,
  sendDue: () => Promise<SmsDueResult> = () =>
    sendDueAvailabilitySms(defaultSmsDueDeps(env)),
) {
  if (!isCronEnabled(env)) return CRON_DISABLED_RESPONSE
  return { sms: await sendDue() }
}
