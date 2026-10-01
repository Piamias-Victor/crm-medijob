import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { JobOfferDetailPage } from '@/components/organisms/JobOfferDetailPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const offer = await caller.jobOffer.getById({ id })
  if (!offer) notFound()

  return (
    <JobOfferDetailPage
      offer={{
        id: offer.id,
        title: offer.title,
        content: offer.content,
        status: offer.status,
        missionId: offer.missionId,
        city: offer.city,
      }}
    />
  )
}
