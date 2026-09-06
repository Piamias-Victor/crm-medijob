import { createServerCaller } from '@/lib/trpc/server'
import { InterimHomeAlerts } from '@/components/organisms/InterimHomeAlerts'
import { InterimSecondaryLinks } from '@/components/molecules/InterimSecondaryLinks'
import {
  besoinsWeekHref,
  candidatsCreatedWithinHref,
  listUnfilledThisWeek,
  toHomeAlertCandidates,
} from '@/view-models/interim-home-alerts'

export default async function Page() {
  const caller = await createServerCaller()
  const [needs, recent] = await Promise.all([
    caller.badakanMission.listAllNeeds(),
    caller.candidate.list({ createdWithinHours: 24 }),
  ])
  const missionRows = listUnfilledThisWeek(needs)
  const candidateRows = toHomeAlertCandidates(recent.rows)
  return (
    <div className="flex flex-col gap-6">
      <InterimHomeAlerts
        unfilledThisWeek={{
          count: missionRows.length,
          href: besoinsWeekHref(),
          rows: missionRows,
        }}
        newCandidates={{
          count: candidateRows.length,
          href: candidatsCreatedWithinHref(24),
          rows: candidateRows,
        }}
      />
      <InterimSecondaryLinks />
    </div>
  )
}
