import { createRawToken } from '@/server/auth/hash-token'
import { getAppBaseUrl } from '@/server/auth/app-base-url'
import { prisma } from '@/server/db/repositories/client'
import { makeWeeklyAvailabilityRepository } from '@/server/db/repositories/weekly-availability.repo'
import { makeWeeklyAvailabilityFilterRepository } from '@/server/db/repositories/weekly-availability-filter.repo'
import { createAvailabilityFilterGeoLookup } from '@/server/weekly-availability/filter-geo-lookup'
import type { GeoLookup } from '@/server/matching/distance'
import type { WeeklyAvailabilityStore } from '@/server/weekly-availability/types'
import type { WeeklyAvailabilityFilterStore } from '@/server/weekly-availability/filter-pool'

export type WeeklyAvailabilityDeps = {
  store: WeeklyAvailabilityStore
  filterStore: WeeklyAvailabilityFilterStore
  lookupGeo: GeoLookup
  createToken: () => string
  getBaseUrl: () => string
}

export function defaultWeeklyAvailabilityDeps(): WeeklyAvailabilityDeps {
  return {
    store: makeWeeklyAvailabilityRepository(prisma),
    filterStore: makeWeeklyAvailabilityFilterRepository(prisma),
    lookupGeo: createAvailabilityFilterGeoLookup(),
    createToken: createRawToken,
    getBaseUrl: getAppBaseUrl,
  }
}
