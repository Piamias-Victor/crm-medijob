import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EntityDocumentsList } from '@/components/molecules/EntityDocumentsList'

describe('EntityDocumentsList', () => {
  it('renders EmptyState when the document list is empty', () => {
    render(
      <EntityDocumentsList
        documents={[]}
        emptyLabel="Aucun document pour cette mission."
        onDownload={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Aucun document pour cette mission.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
