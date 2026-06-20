import { createServerCaller } from '@/lib/trpc/server'
import { CandidatsPage } from '@/components/organisms/CandidatsPage'

export default async function Page() {
  const caller = await createServerCaller()
  const [list, inbox, refs] = await Promise.all([
    caller.candidate.list(),
    caller.application.listInbox(),
    caller.candidate.referentials(),
  ])

  return (
    <CandidatsPage
      list={list}
      inbox={inbox}
      jobTitles={refs.jobTitles}
      recruiters={refs.recruiters}
    />
  )
}
