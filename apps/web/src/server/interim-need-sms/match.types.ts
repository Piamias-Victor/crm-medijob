export type NeedSmsCandidate = {
  id: string
  jobTitleId: string
  lastSentAt: Date | null
  latitude: number | null
  longitude: number | null
  postalCode: string | null
}

export type NeedSmsRow = NeedSmsCandidate & { phone: string | null }

export type NeedSmsNeed = {
  jobTitleId: string | null
  createdAt: Date
  latitude: number | null
  longitude: number | null
  postalCode: string | null
}
