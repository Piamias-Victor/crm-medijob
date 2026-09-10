import { sendPharmacyContractEmail } from '@/server/brevo/send-contract-email'
import { prisma } from '@/server/db/repositories/client'
import { makeBadakanContractSignEmailRepository } from '@/server/db/repositories/badakan-contract-sign-email.repo'
import type { ContractSignEmailDueDeps } from './send-due.types'

export function defaultContractSignEmailDeps(
  env: NodeJS.ProcessEnv = process.env,
): ContractSignEmailDueDeps {
  const store = makeBadakanContractSignEmailRepository(prisma)
  return {
    listDue: () => store.listDue(),
    markSent: store.markSent,
    sendEmail: (input) =>
      sendPharmacyContractEmail(input, {
        env: {
          BREVO_API_KEY: env.BREVO_API_KEY,
          BREVO_SENDER: env.BREVO_SENDER,
          BREVO_PHARMACY_CONTRACT_TEMPLATE_ID: env.BREVO_PHARMACY_CONTRACT_TEMPLATE_ID,
        },
      }),
  }
}
