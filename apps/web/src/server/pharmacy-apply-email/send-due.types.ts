export type PharmacyApplyEmailDueRow = {
  missionBadakanId: string
  recipientId: string
  pharmacyEmail: string | null
  primaryEmail: string | null
  primaryFirstName: string | null
}

export type PharmacyApplyEmailDueResult = {
  sent: number
  skippedNoEmail: number
  failed: number
  lastError?: string
}

export type PharmacyApplyEmailDueDeps = {
  listDue: () => Promise<PharmacyApplyEmailDueRow[]>
  sendEmail: (input: { to: string[]; firstName: string }) => Promise<void>
  markSent: (missionBadakanId: string, recipientId: string) => Promise<void>
}
