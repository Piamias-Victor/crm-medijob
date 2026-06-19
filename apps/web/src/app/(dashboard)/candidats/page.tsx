import { createServerCaller } from '@/lib/trpc/server'
import { CandidatsPage } from '@/components/organisms/CandidatsPage'

export default async function Page() {
  const caller = await createServerCaller()
  const [list, inbox] = await Promise.all([
    caller.candidate.list(),
    caller.application.listInbox(),
  ])

  return <CandidatsPage list={list} inbox={inbox} />
}
