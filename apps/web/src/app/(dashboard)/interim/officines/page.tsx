import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { BadakanEnterpriseList } from '@/components/organisms/BadakanEnterpriseList'
import { SectionCard } from '@/components/molecules/SectionCard'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'
import { interimCountLabel } from '@/view-models/interim-count-label'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.badakanEnterprise.listPending()
  return (
    <SectionCard title="Officines" description={interimCountLabel(rows.length, 'officine')}>
      <Suspense fallback={<EntityTableSkeleton />}>
        <BadakanEnterpriseList rows={rows} />
      </Suspense>
    </SectionCard>
  )
}
