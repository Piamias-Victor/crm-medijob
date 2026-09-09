import { toSmsRecipient } from '@/lib/phone-normalize'
import {
  badakanContractReminderSmsContent,
  badakanContractSignSmsContent,
} from '@/view-models/badakan-contract-sms'
import type { ContractSmsDueDeps, ContractSmsDueRow } from './send-due.types'

function contentFor(row: ContractSmsDueRow) {
  if (row.kind === 'reminder') return badakanContractReminderSmsContent
  return badakanContractSignSmsContent
}

export async function sendOneContractSignSms(
  row: ContractSmsDueRow,
  deps: ContractSmsDueDeps,
): Promise<'sent' | 'skippedNoPhone'> {
  const to = row.phone ? toSmsRecipient(row.phone) : null
  if (!to) return 'skippedNoPhone'
  await deps.sendSms({ to, content: contentFor(row) })
  await deps.markSent(row.contractId, row.kind)
  return 'sent'
}
