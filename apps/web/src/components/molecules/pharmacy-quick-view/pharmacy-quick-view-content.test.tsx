import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PharmacyQuickViewContent } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-content'
import type { PharmacyQuickViewPayload } from '@/view-models/pharmacy-quick-view.types'
import {
  PHARMACY_QUICK_VIEW_EMPTY,
  PHARMACY_QUICK_VIEW_SECTIONS,
} from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'

const payload: PharmacyQuickViewPayload = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  coordinates: {
    address: '10 rue de la Paix',
    postalCode: '75002',
    city: 'Paris',
    phone: '0102030405',
    email: 'contact@pharma.fr',
  },
  primaryContacts: [{ id: 'c1', fullName: 'Marie Curie', email: 'marie@pharma.fr', phone: null }],
  openNeeds: [{ id: 'm1', title: 'CDI', status: 'A_POURVOIR', jobTitle: 'Pharmacien' }],
  lastAction: {
    typeLabel: 'Appel',
    dateLabel: '15/07/2026',
    content: 'Rappel titulaire',
    authorName: 'Alice',
  },
}

describe('PharmacyQuickViewContent', () => {
  it('renders CSV sections for pharmacy preview', () => {
    render(<PharmacyQuickViewContent view={payload} />)

    expect(screen.getByText(PHARMACY_QUICK_VIEW_SECTIONS.coordinates)).toBeInTheDocument()
    expect(screen.getByText(/10 rue de la Paix/)).toBeInTheDocument()
    expect(screen.getByText(PHARMACY_QUICK_VIEW_SECTIONS.contacts)).toBeInTheDocument()
    expect(screen.getByText('Marie Curie')).toBeInTheDocument()
    expect(screen.getByText(PHARMACY_QUICK_VIEW_SECTIONS.needs)).toBeInTheDocument()
    expect(screen.getByText(/CDI/)).toBeInTheDocument()
    expect(screen.getByText(PHARMACY_QUICK_VIEW_SECTIONS.lastAction)).toBeInTheDocument()
    expect(screen.getByText(/Rappel titulaire/)).toBeInTheDocument()
  })

  it('shows empty states when lists and last action missing', () => {
    render(
      <PharmacyQuickViewContent
        view={{ ...payload, primaryContacts: [], openNeeds: [], lastAction: null }}
      />,
    )

    expect(screen.getByText(PHARMACY_QUICK_VIEW_EMPTY.contacts)).toBeInTheDocument()
    expect(screen.getByText(PHARMACY_QUICK_VIEW_EMPTY.needs)).toBeInTheDocument()
    expect(screen.getByText(PHARMACY_QUICK_VIEW_EMPTY.lastAction)).toBeInTheDocument()
  })
})
