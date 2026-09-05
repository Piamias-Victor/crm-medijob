import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import type { SyncValidatedResult } from './sync-validated.types'
import type { SmsDueRow } from '@/server/weekly-availability/sms-due.types'

export type TestOneDeps = {
  testPhone?: string
  getRecipient: (badakanId: string) => Promise<BadakanRecipient | null>
  syncValidated: (rows: BadakanRecipient[]) => Promise<SyncValidatedResult>
  findCandidate: (badakanId: string) => Promise<{ id: string } | null>
  sendAvailabilitySms: (row: SmsDueRow) => Promise<'sent' | 'skippedNoPhone'>
}

export type TestOneReport =
  | {
      ok: true
      name: string
      sync: SyncValidatedResult
      candidateId: string
      sms: 'sent' | 'skippedNoPhone'
      sentTo: string
    }
  | { ok: false; reason: 'test_phone_missing' | 'recipient_missing' | 'candidate_missing' }

export async function runAppValidatedTest(
  badakanId: string,
  deps: TestOneDeps,
): Promise<TestOneReport> {
  const sentTo = deps.testPhone?.trim()
  if (!sentTo) return { ok: false, reason: 'test_phone_missing' }
  const recipient = await deps.getRecipient(badakanId)
  if (!recipient) return { ok: false, reason: 'recipient_missing' }

  const sync = await deps.syncValidated([recipient])
  const candidate = await deps.findCandidate(badakanId)
  if (!candidate) return { ok: false, reason: 'candidate_missing' }

  const sms = await deps.sendAvailabilitySms({
    candidateId: candidate.id,
    firstName: recipient.firstName,
    phone: recipient.phone,
  })
  return {
    ok: true,
    name: `${recipient.firstName} ${recipient.lastName}`.trim(),
    sync,
    candidateId: candidate.id,
    sms,
    sentTo,
  }
}
