import type { SmsDueKind } from '@/view-models/badakan-contract-sms'

export type ContractSmsDueRow = {
  contractId: string
  candidateId: string
  phone: string | null
  kind: SmsDueKind
}

export type ContractSmsDueResult = {
  sent: number
  skippedNoPhone: number
  failed: number
  lastError?: string
}

export type ContractSmsDueDeps = {
  listDue: () => Promise<ContractSmsDueRow[]>
  sendSms: (input: { to: string; content: string }) => Promise<void>
  markSent: (contractId: string, kind: SmsDueKind) => Promise<void>
}
