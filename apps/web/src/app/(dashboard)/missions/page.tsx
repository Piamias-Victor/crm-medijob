import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { MissionsPage } from '@/components/organisms/MissionsPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { buildMissionFilterConfig } from '@/lib/filters/mission-filter-config'
import { toMissionListFilters } from '@/lib/filters/mission-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const refs = await caller.mission.referentials()
  const filterConfig = buildMissionFilterConfig(refs.pharmacies, refs.jobTitles, refs.recruiters)
  const serverFilters = toMissionListFilters(
    deserializeFilters(filterConfig, toUrlSearchParams(params)),
  )
  const { rows } = await caller.mission.list(serverFilters)

  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <MissionsPage
        initialRows={rows}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
        pharmacies={refs.pharmacies}
        jobTitles={refs.jobTitles}
        recruiters={refs.recruiters}
      />
    </Suspense>
  )
}
