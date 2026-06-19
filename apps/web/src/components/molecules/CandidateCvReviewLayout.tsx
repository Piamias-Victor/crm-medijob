'use client'

import type { ReactNode } from 'react'
import { CandidateCvPreview } from '@/components/molecules/CandidateCvPreview'

type Props = {
  previewUrl: string
  mimeType: string
  filename: string
  children: ReactNode
}

export function CandidateCvReviewLayout({ previewUrl, mimeType, filename, children }: Props) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="xl:sticky xl:top-4 xl:self-start">
        <CandidateCvPreview previewUrl={previewUrl} mimeType={mimeType} filename={filename} size="review" />
      </div>
      <div>{children}</div>
    </div>
  )
}
