import type {
  AvailabilityFilterSeed,
  DeclaredAvailabilityPoolRow,
  DeclaredAvailabilityQuery,
  WeeklyAvailabilityDeclaredStore,
} from './filter-pool'

function keptSlots(seed: AvailabilityFilterSeed, query: DeclaredAvailabilityQuery) {
  return seed.slots.filter(
    (slot) =>
      slot.date >= query.from &&
      (!query.dateTo || slot.date <= query.dateTo) &&
      (!query.period || slot.period === query.period),
  )
}

function matchesHasDispo(seed: AvailabilityFilterSeed, query: DeclaredAvailabilityQuery) {
  const mode = query.hasDispo ?? 'yes'
  const count = keptSlots(seed, query).length
  if (mode === 'all') return true
  if (mode === 'no') return count === 0
  return count > 0
}

export function memoryDeclaredStore(
  seeds: AvailabilityFilterSeed[] = [],
): WeeklyAvailabilityDeclaredStore {
  return {
    listDeclared: async (query) =>
      seeds
        .filter(
          (seed) =>
            seed.status !== 'INACTIF' &&
            (!query.jobTitleIds?.length || query.jobTitleIds.includes(seed.jobTitleId)) &&
            matchesHasDispo(seed, query),
        )
        .map(
          (seed): DeclaredAvailabilityPoolRow => ({
            id: seed.id,
            firstName: seed.firstName,
            lastName: seed.lastName,
            phone: seed.phone,
            city: seed.city,
            postalCode: seed.postalCode,
            jobTitleId: seed.jobTitleId,
            jobTitleName: seed.jobTitleName,
            slots: keptSlots(seed, { ...query, period: undefined }),
          }),
        ),
  }
}
