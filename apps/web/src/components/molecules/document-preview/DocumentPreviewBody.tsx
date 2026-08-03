'use client'

import { Button } from '@/components/atoms/Button'
import {
  buildDocumentPreviewSrc,
  isPdfDocument,
  isPreviewableDocument,
} from '@/lib/document-preview'
import {
  DOCUMENT_PREVIEW_DOWNLOAD,
  DOCUMENT_PREVIEW_FALLBACK,
} from '@/components/molecules/document-preview/document-preview-copy'

type Props = {
  previewUrl: string
  mimeType: string | null
  filename: string
  onDownload: () => void
}

export function DocumentPreviewBody({ previewUrl, mimeType, filename, onDownload }: Props) {
  if (!isPreviewableDocument({ mimeType, filename })) {
    return (
      <div className="flex flex-col items-start gap-4 py-2">
        <p className="text-sm text-fg-muted">{DOCUMENT_PREVIEW_FALLBACK}</p>
        <Button type="button" variant="outline" onClick={onDownload}>
          {DOCUMENT_PREVIEW_DOWNLOAD}
        </Button>
      </div>
    )
  }

  const src = buildDocumentPreviewSrc(previewUrl, mimeType, filename)
  const title = `Aperçu ${filename}`

  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-white h-[70vh] min-h-[24rem]">
      {isPdfDocument({ mimeType, filename }) ? (
        <embed src={src} type="application/pdf" title={title} className="h-full w-full" />
      ) : (
        // Blob / API preview URLs — next/image not suitable
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={title} className="h-full w-full object-contain" />
      )}
    </div>
  )
}
