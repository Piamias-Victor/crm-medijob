import type {
  AvailabilityFilterPoolRow,
  AvailabilityFilterSeed,
  WeeklyAvailabilityFilterStore,
} from './filter-pool'

export function memoryFilterStore(
  seeds: AvailabilityFilterSeed[] = [],
): WeeklyAvailabilityFilterStore {
  return {
    listBySlot: async ({ date, period, jobTitleId }) =>
      seeds
        .filter(
          (row) =>
            row.origin === 'APP' &&
            row.status !== 'INACTIF' &&
            row.jobTitleId === jobTitleId &&
            row.slots.some((slot) => slot.date === date && slot.period === period),
        )
        .map(
          ({
            id,
            firstName,
            lastName,
            phone,
            city,
            postalCode,
            jobTitleName,
          }): AvailabilityFilterPoolRow => ({
            id,
            firstName,
            lastName,
            phone,
            city,
            postalCode,
            jobTitleName,
          }),
        ),
  }
}
