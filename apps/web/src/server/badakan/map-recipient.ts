import { z } from 'zod'

const activityItem = z.union([
  z.string(),
  z.object({ label: z.string().optional(), name: z.string().optional() }),
])

export const badakanRecipientSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    mobilePhone: z.string().optional().nullable(),
    validatedPhoneNumber: z.string().optional().nullable(),
    address: z
      .object({
        address1: z.string().optional().nullable(),
        address2: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        zipCode: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
    city: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    activity: activityItem.optional().nullable(),
    activities: z.array(activityItem).optional().nullable(),
    documents: z
      .object({
        RESUME: z.object({ rectoUrl: z.string().optional() }).optional(),
      })
      .passthrough()
      .optional()
      .nullable(),
  })
  .passthrough()

export type BadakanRecipientRaw = z.infer<typeof badakanRecipientSchema>

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
  snapshot: BadakanRecipientRaw
}

function labelOf(value: z.infer<typeof activityItem> | null | undefined): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.label ?? value.name ?? null
}

function joinAddress(a: NonNullable<BadakanRecipientRaw['address']>): string | null {
  const line = [a.address1, a.address2].map((p) => p?.trim()).filter(Boolean).join(', ')
  return line || null
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
    snapshot: r,
  }
}
