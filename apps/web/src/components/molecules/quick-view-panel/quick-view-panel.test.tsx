import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuickViewPanel } from '@/components/molecules/quick-view-panel/quick-view-panel'

describe('QuickViewPanel', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <QuickViewPanel open={false} onClose={vi.fn()} title="Pharmacie" footerHref="/pharmacies/p1">
        <p>Contenu</p>
      </QuickViewPanel>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows title, children and detail link when open', () => {
    render(
      <QuickViewPanel open onClose={vi.fn()} title="Pharmacie du Centre" footerHref="/pharmacies/p1">
        <p>Coords preview</p>
      </QuickViewPanel>,
    )

    expect(screen.getByRole('dialog', { name: 'Pharmacie du Centre' })).toBeInTheDocument()
    expect(screen.getByText('Coords preview')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voir la fiche' })).toHaveAttribute(
      'href',
      '/pharmacies/p1',
    )
  })
})
