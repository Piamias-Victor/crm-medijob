import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { FacturationSuiviPage } from '@/components/organisms/FacturationSuiviPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { readFacturationFilters } from '@/lib/filters/read-facturation-filters'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const refs = await caller.facturation.referentials()
  const { filterConfig, serverFilters } = readFacturationFilters(
    params,
    refs.pharmacies,
    refs.recruiters,
  )
  const { rows } = await caller.facturation.listSuivi(serverFilters)

  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <FacturationSuiviPage
        initialRows={rows}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
        pharmacies={refs.pharmacies}
        candidates={refs.candidates}
        missions={refs.missions}
      />
    </Suspense>
  )
}
