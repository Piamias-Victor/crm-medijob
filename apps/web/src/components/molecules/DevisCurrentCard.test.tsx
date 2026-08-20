import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DevisCurrentCard } from '@/components/molecules/DevisCurrentCard'
import { DEVIS_ACCEPT_LABEL } from '@/view-models/devis-copy'
import type { DevisView } from '@/view-models/devis'

const sent: DevisView = {
  id: 'd1',
  kind: 'CDD',
  status: 'SENT',
  hours: null,
  hourlyRate: null,
  amountHt: 3000,
  amountTtc: 3600,
  htSource: 'TYPED',
  acceptedAt: null,
  invoicedAt: null,
}

describe('DevisCurrentCard', () => {
  it('shows commercial status and accept on a SENT devis', () => {
    render(
      <DevisCurrentCard
        current={sent}
        commercialStatus="ENVOYE"
        ca={0}
        canAccept
        onAccept={vi.fn()}
      />,
    )
    expect(screen.getByText('Envoyé')).toBeInTheDocument()
    expect(screen.getByText('CA 0,00 €')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: DEVIS_ACCEPT_LABEL })).toBeInTheDocument()
  })
})
