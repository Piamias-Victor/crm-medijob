import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { OffresPage } from '@/components/organisms/OffresPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { buildJobOfferFilterConfig } from '@/lib/filters/job-offer-filter-config'
import { toJobOfferListFilters } from '@/lib/filters/job-offer-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const refs = await caller.mission.referentials()
  const filterConfig = buildJobOfferFilterConfig(refs.pharmacies, refs.jobTitles, refs.recruiters)
  const serverFilters = toJobOfferListFilters(
    deserializeFilters(filterConfig, toUrlSearchParams(params)),
  )
  const rows = await caller.jobOffer.list(serverFilters)

  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <OffresPage
        initialRows={rows}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
      />
    </Suspense>
  )
}
