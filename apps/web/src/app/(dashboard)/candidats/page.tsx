import { createServerCaller } from '@/lib/trpc/server'
import { CandidatsPage } from '@/components/organisms/CandidatsPage'
import { parseCandidatsTab } from '@/view-models/candidats-tab'

type Props = { searchParams: Promise<{ tab?: string }> }

export default async function Page({ searchParams }: Props) {
  const { tab } = await searchParams
  const caller = await createServerCaller()
  const [list, inbox] = await Promise.all([
    caller.candidate.list(),
    caller.application.listInbox(),
  ])

  return <CandidatsPage list={list} inbox={inbox} initialTab={parseCandidatsTab(tab)} />
}
