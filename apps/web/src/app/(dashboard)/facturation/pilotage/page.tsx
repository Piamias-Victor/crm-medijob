import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { FacturationPilotagePage } from '@/components/organisms/FacturationPilotagePage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { readPilotageFilters } from '@/lib/filters/read-pilotage-filters'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function Page({ searchParams }: Props) {
  const params = await searchParams
  const caller = await createServerCaller()
  const refs = await caller.facturation.referentials()
  const { filterConfig, serverFilters } = readPilotageFilters(params, refs.recruiters)
  const initialPilotage = await caller.facturation.pilotage(serverFilters)
  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <FacturationPilotagePage
        initialPilotage={initialPilotage}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
      />
    </Suspense>
  )
}
