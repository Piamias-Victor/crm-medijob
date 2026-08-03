import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DocumentPreviewBody } from '@/components/molecules/document-preview/DocumentPreviewBody'
import { DOCUMENT_PREVIEW_FALLBACK } from '@/components/molecules/document-preview/document-preview-copy'

describe('DocumentPreviewBody', () => {
  it('embeds a pdf when the document is previewable', () => {
    render(
      <DocumentPreviewBody
        previewUrl="/api/documents/d1/preview"
        mimeType="application/pdf"
        filename="contrat.pdf"
        onDownload={vi.fn()}
      />,
    )

    const embed = screen.getByTitle('Aperçu contrat.pdf')
    expect(embed.tagName.toLowerCase()).toBe('embed')
    expect(embed).toHaveAttribute('src', expect.stringContaining('/api/documents/d1/preview'))
  })

  it('renders an image preview', () => {
    render(
      <DocumentPreviewBody
        previewUrl="/api/documents/d2/preview"
        mimeType="image/png"
        filename="scan.png"
        onDownload={vi.fn()}
      />,
    )

    expect(screen.getByRole('img', { name: 'Aperçu scan.png' })).toHaveAttribute(
      'src',
      '/api/documents/d2/preview',
    )
  })

  it('shows fallback and download for non-previewable formats', () => {
    const onDownload = vi.fn()
    render(
      <DocumentPreviewBody
        previewUrl="/api/documents/d3/preview"
        mimeType="text/csv"
        filename="export.csv"
        onDownload={onDownload}
      />,
    )

    expect(screen.getByText(DOCUMENT_PREVIEW_FALLBACK)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Télécharger' }))
    expect(onDownload).toHaveBeenCalledOnce()
  })
})
