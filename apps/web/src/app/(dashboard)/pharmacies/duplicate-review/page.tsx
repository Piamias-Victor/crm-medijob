import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { createServerCaller } from '@/lib/trpc/server'
import { PharmacyDuplicateReviewPage } from '@/components/organisms/pharmacy-duplicate-review/PharmacyDuplicateReviewPage'

type Props = {
  searchParams: Promise<{ existingId?: string; pick?: string }>
}

export default async function Page({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { existingId, pick } = await searchParams
  const caller = await createServerCaller()
  const existing = existingId ? await caller.pharmacy.getById({ id: existingId }) : null

  return (
    <PharmacyDuplicateReviewPage
      initialExistingId={existingId}
      pick={pick === '1'}
      existing={existing}
    />
  )
}
