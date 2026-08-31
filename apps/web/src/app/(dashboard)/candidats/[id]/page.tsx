import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { CandidateDetailPage } from '@/components/organisms/CandidateDetailPage'
import { parseCvthequeBackHref } from '@/lib/cvtheque-candidate-href'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ back?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { back } = await searchParams
  const caller = await createServerCaller()
  const [profile, referentials, activities, documents, interviews, comments] = await Promise.all([
    caller.candidate.getById({ id }),
    caller.candidate.referentials(),
    caller.activityLog.listByEntity({ entityType: 'CANDIDATE', entityId: id }),
    caller.document.listByEntity({ entityType: 'CANDIDATE', entityId: id }),
    caller.interview.listByCandidate({ candidateId: id }),
    caller.candidate.listComments({ id }),
  ])

  if (!profile) notFound()

  return (
    <CandidateDetailPage
      profile={profile}
      referentials={referentials}
      activities={activities}
      documents={documents}
      interviews={interviews}
      comments={comments}
      backHref={parseCvthequeBackHref(back)}
    />
  )
}
