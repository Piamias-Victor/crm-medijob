import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadakanEnterpriseVerifyPage } from './BadakanEnterpriseVerifyPage'
import type { BadakanEnterprisePreview } from '@/view-models/badakan-enterprise-preview'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    badakanEnterprise: {
      confirm: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}))

const preview: BadakanEnterprisePreview = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  statusLabel: 'Pharmacie déjà dans le CRM',
  contactActionLabel: 'Fusionner par email',
  confirmLabel: 'Lier à la pharmacie existante',
  existingPharmacyHref: '/pharmacies/p-exist',
  existingPharmacyName: 'Hermes CRM',
  siret: '12345678901234',
  blockHint: 'Ce SIRET est déjà dans le CRM. Liez cette officine ou corrigez le numéro.',
  fields: [
    { label: 'Nom', value: 'Pharmacie Hermes' },
    { label: 'SIRET', value: '12345678901234' },
  ],
}

describe('BadakanEnterpriseVerifyPage', () => {
  it('shows imported card, existing pharmacie and link action', () => {
    render(<BadakanEnterpriseVerifyPage preview={preview} />)
    expect(screen.getByRole('heading', { name: 'Pharmacie Hermes' })).toBeInTheDocument()
    expect(screen.getAllByText('Pharmacie déjà dans le CRM').length).toBeGreaterThan(0)
    expect(
      screen.getByText('Ce SIRET est déjà dans le CRM. Liez cette officine ou corrigez le numéro.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hermes CRM' })).toHaveAttribute(
      'href',
      '/pharmacies/p-exist',
    )
    expect(screen.getByRole('button', { name: 'Lier à la pharmacie existante' })).toBeInTheDocument()
    expect(screen.getByLabelText('SIRET')).toHaveValue('12345678901234')
  })
})
