import {
  badakanMissionSchema,
  type BadakanMissionRaw,
  type BadakanPeriodRaw,
} from './map-mission.schema'
import { mapBadakanMissionDetails, type BadakanMissionDetails } from './map-mission-details'

export { badakanMissionSchema }

export type BadakanSearchApplied = {
  recipientId: string
  firstName: string
  lastName: string
  phone: string | null
}

export type BadakanMissionPeriod = { start: string | null; end: string | null }

export type BadakanMission = BadakanMissionDetails & {
  badakanId: string
  pharmacyName: string
  enterpriseId: string | null
  step: string
  periods: BadakanMissionPeriod[]
  searchApplied: BadakanSearchApplied[]
}

function mapPeriod(p: BadakanPeriodRaw): BadakanMissionPeriod {
  return { start: p.startDate ?? p.beginDate ?? null, end: p.endDate ?? null }
}

function mapPeriods(raw: BadakanMissionRaw): BadakanMissionPeriod[] {
  const listed = (raw.periods ?? []).map(mapPeriod).filter((p) => p.start || p.end)
  if (listed.length > 0) return listed
  if (raw.expectedStartDate || raw.expectedEndDate) {
    return [{ start: raw.expectedStartDate ?? null, end: raw.expectedEndDate ?? null }]
  }
  return []
}

function mapApplied(raw: BadakanMissionRaw): BadakanSearchApplied[] {
  return (raw.recipients ?? [])
    .filter((row) => row.currentStep === 'SEARCH_APPLIED')
    .flatMap((row) => {
      const recipientId = row.recipientId ?? row.id
      if (!recipientId) return []
      return [
        {
          recipientId,
          firstName: (row.firstName ?? '').trim() || '—',
          lastName: (row.lastName ?? '').trim() || '—',
          phone: row.validatedPhoneNumber ?? row.phone ?? row.mobilePhone ?? null,
        },
      ]
    })
}

export function mapBadakanMission(raw: unknown): BadakanMission | null {
  const parsed = badakanMissionSchema.safeParse(raw)
  if (!parsed.success) return null
  const r = parsed.data
  return {
    ...mapBadakanMissionDetails(r),
    badakanId: r.id,
    pharmacyName: (r.enterprise?.enterpriseName ?? r.enterprise?.name ?? '').trim() || '—',
    enterpriseId: r.enterprise?.id ?? null,
    step: (r.currentStep ?? '').trim() || '—',
    periods: mapPeriods(r),
    searchApplied: mapApplied(r),
  }
}
