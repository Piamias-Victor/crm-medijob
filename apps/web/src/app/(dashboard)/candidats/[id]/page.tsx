import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { CandidateDetailPage } from '@/components/organisms/CandidateDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const [profile, referentials] = await Promise.all([
    caller.candidate.getById({ id }),
    caller.candidate.referentials(),
  ])

  if (!profile) notFound()

  return <CandidateDetailPage profile={profile} referentials={referentials} />
}
