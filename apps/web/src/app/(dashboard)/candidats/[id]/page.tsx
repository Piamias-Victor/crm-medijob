import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { CandidateDetailPage } from '@/components/organisms/CandidateDetailPage'
import { parseCvthequeBackHref, candidateBackLabel } from '@/lib/cvtheque-candidate-href'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ back?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { back } = await searchParams
  const caller = await createServerCaller()
  const [profile, referentials] = await Promise.all([
    caller.candidate.getById({ id }),
    caller.candidate.referentials(),
  ])

  if (!profile) notFound()

  const backHref = parseCvthequeBackHref(back)

  return (
    <CandidateDetailPage
      profile={profile}
      referentials={referentials}
      backHref={backHref}
      backLabel={candidateBackLabel(backHref)}
    />
  )
}
