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
        city: z.string().optional().nullable(),
        zipCode: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
    city: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    activity: activityItem.optional().nullable(),
    activities: z.array(activityItem).optional().nullable(),
  })
  .passthrough()

export type BadakanRecipientRaw = z.infer<typeof badakanRecipientSchema>

export type BadakanRecipient = {
  badakanId: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  city: string | null
  postalCode: string | null
  activityLabel: string | null
  snapshot: BadakanRecipientRaw
}

function labelOf(value: z.infer<typeof activityItem> | null | undefined): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.label ?? value.name ?? null
}

function firstActivity(r: BadakanRecipientRaw): string | null {
  return labelOf(r.activity) ?? labelOf(r.activities?.[0])
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
    city: r.address?.city ?? r.city ?? null,
    postalCode: r.address?.zipCode ?? r.zipCode ?? null,
    activityLabel: firstActivity(r),
    snapshot: r,
  }
}
