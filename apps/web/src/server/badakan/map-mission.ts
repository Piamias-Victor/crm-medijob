import { z } from 'zod'

const recipientSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional().nullable(),
    mobilePhone: z.string().optional().nullable(),
    validatedPhoneNumber: z.string().optional().nullable(),
    currentStep: z.string().optional().nullable(),
  })
  .passthrough()

const periodSchema = z
  .object({
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    beginDate: z.string().optional().nullable(),
  })
  .passthrough()

export const badakanMissionSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    currentStep: z.string().optional().nullable(),
    expectedStartDate: z.string().optional().nullable(),
    expectedEndDate: z.string().optional().nullable(),
    enterprise: z
      .object({
        enterpriseName: z.string().optional().nullable(),
        name: z.string().optional().nullable(),
      })
      .passthrough()
      .optional()
      .nullable(),
    periods: z.array(periodSchema).optional().nullable(),
    recipients: z.array(recipientSchema).optional().nullable(),
  })
  .passthrough()

export type BadakanSearchApplied = {
  recipientId: string
  firstName: string
  lastName: string
  phone: string | null
}

export type BadakanMissionPeriod = { start: string | null; end: string | null }

export type BadakanMission = {
  badakanId: string
  pharmacyName: string
  step: string
  periods: BadakanMissionPeriod[]
  searchApplied: BadakanSearchApplied[]
}

function mapPeriod(p: z.infer<typeof periodSchema>): BadakanMissionPeriod {
  return { start: p.startDate ?? p.beginDate ?? null, end: p.endDate ?? null }
}

function mapPeriods(raw: z.infer<typeof badakanMissionSchema>): BadakanMissionPeriod[] {
  const listed = (raw.periods ?? []).map(mapPeriod).filter((p) => p.start || p.end)
  if (listed.length > 0) return listed
  if (raw.expectedStartDate || raw.expectedEndDate) {
    return [{ start: raw.expectedStartDate ?? null, end: raw.expectedEndDate ?? null }]
  }
  return []
}

export function mapBadakanMission(raw: unknown): BadakanMission | null {
  const parsed = badakanMissionSchema.safeParse(raw)
  if (!parsed.success) return null
  const r = parsed.data
  return {
    badakanId: r.id,
    pharmacyName: (r.enterprise?.enterpriseName ?? r.enterprise?.name ?? '').trim() || '—',
    step: (r.currentStep ?? '').trim() || '—',
    periods: mapPeriods(r),
    searchApplied: (r.recipients ?? [])
      .filter((row) => row.currentStep === 'SEARCH_APPLIED')
      .map((row) => ({
        recipientId: row.id,
        firstName: (row.firstName ?? '').trim() || '—',
        lastName: (row.lastName ?? '').trim() || '—',
        phone: row.validatedPhoneNumber ?? row.phone ?? row.mobilePhone ?? null,
      })),
  }
}
