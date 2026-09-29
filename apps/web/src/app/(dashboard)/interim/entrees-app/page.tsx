import { Suspense } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { AppIntakeFollowUpSection } from '@/components/organisms/AppIntakeFollowUpSection'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'

export default async function Page() {
  const caller = await createServerCaller()
  const [rows, refs, statuses] = await Promise.all([
    caller.appProfile.listIntakeFollowUp({ referentScope: 'mine' }),
    caller.candidate.referentials(),
    caller.appProfile.listIntakeStatuses(),
  ])
  return (
    <Suspense fallback={<EntityTableSkeleton />}>
      <AppIntakeFollowUpSection
        initialItems={rows}
        recruiters={refs.recruiters}
        statuses={statuses}
      />
    </Suspense>
  )
}
