import { notFound, redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { InterviewCloseForm } from '@/components/organisms/interview-close-form/InterviewCloseForm'
import { INTERVIEW_CLOSE_CONFIRM } from '@/view-models/interview-copy'

type Props = { params: Promise<{ id: string; interviewId: string }> }

export default async function Page({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id, interviewId } = await params
  const caller = await createServerCaller()
  const preview = await caller.interview.previewClose({ id: interviewId })
  if (!preview || preview.candidateId !== id) notFound()

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref={`/candidats/${id}/entretiens/${interviewId}`}
          backLabel="Retour à l’entretien"
          name={INTERVIEW_CLOSE_CONFIRM}
        />
      }
      tabKey="close"
    >
      <SectionCard variant="glass" title={INTERVIEW_CLOSE_CONFIRM} bodyClassName="p-5 sm:p-6">
        <InterviewCloseForm preview={preview} interviewId={interviewId} />
      </SectionCard>
    </EntityDetailShell>
  )
}
