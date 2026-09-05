import { createServerCaller } from '@/lib/trpc/server'
import { InterimHomeDashboard } from '@/components/organisms/InterimHomeDashboard'
import { buildAvailabilityFilterConfig } from '@/lib/filters/availability-filter-config'
import { parisYmd } from '@/lib/paris-week'

export default async function Page() {
  const caller = await createServerCaller()
  const today = parisYmd(new Date())
  const [{ jobTitles }, needs, availabilityRows, suivi] = await Promise.all([
    caller.candidate.referentials(),
    caller.badakanMission.listNeeds(),
    caller.weeklyAvailability.search({ dateFrom: today, hasDispo: 'all' }),
    caller.badakanMission.suivi(),
  ])
  return (
    <InterimHomeDashboard
      needs={needs}
      availabilityRows={availabilityRows}
      availabilityFilters={{ dateFrom: today, hasDispo: 'all' }}      availabilityFilterConfig={buildAvailabilityFilterConfig(jobTitles)}
      suivi={suivi}
    />
  )
}
