'use client'

import { GlassModal } from '@/components/molecules/GlassModal'
import { Button } from '@/components/atoms/Button'
import { DocumentPreviewBody } from '@/components/molecules/document-preview/DocumentPreviewBody'
import {
  DOCUMENT_PREVIEW_CLOSE,
  DOCUMENT_PREVIEW_DOWNLOAD,
} from '@/components/molecules/document-preview/document-preview-copy'
import { buildDocumentPreviewUrl, isPreviewableDocument } from '@/lib/document-preview'

type Props = {
  open: boolean
  filename: string
  mimeType: string | null
  documentId: string
  onClose: () => void
  onDownload: () => void
}

export function DocumentPreviewModal({
  open,
  filename,
  mimeType,
  documentId,
  onClose,
  onDownload,
}: Props) {
  const previewable = isPreviewableDocument({ mimeType, filename })

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={filename}
      className="max-w-4xl"
      trapFocus
    >
      <DocumentPreviewBody
        previewUrl={buildDocumentPreviewUrl(documentId)}
        mimeType={mimeType}
        filename={filename}
        onDownload={onDownload}
      />
      <div className="mt-4 flex justify-end gap-3 border-t border-border/50 pt-4">
        {previewable ? (
          <Button type="button" variant="outline" onClick={onDownload}>
            {DOCUMENT_PREVIEW_DOWNLOAD}
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={onClose}>
          {DOCUMENT_PREVIEW_CLOSE}
        </Button>
      </div>
    </GlassModal>
  )
}
