import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { BadakanNeedList } from '@/components/organisms/BadakanNeedList'
import { SectionCard } from '@/components/molecules/SectionCard'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'
import { interimCountLabel } from '@/view-models/interim-count-label'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.badakanMission.listNeeds()
  return (
    <SectionCard
      title="Besoins ouverts"
      description={`${interimCountLabel(rows.length, 'besoin')} — missions Badakan pas encore staffées.`}
    >
      <Suspense fallback={<EntityTableSkeleton />}>
        <BadakanNeedList rows={rows} />
      </Suspense>
    </SectionCard>
  )
}
