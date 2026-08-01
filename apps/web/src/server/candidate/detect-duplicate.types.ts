export type DuplicateIdentity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
}

export type DuplicateMatchReason = 'email' | 'name_phone' | 'phone'

export type DuplicateMatch = {
  candidateId: string
  reason: DuplicateMatchReason
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
}

export type ImportDuplicateMatch = DuplicateMatch & {
  reason: 'email' | 'phone'
}
