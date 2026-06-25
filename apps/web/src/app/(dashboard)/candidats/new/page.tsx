import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { CandidateCreatePage } from '@/components/organisms/candidate-create-page/CandidateCreatePage'
import { CandidateCvCreatePage } from '@/components/organisms/candidate-cv-create/CandidateCvCreatePage'
import { buildCandidateCreateDefaults } from '@/view-models/candidate-create-defaults'

type Props = { searchParams: Promise<{ source?: string }> }

export default async function Page({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { source } = await searchParams
  const caller = await createServerCaller()
  const referentials = await caller.candidate.referentials()
  const jobTitleId = referentials.jobTitles[0]?.id
  if (!jobTitleId) redirect('/candidats')

  const createDefaults = buildCandidateCreateDefaults(session.user.id, jobTitleId)

  if (source === 'cv') {
    return <CandidateCvCreatePage createDefaults={createDefaults} referentials={referentials} />
  }

  return <CandidateCreatePage defaultValues={createDefaults} referentials={referentials} />
}
