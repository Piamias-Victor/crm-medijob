import { createRawToken } from '@/server/auth/hash-token'
import { getAppBaseUrl } from '@/server/auth/app-base-url'
import { prisma } from '@/server/db/repositories/client'
import { makeWeeklyAvailabilityRepository } from '@/server/db/repositories/weekly-availability.repo'
import { makeWeeklyAvailabilitySmsRepository } from '@/server/db/repositories/weekly-availability-sms.repo'
import { sendAvailabilitySms } from '@/server/sms/send'
import { ensureLink } from '@/server/weekly-availability/ensure-link'
import { weeklyAvailabilityUrl } from '@/view-models/weekly-availability-path'
import { resolveAvailabilityLinkTestPhone } from '@/server/weekly-availability/availability-link-test-phone'
import type { ResendSmsDeps } from '@/server/weekly-availability/sms-resend'
import type { SmsDueDeps } from '@/server/weekly-availability/sms-due.types'
import { defaultLogAutomaticSend } from '@/server/activity-log/default-automatic-send'

export function defaultSmsDueDeps(env: NodeJS.ProcessEnv = process.env): SmsDueDeps {
  const store = makeWeeklyAvailabilityRepository(prisma)
  const sms = makeWeeklyAvailabilitySmsRepository(prisma)
  return {
    listDue: sms.listDue,
    ensureUrl: async (candidateId) => {
      const result = await ensureLink(store, { candidateId, createToken: createRawToken })
      if (!result.ok) return null
      return weeklyAvailabilityUrl(getAppBaseUrl(), result.token)
    },
    sendSms: (input) =>
      sendAvailabilitySms(input, {
        env: {
          BREVO_API_KEY: env.BREVO_API_KEY,
          BREVO_SMS_SENDER: env.BREVO_SMS_SENDER,
        },
      }),
    markSent: sms.markSent,
    testTo: resolveAvailabilityLinkTestPhone(env),
    logSend: defaultLogAutomaticSend,
  }
}

export function defaultResendSmsDeps(env: NodeJS.ProcessEnv = process.env): ResendSmsDeps {
  const sms = makeWeeklyAvailabilitySmsRepository(prisma)
  return { ...defaultSmsDueDeps(env), findContact: sms.findContact }
}

export function defaultReminderSmsDueDeps(env: NodeJS.ProcessEnv = process.env): SmsDueDeps {
  const sms = makeWeeklyAvailabilitySmsRepository(prisma)
  return { ...defaultSmsDueDeps(env), listDue: () => sms.listReminderDue() }
}
