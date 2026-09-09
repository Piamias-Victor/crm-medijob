import { createGeoLookup } from '@/server/matching/distance'
import { sendAvailabilitySms } from '@/server/sms/send'
import { prisma } from '@/server/db/repositories/client'
import { makeInterimNeedSmsRepository } from '@/server/db/repositories/interim-need-sms.repo'
import { resolveAvailabilityLinkTestPhone } from '@/server/weekly-availability/availability-link-test-phone'
import type { InterimNeedSmsDeps } from './send-due.types'

export function defaultInterimNeedSmsDeps(
  env: NodeJS.ProcessEnv = process.env,
): InterimNeedSmsDeps {
  const store = makeInterimNeedSmsRepository(prisma)
  return {
    listCandidates: store.listCandidates,
    listOpenNeeds: store.listOpenNeeds,
    markSent: store.markSent,
    lookupGeo: createGeoLookup(),
    sendSms: (input) =>
      sendAvailabilitySms(input, {
        env: {
          BREVO_API_KEY: env.BREVO_API_KEY,
          BREVO_SMS_SENDER: env.BREVO_SMS_SENDER,
        },
      }),
    testTo: resolveAvailabilityLinkTestPhone(env),
  }
}
