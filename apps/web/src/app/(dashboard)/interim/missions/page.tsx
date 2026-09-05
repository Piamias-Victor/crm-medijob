import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { BadakanMissionList } from '@/components/organisms/BadakanMissionList'
import { SectionCard } from '@/components/molecules/SectionCard'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'
import { interimCountLabel } from '@/view-models/interim-count-label'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.badakanMission.list()
  return (
    <SectionCard title="Missions" description={interimCountLabel(rows.length, 'mission')}>
      <Suspense fallback={<EntityTableSkeleton />}>
        <BadakanMissionList rows={rows} />
      </Suspense>
    </SectionCard>
  )
}
