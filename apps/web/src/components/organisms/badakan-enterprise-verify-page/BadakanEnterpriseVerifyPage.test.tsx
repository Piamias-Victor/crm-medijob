import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadakanEnterpriseVerifyPage } from './BadakanEnterpriseVerifyPage'
import { existingVerifyPreview, newVerifyPreview } from './BadakanEnterpriseVerifyPage.fixtures'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    badakanEnterprise: {
      confirm: { useMutation: () => ({ mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false }) },
    },
    pharmacy: {
      getById: {
        useQuery: () => ({
          data: {
            formSource: {
              name: 'Hermes CRM',
              siret: '12345678901234',
              numeroTVA: null,
              address: '2 rue CRM',
              city: 'Paris',
              postalCode: '75001',
              phone: null,
              email: null,
              website: null,
              status: 'ACTIF',
              groupementId: null,
              softwareId: null,
              notes: null,
              referentId: null,
            },
          },
        }),
      },
      merge: { useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }) },
    },
  },
}))

describe('BadakanEnterpriseVerifyPage', () => {
  it('opens the field-by-field fusion when the SIRET already exists', () => {
    render(<BadakanEnterpriseVerifyPage preview={existingVerifyPreview} />)
    expect(screen.getByText('Pharmacie CRM')).toBeInTheDocument()
    expect(screen.getByText('Import Badakan')).toBeInTheDocument()
    expect(screen.getByText('Hermes CRM')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fusionner' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ignorer' })).not.toBeInTheDocument()
  })

  it('keeps the SIRET form when the pharmacie is new', () => {
    render(<BadakanEnterpriseVerifyPage preview={newVerifyPreview} />)
    expect(screen.getByRole('button', { name: 'Créer la pharmacie' })).toBeInTheDocument()
    expect(screen.getByLabelText('SIRET')).toHaveValue('12345678901234')
  })
})
