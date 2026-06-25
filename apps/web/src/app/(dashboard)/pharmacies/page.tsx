import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { PharmaciesPage } from '@/components/organisms/PharmaciesPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { buildPharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import { toPharmacyListFilters } from '@/lib/filters/pharmacy-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const referentials = await caller.pharmacy.referentials()
  const filterConfig = buildPharmacyFilterConfig(referentials)
  const serverFilters = toPharmacyListFilters(
    deserializeFilters(filterConfig, toUrlSearchParams(params)),
  )
  const rows = await caller.pharmacy.list(serverFilters)

  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <PharmaciesPage initialRows={rows} serverFilters={serverFilters} filterConfig={filterConfig} />
    </Suspense>
  )
}
