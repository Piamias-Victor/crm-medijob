export type SmsDueKind = 'first' | 'reminder'

export type SmsDueRow = {
  candidateId: string
  firstName: string
  phone: string | null
  kind: SmsDueKind
}

export type AvailabilitySmsContact = {
  origin: 'APP' | 'CRM'
  status: string
  firstName: string
  phone: string | null
}

export type SmsDueDeps = {
  listDue: () => Promise<SmsDueRow[]>
  ensureUrl: (candidateId: string) => Promise<string | null>
  sendSms: (input: { to: string; content: string }) => Promise<void>
  markSent: (candidateId: string) => Promise<void>
  testTo?: string
}

export type SmsDueResult = {
  sent: number
  skippedNoPhone: number
  failed: number
  lastError?: string
}
