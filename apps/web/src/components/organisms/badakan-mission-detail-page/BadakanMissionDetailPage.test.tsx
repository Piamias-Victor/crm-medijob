import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadakanMissionDetailPage } from './BadakanMissionDetailPage'
import type { BadakanMissionDetail } from '@/view-models/badakan-mission-detail'

vi.mock('@/components/organisms/BadakanMissionMatchingTab', () => ({
  BadakanMissionMatchingTab: () => <div>Matching IA mock</div>,
}))

vi.mock('@/components/organisms/BadakanMissionProposalsSection', () => ({
  BadakanMissionProposalsSection: () => <div>Proposals mock</div>,
}))

const detail: BadakanMissionDetail = {
  id: 'row1',
  pharmacyName: 'Pharmacie Hermes',
  stepLabel: 'Annulée',
  periodLabel: '01/08/2026 → 03/08/2026',
  sectionTitle: 'Candidats ayant postulé',
  fields: [
    { label: 'Étape', value: 'Annulée' },
    { label: 'Périodes', value: '01/08/2026 → 03/08/2026' },
  ],
  searchApplied: [
    {
      recipientId: 'r-lucie',
      fullName: 'Lucie Robert',
      phone: '0601020304',
      telHref: 'tel:0601020304',
    },
    {
      recipientId: 'r-sandra',
      fullName: 'Sandra Viau',
      phone: null,
      telHref: null,
    },
  ],
  matching: {
    canMatch: true,
    jobTitleName: 'Préparateur',
    pharmacyName: 'Pharmacie Hermes',
  },
}

describe('BadakanMissionDetailPage', () => {
  it('lists applicants with a phone link when present', () => {
    render(<BadakanMissionDetailPage detail={detail} />)
    expect(screen.getByRole('heading', { name: 'Pharmacie Hermes' })).toBeInTheDocument()
    expect(screen.getByText('Candidats ayant postulé')).toBeInTheDocument()
    expect(screen.getByText('Lucie Robert')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '0601020304' })).toHaveAttribute(
      'href',
      'tel:0601020304',
    )
    expect(screen.getByText('Sandra Viau')).toBeInTheDocument()
    expect(screen.queryByText(/application/i)).not.toBeInTheDocument()
  })
})
