import { createServerCaller } from '@/lib/trpc/server'
import { MissionsPage } from '@/components/organisms/MissionsPage'

export default async function Page() {
  const caller = await createServerCaller()
  const [{ rows }, refs] = await Promise.all([
    caller.mission.list(),
    caller.mission.referentials(),
  ])

  return (
    <MissionsPage
      rows={rows}
      pharmacies={refs.pharmacies}
      jobTitles={refs.jobTitles}
      recruiters={refs.recruiters}
    />
  )
}
