import type { LogAutomaticSend } from '@/server/activity-log/log-automatic-send'

export type ContractSignEmailDueRow = {
  contractId: string
  pharmacyId: string | null
  contactId: string | null
  pharmacyEmail: string | null
  primaryEmail: string | null
  primaryFirstName: string | null
}

export type ContractSignEmailDueResult = {
  sent: number
  skippedNoEmail: number
  failed: number
  lastError?: string
}

export type ContractSignEmailDueDeps = {
  listDue: () => Promise<ContractSignEmailDueRow[]>
  sendEmail: (input: { to: string[]; firstName: string }) => Promise<void>
  markSent: (contractId: string) => Promise<void>
  logSend: LogAutomaticSend
}
