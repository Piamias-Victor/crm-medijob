import { createServerCaller } from '@/lib/trpc/server'
import { InterimHomeAlerts } from '@/components/organisms/InterimHomeAlerts'
import { InterimSecondaryLinks } from '@/components/molecules/InterimSecondaryLinks'
import {
  besoinsWeekHref,
  candidatsCreatedWithinHref,
  countUnfilledThisWeek,
} from '@/view-models/interim-home-alerts'

export default async function Page() {
  const caller = await createServerCaller()
  const [needs, recent] = await Promise.all([
    caller.badakanMission.listAllNeeds(),
    caller.candidate.list({ createdWithinHours: 24 }),
  ])
  return (
    <div className="flex flex-col gap-6">
      <InterimHomeAlerts
        unfilledThisWeek={{
          count: countUnfilledThisWeek(needs),
          href: besoinsWeekHref(),
        }}
        newCandidates={{
          count: recent.rows.length,
          href: candidatsCreatedWithinHref(24),
        }}
      />
      <InterimSecondaryLinks />
    </div>
  )
}
