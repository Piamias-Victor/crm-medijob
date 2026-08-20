import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { FacturationSuiviPage } from '@/components/organisms/FacturationSuiviPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { buildFacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import { toFacturationSuiviFilters } from '@/lib/filters/facturation-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const refs = await caller.facturation.referentials()
  const filterConfig = buildFacturationFilterConfig(refs.pharmacies, refs.recruiters)
  const serverFilters = toFacturationSuiviFilters(
    deserializeFilters(filterConfig, toUrlSearchParams(params)),
  )
  const { rows } = await caller.facturation.listSuivi(serverFilters)

  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <FacturationSuiviPage
        initialRows={rows}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
      />
    </Suspense>
  )
}
