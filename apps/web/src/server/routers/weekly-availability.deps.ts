import { createRawToken } from '@/server/auth/hash-token'
import { getAppBaseUrl } from '@/server/auth/app-base-url'
import { prisma } from '@/server/db/repositories/client'
import { makeWeeklyAvailabilityRepository } from '@/server/db/repositories/weekly-availability.repo'
import type { WeeklyAvailabilityStore } from '@/server/weekly-availability/types'

export type WeeklyAvailabilityDeps = {
  store: WeeklyAvailabilityStore
  createToken: () => string
  getBaseUrl: () => string
}

export function defaultWeeklyAvailabilityDeps(): WeeklyAvailabilityDeps {
  return {
    store: makeWeeklyAvailabilityRepository(prisma),
    createToken: createRawToken,
    getBaseUrl: getAppBaseUrl,
  }
}
