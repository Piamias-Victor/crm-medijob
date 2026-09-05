import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { BadakanContractList } from '@/components/organisms/BadakanContractList'
import { SectionCard } from '@/components/molecules/SectionCard'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'
import { interimCountLabel } from '@/view-models/interim-count-label'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.badakanContract.list()
  return (
    <SectionCard title="Contrats" description={interimCountLabel(rows.length, 'contrat')}>
      <Suspense fallback={<EntityTableSkeleton />}>
        <BadakanContractList rows={rows} />
      </Suspense>
    </SectionCard>
  )
}
