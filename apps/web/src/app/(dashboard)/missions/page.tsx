import { createServerCaller } from '@/lib/trpc/server'
import { MissionsPage } from '@/components/organisms/MissionsPage'

export default async function Page() {
  const caller = await createServerCaller()
  const missions = await caller.mission.list()

  return <MissionsPage missions={missions} />
}
