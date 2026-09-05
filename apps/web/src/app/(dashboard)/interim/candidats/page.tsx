import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { InterimCandidatesPage } from '@/components/organisms/interim-candidates/InterimCandidatesPage'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'
import { buildCvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import {
  normalizeCvthequeFilterValues,
  toCandidateListFilters,
} from '@/lib/filters/cvtheque-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const referentials = await caller.candidate.referentials()
  const filterConfig = buildCvthequeFilterConfig(referentials)
  const serverFilters = toCandidateListFilters(
    normalizeCvthequeFilterValues(deserializeFilters(filterConfig, toUrlSearchParams(params))),
  )
  const [list, declared] = await Promise.all([
    caller.candidate.list(serverFilters),
    caller.weeklyAvailability.search(),
  ])

  return (
    <Suspense fallback={<EntityTableSkeleton />}>
      <InterimCandidatesPage
        initialList={list}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
        declared={declared}
      />
    </Suspense>
  )
}
