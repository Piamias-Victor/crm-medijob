import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { CandidateDuplicateReviewPage } from '@/components/organisms/candidate-duplicate-review/CandidateDuplicateReviewPage'

type Props = {
  searchParams: Promise<{ existingId?: string; pick?: string }>
}

export default async function Page({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { existingId, pick } = await searchParams
  const caller = await createServerCaller()
  const referentials = await caller.candidate.referentials()
  const existing = existingId ? await caller.candidate.getById({ id: existingId }) : null

  return (
    <CandidateDuplicateReviewPage
      initialExistingId={existingId}
      pick={pick === '1'}
      existing={existing}
      referentials={{
        jobTitles: referentials.jobTitles,
        softwares: referentials.softwares,
        recruiters: referentials.recruiters,
      }}
    />
  )
}
