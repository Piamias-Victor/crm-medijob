import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { AppIntakeFollowUpSection } from '@/components/organisms/AppIntakeFollowUpSection'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.appProfile.listIntakeFollowUp()
  return (
    <Suspense fallback={<EntityTableSkeleton />}>
      <AppIntakeFollowUpSection initialItems={rows} />
    </Suspense>
  )
}
