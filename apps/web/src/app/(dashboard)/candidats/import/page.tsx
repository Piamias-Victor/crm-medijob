import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { CandidateCsvImportPage } from '@/components/organisms/candidate-csv-import/CandidateCsvImportPage'

export default async function Page() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  const caller = await createServerCaller()
  const referentials = await caller.candidate.referentials()
  return <CandidateCsvImportPage jobTitles={referentials.jobTitles} />
}
