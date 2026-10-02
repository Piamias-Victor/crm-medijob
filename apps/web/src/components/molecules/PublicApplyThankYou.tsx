'use client'

import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'

export function PublicApplyThankYou() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-8 text-center">
      <h2 className="text-lg font-semibold text-fg">{PUBLIC_APPLY_COPY.thanksTitle}</h2>
      <p className="max-w-md text-sm text-fg-muted">{PUBLIC_APPLY_COPY.thanksBody}</p>
    </div>
  )
}
