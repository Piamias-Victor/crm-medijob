import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadakanContractList } from './BadakanContractList'
import type { BadakanContractListItem } from '@/view-models/badakan-contract-list'

const row: BadakanContractListItem = {
  id: 'row1',
  recipientName: 'Lucie Robert',
  pharmacyName: 'Pharmacie Hermes',
  status: 'VALIDATED',
  statusLabel: 'Validé',
  pdfHref: 'https://files.badakan.test/c-lucie.pdf',
  dpaeHref: 'https://files.badakan.test/c-lucie-dpae.pdf',
}

describe('BadakanContractList', () => {
  it('shows status, PDF and DPAE without a create-contract control', () => {
    render(<BadakanContractList rows={[row]} />)
    expect(screen.getByText('Lucie Robert')).toBeInTheDocument()
    expect(screen.getByText('Pharmacie Hermes')).toBeInTheDocument()
    expect(screen.getByText('Validé')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'PDF' })).toHaveAttribute(
      'href',
      row.pdfHref,
    )
    expect(screen.getByRole('link', { name: 'DPAE' })).toHaveAttribute(
      'href',
      row.dpaeHref,
    )
    expect(screen.queryByRole('button', { name: /créer contrat/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/ligne de suivi/i)).not.toBeInTheDocument()
  })

  it('explains empty Badakan contract list without finance copy', () => {
    render(<BadakanContractList rows={[]} />)
    expect(screen.getByText('Aucun contrat Badakan')).toBeInTheDocument()
    expect(screen.queryByText(/ligne de suivi/i)).not.toBeInTheDocument()
  })
})
