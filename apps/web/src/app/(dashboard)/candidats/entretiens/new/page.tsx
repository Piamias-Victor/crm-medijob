import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { InterviewStartPage } from '@/components/organisms/interview-start-page/InterviewStartPage'
import { buildInterviewStartDefaults } from '@/view-models/interview-start-defaults'

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const caller = await createServerCaller()
  const referentials = await caller.candidate.referentials()
  const jobTitleId = referentials.jobTitles[0]?.id
  if (!jobTitleId) redirect('/candidats')

  return (
    <InterviewStartPage
      defaultValues={buildInterviewStartDefaults({ jobTitleId })}
      jobTitles={referentials.jobTitles}
    />
  )
}
