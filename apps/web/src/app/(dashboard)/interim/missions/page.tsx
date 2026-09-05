import { createServerCaller } from '@/lib/trpc/server'
import { BadakanMissionList } from '@/components/organisms/BadakanMissionList'

export default async function Page() {
  const caller = await createServerCaller()
  const rows = await caller.badakanMission.list()
  return <BadakanMissionList rows={rows} />
}
