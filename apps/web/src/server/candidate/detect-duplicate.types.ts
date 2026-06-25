export type DuplicateIdentity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
}

export type DuplicateMatch = {
  candidateId: string
  reason: 'email' | 'name_phone'
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
}
