import { notFound } from 'next/navigation'
import { createServerCaller } from '@/lib/trpc/server'
import { getAppBaseUrl } from '@/server/auth/app-base-url'
import { JobOfferDetailPage } from '@/components/organisms/JobOfferDetailPage'
import {
  canShowPublicApplyLink,
  publicApplyUrl,
} from '@/view-models/public-apply-href'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  const caller = await createServerCaller()
  const offer = await caller.jobOffer.getById({ id })
  if (!offer) notFound()

  const showLink = canShowPublicApplyLink({
    status: offer.status,
    boardListingId: offer.boardListingId,
  })

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
      publicApplyUrl={
        showLink && offer.boardListingId
          ? publicApplyUrl(getAppBaseUrl(), offer.boardListingId)
          : null
      }
    />
  )
}
