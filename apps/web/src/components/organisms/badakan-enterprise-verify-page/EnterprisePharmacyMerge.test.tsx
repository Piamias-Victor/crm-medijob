import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { EnterprisePharmacyMerge } from './EnterprisePharmacyMerge'
import { toIncomingPharmacyRow } from '@/view-models/badakan-enterprise-incoming'
import type { BadakanEnterprisePreview } from '@/view-models/badakan-enterprise-preview'
import type { EnterpriseVerifyRow } from '@/server/badakan-enterprise/verify.types'

const { mergeAsync, confirmAsync } = vi.hoisted(() => ({
  mergeAsync: vi.fn(),
  confirmAsync: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
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
      merge: { useMutation: () => ({ mutateAsync: mergeAsync }) },
    },
    badakanEnterprise: {
      confirm: { useMutation: () => ({ mutateAsync: confirmAsync }) },
    },
  },
}))

const row: EnterpriseVerifyRow = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  siret: '12345678901234',
  address: '1 rue de la Paix',
  city: 'Paris',
  postalCode: '75001',
  principalFirstName: 'Dominique',
  principalLastName: 'Litzler',
  principalEmail: 'd.litzler@hermes.fr',
  principalPhone: '0601020304',
  pharmacyId: null,
  verifiedAt: null,
}

const preview: BadakanEnterprisePreview = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  statusLabel: 'Pharmacie déjà dans le CRM',
  contactActionLabel: 'Fusionner par email',
  confirmLabel: 'Fusionner',
  existingPharmacyId: 'p-exist',
  existingPharmacyHref: '/pharmacies/p-exist',
  existingPharmacyName: 'Hermes CRM',
  siret: '12345678901234',
  blockHint: null,
  incomingPharmacy: toIncomingPharmacyRow(row),
  fields: [],
}

describe('EnterprisePharmacyMerge', () => {
  it('merges into the CRM pharmacie then verifies the Badakan row', async () => {
    mergeAsync.mockResolvedValue({ id: 'p-exist' })
    confirmAsync.mockResolvedValue({ pharmacyId: 'p-exist' })
    render(<EnterprisePharmacyMerge preview={preview} />)
    fireEvent.click(screen.getByRole('button', { name: 'Fusionner' }))
    await vi.waitFor(() => {
      expect(mergeAsync).toHaveBeenCalledWith(
        expect.objectContaining({ keptId: 'p-exist' }),
      )
      expect(confirmAsync).toHaveBeenCalledWith({ id: 'row1', siret: '12345678901234' })
    })
  })
})
