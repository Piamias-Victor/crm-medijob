'use client'

import { buildCvPreviewSrc, isPdfPreview, type CvPreviewSize, CV_PREVIEW_FRAME_CLASS } from '@/lib/cv-preview-url'
import { cn } from '@/lib/cn'

type Props = {
  previewUrl: string
  mimeType: string
  filename: string
  size?: CvPreviewSize
}

export function CandidateCvPreview({ previewUrl, mimeType, filename, size = 'stored' }: Props) {
  const src = buildCvPreviewSrc(previewUrl, mimeType, filename, size)

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-surface/60 p-3">
      <p className="text-xs font-medium text-fg-muted">CV · {filename}</p>
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-border/60 bg-white',
          CV_PREVIEW_FRAME_CLASS[size],
        )}
      >
        {isPdfPreview(mimeType, filename) ? (
          <embed src={src} type="application/pdf" title={`CV ${filename}`} className="h-full w-full" />
        ) : (
          <img src={src} alt={`CV ${filename}`} className="h-full w-full object-contain" />
        )}
      </div>
    </div>
  )
}
