import { notFound, redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { InterviewStartPage } from '@/components/organisms/interview-start-page/InterviewStartPage'
import { buildInterviewStartDefaults } from '@/view-models/interview-start-defaults'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id } = await params
  const caller = await createServerCaller()
  const [profile, referentials] = await Promise.all([
    caller.candidate.getById({ id }),
    caller.candidate.referentials(),
  ])
  if (!profile) notFound()

  const jobTitleId = profile.jobTitleId || referentials.jobTitles[0]?.id
  if (!jobTitleId) redirect('/candidats')

  return (
    <InterviewStartPage
      defaultValues={buildInterviewStartDefaults({
        candidateId: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        jobTitleId,
      })}
      jobTitles={referentials.jobTitles}
    />
  )
}
