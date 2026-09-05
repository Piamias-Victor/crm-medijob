import { badakanClientFromEnv } from '@/server/badakan/client'
import { syncValidatedEmployees } from '@/server/app-profile/sync-validated.deps'
import { makeCandidateAppOriginRepository } from '@/server/db/repositories/candidate-app-origin.repo'
import { prisma } from '@/server/db/repositories/client'
import { defaultSmsDueDeps } from '@/server/weekly-availability/sms-due.deps'
import { sendOneAvailabilitySms } from '@/server/weekly-availability/sms-due-one'
import { resolveAvailabilityLinkTestPhone } from '@/server/weekly-availability/availability-link-test-phone'
import type { TestOneDeps } from '@/server/app-profile/test-one'

export function defaultTestOneDeps(env: NodeJS.ProcessEnv = process.env): TestOneDeps {
  const appOrigin = makeCandidateAppOriginRepository(prisma)
  return {
    testPhone: resolveAvailabilityLinkTestPhone(env),
    getRecipient: (badakanId) => badakanClientFromEnv(env).getRecipient(badakanId),
    syncValidated: (rows) => syncValidatedEmployees(rows),
    findCandidate: (badakanId) => appOrigin.findByBadakanId(badakanId),
    sendAvailabilitySms: (row) => sendOneAvailabilitySms(row, defaultSmsDueDeps(env)),
  }
}
