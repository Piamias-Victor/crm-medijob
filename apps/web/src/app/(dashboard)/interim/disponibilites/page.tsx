import { createServerCaller } from '@/lib/trpc/server'
import {
  filterFormValues,
  parseAvailabilityFilter,
} from '@/view-models/weekly-availability-filter-parse'
import { WeeklyAvailabilityFilterPage } from '@/components/organisms/WeeklyAvailabilityFilterPage'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const filter = parseAvailabilityFilter(params)
  const caller = await createServerCaller()
  const [{ jobTitles }, rows] = await Promise.all([
    caller.candidate.referentials(),
    filter ? caller.weeklyAvailability.filter(filter) : Promise.resolve([]),
  ])
  return (
    <WeeklyAvailabilityFilterPage
      jobTitles={jobTitles}
      values={filterFormValues(filter)}
      rows={rows}
      queried={Boolean(filter)}
    />
  )
}
