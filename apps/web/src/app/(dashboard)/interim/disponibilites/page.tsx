import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { AvailabilitySearchPage } from '@/components/organisms/AvailabilitySearchPage'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'
import { buildAvailabilityFilterConfig } from '@/lib/filters/availability-filter-config'
import { toAvailabilitySearchFilters } from '@/lib/filters/availability-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const { jobTitles } = await caller.candidate.referentials()
  const filterConfig = buildAvailabilityFilterConfig(jobTitles)
  const serverFilters = toAvailabilitySearchFilters(
    deserializeFilters(filterConfig, toUrlSearchParams(params)),
  )
  const rows = await caller.weeklyAvailability.search(serverFilters)

  return (
    <Suspense fallback={<EntityTableSkeleton />}>
      <AvailabilitySearchPage
        initialRows={rows}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
      />
    </Suspense>
  )
}
