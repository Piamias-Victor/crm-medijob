'use client'

import { useState } from 'react'
import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'
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
}

type Props = {
  boardListingId?: string
  offer?: Offer | null
  privacyUrl: string
  retentionLabel: string
}

export function PublicApplyPage({ boardListingId, offer, privacyUrl, retentionLabel }: Props) {
  const [done, setDone] = useState(false)
  if (offer && !offer.available) return <PublicApplyUnavailable />
  if (done) return <PublicApplyThankYou />

  return (
    <main className="min-h-dvh bg-[var(--color-primary-muted)] pb-12">
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-8">
        <PublicApplyOfferSummary
          offer={
            offer
              ? offer
              : {
                  title: PUBLIC_APPLY_COPY.spontaneousTitle,
                  intro: PUBLIC_APPLY_COPY.spontaneousIntro,
                }
          }
        />
        <div className="rounded-3xl bg-white p-5 shadow-lg">
          <PublicApplyForm
            boardListingId={boardListingId}
            privacyUrl={privacyUrl}
            retentionLabel={retentionLabel}
            onSuccess={() => setDone(true)}
          />
        </div>
      </div>
    </main>
  )
}
