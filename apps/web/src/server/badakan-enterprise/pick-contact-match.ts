import { phonesMatch } from '@/lib/phone-normalize'

export type ContactMatchIdentity = {
  id: string
  email: string | null
  phone: string | null
}

export type ContactMatchProbe = {
  email?: string | null
  phone?: string | null
}

export type ContactMatch = ContactMatchIdentity & { reason: 'email' | 'phone' }

const norm = (value: string) => value.trim().toLowerCase()

export function pickContactMatch(
  probe: ContactMatchProbe,
  contacts: ContactMatchIdentity[],
): ContactMatch | null {
  if (probe.email) {
    const hit = contacts.find(
      (row) => row.email && norm(row.email) === norm(probe.email!),
    )
    if (hit) return { ...hit, reason: 'email' }
  }
  if (probe.phone) {
    const hit = contacts.find(
      (row) => row.phone && phonesMatch(row.phone, probe.phone!),
    )
    if (hit) return { ...hit, reason: 'phone' }
  }
  return null
}
