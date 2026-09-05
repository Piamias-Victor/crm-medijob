import { createServerCaller } from '@/lib/trpc/server'
import { InterimSuiviPage } from '@/components/organisms/InterimSuiviPage'

export default async function Page() {
  const caller = await createServerCaller()
  const buckets = await caller.badakanMission.suivi()
  return <InterimSuiviPage buckets={buckets} />
}
