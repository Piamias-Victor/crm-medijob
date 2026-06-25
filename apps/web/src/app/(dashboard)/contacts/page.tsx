import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { ContactsPage } from '@/components/organisms/ContactsPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { buildContactFilterConfig } from '@/lib/filters/contact-filter-config'
import { toContactListFilters } from '@/lib/filters/contact-filter-map'
import { deserializeFilters } from '@/lib/filters/serialize'
import { toUrlSearchParams } from '@/lib/url-search-params'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const pharmacies = await caller.contact.referentials()
  const filterConfig = buildContactFilterConfig(pharmacies)
  const serverFilters = toContactListFilters(
    deserializeFilters(filterConfig, toUrlSearchParams(params)),
  )
  const rows = await caller.contact.list(serverFilters)

  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <ContactsPage initialRows={rows} serverFilters={serverFilters} filterConfig={filterConfig} />
    </Suspense>
  )
}
