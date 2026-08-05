import { z } from 'zod'

export const badakanRecipientSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    email: z.string().optional().nullable(),
    mail: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    mobilePhone: z.string().optional().nullable(),
    mobile: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    town: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    activity: z
      .union([z.string(), z.object({ label: z.string().optional(), name: z.string().optional() })])
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
  city: string | null
  postalCode: string | null
  activityLabel: string | null
  snapshot: BadakanRecipientRaw
}

function activityLabel(value: BadakanRecipientRaw['activity']): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.label ?? value.name ?? null
}

export function mapBadakanRecipient(raw: unknown): BadakanRecipient | null {
  const parsed = badakanRecipientSchema.safeParse(raw)
  if (!parsed.success) return null
  const r = parsed.data
  const firstName = (r.firstName ?? r.firstname ?? '').trim()
  const lastName = (r.lastName ?? r.lastname ?? '').trim()
  if (!firstName && !lastName) return null
  return {
    badakanId: r.id,
    firstName: firstName || '—',
    lastName: lastName || '—',
    email: r.email ?? r.mail ?? null,
    phone: r.phone ?? r.mobilePhone ?? r.mobile ?? null,
    city: r.city ?? r.town ?? null,
    postalCode: r.zipCode ?? r.postalCode ?? null,
    activityLabel: activityLabel(r.activity),
    snapshot: r,
  }
}
