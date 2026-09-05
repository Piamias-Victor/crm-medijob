import { createRawToken } from '@/server/auth/hash-token'
import { getAppBaseUrl } from '@/server/auth/app-base-url'
import { prisma } from '@/server/db/repositories/client'
import { makeWeeklyAvailabilityRepository } from '@/server/db/repositories/weekly-availability.repo'
import { makeWeeklyAvailabilityFilterRepository } from '@/server/db/repositories/weekly-availability-filter.repo'
import { createAvailabilityFilterGeoLookup } from '@/server/weekly-availability/filter-geo-lookup'
import { resendAvailabilitySms } from '@/server/weekly-availability/sms-resend'
import { defaultResendSmsDeps } from '@/server/weekly-availability/sms-due.deps'
import type { GeoLookup } from '@/server/matching/distance'
import type { WeeklyAvailabilityStore } from '@/server/weekly-availability/types'
import { makeWeeklyAvailabilityDeclaredRepository } from '@/server/db/repositories/weekly-availability-declared.repo'
import type {
  WeeklyAvailabilityDeclaredStore,
  WeeklyAvailabilityFilterStore,
} from '@/server/weekly-availability/filter-pool'

export type WeeklyAvailabilityDeps = {
  store: WeeklyAvailabilityStore
  filterStore: WeeklyAvailabilityFilterStore
  declaredStore: WeeklyAvailabilityDeclaredStore
  lookupGeo: GeoLookup
  createToken: () => string
  getBaseUrl: () => string
  resendSms: (
    candidateId: string,
  ) => Promise<'sent' | 'skippedNoPhone' | 'not_app' | 'not_found'>
}

export function defaultWeeklyAvailabilityDeps(): WeeklyAvailabilityDeps {
  return {
    store: makeWeeklyAvailabilityRepository(prisma),
    filterStore: makeWeeklyAvailabilityFilterRepository(prisma),
    declaredStore: makeWeeklyAvailabilityDeclaredRepository(prisma),
    lookupGeo: createAvailabilityFilterGeoLookup(),
    createToken: createRawToken,
    getBaseUrl: getAppBaseUrl,
    resendSms: (candidateId) =>
      resendAvailabilitySms(candidateId, defaultResendSmsDeps()),
  }
}
