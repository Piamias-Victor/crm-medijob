import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ClipboardCheck } from 'lucide-react'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { InterviewCloseForm } from '@/components/organisms/interview-close-form/InterviewCloseForm'
import {
  INTERVIEW_CLOSE_BACK,
  INTERVIEW_CLOSE_HINT,
  INTERVIEW_CLOSE_PAGE,
} from '@/view-models/interview-copy'

type Props = { params: Promise<{ id: string; interviewId: string }> }

export default async function Page({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { id, interviewId } = await params
  const caller = await createServerCaller()
  const preview = await caller.interview.previewClose({ id: interviewId })
  if (!preview || preview.candidateId !== id) notFound()

  return (
    <DashboardPage
      icon={<ClipboardCheck className="size-5" />}
      title={INTERVIEW_CLOSE_PAGE}
      description={INTERVIEW_CLOSE_HINT}
      maxWidth="max-w-5xl"
      nav={
        <Link
          href={`/candidats/${id}/entretiens/${interviewId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted transition-colors hover:text-accent-hover"
        >
          <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
          {INTERVIEW_CLOSE_BACK}
        </Link>
      }
    >
      <InterviewCloseForm preview={preview} interviewId={interviewId} />
    </DashboardPage>
  )
}
