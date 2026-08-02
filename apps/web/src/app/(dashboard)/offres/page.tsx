import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { OffresPage } from '@/components/organisms/OffresPage'
import { EntityListPageSkeleton } from '@/components/molecules/skeletons/EntityListPageSkeleton'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.jobOffer.list()

  return (
    <Suspense fallback={<EntityListPageSkeleton />}>
      <OffresPage initialRows={rows} />
    </Suspense>
  )
}
