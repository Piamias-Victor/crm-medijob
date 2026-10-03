'use client'

import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'

export function PublicApplyUnavailable() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-primary-muted)] px-6 text-center">
      <div className="max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">
          {PUBLIC_APPLY_COPY.unavailableTitle}
        </h2>
        <p className="mt-3 text-sm text-fg-muted">{PUBLIC_APPLY_COPY.unavailableBody}</p>
      </div>
    </div>
  )
}
