import { memoryAvailabilityStore } from '@/server/weekly-availability/test-store'
import { memoryFilterStore } from '@/server/weekly-availability/memory-filter-store'
import { memoryDeclaredStore } from '@/server/weekly-availability/memory-declared-store'
import type { WeeklyAvailabilityDeps } from '@/server/routers/weekly-availability.deps'
import type { AvailabilityFilterSeed } from '@/server/weekly-availability/filter-pool'

export const LYON = { lat: 45.75, lon: 4.85 }
export const PARIS = { lat: 48.85, lon: 2.35 }

export const marie: AvailabilityFilterSeed = {
  id: 'marie',
  firstName: 'Marie',
  lastName: 'Dupont',
  phone: '06 12 34 56 78',
  city: 'Lyon',
  postalCode: '69003',
  jobTitleId: 'jt-prep',
  jobTitleName: 'Préparateur',
  origin: 'APP',
  status: 'NOUVEAU',
  slots: [{ date: '2026-09-02', period: 'AM' }],
}

export function filterDeps(
  seeds: AvailabilityFilterSeed[] = [marie],
  lookupGeo: WeeklyAvailabilityDeps['lookupGeo'] = async () => LYON,
): WeeklyAvailabilityDeps {
  return {
    store: memoryAvailabilityStore([{ candidateId: 'marie', origin: 'APP' }]),
    filterStore: memoryFilterStore(seeds),
    declaredStore: memoryDeclaredStore(seeds),
    lookupGeo,
    createToken: () => 'token',
    getBaseUrl: () => 'http://localhost:3000',
    resendSms: async () => 'sent' as const,
  }
}

export const wedAmPrep = {
  date: '2026-09-02' as const,
  period: 'AM' as const,
  jobTitleId: 'jt-prep',
  city: 'Lyon',
}
