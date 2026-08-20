import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DevisQuoteSheet } from '@/components/molecules/DevisQuoteSheet'
import { buildDevisPdfModel } from '@/view-models/devis-pdf-model'
import { DEVIS_PDF_ISSUER, DEVIS_PDF_TOTAL_TTC } from '@/view-models/devis-pdf-copy'

describe('DevisQuoteSheet', () => {
  it('renders issuer, destinataire and TTC', () => {
    const quote = buildDevisPdfModel({
      pharmacyName: 'Pharmacie du Centre',
      contactName: 'Marie Curie',
      kind: 'CDD',
      hours: null,
      hourlyRate: null,
      amountHt: 3000,
      amountTtc: 3600,
      missionTitle: 'Remplacement titulaire',
      issuedAt: new Date(2026, 7, 20),
    })
    render(<DevisQuoteSheet quote={quote} />)
    expect(screen.getAllByText(DEVIS_PDF_ISSUER).length).toBeGreaterThan(0)
    expect(screen.getByText('Pharmacie du Centre')).toBeInTheDocument()
    expect(screen.getByText(DEVIS_PDF_TOTAL_TTC)).toBeInTheDocument()
    expect(screen.getByText('3 600,00 €')).toBeInTheDocument()
  })
})
