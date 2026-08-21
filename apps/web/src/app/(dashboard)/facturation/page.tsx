import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { FacturationOverviewPage } from '@/components/organisms/FacturationOverviewPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { readFacturationOverviewFilters } from '@/lib/filters/read-facturation-filters'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const refs = await caller.facturation.referentials()
  const { filterConfig, serverFilters } = readFacturationOverviewFilters(
    params,
    refs.pharmacies,
    refs.recruiters,
  )
  const overview = await caller.facturation.overview(serverFilters)

  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <FacturationOverviewPage
        initialOverview={overview}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
      />
    </Suspense>
  )
}
