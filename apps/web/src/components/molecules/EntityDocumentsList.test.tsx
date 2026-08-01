import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EntityDocumentsList } from '@/components/molecules/EntityDocumentsList'
import type { DocumentListRow } from '@/view-models/document-list'

const doc: DocumentListRow = {
  id: 'd1',
  category: 'CONTRAT',
  categoryLabel: 'Contrat',
  name: 'contrat.pdf',
  url: 'https://blob.example/contrat.pdf',
  mimeType: 'application/pdf',
  size: 1024,
  sizeLabel: '1 Ko',
  createdAt: new Date('2026-01-15T10:00:00.000Z'),
  dateLabel: '15/01/2026',
}

describe('EntityDocumentsList', () => {
  it('renders EmptyState when the document list is empty', () => {
    render(
      <EntityDocumentsList
        documents={[]}
        emptyLabel="Aucun document pour cette mission."
        onDownload={vi.fn()}
        onPreview={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Aucun document pour cette mission.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('calls onPreview when Aperçu is clicked', () => {
    const onPreview = vi.fn()
    render(
      <EntityDocumentsList
        documents={[doc]}
        emptyLabel="Aucun document"
        onDownload={vi.fn()}
        onPreview={onPreview}
        onDelete={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Aperçu' }))
    expect(onPreview).toHaveBeenCalledWith('d1')
  })
})
