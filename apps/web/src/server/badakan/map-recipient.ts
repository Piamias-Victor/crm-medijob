import {
  badakanRecipientSchema,
  type ActivityItem,
  type BadakanRecipientRaw,
} from './map-recipient.schema'
import {
  mapBadakanEmployeeStatus,
  type BadakanEmployeeStatus,
} from './map-recipient-status'

export { badakanRecipientSchema, type BadakanRecipientRaw }

export type BadakanRecipient = {
  badakanId: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  activityLabel: string | null
  hasResume: boolean
  nir: string | null
  iban: string | null
  status: BadakanEmployeeStatus | null
  snapshot: BadakanRecipientRaw
}

function labelOf(value: ActivityItem | null | undefined): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.label ?? value.name ?? null
}

function joinAddress(a: NonNullable<BadakanRecipientRaw['address']>): string | null {
  const line = [a.address1, a.address2].map((p) => p?.trim()).filter(Boolean).join(', ')
  return line || null
}

function present(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function mapBadakanRecipient(raw: unknown): BadakanRecipient | null {
  const parsed = badakanRecipientSchema.safeParse(raw)
  if (!parsed.success) return null
  const r = parsed.data
  const firstName = (r.firstName ?? '').trim()
  const lastName = (r.lastName ?? '').trim()
  if (!firstName && !lastName) return null
  return {
    badakanId: r.id,
    firstName: firstName || '—',
    lastName: lastName || '—',
    email: r.email ?? null,
    phone: r.validatedPhoneNumber ?? r.phone ?? r.mobilePhone ?? null,
    address: r.address ? joinAddress(r.address) : null,
    city: r.address?.city ?? r.city ?? null,
    postalCode: r.address?.zipCode ?? r.zipCode ?? null,
    activityLabel: labelOf(r.activity) ?? labelOf(r.activities?.[0]),
    hasResume: Boolean(r.documents?.RESUME?.rectoUrl),
    nir: present(r.healthCareNumber),
    iban: present(r.bankAccount?.iban),
    status: mapBadakanEmployeeStatus(r.status),
    snapshot: r,
  }
}
