import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { FacturationPilotagePage } from '@/components/organisms/FacturationPilotagePage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'
import { buildPilotageFilterConfig } from '@/lib/filters/pilotage-filter-config'

export default async function Page() {
  const caller = await createServerCaller()
  const refs = await caller.facturation.referentials()
  const filterConfig = buildPilotageFilterConfig(refs.recruiters)
  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <FacturationPilotagePage filterConfig={filterConfig} />
    </Suspense>
  )
}
