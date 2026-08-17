import { notFound, redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { InterviewDraftPanel } from '@/components/organisms/interview-draft-panel/InterviewDraftPanel'

type Props = { params: Promise<{ id: string; interviewId: string }> }

export default async function Page({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id, interviewId } = await params
  const caller = await createServerCaller()
  const run = await caller.interview.getRun({ id: interviewId })
  if (!run || run.candidateId !== id) notFound()

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref={`/candidats/${id}`}
          backLabel="Fiche candidat"
          name="Entretien"
        />
      }
      tabKey="draft"
    >
      <SectionCard
        variant="glass"
        title={run.statusLabel}
        description={`${run.templateLabel} · ${run.modeLabel}`}
        bodyClassName="p-5 sm:p-6"
      >
        <InterviewDraftPanel run={run} />
      </SectionCard>
    </EntityDetailShell>
  )
}
