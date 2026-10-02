import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { PublicApplyPage } from '@/components/organisms/PublicApplyPage'

export const metadata = {
  title: 'Postuler — MediJob',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ boardListingId: string }> }

export default async function Page({ params }: Props) {
  const { boardListingId } = await params
  if (!boardListingId?.trim()) notFound()
  const caller = await createServerCaller()
  try {
    const offer = await caller.publicApply.getOffer({ boardListingId })
    return <PublicApplyPage boardListingId={boardListingId} offer={offer} />
  } catch {
    notFound()
  }
}
