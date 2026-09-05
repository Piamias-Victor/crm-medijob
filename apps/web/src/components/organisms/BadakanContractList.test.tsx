import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { BadakanContractList } from './BadakanContractList'
import type { BadakanContractListItem } from '@/view-models/badakan-contract-list'

const { router, searchParams } = vi.hoisted(() => ({
  router: { push: vi.fn(), replace: vi.fn() },
  searchParams: new URLSearchParams(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/interim/contrats',
  useSearchParams: () => searchParams,
}))

const row: BadakanContractListItem = {
  id: 'row1',
  recipientName: 'Lucie Robert',
  pharmacyName: 'Pharmacie Hermes',
  status: 'VALIDATED',
  statusLabel: 'Validé',
  pdfHref: 'https://files.badakan.test/c-lucie.pdf',
  dpaeHref: 'https://files.badakan.test/c-lucie-dpae.pdf',
}

const other: BadakanContractListItem = {
  ...row,
  id: 'row2',
  recipientName: 'Margo Rié',
  status: 'CANCELLED',
  statusLabel: 'Annulé',
}

describe('BadakanContractList', () => {
  it('shows status, PDF and DPAE without a create-contract control', () => {
    render(<BadakanContractList rows={[row]} />)
    expect(screen.getByText('Lucie Robert')).toBeInTheDocument()
    expect(screen.getByText('Pharmacie Hermes')).toBeInTheDocument()
    expect(screen.getByText('Validé')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contrat' })).toHaveAttribute('href', row.pdfHref)
    expect(screen.getByRole('link', { name: 'DPAE' })).toHaveAttribute('href', row.dpaeHref)
    expect(screen.queryByRole('button', { name: /créer contrat/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/ligne de suivi/i)).not.toBeInTheDocument()
  })

  it('narrows the table to the searched candidate', () => {
    render(<BadakanContractList rows={[row, other]} />)
    fireEvent.change(screen.getByPlaceholderText('Candidat, officine…'), {
      target: { value: 'margo' },
    })
    expect(screen.getByText('Margo Rié')).toBeInTheDocument()
    expect(screen.queryByText('Lucie Robert')).not.toBeInTheDocument()
  })

  it('explains empty Badakan contract list without finance copy', () => {
    render(<BadakanContractList rows={[]} />)
    expect(screen.getByText('Aucun contrat Badakan')).toBeInTheDocument()
    expect(screen.queryByText(/ligne de suivi/i)).not.toBeInTheDocument()
  })
})
