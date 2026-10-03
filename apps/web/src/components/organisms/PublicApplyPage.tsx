'use client'

import { useState } from 'react'
import { PublicApplyForm } from '@/components/molecules/PublicApplyForm'
import { PublicApplyThankYou } from '@/components/molecules/PublicApplyThankYou'
import { PublicApplyUnavailable } from '@/components/molecules/PublicApplyUnavailable'
import { PublicApplyOfferSummary } from '@/components/molecules/PublicApplyOfferSummary'

type Offer = {
  title: string
  jobTitleName: string
  city: string
  contractLabel: string
  available: boolean
  privacyUrl: string
  retentionLabel: string
}

type Props = { boardListingId: string; offer: Offer }

export function PublicApplyPage({ boardListingId, offer }: Props) {
  const [done, setDone] = useState(false)
  if (!offer.available) return <PublicApplyUnavailable />
  if (done) return <PublicApplyThankYou />

  return (
    <main className="min-h-dvh bg-[var(--color-primary-muted)] pb-12">
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-8">
        <PublicApplyOfferSummary offer={offer} />
        <div className="rounded-3xl bg-white p-5 shadow-lg">
          <PublicApplyForm
            boardListingId={boardListingId}
            privacyUrl={offer.privacyUrl}
            retentionLabel={offer.retentionLabel}
            onSuccess={() => setDone(true)}
          />
        </div>
      </div>
    </main>
  )
}
