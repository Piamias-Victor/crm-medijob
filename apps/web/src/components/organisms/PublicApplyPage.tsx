'use client'

import { useState } from 'react'
import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'
import { PublicApplyForm } from '@/components/molecules/PublicApplyForm'
import { PublicApplyThankYou } from '@/components/molecules/PublicApplyThankYou'
import { PublicApplyUnavailable } from '@/components/molecules/PublicApplyUnavailable'

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

  if (!offer.available) {
    return (
      <main className="min-h-dvh bg-surface px-4 py-10">
        <PublicApplyUnavailable />
      </main>
    )
  }

  if (done) {
    return (
      <main className="min-h-dvh bg-surface px-4 py-10">
        <PublicApplyThankYou />
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-surface pb-10">
      <header className="sticky top-0 z-10 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl flex-col gap-1 px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">
            {PUBLIC_APPLY_COPY.brand}
          </p>
          <h1 className="text-lg font-semibold text-fg">{PUBLIC_APPLY_COPY.title}</h1>
          <p className="text-sm font-medium text-fg">{offer.title}</p>
        </div>
      </header>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <p className="text-sm text-fg-muted">{PUBLIC_APPLY_COPY.intro}</p>
        <dl className="grid gap-2 text-sm text-fg">
          <div>
            <dt className="text-fg-muted">{PUBLIC_APPLY_COPY.offerJob}</dt>
            <dd className="font-medium">{offer.jobTitleName}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">{PUBLIC_APPLY_COPY.offerCity}</dt>
            <dd className="font-medium">{offer.city}</dd>
          </div>
          <div>
            <dt className="text-fg-muted">{PUBLIC_APPLY_COPY.offerContract}</dt>
            <dd className="font-medium">{offer.contractLabel}</dd>
          </div>
        </dl>
        <PublicApplyForm
          boardListingId={boardListingId}
          privacyUrl={offer.privacyUrl}
          retentionLabel={offer.retentionLabel}
          onSuccess={() => setDone(true)}
        />
      </div>
    </main>
  )
}
