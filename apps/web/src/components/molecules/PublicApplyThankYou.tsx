'use client'

import { Check } from 'lucide-react'
import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'

export function PublicApplyThankYou() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-primary)] px-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-[var(--color-accent)] shadow-lg">
        <Check className="size-10 text-[var(--color-primary)]" strokeWidth={3} />
      </div>
      <h2 className="mt-8 text-3xl font-semibold text-white">{PUBLIC_APPLY_COPY.thanksTitle}</h2>
      <p className="mt-3 max-w-md text-base text-[var(--color-primary-muted)]">
        {PUBLIC_APPLY_COPY.thanksBody}
      </p>
      <p className="mt-2 text-sm text-[var(--color-accent)]">{PUBLIC_APPLY_COPY.thanksHint}</p>
    </div>
  )
}
