export type ContractSignEmailDueRow = {
  contractId: string
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
}
