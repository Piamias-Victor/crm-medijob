import { getServerCaller } from '@/lib/trpc/server'
import { CandidatsPage } from '@/components/organisms/CandidatsPage'

export default async function Page() {
  const caller = await getServerCaller()
  const [cvtheque, inbox] = await Promise.all([
    caller.candidate.cvtheque(),
    caller.application.listInbox(),
  ])

  return <CandidatsPage cvtheque={cvtheque} inbox={inbox} />
}
