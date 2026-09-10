import { sendPharmacyApplyEmail } from '@/server/brevo/send-apply-email'
import { prisma } from '@/server/db/repositories/client'
import { makePharmacyApplyEmailRepository } from '@/server/db/repositories/pharmacy-apply-email.repo'
import type { PharmacyApplyEmailDueDeps } from './send-due.types'

export function defaultPharmacyApplyEmailDeps(
  env: NodeJS.ProcessEnv = process.env,
): PharmacyApplyEmailDueDeps {
  const journal = makePharmacyApplyEmailRepository(prisma)
  return {
    listDue: () => journal.listDue(),
    markSent: journal.markSent,
    sendEmail: (input) =>
      sendPharmacyApplyEmail(input, {
        env: {
          BREVO_API_KEY: env.BREVO_API_KEY,
          BREVO_SENDER: env.BREVO_SENDER,
          BREVO_PHARMACY_APPLY_TEMPLATE_ID: env.BREVO_PHARMACY_APPLY_TEMPLATE_ID,
        },
      }),
  }
}
