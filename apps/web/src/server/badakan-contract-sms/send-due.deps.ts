import { sendAvailabilitySms } from '@/server/sms/send'
import { prisma } from '@/server/db/repositories/client'
import { makeBadakanContractSmsRepository } from '@/server/db/repositories/badakan-contract-sms.repo'
import { defaultLogAutomaticSend } from '@/server/activity-log/default-automatic-send'
import type { ContractSmsDueDeps } from './send-due.types'

export function defaultContractSmsDueDeps(
  env: NodeJS.ProcessEnv = process.env,
): ContractSmsDueDeps {
  const sms = makeBadakanContractSmsRepository(prisma)
  return {
    listDue: () => sms.listDue(),
    markSent: sms.markSent,
    sendSms: (input) =>
      sendAvailabilitySms(input, {
        env: {
          BREVO_API_KEY: env.BREVO_API_KEY,
          BREVO_SMS_SENDER: env.BREVO_SMS_SENDER,
        },
      }),
    logSend: defaultLogAutomaticSend,
  }
}
