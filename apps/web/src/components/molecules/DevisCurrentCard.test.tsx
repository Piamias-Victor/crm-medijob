import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DevisCurrentCard } from '@/components/molecules/DevisCurrentCard'
import {
  DEVIS_ACCEPT_LABEL,
  DEVIS_PREVIEW_LABEL,
  DEVIS_SEND_LABEL,
} from '@/view-models/devis-copy'
import type { DevisView } from '@/view-models/devis'

const draft: DevisView = {
  id: 'd1',
  kind: 'CDD',
  status: 'DRAFT',
  hours: null,
  hourlyRate: null,
  amountHt: 3000,
  amountTtc: 3600,
  htSource: 'TYPED',
  acceptedAt: null,
  invoicedAt: null,
}

describe('DevisCurrentCard', () => {
  it('shows preview, send and accept on a lone DRAFT', () => {
    render(
      <DevisCurrentCard
        current={draft}
        commercialStatus="SANS_DEVIS"
        ca={0}
        onPreview={vi.fn()}
        onSend={vi.fn()}
        onAccept={vi.fn()}
      />,
    )
    expect(screen.getByText('Devis courant')).toBeInTheDocument()
    expect(screen.getByText(/Brouillon/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: DEVIS_PREVIEW_LABEL })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: DEVIS_SEND_LABEL })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: DEVIS_ACCEPT_LABEL })).toBeInTheDocument()
  })
})
