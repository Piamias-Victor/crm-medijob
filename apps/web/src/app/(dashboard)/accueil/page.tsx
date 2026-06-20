import { createServerCaller } from '@/lib/trpc/server'
import { HomePage } from '@/components/organisms/HomePage'

export default async function Page() {
  const caller = await createServerCaller()
  const [overview, missionRefs, pharmacyRefs] = await Promise.all([
    caller.dashboard.overview(),
    caller.mission.referentials(),
    caller.pharmacy.referentials(),
  ])

  return (
    <HomePage
      overview={overview}
      referentials={{
        jobTitles: missionRefs.jobTitles,
        recruiters: missionRefs.recruiters,
        pharmacies: missionRefs.pharmacies,
        groupements: pharmacyRefs.groupements,
        softwares: pharmacyRefs.softwares,
      }}
    />
  )
}
