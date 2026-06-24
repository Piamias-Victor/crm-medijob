import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { CandidateCreatePage } from '@/components/organisms/candidate-create-page/CandidateCreatePage'
import { buildCandidateCreateDefaults } from '@/view-models/candidate-create-defaults'

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const caller = await createServerCaller()
  const referentials = await caller.candidate.referentials()
  const jobTitleId = referentials.jobTitles[0]?.id
  if (!jobTitleId) redirect('/candidats')

  return (
    <CandidateCreatePage
      defaultValues={buildCandidateCreateDefaults(session.user.id, jobTitleId)}
      referentials={referentials}
    />
  )
}
