'use client'

import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'

type Offer = {
  title: string
  intro?: string
  jobTitleName?: string
  city?: string
  contractLabel?: string
}

export function PublicApplyOfferSummary({ offer }: { offer: Offer }) {
  const chips = [
    offer.jobTitleName
      ? { label: PUBLIC_APPLY_COPY.offerJob, value: offer.jobTitleName }
      : null,
    offer.city ? { label: PUBLIC_APPLY_COPY.offerCity, value: offer.city } : null,
    offer.contractLabel
      ? { label: PUBLIC_APPLY_COPY.offerContract, value: offer.contractLabel }
      : null,
  ].filter((chip): chip is { label: string; value: string } => Boolean(chip))
  return (
    <section className="rounded-3xl bg-[var(--color-primary)] px-5 py-6 text-white shadow-lg">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)]">
        {PUBLIC_APPLY_COPY.brand}
      </p>
      <h1 className="mt-2 text-2xl font-semibold leading-tight">{offer.title}</h1>
      <p className="mt-2 text-sm text-[var(--color-primary-muted)]">
        {offer.intro ?? PUBLIC_APPLY_COPY.intro}
      </p>
      {chips.length ? (
        <dl className="mt-5 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <div
              key={chip.label}
              className="rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-[var(--color-accent-fg)]"
            >
              <dt className="sr-only">{chip.label}</dt>
              <dd className="text-sm font-semibold">{chip.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  )
}
