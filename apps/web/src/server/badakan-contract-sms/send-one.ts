import { toSmsRecipient } from '@/lib/phone-normalize'
import { AUTOMATIC_OUTBOUND } from '@/view-models/automatic-outbound'
import {
  badakanContractReminderSmsContent,
  badakanContractSignSmsContent,
} from '@/view-models/badakan-contract-sms'
import type { ContractSmsDueDeps, ContractSmsDueRow } from './send-due.types'

function contentFor(row: ContractSmsDueRow) {
  if (row.kind === 'reminder') return badakanContractReminderSmsContent
  return badakanContractSignSmsContent
}

function logContent(row: ContractSmsDueRow) {
  if (row.kind === 'reminder') return AUTOMATIC_OUTBOUND.smsContractReminder
  return AUTOMATIC_OUTBOUND.smsContractSign
}

export async function sendOneContractSignSms(
  row: ContractSmsDueRow,
  deps: ContractSmsDueDeps,
): Promise<'sent' | 'skippedNoPhone'> {
  const to = row.phone ? toSmsRecipient(row.phone) : null
  if (!to) return 'skippedNoPhone'
  await deps.sendSms({ to, content: contentFor(row) })
  await deps.markSent(row.contractId, row.kind)
  await deps.logSend({
    type: 'SMS',
    content: logContent(row),
    targets: [{ entityType: 'CANDIDATE', entityId: row.candidateId }],
  })
  return 'sent'
}

