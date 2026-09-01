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
  statusLabel: 'Pharmacy existante',
  contactActionLabel: 'Fusionner par email',
  existingPharmacyHref: '/pharmacies/p-exist',
  existingPharmacyName: 'Hermes CRM',
  fields: [
    { label: 'Nom', value: 'Pharmacie Hermes' },
    { label: 'SIRET', value: '12345678901234' },
  ],
}

describe('BadakanEnterpriseVerifyPage', () => {
  it('shows imported card, existing Pharmacy and confirm action', () => {
    render(<BadakanEnterpriseVerifyPage preview={preview} />)
    expect(screen.getByRole('heading', { name: 'Pharmacie Hermes' })).toBeInTheDocument()
    expect(screen.getAllByText('Pharmacy existante').length).toBeGreaterThan(0)
    expect(screen.getByText('Fusionner par email')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hermes CRM' })).toHaveAttribute(
      'href',
      '/pharmacies/p-exist',
    )
    expect(screen.getByRole('button', { name: 'Valider Pharmacy' })).toBeInTheDocument()
  })
})
